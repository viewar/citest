import React from "react";
import Button from "./Button";
import { render } from "@testing-library/react";

describe("Button", () => {
  it("renders", () => {
    const { container } = render(<Button />);
    return expect(container).not.toBeNull();
  });
});
