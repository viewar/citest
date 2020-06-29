import React from "react";
import { createContext, useContext } from "react";
import TranslationService from "./TranslationService";

const TranslationContext = createContext<TranslationService>(undefined);

function useTranslation() {
  return useContext(TranslationContext);
};

export function TranslationProvider({ children }) {
  const translations = new TranslationService();

  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
}

export default useTranslation;
