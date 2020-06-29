import React, { useEffect, useState } from "react";
import { InferProps } from "prop-types";
import useViewarApi from "hooks/useViewarApi";
import styles from "./Gallery.scss";
import CategoryView from "components/Patterns/CategoryView";
import PropTypes from "prop-types";
import { Category } from "../CategoryView/CategoryView";
import { Product } from "../ProductCard/ProductCard";
import Icon from "components/Primitives/Icon";
import Input from "../Input";

function Gallery({ loadModel, toggleView } : InferProps<typeof Gallery.propTypes>) {
  const viewarApi = useViewarApi();
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const rootCategory = viewarApi.modelManager.rootCategory;
  const [currentCategory, setCurrentCategory] = useState(null);

  const loadProduct = (product: Product) => {
    if (product.isCategory) {
      setCurrentCategory(product.id);
    } else {
      loadModel(product.id);
    }
  }

  const updateCategories = async() => {
    const newCategories = [];

    for (const category of rootCategory.children) {
      const newCategory: Category = {
        id: category.id,
        children: [],
        image:  category.data ? (category.data as any).image : "",
        name: category.name,
      };

      for (const child of category.children || []) {
        if (!searchText || child.name.toLowerCase().indexOf(searchText) !== -1) {
          if (!child.children) {
            await (child as any).downloadDescription();
          }

          let price = null;
          if ((child.data as any).description) {
            price = (child.data as any).description.price;
          }

          const product: Product = {
            id: (child as any).id,
            imageUrl: child.imageUrl || "",
            name: child.name,
            price,
            isCategory: !!child.children,
          };

          newCategory.children.push(product);
        }
      }

      // Don't show empty categories (also important for search functionality).
      if (newCategory.children.length) {
        newCategories.push(newCategory);
      }
    }

    setCategories(newCategories);
  }

  useEffect(() => {
    updateCategories();
  }, [searchText, currentCategory]);

  const onSearchType = async (value) => {
    setSearchText(value.trim().toLowerCase() || "");
  }

  useEffect(() => {
    updateCategories();
  }, []);

  const fullCategory = categories.find(c => c.id === currentCategory);
  return (
    <div className={styles.GalleryContainer}>
      <div className={styles.SearchInputWrapper}>
        <Icon
          name="close"
          onClick={(toggleView as any)}
          size="small"
          variant="gallery-close"
        />
        <Input
          submitButton="search"
          spacer
          onSubmit={toggleView}
          value={searchText}
          onChange={onSearchType}
          onReset={() => setSearchText("")}
          placeholder="Produktsuche"
        />
      </div>

      <div className={styles.CategoriesWrapper}>
        {fullCategory ? (
          <CategoryView
            category={fullCategory}
            key={fullCategory.name}
            fullView
            loadProduct={loadProduct}
            setCurrentCategory={
              () => setCurrentCategory(null)
            }
          />
        ) : (
          <>
            {categories.length && categories.sort((a,b) => a.id - b.id).map((c: Category) => {
              return (
                <CategoryView
                  category={c}
                  key={c.name}
                  loadProduct={loadProduct}
                  setCurrentCategory={
                    // @ts-ignore
                    () => setCurrentCategory(c.id)
                  }
                />
              )
            })}
          </>
        )}
      </div>
    </div>
  );
};

Gallery.propTypes = {
  loadModel: PropTypes.func,
  toggleView: PropTypes.func,
};

export default Gallery;
