import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { InferProps } from "prop-types";
import PagePropTypes from "../../PagePropTypes";
import PropTypes from "prop-types";
import useViewarApi from "hooks/useViewarApi";
import styles from "./LandingPage.scss";
import useTranslation from "hooks/useTranslation";

function LandingPage({ history, defaultModules } : InferProps<typeof LandingPage.propTypes>) {
  const viewarApi = useViewarApi();
  const translationService = useTranslation();

  useEffect(() => {
    const load = async() => {
      if (viewarApi.tracker) {
        await viewarApi.tracker.deactivate();
      }
      await viewarApi.sceneManager.clearScene();
      await viewarApi.appUtils.pauseRenderLoop();
    };

    load();
  }, []);

  const goTo = (path) => history.push(path);

  return (
    <div className={styles.Background}>
      <div className={styles.Overlay} />
      <div className={styles.Overlay2} />

      <div className={styles.Logo} />

      <div className={styles.TextWrapper}>
        <h1 className={styles.Title}>{translationService.translate("LANDING_PAGE_TITLE")}</h1>
        <h3 className={styles.SubTitle}>{translationService.translate("LANDING_PAGE_SUBTITLE")}</h3>

        <div className={styles.ButtonWrapper}>
          {defaultModules.map(module => (
            <button
              className={styles.StartButton}
              key={module}
              onClick={() => goTo(`/${module}`)}
            >
              {translationService.translate(`LANDING_PAGE_BUTTON_${!!module && module.toUpperCase()}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

LandingPage.propTypes = {
  ...PagePropTypes,
  defaultModules: PropTypes.array
};

export default withRouter(LandingPage);
