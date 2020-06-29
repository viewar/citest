import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import { InferProps } from "prop-types";
import { useModal } from "react-modal-hook";
import Dialog from "components/Primitives/Dialog";
import PagePropTypes from "../../PagePropTypes";
import useQueryState from "hooks/useQueryState";
import useViewarApi from "hooks/useViewarApi";
import useTranslation from "hooks/useTranslation";
import useLoading from "hooks/useLoading";
import HeaderBar from "components/Patterns/HeaderBar";
import Logo from "components/Primitives/Logo/Logo";
import cx from "classnames";
import styles from "./RoomPlanner.scss";
import ButtonPanel from "components/Patterns/ButtonPanel";
import isEqual from "lodash.isequal";
import useServices from "hooks/useServices";
import useDefaultColorOptions from "hooks/useDefaultColorOptions";
import PropTypes from "prop-types";
import Input from "components/Patterns/Input";
import useStateToggle from "hooks/useStateToggle";
import SceneInfo from "components/Patterns/SceneInfo";
import SlideWrapper from "components/Primitives/SlideWrapper";
import calculateSurfaceArea, { SurfaceArea } from "./calculateSurfaceArea";
import ARButtons from "components/Primitives/ARButtons";
import debugState from "./debug-state.json";

type EmailObject = {
  subject: string;
  message: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  attachments: string[];
};

// Set to true to debug in the mock mode with the room state from debug-state.json.
// Has to be false in production mode.
const DEBUG = false;

export const squareMillimetresToMetres = (value: number, decimalPoints: number = 2): number => {
  const decimals = Math.pow(10, decimalPoints);
  return Math.round((value || 0) * 1E-5 * decimals) / decimals;
};

export const valueToUnitString = (value: number): string => {
  return `${value}cm`;
};

export const unitStringToValue = (unitString: string): number => {
  const [, strValue, unit] = unitString.split(/(\d*[\.,]?\d*)\s*(\w*)/gi)

  const value = parseFloat(strValue);
  let factor = 1;

  switch(unit) {
    case "m":
      factor = 100;
      break;
    case "dm":
      factor = 10;
      break;
    case "mm":
      factor = 0.1;
      break;
    case "cm":
    default:
      factor = 1;
      break;
  }

  return value * factor;
}

