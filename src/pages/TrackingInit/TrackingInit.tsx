import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useViewarApi from "hooks/useViewarApi";
import PropTypes, { InferProps } from "prop-types";
import styles from "./TrackingInit.scss";
import Logo from "components/Primitives/Logo/Logo";
import useTranslation from "hooks/useTranslation";

export default function TrackingInit({ nextRoute }: InferProps<typeof TrackingInit.propTypes>) {
  const viewarApi = useViewarApi();
  const history = useHistory();   // Avoid withRouter for type checking of the additional properties (nextRoute).
  const translationService = useTranslation();

  const goTo = (path) => history.push(path);

  const handleTrackingChanged = () => {
    if ((viewarApi.tracker as any).tracking) {
      if (viewarApi.coreInterface.platform !== "Mock" && viewarApi.coreInterface.platform !== "Emscripten") {
        viewarApi.coreInterface.call("playSound", { type: "vibrate" });
      }

      goTo(nextRoute);
    }
  };

  useEffect(() => {
    if (viewarApi.tracker.tracking) {
      goTo(nextRoute);
    }

    const load = async() => {
      await viewarApi.appUtils.resumeRenderLoop();
      await viewarApi.cameras.arCamera.activate();

      if (viewarApi.tracker) {
        viewarApi.tracker.on("trackingTargetStatusChanged", handleTrackingChanged);
        await viewarApi.tracker.activate();
      } else {
        goTo(nextRoute);
      }
    };

    load();

    return () => {
      if (viewarApi.tracker) {
        viewarApi.tracker.off("trackingTargetStatusChanged", handleTrackingChanged);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.Overlay} />

      <div className={styles.TextWrapper}>
        <h1 className={styles.Title}>{translationService.translate("TRACKING_INIT_TITLE")}</h1>
        <h3 className={styles.SubTitle}>
          {translationService.translate("TRACKING_INIT_SUBTITLE")}
        </h3>

        <img className={styles.HelperImage} src="assets/images/tracking_init.png" />
      </div>

      <Logo />
    </>
  );
};

TrackingInit.propTypes = {
  nextRoute: PropTypes.string
};

// export TrackingInit;
