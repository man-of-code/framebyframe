import { describe, expect, it } from "vitest";
import { splitAtSlashes, toRoman } from "./title";

describe("toRoman", () => {
  it("covers the seven modules", () => {
    expect([1, 2, 3, 4, 5, 6, 7].map(toRoman)).toEqual(["I", "II", "III", "IV", "V", "VI", "VII"]);
  });
});

describe("splitAtSlashes", () => {
  it("keeps the slash on the left piece and loses no text", () => {
    const parts = splitAtSlashes("movement/angles/framing, lenses");
    expect(parts).toEqual(["movement/", "angles/", "framing, lenses"]);
    expect(parts.join("")).toBe("movement/angles/framing, lenses");
  });

  it("returns one piece when there is no slash", () => {
    expect(splitAtSlashes("Open on an image")).toEqual(["Open on an image"]);
  });
});
