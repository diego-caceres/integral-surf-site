import { describe, it, expect } from "vitest";
import { classifyPath } from "./middleware";

describe("classifyPath", () => {
  // Regression guard for S1: a middleware matcher gap once let
  // POST /api/configurations (create arbitrary config rows) through
  // unauthenticated. Both GET and POST must require a session.
  it("protects /api/configurations for both GET and POST", () => {
    expect(classifyPath("/api/configurations", "GET").kind).toBe("protectedApi");
    expect(classifyPath("/api/configurations", "POST").kind).toBe("protectedApi");
    expect(classifyPath("/api/configurations/anything", "GET").kind).toBe("protectedApi");
  });

  it("always protects /api/admin/* regardless of method", () => {
    expect(classifyPath("/api/admin/trips", "GET").kind).toBe("protectedApi");
    expect(classifyPath("/api/admin/trips", "POST").kind).toBe("protectedApi");
  });

  it("always protects /api/cloudinary/*", () => {
    expect(classifyPath("/api/cloudinary/sign", "POST").kind).toBe("protectedApi");
  });

  it("exempts login/logout even though they live under /api/admin", () => {
    expect(classifyPath("/api/admin/login", "POST").kind).toBe("public");
    expect(classifyPath("/api/admin/logout", "POST").kind).toBe("public");
  });

  it("allows public GET/HEAD on /api/trips and /api/config but protects writes", () => {
    expect(classifyPath("/api/trips", "GET").kind).toBe("public");
    expect(classifyPath("/api/trips", "HEAD").kind).toBe("public");
    expect(classifyPath("/api/trips", "POST").kind).toBe("protectedApi");
    expect(classifyPath("/api/trips/123", "PUT").kind).toBe("protectedApi");
    expect(classifyPath("/api/trips/123", "DELETE").kind).toBe("protectedApi");

    expect(classifyPath("/api/config/whatsapp_phone_number", "GET").kind).toBe("public");
    expect(classifyPath("/api/config/whatsapp_phone_number", "PUT").kind).toBe("protectedApi");
  });

  it("redirects unauthenticated visits to protected pages instead of 401ing", () => {
    expect(classifyPath("/nuevo-viaje", "GET").kind).toBe("protectedPage");
  });

  it("leaves unrelated public routes untouched", () => {
    expect(classifyPath("/", "GET").kind).toBe("public");
    expect(classifyPath("/viajes/costa-rica", "GET").kind).toBe("public");
    expect(classifyPath("/api/instagram-posts", "GET").kind).toBe("public");
  });
});
