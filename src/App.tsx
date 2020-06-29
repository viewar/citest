import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import useViewarApi from "hooks/useViewarApi";
import LandingPage from "pages/LandingPage";
import TrackingInit from "pages/TrackingInit/TrackingInit";
import Loading from "components/Patterns/Loading";
import { ModalProvider } from "react-modal-hook";
import { TranslationProvider } from "hooks/useTranslation/useTranslation";


import * as localModules from "./modules";
import ErrorPage from "pages/ErrorPage";
const AVAILABLE_MODULES = Object.keys(localModules);
const DEFAULT_MODULES = ["ProductVisualisation"];

const App = () => {
  const viewarApi = useViewarApi();
  const [defaultModules, setDefaultModules] = useState(DEFAULT_MODULES);

  useEffect(() => {
    // Check UIConfig and compare modules list with available local modules...
    // then create an array of dynamically available modules based on both factors

    // @ts-ignore
    const configModules = viewarApi.appConfig.uiConfig.modules;

    if (configModules && configModules.length) {
      const tempModules = [];
      configModules.forEach(configModule => {
        if (!!AVAILABLE_MODULES && (AVAILABLE_MODULES as any).includes(configModule)) {
          tempModules.push(configModule);
        }
      })

      if (tempModules.length) {
        setDefaultModules(tempModules);
      }
    }
  }, []);

  return (
    <TranslationProvider>
      <Loading>
        <ModalProvider>
          <Switch>
            <Route
              exact
              path="/"
              // @ts-ignore
              render={() => <LandingPage defaultModules={defaultModules} />}
            />

            {/* Basic module routes */}
            {(Object.entries(localModules)).map(([k, v]) => <Route key={k} path={`/${k}`} exact render={(v as any)} />)}

            {/* Module subroutes */}
            {Object.entries(localModules).map(([k, v]) => (v as any).routes && Object.entries((v as any).routes).map(([path, render]) => <Route key={k} path={`/${k}/${path}`} exact render={(render as any)} />))}

            {/* Undefined routes - 404 Error. */}
            <Route path="/:id" render={({ match }) => <ErrorPage {...{errorMessage: `Route "/${match.params.id}" not found.`, errorNumber: "404"}} />}/>

            <Redirect to="/" />
          </Switch>
        </ModalProvider>
      </Loading>
    </TranslationProvider>
  );
}

export default hot(module)(withRouter(App));
