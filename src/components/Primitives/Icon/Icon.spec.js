import React from "react";
import Icon from "./Icon";
import { render } from "@testing-library/react";

describe("Icon", () => {
  it("renders", () => {
    const { container } = render(<Icon name="add" />);
    return expect(container).not.toBeNull();
  });
});
