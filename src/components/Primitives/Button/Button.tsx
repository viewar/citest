import React from "react";
import PropTypes, { InferProps } from "prop-types";
import cx from "classnames";
import styles from "./Button.scss";

const variants = [
  "button",
  "icon"
];

function Button({ children, variant, onClick, disabled, className, ...rest}: InferProps<typeof Button.propTypes>) {
  return (
    <button
      className={cx(styles.Button, styles[`is-${variant}`], className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(variants).isRequired,
  className: PropTypes.any,
  style: PropTypes.any,
};

Button.defaultProps = {
  variant: "button",
  disabled: false,
}

export default Button;
