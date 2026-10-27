import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

describe("App", () => {
  it("renders the product foundation", () => {
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <App />
      </QueryClientProvider>,
    );

    expect(screen.getByRole("heading", { name: "Wind Procurement Insight" })).toBeInTheDocument();
    expect(screen.getByText("UK day-ahead wind forecast performance")).toBeInTheDocument();
  });
});
