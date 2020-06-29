import React, { useEffect, useState } from "react";
import { InferProps, InferType } from "prop-types";
import useViewarApi from "hooks/useViewarApi";
import useQueryState from "hooks/useQueryState";
import styles from "./SceneInfo.scss";
import CategoryView from "components/Patterns/CategoryView";
import PropTypes from "prop-types";
import useLoading from "hooks/useLoading";
import Icon from "components/Primitives/Icon";
import { useHistory } from "react-router";
import cx from "classnames";
import useTranslation from "hooks/useTranslation";

function SceneInfo({
  className,
  currentPath,
  removeInstance,
  sceneProducts,
  toggleView,
} : InferProps<typeof SceneInfo.propTypes>) {
  const history = useHistory();
  const viewarApi = useViewarApi();
  const translationService = useTranslation();

  const onShopClick = (productUrl) => {
    viewarApi.appUtils.openUrl(productUrl);
  };

  const onModeClick = async (e, url) => {
    const { pathname } = history.location;

    e.stopPropagation();

    if (url === pathname) {
      toggleView();
    } else {
      // Clear to prevent bugs
      await viewarApi.sceneManager.clearScene();
      await viewarApi.roomManager.removeRoomFromScene();
      history.push(url);
    }
  };

  const onMeasureClick = (e) => {
    if (!viewarApi.roomManager.roomDescription) {
      onModeClick(e, "/RoomCapture")
    } else {
      onModeClick(e, "/RoomPlanner")
    }
  };

  return (
    <div className={cx(styles.SceneInfoContainer, className)}>
      <Icon
        className={styles.ToggleView}
        onClick={(toggleView as any)}
        name="close"
        size="small"
      />

      <div className={styles.SceneInfoUpper}>
        <div className={styles.SectionTitle}>Modus auswählen</div>
        <div
          className={cx(styles.LinkOptions, (currentPath !== "/ProductVisualisation") && styles.isActive)}
          onClick={onMeasureClick}
        >
            <Icon name="tape-measure" size="small" />
            {translationService.translate("LANDING_PAGE_BUTTON_ROOMPLANNER")}
        </div>
        <div
          className={cx(styles.LinkOptions, (currentPath === "/ProductVisualisation") && styles.isActive)}
          onClick={(e) => onModeClick(e, "/ProductVisualisation")}
        >
          <Icon name="cube-scan" size="small"/>
          {translationService.translate("LANDING_PAGE_BUTTON_PRODUCTVISUALISATION")}
        </div>
      </div>

      {!!sceneProducts.length &&
        <div className={styles.SceneInfoLower}>
          <div className={styles.SectionTitle}>HINZUGEFÜGTE PRODUKTE</div>
          {sceneProducts.map((instance: any) => {
            if (!instance.model) {
              return null;
            }

            const { id, model: { name, imageUrl }} = instance;

            let price = null;
            let productUrl = null;

            if (instance.model.data.description) {
              price = instance.model.data.description.price;
              productUrl = instance.model.data.description.product_url;
            }

            return (
              <div className={styles.ProductWrapper} key={`${id}`}>
                <div className={styles.ProductWrapperUpper}>

                  <div className={styles.ImageWrapper}>
                    <img src={imageUrl} />
                  </div>

                  <div className={styles.DetailWrapper}>
                    {name && <div className={styles.Name}>{name}</div>}
                    {price && <div className={styles.Price}>{price}.00€</div>}
                  </div>
                </div>
                <div className={styles.ProductWrapperLower}>
                  <button
                    className={styles.Remove}
                    onClick={() => removeInstance(id)}
                  >
                    {translationService.translate("SCENE_INFO_REMOVE")}
                  </button>

                  {productUrl &&
                    <button
                      className={styles.Shop}
                      disabled={!productUrl}
                      onClick={() => onShopClick(productUrl)}
                    >
                      {translationService.translate("SCENE_INFO_SHOP")}
                    </button>
                  }
                </div>
              </div>
            )}
          )}
        </div>
}
    </div>
  );
};

SceneInfo.propTypes = {
  className: PropTypes.any,
  currentPath: PropTypes.string,
  removeInstance: PropTypes.func,
  sceneProducts: PropTypes.array.isRequired,
  toggleView: PropTypes.func,
};

SceneInfo.defaultProps = {
  sceneProducts: [],
};

export default SceneInfo;
