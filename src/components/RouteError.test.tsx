import { render, screen } from "@testing-library/react";
import { lazy, Suspense } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RouteError } from "./RouteError";

const Stale = lazy(() => Promise.reject(new TypeError("Failed to fetch dynamically imported module: /assets/Plan-old.js")));

describe("RouteError", () => {
  afterEach(() => vi.restoreAllMocks());

  it("catches a failed lazy route import and offers a reload", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createMemoryRouter(
      [{ path: "/", children: [{ errorElement: <RouteError />, children: [{ index: true, element: <Suspense fallback={null}><Stale /></Suspense> }] }] }],
      { initialEntries: ["/"] },
    );
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("heading", { level: 1, name: "This page did not load" })).toBeTruthy();
    const reload = screen.getByRole("button", { name: "Reload" });
    expect(reload.closest(".intermission")).toBeTruthy();
  });
});
