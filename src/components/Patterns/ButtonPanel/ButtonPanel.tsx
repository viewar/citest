import React from "react";
import styles from "./ButtonPanel.scss";
import PropTypes, { InferProps } from "prop-types";
import cx from "classnames";
import Icon from "../../Primitives/Icon";

// START
// Example of how to use this component:
// <ButtonPanel
//   buttonsArray={currentInstance ? [
//     {id: "share", icon: "camera_alt", name: "Share", onClick: shareScene },
//     {id: "remove", icon: "remove", name: "Delete", onClick: removeInstance },
//     ...(customTextures.length > 0 ? [{id: "texture", icon: "texture", name: "Texture", onClick: toggleTextures }] : []),
//     ...(!!currentInstance.model.data.description ? [{id: "info", icon: "info", name: "Information", onClick: toggleProductInfo }] : []),
//   ] : [
//     {id: "share", icon: "camera_alt", name: "Share", onClick: shareScene },
//     {id: "add", icon: "add", name: "Add Product", onClick: toggleGallery },
//   ]}
//   baseButton={{
//     name: (currentInstance && currentInstance.model) ? currentInstance.model.name : "",
//     onClick: toggleShowButtons,
//     icon: currentInstance ? (showButtons ? "layers" : "layers2") :
//       (`dots-vertical-${showButtons ? "open" : "closed"}`),
//     style: {
//       backgroundColor: showButtons ? "white" : "transparent"
//     }
//   }}
//   showButtons={showButtons}
// />
// End

function ButtonPanel({
  buttonsArray,
  showButtons,
  baseButton,
  className,
}: InferProps<typeof ButtonPanel.propTypes>) {

  return (
    <div className={cx(styles.FieldWrapper, className)}>
      {buttonsArray.map((button, i) => (
        <button
          disabled={button.disabled}
          key={button.id + i}
          className={cx(styles.ButtonWrapper, showButtons && styles.ActiveWrapper)}
          style={{
            opacity: showButtons ? "1" : "0",
            transform: showButtons ? `translateY(0%)` : `translateY(100%)`
          }}
          onClick={button.onClick}
        >
          <Icon
            disabled={button.disabled}
            className={button.iconClass}
            name={button.icon}
            variant={button.variant}
          />
          <div className={cx(styles.ButtonText, button.variant && styles[`variant-${button.variant}`])}>{button.name}</div>
        </button>
      ))}

      {!!baseButton &&
        <div className={cx(styles.ButtonWrapper, styles.BaseButtonWrapper)}>
          <button
            disabled={baseButton.disabled}
            className={cx(styles.Button)}
            onClick={baseButton.onClick}
            style={baseButton.style}
          >
            <Icon
              disabled={baseButton.disabled}
              variant={baseButton.variant}
              name={baseButton.icon}
            />
          </button>
          <div className={styles.ButtonText}>{baseButton.name}</div>
        </div>
      }
    </div>
  );
}

const ButtonPropType = PropTypes.shape({
  id: PropTypes.string,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  name: PropTypes.string,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.any,
  disabled: PropTypes.bool,
})

ButtonPanel.propTypes = {
  buttonsArray: PropTypes.arrayOf(ButtonPropType),
  baseButton: PropTypes.oneOfType([ButtonPropType, PropTypes.any]),
  showButtons: PropTypes.bool,
  toggleShowButtons: PropTypes.func,
  dark: PropTypes.bool,
  className: PropTypes.any,
}

ButtonPanel.defaultProps = {
  dark: false,
};

export default ButtonPanel;
