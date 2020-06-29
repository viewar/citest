import React, { useEffect, useState } from "react";
import { InferProps } from "prop-types";
import { withRouter } from "react-router-dom";
import PagePropTypes from "src/PagePropTypes";
import Button from "components/Primitives/Button";
import useQueryState from "hooks/useQueryState";
import useViewarApi from "hooks/useViewarApi";
import useLoading from "hooks/useLoading";
import Gallery from "components/Patterns/Gallery/Gallery";
import ProductInfo from "components/Patterns/ProductInfo/ProductInfo";
import PropertyPicker from "components/Patterns/PropertyPicker/PropertyPicker";
import SceneInfo from "components/Patterns/SceneInfo/SceneInfo";
import ButtonPanel from "components/Patterns/ButtonPanel/ButtonPanel";
import styles from "./ProductVisualisation.scss";
import HeaderBar from "components/Patterns/HeaderBar";
import Progress from "components/Patterns/Progress";
import Logo from "components/Primitives/Logo/Logo";
import useStateToggle from "hooks/useStateToggle";
import SlideWrapper from "components/Primitives/SlideWrapper";
import cx from "classnames";
import useTranslation from "hooks/useTranslation";
import TrackingInit from "pages/TrackingInit";

function ProductVisualisationBase({ history }: InferProps<typeof ProductVisualisationBase.propTypes>) {
  const viewarApi = useViewarApi();
  const translationService = useTranslation();
  const { showLoading, hideLoading } = useLoading();
  const [tracking, setTracking] = useQueryState("tracking", viewarApi.tracker ? (viewarApi.tracker as any).tracking : true);

  const [currentInstance, setCurrentInstance] = useState(null);
  const [customTextures, setCustomTextures] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [sceneProducts, setSceneProducts] = useState([]);
  const [showTextures, setShowTextures] = useState(false);

  const [toggleGallery, showGallery, setShowGallery] = useStateToggle(false);
  const [toggleProductInfo, showProductInfo] = useStateToggle(false);
  const [toggleSceneInfo, showSceneInfo] = useStateToggle(false);

  const [toggleShowInstanceButtons, showInstanceButtons, setShowInstanceButtons] = useStateToggle(true);
  const [toggleShowSceneButtons, showSceneButtons, setShowSceneButtons] = useStateToggle(true);

  const toggleTextures = () => {
    if (!showTextures) {
      setShowTextures(true);
    }

    setShowInstanceButtons(false);
  }

  useEffect(() => {
    if (!tracking) {
      // TODO: Check if the "/ProductVisualisation" part can be generated automatically.
      goTo("/ProductVisualisation/TrackingInit");
    }

    const resetARCamera = async () => {
      await viewarApi.cameras.arCamera.activate();
    }

    if (viewarApi.tracker) {
      resetARCamera();

      viewarApi.modelManager.on("transferProgress", updateProgress);
      viewarApi.sceneManager.on("objectTouched", selectInstance);
      viewarApi.sceneManager.on("selectionChanged", deSelectInstance);
      viewarApi.tracker.on("trackingTargetStatusChanged", handleTrackingChanged);
    }

    return () => {
      if (viewarApi.tracker) {
        viewarApi.modelManager.off("transferProgress", updateProgress);
        viewarApi.sceneManager.off("objectTouched", selectInstance);
        viewarApi.sceneManager.off("selectionChanged", deSelectInstance);
        viewarApi.tracker.off("trackingTargetStatusChanged", handleTrackingChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentInstance) {
      setShowTextures(false);
      setCustomTextures([]);
      return;
    }

    const customTexturesArray = Object.keys(currentInstance.properties).map(p => {
      if (currentInstance.properties[p].options.length > 1) {
        return currentInstance.properties[p];
      }
    }).filter(Boolean);

    setCustomTextures(customTexturesArray);

  }, [currentInstance]);

  const updateProgress = (id, progress) => {
    if (showTextures) {
      return;
    }

    const progressParsed = parseFloat(progress);
    if (progressParsed > 90 && downloadProgress !== 100) {
      setDownloadProgress(100);
    } else {
      setDownloadProgress(progressParsed);
    }
  };

  // Use this only to SELECT the current instance
  const selectInstance = (node) => {
    if (!currentInstance || (currentInstance && currentInstance.id !== node.id)) {
      setCurrentInstance(node);
      // TODO: Make sure Texture toggling works as expected
      setShowTextures(false);
    }

    if (!showInstanceButtons) {
      setShowInstanceButtons(true);
    }
  };

  // Use this only to DESELECT current instance
  const deSelectInstance = async (selection) => {
    // await viewarApi.sceneManager.select(selection);

    if (!selection) {
      setCurrentInstance(null);
    }

    if (selection || !showInstanceButtons) {
      setShowInstanceButtons(true);
    }
  }

  // // Show infinite spinner while Inserting model (has no onProgress info)
  // useEffect(() => {
  //   if (downloadProgress === 100) {
  //     showLoading();
  //   } else {
  //     hideLoading();
  //   }
  // }, [downloadProgress])

  const loadModel = async (modelID) => {
    setShowGallery(false);
    const model = await viewarApi.modelManager.fetchModelFromRepository(`${modelID}`);
    const pose = await viewarApi.cameras.arCamera.getPoseInViewingDirection(1500, true);

    await viewarApi.sceneManager.insertModel(model, {pose } as any);
    setDownloadProgress(0);

    // UPDATE FROM MARKUS:
    // await viewarApi.sceneManager.select(instance); USE THIS!!
    // setCurrentInstance(instance); DO NOT USE THIS!!

    setSceneProducts(viewarApi.sceneManager.scene.children);
  }

  const goTo = (path) => history.push(path);

  const handleTrackingChanged = () => {
    setTracking((viewarApi.tracker as any).tracking);
  };

  const removeInstance = async (instanceID) => {
    const instance = await viewarApi.sceneManager.findNodeById(instanceID);
    await viewarApi.sceneManager.removeNode(instance);
    setCurrentInstance(null);
    setSceneProducts(viewarApi.sceneManager.scene.children);

    hideLoading();
  }

  const shareScene = async () => {
    await viewarApi.screenshotManager.takeScreenshot();
    const url = await viewarApi.screenshotManager.saveScreenshot("screenshots");
    viewarApi.screenshotManager.shareScreenshot("native", url);
    setCurrentInstance(null);
  }

  const deselectAndToggleInstanceButtons = async () => {
    if (currentInstance && showInstanceButtons) {
      await viewarApi.sceneManager.select(null);
      setCurrentInstance(null);
    }

    if (!currentInstance) {
      toggleShowInstanceButtons();
    }

    if (showTextures && !showInstanceButtons) {
      setShowTextures(false);
      toggleShowInstanceButtons();
    }
  }
  const deselectAndToggleSceneButtons = async () => {

    // if (currentInstance && showSceneButtons) {
    //   await viewarApi.sceneManager.select(null);
    //   setCurrentInstance(null);
    // }

    if (showTextures && !showSceneButtons) {
      setShowTextures(false);
    }

    toggleShowSceneButtons();
  }

  return (
    <>
      <HeaderBar onClick={toggleSceneInfo} />
      <div className={styles.Overlay} />
      <div className={styles.Overlay2} />
        {!tracking && (
          <>
            <p>{translationService.translate("AR_TRACKING_LOST")}</p>
            <Button onClick={() => goTo("/ProductVisualization/TrackingInit")}>
              {translationService.translate("AR_TRACKING_RESTORE")}
            </Button>
          </>
        )}

        <Progress
          hidden={(downloadProgress === 0) || (downloadProgress === 100)}
          progress={downloadProgress}
        />

        {downloadProgress > 0 &&
          <div className={styles.LoadModelText}>
            {(downloadProgress === 100) ? "" : translationService.translate("AR_PROGRESS_DOWNLOAD")
            }
          </div>
        }

        <ButtonPanel
          buttonsArray={[
            {
              id: "share",
              icon: "camera_alt",
              name: (translationService.translate("BUTTON_PANEL_SHARE") as string),
              onClick: shareScene,
            },
            {
              id: "add",
              icon: "add",
              name: (translationService.translate("BUTTON_PANEL_ADD") as string),
              onClick: toggleGallery,
            },
          ]}
          baseButton={{
            name: "",
            onClick: deselectAndToggleSceneButtons,
            icon: `dots-vertical-${showSceneButtons ? "open" : "closed"}`,
            style: { backgroundColor: showSceneButtons ? "white" : "transparent" }
          }}
          className={cx(currentInstance ? styles.InstanceActiveBase : styles.Default)}
          showButtons={showSceneButtons}
        />

        <ButtonPanel
          buttonsArray={[
            {
              id: "share",
              icon: "camera_alt",
              name: (translationService.translate("BUTTON_PANEL_SHARE") as string),
              onClick: shareScene,
            },
            {
              id: "remove",
              icon: "remove",
              name: (translationService.translate("BUTTON_PANEL_REMOVE") as string),
              onClick: () => removeInstance(currentInstance.id),
          },
            ...(customTextures.length > 0 ? [
              {
                id: "texture",
                icon: "texture",
                name: (translationService.translate("BUTTON_PANEL_TEXTURES") as string),
                onClick: toggleTextures
              }
            ] : []),
            {
              id: "info",
              icon: "info",
              name: (translationService.translate("BUTTON_PANEL_INFO") as string),
              onClick: toggleProductInfo,
            },
          ]}
          baseButton={{
            name: ((showInstanceButtons || showTextures) && currentInstance && currentInstance.model) ? currentInstance.model.name : "",
            onClick: deselectAndToggleInstanceButtons,
            icon: "back_arrow",
            style: { backgroundColor: "white" }
          }}
          className={cx(currentInstance ? styles.Default : styles.InstanceInactive)}
          showButtons={showInstanceButtons}
        />

        <PropertyPicker
          customisableProperties={customTextures}
          isVisible={!!currentInstance && showTextures}
          instance={currentInstance}
        />

        <Logo />

        <SlideWrapper visible={showGallery}>
          <Gallery loadModel={loadModel} toggleView={toggleGallery} />
        </SlideWrapper>

        <SlideWrapper visible={showProductInfo}>
          <ProductInfo instance={currentInstance} toggleView={toggleProductInfo} />
        </SlideWrapper>

        <SlideWrapper visible={showSceneInfo}>
          <SceneInfo
            currentPath={history.location.pathname}
            removeInstance={removeInstance}
            sceneProducts={sceneProducts}
            toggleView={toggleSceneInfo}
          />
        </SlideWrapper>
      </>
  );
};

ProductVisualisationBase.propTypes = PagePropTypes;

ProductVisualisationBase.routes = {
 TrackingInit: () => <TrackingInit nextRoute="/ProductVisualisation" />
};

export const ProductVisualisation = withRouter(ProductVisualisationBase);
