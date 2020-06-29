import React from "react";
import PropTypes, { InferProps } from "prop-types";
import styles from "./Input.scss";
import Icon from "components/Primitives/Icon";
import cx from "classnames";

function Input({
  className,
  inputRef,
  onChange,
  onReset,
  onSubmit,
  placeholder,
  spacer,
  submitButton,
  value,
}: InferProps<typeof Input.propTypes>) {
  const handleSubmit = (e) => {
    onSubmit(e);
    e.preventDefault();   // Stop page refresh.
  }

  return (
    <form className={cx(styles.InnerFormWrapper, className)} onSubmit={handleSubmit} onReset={onReset}>
      <button type="reset">
        <Icon
          className={styles.SearchInputBackButton}
          style={{ opacity: value.length > 0 ? "1" : "0" }}
          size="small"
          name="back_arrow"
          variant="dark"
        />
      </button>

      <input
        ref={inputRef}
        autoComplete="off"
        className={styles.SearchInput}
        id="bundleID"
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />

      {spacer && <div className={styles.SearchVerticalSpacer}></div>}
      <button type="submit">
        {typeof submitButton === "string" ? (
          <Icon
            className={styles.SearchInputSubmitButton}
            size="small"
            name={submitButton}
            variant={"dark"}
          />
        ) : (
          <Icon
            className={cx(styles.SearchInputSubmitButton, submitButton.className)}
            size="small"
            name={submitButton.icon}
            variant={submitButton.variant || "dark"}
          />
        )}

      </button>
    </form>
  );
}

Input.propTypes = {
  spacer: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  submitButton: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    icon: PropTypes.string,
    variant: PropTypes.string,
    className: PropTypes.any,
  })]),
  className: PropTypes.any,
  inputRef: PropTypes.any,
  placeholder: PropTypes.string,
};

export default Input;
