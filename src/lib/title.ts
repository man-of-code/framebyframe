const ROMAN: readonly (readonly [number, string])[] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Module numerals are Roman in eyebrows only (design-system.md 3.3). Defined for 1-39. */
export function toRoman(n: number): string {
  let rest = Math.trunc(n);
  let out = "";
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

/**
 * Splits after every "/" so a renderer can put a <wbr> there (design-system.md 3.2). Text is unchanged.
 * A slash with a digit on both sides ("3/5/7-act") is not a break opportunity.
 */
export function splitAtSlashes(text: string): string[] {
  return text.split(/(?<=\/)(?:(?<!\d\/)|(?!\d))/);
}
