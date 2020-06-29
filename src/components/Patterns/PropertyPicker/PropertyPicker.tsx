import React, { useState } from "react";
import styles from "./PropertyPicker.scss";
import PropTypes, { InferProps } from "prop-types";
import cx from "classnames";
import useLoading from "hooks/useLoading";

function PropertyPicker({
  customisableProperties,
  instance,
  isVisible,
}: InferProps<typeof PropertyPicker.propTypes>) {

  const { showLoading, hideLoading } = useLoading();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (customisableProperties.length === 0) {
    return null;
  }

  const setValues = async (value) => {
    showLoading();

    await instance.setPropertyValues({ [(customisableProperties[0] as any).name]: value.key });

    hideLoading();
  };

  const currentProperties = (customisableProperties[currentIndex] as any);

  return (
    <div
      className={cx(
        styles.Wrapper,
        styles.Thumbnail,
        !isVisible && styles.Hidden,
      )}
      >
        <div className={styles.Spacer} />

        {currentProperties.options.map((option) => (
          <div
            className={cx(
              styles.Value,
              (currentProperties.value.key === option.key) && styles.isSelected,
            )}
            key={option.key}
            onClick={() => setValues(option)}
          >
            <div
              className={cx(
                styles.Image,
                (currentProperties.value.key === option.key) && styles.isSelected,
                )}
              style={{ backgroundImage: `url(${option.imageUrl})` }}
            />
            <div
              className={cx(
                styles.Name,
                (currentProperties.value.key === option.key) && styles.isSelected,
              )}
            >
              {option.name}
            </div>
          </div>
        ))}

        <div className={styles.Spacer} />
    </div>
  );
}

PropertyPicker.propTypes = {
  customisableProperties: PropTypes.arrayOf(
    PropTypes.shape({
      options: PropTypes.array,
      value: PropTypes.object,
    })
  ),
  instance: PropTypes.shape({
    setPropertyValues: PropTypes.func,
  }),
  isVisible: PropTypes.bool,
}

export default PropertyPicker;
