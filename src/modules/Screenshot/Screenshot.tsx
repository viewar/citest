import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PagePropTypes from "src/PagePropTypes";
import Button from "components/Primitives/Button";
import styles from "./Screenshot.scss";
import useViewarApi from "hooks/useViewarApi";
import { InferProps } from "prop-types";
import Icon from "components/Primitives/Icon";

function ScreenshotBase({ history }: InferProps<typeof ScreenshotBase.propTypes>) {
  const viewarApi = useViewarApi();

  const [screenshot, setScreenshot] = useState("");
  const goTo = (path) => history.push(path);

  useEffect(() => {
    const load = async() => {
      await viewarApi.screenshotManager.takeScreenshot();
      const url = await viewarApi.screenshotManager.saveScreenshot("screenshots");
      await viewarApi.appUtils.pauseRenderLoop();
      setScreenshot(url);
    };

    load();

    return async() => {
      await viewarApi.appUtils.resumeRenderLoop();
    };
  }, []);

  const shareScreenshot = () => {
    viewarApi.screenshotManager.shareScreenshot("native", screenshot);
  }

  return (
    <>
      <h1>Screenshot</h1>
      <Button onClick={() => goTo("/ProductVisualisation")} variant="icon"><Icon name="back"/></Button>
      <Button onClick={shareScreenshot} variant="icon"><Icon name="share"/></Button>
      {!!screenshot && (
        <img src={screenshot} className={styles.Screenshot}/>
      )}
    </>
  );
};

ScreenshotBase.propTypes = PagePropTypes;

export const Screenshot = withRouter(ScreenshotBase);
