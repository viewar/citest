import qs from "query-string";
import { useState, useCallback } from "react";
import PropTypes from "prop-types";

const queryRefs = {};

window.addEventListener("hashchange", () => {
  const queryString = window.location.hash.split("?")[1];
  const values = qs.parse(queryString);

  for (const key of Object.keys(values)) {
    if (queryRefs[key]) {
      let value: string | boolean = values[key] as string;

      // Parse boolean value.
      if (value === "true") {
        value = true;
      }
      else if (value === "false") {
        value = false;
      }

      queryRefs[key](value);
    }
  }
});

export const getRoute = (route, params = {}) => {
  if (!Object.keys(params).length) {
    return route;
  }

  return `${route}?${Object.entries(params).map((entry) => entry.join("=")).join("&")}`;
};

getRoute.propTypes = {
  route:  PropTypes.string.isRequired,
  params: PropTypes.object,
};

const getQueryStringValue = (
  key,
) => {
  const queryString = window.location.hash.split("?")[1];
  const values = qs.parse(queryString);
  return values[key];
};

const setQueryStringWithoutPageReload = (qsValue) => {
  const hash = window.location.hash.split("?")[0];
  window.history.pushState(null, null, hash + qsValue);
};

const setQueryStringValue = (
  key,
  value,
) => {
  const queryString = window.location.hash.split("?")[1];
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({
    ...values,
    [key]: value,
  });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

function useQueryState(key, initialValue) {
  const [ value, setValue ] = useState(getQueryStringValue(key) || initialValue);

  const onSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [ key ],
  );

  queryRefs[key] = setValue;
  return [ value, onSetValue ];
}

useQueryState.propTypes = {
  key:          PropTypes.string.isRequired,
  initialValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool ]),
};

export default useQueryState;