function ResizePanel({ visible, value, onResize } : InferProps<typeof ResizePanel.propTypes>) {
  const [internalValue, setInternalValue] = useState(valueToUnitString(value));
  const input = useRef(undefined);
  const translationService = useTranslation();

  const [showUnitWarningModal, hideUnitWarningModal] = useModal(() => (
    <Dialog>
      <p>{translationService.translate("ROOM_PLANNER_MODAL_UNIT_WARNING_1")}</p>
      <p>{translationService.translate("ROOM_PLANNER_MODAL_UNIT_WARNING_2")}</p>
      <button onClick={() => hideUnitWarningModal()}>Ok</button>
    </Dialog>
  ));

  useEffect(() => {
    setInternalValue(valueToUnitString(value));
  }, [value])

  useEffect(() => {
    if (visible) {
      // Set focus to automatically show keyboard.
      input.current.focus();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (parseFloat(internalValue) < 3) {
      showUnitWarningModal();
      return;
    }


    onResize(unitStringToValue(internalValue));
  };

  const handleReset = () => {
    // Resize to original value.
    onResize(value);
  };

  return (
    <div className={cx(styles.ResizePanel, !visible && styles["is-hidden"])}>
      <Input
        submitButton={{
          icon: "image-size-select-small",
          variant: "dark",
          className: styles.SubmitButton,
        }}
        value={internalValue}
        onChange={setInternalValue}
        onSubmit={handleSubmit}
        onReset={handleReset}
        inputRef={input}
        placeholder="E.g. 350mm"
      />
    </div>
  );
};

ResizePanel.propTypes = {
  visible: PropTypes.bool,
  value: PropTypes.number,
  onResize: PropTypes.func,
}

function RoomPlannerBase({ history } : InferProps<typeof RoomPlannerBase.propTypes>) {
  const viewarApi = useViewarApi();
  const translationService = useTranslation();

  const [tracking, setTracking] = useQueryState("tracking", viewarApi.tracker ? (viewarApi.tracker as any).tracking : true);
  const { roomCapturing, roomPlanner } = useServices();
  const editor = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { showLoading, hideLoading } = useLoading();
  const [viewMode, setViewMode] = useState("2D");
  const [toggleShowButtons, showButtons, setShowButtons] = useStateToggle(false);
  const [toggleShowSceneInfo, showSceneInfo] = useStateToggle(false);
  const colorOptions = useDefaultColorOptions();
  const [selection, setSelection] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [showResize, setShowResize] = useState(false);
  const [canResize, setCanResize] = useState(false);
  const [selectionLength, setSelectionLength] = useState(0);
  const [areas, setAreas] = useState<SurfaceArea>({
    floorArea: 0,
    wallArea: 0,
    walls: [],
    floors: [],
  });

  const goTo = (path) => history.push(path);

  const onInput = (type) => {
    if (type === "drop" || type === "drag") {
      updateArea();
    }
  }

  const updateArea = () => {
    setAreas(calculateSurfaceArea(roomPlanner.exportState()));
  }

  const updateState = () => {
    if (!selection || selection !== roomPlanner.selection) {
      setSelection(roomPlanner.selection);
      setShowResize(false);
    }

    setShowButtons(!!roomPlanner.selection);

    setCanUndo(roomPlanner.canUndo);
    updateArea();
  };

  useEffect(() => {
    // Only allow resizing of walls and wall objects.
    const newCanResize = selection && (selection.isWall || (selection.type && selection.wall));
    setCanResize(newCanResize);
    setSelectionLength(newCanResize ? Math.round(selection.length * 100) / 100 : 0);
  }, [selection]),

  useEffect(() => {
    if (!tracking && !DEBUG) {
      goTo("/RoomCapture/TrackingInit");
    }

    // Attach room planner
    roomPlanner.attach(window.document, editor.current, canvas.current, "touchable");

    window.addEventListener("resize", roomPlanner.resizeViewport);
    canvas.current.oncontextmenu = (event) => {
      // Prevent context menu.
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    // Load room state from capturing (if existing).
    if (roomCapturing.roomState) {
      roomPlanner.insertRoom(roomCapturing.roomState);
      roomCapturing.resetRoomState();
    } else if (DEBUG) {
      roomPlanner.importState(debugState);
    }

    roomPlanner.updateSettings({
      snapToGrid: true,
      disableHoldInsertion: true,
      disablePointMerge: true,
    });
    roomPlanner.clearSelection();
    roomPlanner.resizeViewport();
    roomPlanner.on("selectionChanged", updateState);
    roomPlanner.on("input", onInput);

    // Set initial state.
    updateState();

    return async() => {
      roomPlanner.off("selectionChanged", updateState);
      roomPlanner.off("input", onInput);
      roomPlanner.detach();
      await viewarApi.appUtils.resumeRenderLoop();
      window.removeEventListener("resize", roomPlanner.resizeViewport);
    };
  }, []);

  const shareScene = async () => {
    let url;

    if (viewMode !== "2D") {
      await viewarApi.screenshotManager.takeScreenshot();
      url = await viewarApi.screenshotManager.saveScreenshot("screenshots");
    } else {
      const imageData = canvas.current.toDataURL().replace("data:image/png;base64,", "");
      await viewarApi.coreInterface.call("saveCustomFile", "screenshot.png", imageData, "base64");
      url = `/CustomFiles/screenshot.png`;
    }

    const sceneExportObj = await viewarApi.sceneManager.exportScene("Raumaufmas", "obj");

    const email: EmailObject = {
      attachments: [`${sceneExportObj.path}`, `${url}`],
      bcc: null,
      cc: null,
      message:
        `Boden: ${squareMillimetresToMetres(areas.floorArea)}m²<br/>Wände: ${squareMillimetresToMetres(areas.wallArea)}m²`,
      recipients: [""],
      subject: "Raumaufmaß",
    };

    await viewarApi.appUtils.sendEmail(email);
  }

  const addRoomToScene = async () => {
    const exportState = roomPlanner.exportStateToCore(colorOptions);
    // Recreate room if something has changed.
    if (!isEqual(exportState, viewarApi.roomManager.roomDescription)) {
      showLoading();
      await viewarApi.roomManager.addRoomToScene(exportState);
      hideLoading();
    }
  }

  const toggleMode = async (mode) => {
    if (mode === "AR") {
      await addRoomToScene();
      await viewarApi.cameras.arCamera.activate();
      await viewarApi.appUtils.resumeRenderLoop();
    } else if (mode === "3D") {
      await addRoomToScene();
      await viewarApi.cameras.perspectiveCamera.activate();
      await viewarApi.appUtils.resumeRenderLoop();
    } else {
      await viewarApi.appUtils.pauseRenderLoop();
    }

    setViewMode(mode);
  }

  const handleResize = (value) => {
    roomPlanner.updateSelection({
      length: value,
    });
    roomPlanner.redraw();

    updateArea();

    setSelectionLength(value);
    setShowResize(false);
  }

  const wallButtons = areas.walls.map(({area, center}) => ({
    children: `${squareMillimetresToMetres(area)}m²`,
    position: center,
    className: styles.WallButton,
    onClick: () => {
      console.log("Toggle Wall");
    }
  }));

  const floorButtons = areas.floors.map(({area, center}) => ({
    children: `${squareMillimetresToMetres(area)}m²`,
    position: center,
    className: styles.FloorButton,
    onClick: () => {
      console.log("Toggle Floor");
    }
  }));

  const arButtons = [...wallButtons, ...floorButtons];

  const resetRoom = async () => {
    await viewarApi.roomManager.removeRoomFromScene();
    roomPlanner.clear();
    goTo("/RoomCapture");
  }

  return (
    <div
      className={cx(
        styles.Background,
        (viewMode !== "2D") && styles["is-transparent"],
        (viewMode === "3D") && styles.mode3D
      )}
      ref={editor}
    >
      <HeaderBar dark={(viewMode === "2D")} className={styles.HeaderBar} onClick={toggleShowSceneInfo} />
      <Logo className={styles.Logo}/>

      {(viewMode !== "2D") && <ARButtons buttons={arButtons} />}

      {(viewMode === "2D") && <div className={styles.Measurements}>
        <div className={styles.Measurement}>
          Boden: {squareMillimetresToMetres(areas.floorArea)}m&sup2;
        </div>
        <div className={styles.Measurement}>
          Wände: {squareMillimetresToMetres(areas.wallArea)}m&sup2;
        </div>
      </div>}

      <canvas className={cx(styles.Canvas, (viewMode !== "2D") && styles["is-hidden"], "touchable")} ref={canvas} />

      <ResizePanel visible={showResize} value={selectionLength} onResize={handleResize} />

      <SlideWrapper visible={showSceneInfo} className={styles.SlideWrapper}>
        <SceneInfo
          currentPath={history.location.pathname}
          toggleView={toggleShowSceneInfo}
        />
      </SlideWrapper>

      {!showResize && (
        <ButtonPanel
          className={styles.ButtonPanel}
          buttonsArray={[
            {
              id: "reset",
              icon: "reset_arrow",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_COMPLETE") as string),
              onClick: resetRoom,
              variant: (viewMode !== "2D") ? "default" : "dark"
            },
            ...(((viewMode === "2D") && canResize) ? [{
              id: "resize",
              icon: "image-size-select-small",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_RESIZE") as string),
              onClick: () => setShowResize(true),
              variant: "dark",
            }] : []),
            // ...((!modeAR && canUndo) ? [{id: "undo", icon: "cancel", name: "Undo", onClick: roomPlanner.undo, variant: "dark" }] : []),
            ...((viewMode !== "AR") ? [{
              id: "toggle",
              icon: "ar",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_AR_VIEW") as string),
              onClick: () => toggleMode("AR"),
              variant: (viewMode !== "2D") ? "default" : "dark",
            }] : []),
            ...((viewMode !== "3D") ? [{
              id: "toggle",
              icon: "3d",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_3D_VIEW") as string),
              onClick: () => toggleMode("3D"),
              variant: (viewMode !== "2D") ? "default" : "dark",
            }] : []),
            ...((viewMode !== "2D") ? [{
              id: "toggle",
              icon: "2d",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_2D_VIEW") as string),
              onClick: () => toggleMode("2D"),
              variant: "default"
            }] : []),
            {
              id: "share",
              icon: "camera_alt",
              iconClass: styles.Icon,
              name: (translationService.translate("BUTTON_PANEL_COMPLETE") as string),
              onClick: shareScene,
              variant: (viewMode !== "2D") ? "default" : "dark"
            },
          ]}
          showButtons={showButtons}
          baseButton={{
            icon: (viewMode !== "2D") ? `dots-vertical-${showButtons ? "open" : "closed"}` : `dots-vertical-${showButtons ? "closed" : "open"}`,
            name: "",
            onClick: toggleShowButtons,
            style: (viewMode !== "2D") ? {
              backgroundColor: showButtons ? "white" : "transparent"
            } : {
              backgroundColor: showButtons ? "black" : "transparent",
            },
            variant: (viewMode !== "2D") ? "default" : "dark" ,
          }}
        />
      )}
    </div>
  );
};

RoomPlannerBase.propTypes = PagePropTypes;

export const RoomPlanner = withRouter(RoomPlannerBase);
