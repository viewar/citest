import React from "react";
import styles from "./ProductCard.scss";
import PropTypes, { InferProps } from "prop-types";

export type Product = {
  id: string,
  imageUrl: string,
  name: string,
  price?: string,
  isCategory: boolean,
};

function ProductCard({ onClick, product }: InferProps<typeof ProductCard.propTypes>) {
  return (
    <div
      className={styles.Wrapper}
      onClick={() => onClick(product)}
    >
      <div
        className={styles.ProductImage}
        style={{ backgroundImage: `url("${product.imageUrl}")`}}
      />
      {product.name &&
        <div className={styles.Name}>{product.name}</div>
      }
      {product.price &&
        <div className={styles.Price}>{product.price},00 €</div>
      }
    </div>
  );
}

ProductCard.propTypes = {
  onClick: PropTypes.func,
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.number,
    name: PropTypes.string.isRequired,
  }),
}

export default ProductCard;
