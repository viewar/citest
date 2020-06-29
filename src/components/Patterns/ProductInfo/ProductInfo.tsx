import React, { useEffect, useState } from "react";
import { InferProps, InferType } from "prop-types";
import useViewarApi from "hooks/useViewarApi";
import styles from "./ProductInfo.scss";
import CategoryView from "components/Patterns/CategoryView";
import PropTypes from "prop-types";
import useLoading from "hooks/useLoading";
import Icon from "components/Primitives/Icon";

function ProductInfo({ instance, toggleView } : InferProps<typeof ProductInfo.propTypes>) {
  if (!instance || !instance.model) {
    return null;
  }

  let price = null;
  let info = null;

  const { model: { name } } = instance;

  if (instance.model.data.description) {
    price = instance.model.data.description.price;
    info = instance.model.data.description.info;
  }

  return (
    <div className={styles.ProductInfoContainer}>
      <Icon
        className={styles.ToggleView}
        onClick={(toggleView as any)}
        name="close"
        size="small"
      />

      <div className={styles.ProductInfoUpper}>
        <div className={styles.Title}>INFORMATIONEN</div>
        {name && <div className={styles.Name}>{name}</div>}
        {price && <div className={styles.Price}>{price},00€ <span className={styles.PerSt}>/st</span></div>}
      </div>

      {info &&
        <div className={styles.ProductInfoLower}>
          <span dangerouslySetInnerHTML={{ __html: info }} />
        </div>
      }
    </div>
  );
};

ProductInfo.propTypes = {
  instance: PropTypes.shape({
    model: PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.shape({
        description: PropTypes.shape({
          info: PropTypes.string,
          name: PropTypes.string,
          price: PropTypes.number,
        }),
      })
    })
  }),
  toggleView: PropTypes.func,
};

export default ProductInfo;
