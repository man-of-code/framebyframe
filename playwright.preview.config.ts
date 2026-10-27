import { defineConfig } from "@playwright/test";

// Runs against the production build (`npm run build` first) served like Vercel (vite.config.ts vercelLikePreview).
// The dev-server smoke test stays in playwright.config.ts.
export default defineConfig({
  testDir: "e2e-preview",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4401",
    browserName: "chromium",
    // Service workers are outside this spec; blocking them keeps every run a cold network load.
    serviceWorkers: "block",
  },
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4401 --strictPort",
    url: "http://127.0.0.1:4401/",
    reuseExistingServer: false,
  },
  projects: [
    { name: "phone-360", use: { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
  ],
});
