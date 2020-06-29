import React from "react";
import Logo from "./Logo";
import { render } from "@testing-library/react";

describe("Logo", () => {
  it("renders", () => {
    const { container } = render(<Logo />);
    return expect(container).not.toBeNull();
  });
});
