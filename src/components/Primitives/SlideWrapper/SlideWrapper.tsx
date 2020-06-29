import React from "react";
import styles from "./SlideWrapper.scss";
import PropTypes from "prop-types";
import cx from "classnames";

function SlideWrapper({ visible, children, className }) {
  return (
    <div
      className={cx(styles.SlideWrapper, className)}
      style={{ transform: visible ? "translateX(0pt)" : "translateX(-100%)" }}
    >
      {children}
    </div>
  );
}

SlideWrapper.propTypes = {
  children: PropTypes.any,
  visible: PropTypes.bool,
  className: PropTypes.any,
}

export default SlideWrapper;
