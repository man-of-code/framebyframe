import { expect, test } from "@playwright/test";

test("a start date, a ticked task, and a library filter survive reload", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Start date").fill("2026-10-25");
  await page.getByRole("button", { name: "Set start date" }).click();
  await expect(page).toHaveURL(/\/week\/1$/);

  const task = page.getByRole("checkbox", { name: "2–3 videos from Lessons from the Screenplay" });
  await task.click();
  await expect(task).toBeChecked();
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "2–3 videos from Lessons from the Screenplay" })).toBeChecked();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Library" }).click();
  await expect(page).toHaveURL(/\/library$/);
  const count = page.getByRole("status");
  const before = (await count.textContent()) ?? "";
  await page.getByLabel("Search the library").fill("trelby");
  await expect(count).not.toHaveText(before);
  const searched = (await count.textContent()) ?? "";
  await page.getByRole("group", { name: "Type" }).getByRole("button", { name: "YouTube" }).click();
  await expect(count).not.toHaveText(searched);

  const registrations = await page.evaluate(
    async () => (await navigator.serviceWorker?.getRegistrations() ?? []).length,
  );
  expect(registrations).toBe(0);
});
