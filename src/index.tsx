import React from "react";
import ReactDOM from "react-dom";
import viewarApi from "viewar-api";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import "css/index.scss";
import { ViewarApiContext } from "hooks/useViewarApi";
import { ServicesContext, roomCapturing, roomPlanner } from "hooks/useServices";

async function init() {

  window.api = await viewarApi.init({
    roomManager: true
  } as any);

  (window as any).roomCapturing = roomCapturing;
  (window as any).roomPlanner = roomPlanner;

  const rootElement = document.getElementById("app");

  const render = (Component) => {
    ReactDOM.render(
      <Router>
        <ViewarApiContext.Provider value={viewarApi}>
          <ServicesContext.Provider value={{
            roomCapturing,
            roomPlanner,
          }}>
            <Component />
          </ServicesContext.Provider>
        </ViewarApiContext.Provider>
      </Router>,
      rootElement,
    );
  };

  render(() => <App/>);

  if (module.hot) {
    module.hot.accept(() => {
      render(() => <App/>);
    });
  }
}

init();
