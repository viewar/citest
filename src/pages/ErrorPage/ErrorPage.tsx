import React from "react";
import { withRouter } from "react-router-dom";
import { InferProps } from "prop-types";
import PagePropTypes from "../../PagePropTypes";
import styles from "./ErrorPage.scss";
import Button from "components/Primitives/Button";
import PropTypes from "prop-types";

function ErrorPage({ history, errorNumber, errorMessage } : InferProps<typeof ErrorPage.propTypes>) {
  const goTo = (path) => history.push(path);

  return (
    <div className={styles.Background}>
      <div className={styles.Container}>
        <div className={styles.Number}>
          {errorNumber}
        </div>
        <div className={styles.Message}>
          {errorMessage}
        </div>
        <Button onClick={() => goTo("/")} className={styles.Button}>Back</Button>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  ...PagePropTypes,
  errorNumber: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default withRouter(ErrorPage);
