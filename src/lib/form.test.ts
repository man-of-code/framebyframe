import { describe, expect, it } from "vitest";
import { contactErrors, contactMailto, startDateError } from "@/lib/form";

describe("startDateError", () => {
  it("rejects an empty value and an impossible day", () => {
    expect(startDateError("")).toBe("Choose a start date.");
    expect(startDateError("2026-02-31")).toBe("That date is not valid.");
  });

  it("accepts a real calendar day", () => {
    expect(startDateError("2026-10-25")).toBeNull();
  });
});

describe("contactErrors", () => {
  it("names each empty or invalid field", () => {
    expect(contactErrors({ name: " ", email: "not-an-email", message: "" })).toEqual({
      name: "Enter your name.",
      email: "Enter a valid email address.",
      message: "Enter a message.",
    });
  });

  it("returns no errors for a complete note", () => {
    expect(contactErrors({ name: "Asha", email: "asha@example.com", message: "Hello" })).toEqual({});
  });
});

describe("contactMailto", () => {
  it("addresses the site mailbox and encodes the note", () => {
    const href = contactMailto(
      { name: "Asha", email: "asha@example.com", message: "Line one" },
      "mratyunjay.soni@gmail.com",
    );
    expect(href.startsWith("mailto:mratyunjay.soni@gmail.com?")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Line one");
    expect(decodeURIComponent(href)).toContain("Asha");
  });
});
