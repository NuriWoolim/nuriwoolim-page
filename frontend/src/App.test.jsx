import { render, screen } from "@testing-library/react";
import App from "./App";

import { expect } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Log In/i);
  expect(linkElement).toBeInTheDocument();
});
