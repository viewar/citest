import React from "react";
import ReactDOM from "react-dom";
import viewarApi from "viewar-api";

async function init() {

  window.api = await viewarApi.init({
    roomManager: true
  } as any);

  const rootElement = document.getElementById("app");

  const render = () => {
    ReactDOM.render(
      <>
        Hello World! 3
      </>,
      rootElement,
    );
  };

  render();
}

init();
