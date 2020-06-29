import React from "react";
import Spinner from "./Spinner";
import { render } from "@testing-library/react";

describe("Spinner", () => {
  it("renders", () => {
    const { container } = render(<Spinner />);
    return expect(container).not.toBeNull();
  });
});
