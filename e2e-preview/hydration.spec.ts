import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { expectedH1 } from "../e2e/expected-headings";

const ROUTES = [
  "/",
  "/plan",
  ...Array.from({ length: 16 }, (_, index) => `/week/${index + 1}`),
  "/library",
  "/toolkit",
  "/capstone",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/thank-you",
];

const SEEDED_PROGRESS = JSON.stringify({
  version: 1,
  done: { "w1-watch": true, "w7-assignment:check:0": true },
  notes: {},
  capstone: { premise: "done" },
  startDate: "2026-10-15",
});

const HYDRATION_NOISE = /\[hydration\]|Hydration|did not match|recoverable/i;

/** The @vercel/analytics chunk; it must not load before an explicit accept. */
const ANALYTICS_CHUNK = (
  JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8")) as Record<string, { file: string }>
)["node_modules/@vercel/analytics/dist/react/index.mjs"]!.file;

const isAnalytics = (url: string) => url.includes(ANALYTICS_CHUNK) || url.includes("/_vercel/insights/");

async function h1Name(page: Page): Promise<string> {
  const h1 = page.locator("main h1").first();
  await expect(h1).toBeVisible();
  return (await h1.getAttribute("aria-label")) ?? (await h1.innerText()).trim();
}

for (const theme of ["dark", "light"] as const) {
  for (const storage of ["clean", "seeded"] as const) {
    test.describe(`${theme} theme, ${storage} storage`, () => {
      for (const path of ROUTES) {
        test(path, async ({ page }) => {
          const messages: string[] = [];
          page.on("console", (message) => messages.push(`${message.type()}: ${message.text()}`));
          page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
          await page.addInitScript(
            ([themeValue, progress]) => {
              localStorage.setItem("fbf:theme", themeValue);
              if (progress) {
                localStorage.setItem("fbf:progress:v1", progress);
                localStorage.setItem("fbf:consent", "rejected");
              }
            },
            [theme, storage === "seeded" ? SEEDED_PROGRESS : null] as const,
          );

          const response = await page.goto(path, { waitUntil: "networkidle" });
          expect(response?.status()).toBe(200);
          const returningLanding = storage === "seeded" && path === "/";

          // The returning learner's / is a client render of the dashboard; every other page is hydrated in place
          // (main.tsx removes data-prerendered only when it client-renders).
          const marker = await page.locator("#root").getAttribute("data-prerendered");
          expect(marker).toBe(returningLanding ? null : path);
          expect(await h1Name(page)).toBe(returningLanding ? "Today's programme" : expectedH1(path));

          // The stored theme survives hydration (the pre-paint class is never flipped by a neutral snapshot).
          await expect(page.locator("html")).toHaveClass(theme === "light" ? /\blight\b/ : /^(?!.*\blight\b).*$/);

          if (storage === "seeded") {
            if (path === "/week/1") {
              await expect(page.getByRole("checkbox", { name: "Lessons from the Screenplay (2–3 videos)" })).toBeChecked();
            }
            if (path === "/week/7") {
              await expect(
                page.getByRole("checkbox", { name: "Every planned shot has a locked frame rate/shutter/exposure noted" }),
              ).toBeChecked();
              await expect(page.getByRole("checkbox", { name: "day 1 footage backed up in two places same night" })).not.toBeChecked();
            }
          }
          if (path === "/library") {
            // The HTML carries the first page of cards; once hydrated the grid holds every result.
            const total = Number(await page.locator(".library-count strong").innerText());
            expect(total).toBeGreaterThan(9);
            await expect(page.locator(".resource-card")).toHaveCount(total);
          }
          // Clean storage has no consent choice, so the prerendered banner stays; seeded storage stores "rejected".
          const banner = page.getByRole("complementary", { name: "Cookie consent" });
          if (storage === "clean") await expect(banner).toBeVisible();
          else await expect(page.locator(".cookie-banner")).toHaveCount(0);
          await expect(page.getByText("Progress is read-only")).toHaveCount(0);

          // Production React keeps server attributes on a mismatch without reporting it, so a useId divergence
          // between the prerender and the client would only show as dangling id references after an update.
          const dangling = await page.evaluate(() =>
            [...document.querySelectorAll("[aria-labelledby],[aria-describedby],label[for]")]
              .flatMap((el) => [el.getAttribute("aria-labelledby"), el.getAttribute("aria-describedby"), el.getAttribute("for")])
              .filter((value): value is string => Boolean(value))
              .flatMap((value) => value.split(/\s+/))
              .filter((id) => !document.getElementById(id)),
          );
          expect(dangling).toEqual([]);

          expect(messages.filter((text) => HYDRATION_NOISE.test(text))).toEqual([]);
          expect(messages.filter((text) => text.startsWith("pageerror") || text.startsWith("error"))).toEqual([]);
        });
      }
    });
  }
}

