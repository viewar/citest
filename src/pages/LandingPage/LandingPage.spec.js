import React from "react";
import LandingPage from "./LandingPage";
import { render, wait } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { ModalProvider } from "react-modal-hook";
import { ViewarApiContext } from "hooks/useViewarApi";
import useTranslation from "hooks/useTranslation";
import { TranslationProvider } from "hooks/useTranslation/useTranslation";

const mockViewarApi = {
  tracker: {
    deactivate: jest.fn(),
  },
  sceneManager: {
    clearScene: jest.fn(),
  },
  appUtils: {
    pauseRenderLoop: jest.fn(),
  },
  appConfig: {
    deviceType: "phone",
    uiConfig: {},
  },
  coreInterface: {
    platform: "ios",
  },
};

const mockTranslationService = {
  setLanguage: jest.fn(),
  getLanguage: jest.fn(),
  getLanguages: jest.fn(),
  translate: jest.fn(),
};

const mockModules = ["ProductVisualisation"];

jest.mock("hooks/useTranslation");
useTranslation.mockReturnValue(mockTranslationService);
const history = createMemoryHistory();

describe("LandingPage", () => {
  it("renders", () => {
    const { container } = render(
      <Router history={history}>
        <ViewarApiContext.Provider value={mockViewarApi}>
          <TranslationProvider value={mockTranslationService}>
            <ModalProvider>
              <LandingPage defaultModules={mockModules} />
            </ModalProvider>
          </TranslationProvider>
        </ViewarApiContext.Provider>
      </Router>
    );

    return expect(container).not.toBeNull();
  });

  it("calls clearScene", async () => {
    mockViewarApi.sceneManager.clearScene.mockClear();

    render(
      <Router history={history}>
        <ViewarApiContext.Provider value={mockViewarApi}>
          <ModalProvider>
            <LandingPage defaultModules={mockModules} />
          </ModalProvider>
        </ViewarApiContext.Provider>
      </Router>
    );

    return wait(() =>
      expect(mockViewarApi.sceneManager.clearScene).toHaveBeenCalled()
    );
  });
});
