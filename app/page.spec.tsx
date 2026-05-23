import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });
});
