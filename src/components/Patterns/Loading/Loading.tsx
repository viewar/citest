import React, { useState } from "react";
import styles from "./Loading.scss";
import PropTypes, { InferProps } from "prop-types";
import { LoadingContext } from "hooks/useLoading";
import Spinner from "components/Primitives/Spinner";
import global from "css/index.scss";
import cx from "classnames";

function Loading({ children }: InferProps<typeof Loading.propTypes>) {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <>
      {loading && <div className={cx(styles.Loading, global.OverlayBackgroundColor)}><Spinner size={4}/></div>}
      <LoadingContext.Provider
        value={{
          showLoading,
          hideLoading,
        }}
      >
        {children}
      </LoadingContext.Provider>
    </>
  );
}

Loading.propTypes = {
  children: PropTypes.node,
}

export default Loading;
