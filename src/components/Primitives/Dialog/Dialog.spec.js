import React from "react";
import Dialog from "./Dialog";
import { render } from "@testing-library/react";

describe("Dialog", () => {
  it("renders", () => {
    const { container } = render(<Dialog />);
    return expect(container).not.toBeNull();
  });
});
