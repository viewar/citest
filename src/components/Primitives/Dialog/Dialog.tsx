import React from "react";
import PropTypes, { InferProps } from "prop-types";
import cx from "classnames";
import styles from "./Dialog.scss";
import global from "css/index.scss";

function Dialog({ children, className, ...rest}: InferProps<typeof Dialog.propTypes>) {
  return (
    <div className={cx(styles.Dialog, global.OverlayBackgroundColor)} {...rest}>
      <div className={cx(styles.Content, className)}>
        {children}
      </div>
    </div>
  );
}

Dialog.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
};

export default Dialog;
