import React from "react";
import PropTypes, { InferProps } from "prop-types";
import styles from "./Icon.scss";
import cx from "classnames";
import iconsContext from "./icons-context";

export const allIconNames = iconsContext
  .keys()
  .map(key => key.replace(/\.\/(.+)(.svg$)/, "$1"));

function Icon({ name, className, onClick, style, size, variant, disabled, ...rest }: InferProps<typeof Icon.propTypes>) {

  if (name === undefined) {
    return null;
  }

  const { default: IconComponent } = iconsContext(`./${name}.svg`); // This is equal to `require(path)`

  const SvgIcon = () => React.createElement(
    IconComponent,
    { name, ...rest },
    null
  );

  return (
    <div style={style} className={cx(styles.Icon, styles[`size-${size}`], variant && styles[`variant-${variant || "default"}`], disabled && styles["is-disabled"], className)} onClick={onClick}>
      <SvgIcon />
    </div>
  );
};

Icon.propTypes = {
  className: PropTypes.any,
  disabled: PropTypes.bool,
  name: process.env.NODE_ENV === "test" ? PropTypes.string : PropTypes.oneOf(allIconNames),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["small", "default"]),
  style: PropTypes.any,
  variant: PropTypes.oneOf(["dark", "default", "filled", "gallery-close"]),
};

Icon.defaultProps = {
  size: "default",
  variant: "default",
};

export default Icon;
