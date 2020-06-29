import React from "react";
import styles from "./Logo.scss";
import cx from "classnames";
import PropTypes, { InferProps } from "prop-types";

function Logo({className, ...rest} : InferProps<typeof Logo.propTypes>) {
  return (
    <div className={cx(styles.Logo, className)} {...rest} />
  );
}

Logo.propTypes = {
  className: PropTypes.any,
};

export default Logo;