// Consent without progress, so the banner is the only stored state in play. A visibility probe installed before
// any page script samples every DOM change and frame: a stored choice must never show the banner, not even once.
for (const consent of ["accepted", "rejected"] as const) {
  test.describe(`stored consent "${consent}"`, () => {
    for (const path of ["/", "/plan", "/week/7", "/library"]) {
      test(path, async ({ page }) => {
        const messages: string[] = [];
        page.on("console", (message) => messages.push(`${message.type()}: ${message.text()}`));
        page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
        const analytics: string[] = [];
        page.on("request", (request) => {
          if (isAnalytics(request.url())) analytics.push(request.url());
        });
        await page.route("**/_vercel/insights/**", (route) => route.fulfill({ status: 200, body: "" }));
        await page.addInitScript((value) => {
          localStorage.setItem("fbf:consent", value);
          const seen = { visible: false };
          (window as unknown as { __banner: typeof seen }).__banner = seen;
          const probe = () => {
            const el = document.querySelector(".cookie-banner");
            if (el && el.checkVisibility()) seen.visible = true;
          };
          new MutationObserver(probe).observe(document, { childList: true, subtree: true });
          const frame = () => {
            probe();
            if (performance.now() < 8000) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }, consent);

        await page.goto(path, { waitUntil: "networkidle" });
        expect(await page.locator("#root").getAttribute("data-prerendered")).toBe(path);
        expect(await h1Name(page)).toBe(expectedH1(path));
        await expect(page.locator("html")).toHaveClass(/\bhas-consent\b/);
        await expect(page.locator(".cookie-banner")).toHaveCount(0);
        expect(await page.evaluate(() => (window as unknown as { __banner: { visible: boolean } }).__banner.visible)).toBe(false);
        if (consent === "rejected") expect(analytics).toEqual([]);
        else await expect.poll(() => analytics.some((url) => url.includes("/_vercel/insights/"))).toBe(true);

        expect(messages.filter((text) => HYDRATION_NOISE.test(text))).toEqual([]);
        expect(messages.filter((text) => text.startsWith("pageerror") || text.startsWith("error"))).toEqual([]);
      });
    }
  });
}

test("analytics load only after the prerendered banner's Accept", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (message) => messages.push(`${message.type()}: ${message.text()}`));
  const analytics: string[] = [];
  page.on("request", (request) => {
    if (isAnalytics(request.url())) analytics.push(request.url());
  });
  await page.route("**/_vercel/insights/**", (route) => route.fulfill({ status: 200, body: "" }));

  await page.goto("/plan", { waitUntil: "networkidle" });
  expect(await page.locator("#root").getAttribute("data-prerendered")).toBe("/plan");
  await expect(page.locator("html")).not.toHaveClass(/\bhas-consent\b/);
  const banner = page.getByRole("complementary", { name: "Cookie consent" });
  await expect(banner).toBeVisible();
  await page.waitForTimeout(1000);
  expect(analytics).toEqual([]);

  await banner.getByRole("button", { name: "Accept" }).click();
  await expect(banner).toHaveCount(0);
  await expect.poll(() => analytics.some((url) => url.includes(ANALYTICS_CHUNK))).toBe(true);
  await expect.poll(() => analytics.some((url) => url.includes("/_vercel/insights/"))).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem("fbf:consent"))).toBe("accepted");
  expect(messages.filter((text) => HYDRATION_NOISE.test(text))).toEqual([]);
});

test("an unknown path gets 404.html with status 404 and a client render", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (message) => messages.push(message.text()));
  const response = await page.goto("/definitely-missing", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(404);
  expect(await page.locator("#root").getAttribute("data-prerendered")).toBeNull();
  expect(await h1Name(page)).toBe("Page not found");
  expect(await page.title()).not.toBe("");
  expect(await page.locator("head title").count()).toBe(1);
  expect(messages.filter((text) => HYDRATION_NOISE.test(text))).toEqual([]);
});

test("a query-string library link is client-rendered with its filter applied", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (message) => messages.push(message.text()));
  await page.goto("/library?language=ta", { waitUntil: "networkidle" });
  expect(await page.locator("#root").getAttribute("data-prerendered")).toBeNull();
  await expect(page.getByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeVisible();
  expect(messages.filter((text) => HYDRATION_NOISE.test(text))).toEqual([]);
});

test.describe("first paint without JavaScript", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/*.js", (route) => route.abort());
  });

  test("the prerendered HTML paints the page's h1 on / and /week/7", async ({ page }) => {
    for (const path of ["/", "/week/7"]) {
      await page.goto(path);
      await expect(page.locator("main h1").first()).toBeVisible();
      expect(await h1Name(page)).toBe(expectedH1(path));
    }
  });

  test("the prerendered cookie banner shows without a stored choice and is hidden with one", async ({ page }) => {
    await page.goto("/plan");
    await expect(page.getByRole("complementary", { name: "Cookie consent" })).toBeVisible();

    await page.addInitScript(() => localStorage.setItem("fbf:consent", "rejected"));
    await page.goto("/library");
    await expect(page.locator("html")).toHaveClass(/\bhas-consent\b/);
    await expect(page.locator(".cookie-banner")).toHaveCount(1);
    await expect(page.locator(".cookie-banner")).toBeHidden();
  });

  test("a returning learner never sees the prerendered landing", async ({ page }) => {
    await page.addInitScript((progress) => localStorage.setItem("fbf:progress:v1", progress), SEEDED_PROGRESS);
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bhas-progress\b/);
    await expect(page.locator("main h1")).toBeHidden();
    await expect(page.getByText("A sixteen-week path to a short film")).toBeHidden();
  });
});
