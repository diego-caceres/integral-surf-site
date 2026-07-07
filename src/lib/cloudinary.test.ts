import { describe, it, expect } from "vitest";
import { isCloudinary, cloudinaryUrl, cloudinarySrcSet } from "./cloudinary";

const CLOUDINARY_URL =
  "https://res.cloudinary.com/demo/image/upload/v123/integral-surf/trips/foo.jpg";
const NON_CLOUDINARY_URL = "https://example.com/foo.jpg";
const LOCAL_URL = "/images/placeholder.jpg";

describe("isCloudinary", () => {
  it("recognizes a Cloudinary URL", () => {
    expect(isCloudinary(CLOUDINARY_URL)).toBe(true);
  });
  it("rejects non-Cloudinary URLs", () => {
    expect(isCloudinary(NON_CLOUDINARY_URL)).toBe(false);
    expect(isCloudinary(LOCAL_URL)).toBe(false);
  });
  it("rejects null/undefined", () => {
    expect(isCloudinary(null)).toBe(false);
    expect(isCloudinary(undefined)).toBe(false);
  });
});

describe("cloudinaryUrl", () => {
  it("inserts the transform after /upload/ for a Cloudinary upload URL", () => {
    expect(cloudinaryUrl(CLOUDINARY_URL, "f_auto,q_auto,w_1920")).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1920/v123/integral-surf/trips/foo.jpg"
    );
  });
  it("returns non-Cloudinary URLs unchanged", () => {
    expect(cloudinaryUrl(NON_CLOUDINARY_URL, "f_auto,q_auto")).toBe(NON_CLOUDINARY_URL);
    expect(cloudinaryUrl(LOCAL_URL, "f_auto,q_auto")).toBe(LOCAL_URL);
  });
  it("returns Cloudinary URLs without an /image/upload/ segment unchanged", () => {
    const rawUrl = "https://res.cloudinary.com/demo/raw/upload/v123/file.pdf";
    expect(cloudinaryUrl(rawUrl, "f_auto,q_auto")).toBe(rawUrl);
  });
});

describe("cloudinarySrcSet", () => {
  it("builds width descriptors for each width, in order", () => {
    const srcSet = cloudinarySrcSet(CLOUDINARY_URL, [480, 768, 1024]);
    const parts = srcSet.split(", ");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toContain("w_480");
    expect(parts[0].endsWith(" 480w")).toBe(true);
    expect(parts[2]).toContain("w_1024");
  });

  it("uses c_limit so images are never upscaled", () => {
    const srcSet = cloudinarySrcSet(CLOUDINARY_URL, [480]);
    expect(srcSet).toContain("c_limit");
  });

  it("returns an empty string for non-Cloudinary URLs", () => {
    expect(cloudinarySrcSet(NON_CLOUDINARY_URL, [480, 768])).toBe("");
  });
});
