import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import Home from "./page";

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

describe("Home page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Home />);
  });
});
