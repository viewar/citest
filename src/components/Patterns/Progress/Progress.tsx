import React from "react";
import PropTypes, { InferProps } from "prop-types";
import cx from "classnames";
import global from "css/index.scss";
import { Circle } from "rc-progress";
import styles from "./Progress.scss";

function Progress({
  className,
  hidden,
  progress,
}: InferProps<typeof Progress.propTypes>) {

  if (hidden) {
    return null;
  }

  return (
    <div className={cx(styles.Loading, global.OverlayBackgroundColor)}>
      <div className={cx(styles.Container, className)}>
        <Circle
          gapPosition="bottom"
          percent={progress}
          strokeColor="#ef0a12"
          strokeWidth={8}
          trailColor="rgba(255,255,255,0.15)"
          trailWidth={8}
        />

        <div className={styles.Percentage}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

Progress.propTypes = {
  className: PropTypes.string,
  hidden: PropTypes.bool,
  progress: PropTypes.number,
}

export default Progress;
