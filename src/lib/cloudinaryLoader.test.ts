import { describe, it, expect } from "vitest";
import cloudinaryLoader from "./cloudinaryLoader";

const CLOUDINARY_URL =
  "https://res.cloudinary.com/demo/image/upload/v123/integral-surf/trips/foo.jpg";

describe("cloudinaryLoader", () => {
  it("inserts a width- and quality-aware transform for a Cloudinary URL", () => {
    const result = cloudinaryLoader({ src: CLOUDINARY_URL, width: 640, quality: 80 });
    expect(result).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_80,c_limit,w_640/v123/integral-surf/trips/foo.jpg"
    );
  });

  it("defaults quality to auto when not specified", () => {
    const result = cloudinaryLoader({ src: CLOUDINARY_URL, width: 640 });
    expect(result).toContain("q_auto");
  });

  it("passes non-Cloudinary URLs through unchanged (local static assets)", () => {
    const local = "/images/icons/logo.png";
    expect(cloudinaryLoader({ src: local, width: 256 })).toBe(local);
  });

  it("passes through other remote hosts unchanged (e.g. Supabase storage)", () => {
    const supabase =
      "https://hfvqfhkxssecvpzqgoqt.supabase.co/storage/v1/object/public/foo.jpg";
    expect(cloudinaryLoader({ src: supabase, width: 256 })).toBe(supabase);
  });
});
