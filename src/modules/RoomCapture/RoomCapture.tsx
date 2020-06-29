import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { InferProps } from "prop-types";
import PagePropTypes from "src/PagePropTypes";
import useViewarApi from "hooks/useViewarApi";
import useQueryState from "hooks/useQueryState";
import useTranslation from "hooks/useTranslation";
import useLoading from "hooks/useLoading";
import HeaderBar from "components/Patterns/HeaderBar";
import { useModal } from "react-modal-hook";
import Dialog from "components/Primitives/Dialog";
import Button from "components/Primitives/Button";
import RoomCaptureWalls from "./steps/walls";
import RoomCaptureHeight from "./steps/height";
import RoomCaptureObjects from "./steps/objects";
import Logo from "components/Primitives/Logo/Logo";
import useServices from "hooks/useServices";
import useDefaultColorOptions from "hooks/useDefaultColorOptions";
import useStateToggle from "hooks/useStateToggle";
import SceneInfo from "components/Patterns/SceneInfo";
import SlideWrapper from "components/Primitives/SlideWrapper";
import styles from "./RoomCapture.scss";
import TrackingInit from "pages/TrackingInit";

function RoomCaptureBase({ history } : InferProps<typeof RoomCaptureBase.propTypes>) {
  const viewarApi = useViewarApi();
  const translationService = useTranslation();
  const [tracking, setTracking] = useQueryState("tracking", viewarApi.tracker ? (viewarApi.tracker as any).tracking : true);
  const { roomCapturing, roomPlanner } = useServices();
  const { showLoading, hideLoading } = useLoading();
  const [canUndo, setCanUndo] = useState(false);
  const [canFinish, setCanFinish] = useState(false);
  const [canCapture, setCanCapture] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);
  const [snapped, setSnapped] = useState(false);
  const [objectSecondStep, setObjectSecondStep] = useState(false);
  const [objectCaptureType, setObjectCaptureType] = useState(false);
  const colorOptions = useDefaultColorOptions();
  const [toggleShowSceneInfo, showSceneInfo] = useStateToggle(false);

  const [showConfirmationModal, hideConfirmationModal] = useModal(() => (
    <Dialog>
      <p>{translationService.translate("ROOM_CAPTURE_MODAL_TITLE")}</p>
      <Button onClick={createRoomLayout}>{translationService.translate("ROOM_CAPTURE_MODAL_CONFIRM")}</Button>
      <Button onClick={() => hideConfirmationModal()}>{translationService.translate("ROOM_CAPTURE_MODAL_CANCEL")}</Button>
    </Dialog>
  ));

  const updateLength = (newLength) => {
    setLength(Math.round(newLength / 10));
  };

  const updateHeight = (newHeight) => {
    setHeight(Math.round(newHeight / 10));
  };

  const updateProgress = (progress) => {
    console.log(`roomCapturing init progress: ${progress}`);
  };

  const goToNextStep = async() => {
    showLoading();
    await roomCapturing.nextState();
    hideLoading();
    setCurrentStep(currentStep + 1);
  };

  const stopCapture = async() => {
    roomCapturing.off("canUndo", setCanUndo);
    roomCapturing.off("canFinish", setCanFinish);
    roomCapturing.off("canCapture", setCanCapture);
    roomCapturing.off("snapped", setSnapped);
    roomCapturing.off("length", updateLength);
    roomCapturing.off("height", updateHeight);
    roomCapturing.off("roomClosed", goToNextStep);
    await roomCapturing.stop();
  };

  const createRoomLayout = async() => {
    showLoading();

    roomCapturing.finish();
    roomPlanner.insertRoom(roomCapturing.roomState);

    const exportState = roomPlanner.exportStateToCore(colorOptions);

    await stopCapture();
    await viewarApi.roomManager.addRoomToScene(exportState);

    hideLoading();

    history.push("/RoomPlanner");
  }

  const finishCapture = (confirm = false) => {
    if (confirm) {
      showConfirmationModal();
    } else {
      createRoomLayout();
    }
  };

  const goTo = (path) => history.push(path);

  useEffect(() => {
    if (!tracking) {
      goTo("/RoomCapture/TrackingInit");
    }

    const setup = async() => {
      showLoading();
      roomCapturing.on("canUndo", setCanUndo);
      roomCapturing.on("canFinish", setCanFinish);
      roomCapturing.on("canCapture", setCanCapture);
      roomCapturing.on("snapped", setSnapped);
      roomCapturing.on("length", updateLength);
      roomCapturing.on("height", updateHeight);
      roomCapturing.on("roomClosed", goToNextStep);

      await viewarApi.cameras.arCamera.activate();

      await viewarApi.roomManager.removeRoomFromScene();
      await viewarApi.sceneManager.scene.setVisible(false as any);
      await roomCapturing.setup(updateProgress);
      await viewarApi.sceneManager.scene.setVisible(true as any);
      await roomCapturing.start();
      hideLoading();
    }

    setup();

    return async () => await stopCapture();
  }, []);

  const RenderStep = (props) => {
    switch (currentStep) {
      case 0:
        return <RoomCaptureWalls {...props} />;
      case 1:
        return <RoomCaptureHeight {...props} />;
      case 2:
        return <RoomCaptureObjects {...props} />;
      default:
        return null;
    }
  }

  const triggerDefaultAction = async (e) => {
    // console.log("triggerDefaultAction", currentStep, e);
    if (showSceneInfo) {
      return;
    }

    switch (currentStep) {
      case 0:
        if (canCapture) {
          roomCapturing.capture(e);
        }
        return;
      case 1:
        await roomCapturing.capture();
        goToNextStep();
        return;
      case 2:
        if (objectCaptureType) {
          const { captured, finished } = await roomCapturing.capture(objectCaptureType);

          if (captured) {
            setObjectSecondStep(true);
          }

          if (finished) {
            setObjectCaptureType(false);
          }
        } else {
          finishCapture(true)
        }
        return;
      default:
        return null;
    }
  }

  const getTitle = () => {
    switch (currentStep) {
      case 1:
        return (translationService.translate("ROOM_CAPTURE_TITLE_1") as string);
      case 2:
        if (objectCaptureType) {
          if (objectSecondStep) {
            return (translationService.translate("ROOM_CAPTURE_TITLE_2_OSS") as string);
          }

          return (translationService.translate("ROOM_CAPTURE_TITLE_2_OCT") as string);
        }

        return (translationService.translate("ROOM_CAPTURE_TITLE_2") as string);
      case 0:
      default:
        return (translationService.translate("ROOM_CAPTURE_TITLE_0") as string);
    }
  }

  return (
    <div
      onClick={triggerDefaultAction}
      className={styles.Wrapper}
    >
      <HeaderBar title={getTitle()} onClick={toggleShowSceneInfo} />

      <SlideWrapper visible={showSceneInfo}>
        <SceneInfo
          currentPath={history.location.pathname}
          toggleView={toggleShowSceneInfo}
        />
      </SlideWrapper>

      <RenderStep
        canCapture={canCapture}
        canFinish={canFinish}
        canUndo={canUndo}
        finishCapture={finishCapture}
        goToNextStep={goToNextStep}
        height={height}
        length={length}
        objectCaptureType={objectCaptureType}
        objectSecondStep={objectSecondStep}
        roomCapturing={roomCapturing}
        setObjectCaptureType={setObjectCaptureType}
        setObjectSecondStep={setObjectSecondStep}
        snapped={snapped}
      />

      <Logo />
    </div>
  );
};

RoomCaptureBase.propTypes = PagePropTypes;

RoomCaptureBase.routes = {
  TrackingInit: () => <TrackingInit nextRoute="/RoomCapture" />
};

export const RoomCapture = withRouter(RoomCaptureBase);
