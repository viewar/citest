import React from "react";
import styles from "./HeaderBar.scss";
import BurgerMenu from "../BurgerMenu";
import cx from "classnames";
import PropTypes, { InferProps } from "prop-types";

function HeaderBar({ onClick, dark, title, className }: InferProps<typeof HeaderBar.propTypes>) {
  return (
    <div className={cx(styles.HeaderBar, className)}>
      <BurgerMenu dark={dark} className={styles.BurgerMenu} onClick={onClick}/>
      {title && <div className={styles.Title}>{title}</div>}
    </div>
  )
}

HeaderBar.propTypes = {
  className: PropTypes.any,
  onClick: PropTypes.func,
  dark: PropTypes.bool,
  title: PropTypes.string,
}

export default HeaderBar;
