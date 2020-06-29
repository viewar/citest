import React from "react";
import PropTypes, { InferProps } from "prop-types";
import styles from "./Spinner.scss";
import cx from "classnames";

function Spinner({size, ...rest}: InferProps<typeof Spinner.propTypes>) {
  return (
    <div className={cx(styles.Spinner, styles[`size-${size}`])}>
      <div className={styles.SpinnerBackground} />
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
};

Spinner.defaultProps = {
  size: 3,
}

export default Spinner;
