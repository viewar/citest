import useTranslation from "./useTranslation";
import { useContext } from "react";

jest.mock("react", () => ({
  createContext: jest.fn(),
  useContext: jest.fn(),
}));

describe("useTranslation", () => {
  const fakeTranslationService = {};
  useContext.mockResolvedValue(fakeTranslationService);

  it("returns translation service from context", () => {
    return expect(useTranslation()).resolves.toBe(fakeTranslationService);
  });
});
