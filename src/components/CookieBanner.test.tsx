import { act, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { CookieBanner, useConsent } from "./CookieBanner";

function Banner() {
  const [consent, choose] = useConsent();
  return <CookieBanner consent={consent} onChoose={choose} />;
}

function Reader() {
  const [consent] = useConsent();
  return <p data-testid="reader">{consent}</p>;
}

const page = (
  <MemoryRouter>
    <Banner />
    <Reader />
  </MemoryRouter>
);

afterEach(() => localStorage.clear());

describe("consent", () => {
  it("prerenders the banner from the unknown snapshot and drops it once hydrated with a stored choice", async () => {
    localStorage.setItem("fbf:consent", "rejected");
    const container = document.createElement("div");
    container.innerHTML = renderToString(page);
    expect(container.querySelector(".cookie-banner")).not.toBeNull();

    document.body.append(container);
    const errors: unknown[] = [];
    const root = await act(async () => hydrateRoot(container, page, { onRecoverableError: (error) => errors.push(error) }));
    expect(container.querySelector(".cookie-banner")).toBeNull();
    expect(container.querySelector("[data-testid=reader]")?.textContent).toBe("rejected");
    expect(errors).toEqual([]);
    act(() => root.unmount());
    container.remove();
  });

  it("shares an accept with every reader and stores it", () => {
    render(page);
    expect(screen.getByTestId("reader").textContent).toBe("unknown");
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("complementary", { name: "Cookie consent" })).toBeNull();
    expect(screen.getByTestId("reader").textContent).toBe("accepted");
    expect(localStorage.getItem("fbf:consent")).toBe("accepted");
  });
});
