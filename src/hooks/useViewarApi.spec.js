import useViewarApi from "./useViewarApi";
import { useContext } from "react";

jest.mock("react", () => ({
  createContext: jest.fn(),
  useContext: jest.fn(),
}));

describe("useViewarApi", () => {
  const fakeApi = {};
  useContext.mockResolvedValue(fakeApi);

  it("returns viewarApi from context", () => {
    return expect(useViewarApi()).resolves.toBe(fakeApi);
  });
});
