import { describe, it, expect } from "vitest";
import { isGtmExcludedPath } from "./ClientGTM";

describe("isGtmExcludedPath", () => {
  it("excludes /admin and its subpaths", () => {
    expect(isGtmExcludedPath("/admin")).toBe(true);
    expect(isGtmExcludedPath("/admin/trips")).toBe(true);
    expect(isGtmExcludedPath("/admin/trips/edit/123")).toBe(true);
  });

  it("excludes /nuevo-viaje", () => {
    expect(isGtmExcludedPath("/nuevo-viaje")).toBe(true);
  });

  it("does not exclude public routes", () => {
    expect(isGtmExcludedPath("/")).toBe(false);
    expect(isGtmExcludedPath("/viajes")).toBe(false);
    expect(isGtmExcludedPath("/viajes/cabo-polonio")).toBe(false);
    expect(isGtmExcludedPath("/about")).toBe(false);
  });

  it("does not exclude a public route that merely starts with the same letters", () => {
    // e.g. a hypothetical /administracion page should not be swept up by
    // the "/admin" prefix check.
    expect(isGtmExcludedPath("/administracion")).toBe(false);
  });
});
