import React, { useEffect, useState } from "react";
import PropTypes, { InferProps } from "prop-types";
import Button from "../Button";
import getScreenSpaceStyles from "./getScreenSpaceStyles";
import styles from "./ARButtons.scss";
import useViewarApi from "hooks/useViewarApi";
import throttle from "lodash.throttle";
import cx from "classnames";

/**
 * Component to display buttons on the UI depending on a 3d coordinate.
 * Buttons are not visible if the coordinate is not in the camera view.
 * Try to avoid two ARButtons components in one view for performance reasons.
 * Uses the <Button /> component to render the buttons.
 *
 * Usage:
 *  <ARButtons
 *    buttons=[{
 *      children: "This is an AR Button",
 *      className: styles.CustomClass,
 *      position: {
 *        x: 0,
 *        y: 1000,
 *        z: 0
 *      }
 *      onClick: () => {
 *        console.log("AR Button clicked.");
 *      }
 *    }]
 *  />
 */
function ARButtons({ buttons, updateRate }: InferProps<typeof ARButtons.propTypes>) {
  const viewarApi = useViewarApi();

  let updateInterval = null;
  const [buttonStyles, setButtonStyles] = useState([]);

  const update = throttle(async() => {
    if (viewarApi.tracker && viewarApi.tracker.active) {
      const screenCoordinates = await viewarApi.coreInterface.call(
        "getScreenSpaceCoordinates",
        JSON.stringify(buttons.map(button => button.position))
      );

      const newButtonStyles = await getScreenSpaceStyles(screenCoordinates || []);
      setButtonStyles(newButtonStyles);
    }
  }, updateRate);

  useEffect(() => {
    update();
  }, [buttons]);

  useEffect(() => {
    updateInterval = setInterval(() => update(), updateRate);

    return () => {
      clearInterval(updateInterval);
    }
  }, []);

  return (
    <>
      {buttons.map(({className, ...buttonRest}, i) => (
        <Button className={cx(styles.Button, className)} {...buttonRest} key={i} style={buttonStyles[i]} />
      ))}
    </>
  );
}

ARButtons.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    ...Button.propTypes,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      z: PropTypes.number,
    })
  })),
  className: PropTypes.any,
  updateRate: PropTypes.number,
};

ARButtons.defaultProps = {
  buttons: [],
  updateRate: 30,
}

export default ARButtons;
