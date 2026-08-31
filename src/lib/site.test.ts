import { describe, it, expect } from "vitest";
import { absoluteUrl, SITE_URL } from "./site";

describe("absoluteUrl", () => {
  it("prefixes a relative path with SITE_URL", () => {
    expect(absoluteUrl("/viajes/costa-rica")).toBe(`${SITE_URL}/viajes/costa-rica`);
  });

  it("adds a leading slash when the path is missing one", () => {
    expect(absoluteUrl("viajes/costa-rica")).toBe(`${SITE_URL}/viajes/costa-rica`);
  });

  it("returns already-absolute http(s) URLs unchanged", () => {
    expect(absoluteUrl("https://example.com/foo")).toBe("https://example.com/foo");
    expect(absoluteUrl("http://example.com/foo")).toBe("http://example.com/foo");
  });

  it("defaults to the site root when called with no argument", () => {
    expect(absoluteUrl()).toBe(`${SITE_URL}/`);
  });
});

describe("SITE_URL", () => {
  it("has no trailing slash", () => {
    expect(SITE_URL.endsWith("/")).toBe(false);
  });
});
