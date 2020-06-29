import React from "react";
import styles from "./BurgerMenu.scss";
import cx from "classnames";
import PropTypes, { InferProps } from "prop-types";
import Icon from "components/Primitives/Icon";

function BurgerMenu({ className, dark, onClick }: InferProps<typeof BurgerMenu.propTypes>) {
  return (
    <Icon size="small" className={cx(styles.MenuButton, className)} variant={dark ? "dark" : "default"} name="menu" onClick={onClick} />
  );
}

BurgerMenu.propTypes = {
  className: PropTypes.any,
  onClick: PropTypes.func,
  dark: PropTypes.bool,
}

export default BurgerMenu;
