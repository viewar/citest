import React from "react";
import styles from "./CategoryView.scss";
import { InferProps } from "prop-types";
import ProductCard from "components/Patterns/ProductCard";
import PropTypes from "prop-types";
import { Product } from "../ProductCard/ProductCard";
import Icon from "components/Primitives/Icon";
import cx from "classnames";
import useTranslation from "hooks/useTranslation";

export type Category = {
  children: Product[],
  image: string,
  name: string,
  id: string,
};

function CategoryView({
  category,
  loadProduct,
  setCurrentCategory,
  fullView,
}: InferProps<typeof CategoryView.propTypes>) {
  const translationService = useTranslation();

  return (
    <div
      className={cx(styles.Wrapper, fullView && styles.FullView)}
    >
      <div className={styles.TitleWrapper}>
        <Icon className={styles.CategoryIcon} name={category.image} size="small" disabled/>
        <div className={styles.Name}>{category.name}</div>
      </div>

      <div className={styles.CategoryList}>
        {category.children.map(p => (
          <ProductCard
            onClick={loadProduct}
            product={p}
            key={p.id + p.name}
          />
          ))}
      </div>

      <div className={styles.SeeAll} onClick={setCurrentCategory}>
        {fullView ?
          translationService.translate("CATEGORY_VIEW_VIEW_LESS") :
          translationService.translate("CATEGORY_VIEW_VIEW_ALL")
        }
      </div>
    </div>
  );
}

CategoryView.propTypes = {
  category: PropTypes.shape({
    children: PropTypes.any,
    image: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  fullView: PropTypes.bool,
  loadProduct: PropTypes.func,
  setCurrentCategory: PropTypes.func,
}

export default CategoryView;
