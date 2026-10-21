import { describe, expect, it } from "vitest";
import { resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("returns the explicit preference when not system", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("follows the OS when preference is system", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
