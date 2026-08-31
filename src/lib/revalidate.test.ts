import { describe, it, expect, vi, beforeEach } from "vitest";

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}));

// Imported after the mock so the module under test picks up the mocked
// next/cache implementation instead of the real one (which requires a live
// Next.js request context and throws outside of it).
const {
  revalidateTripPages,
  revalidateAbout,
  revalidateFundamentos,
  revalidateHome,
  revalidateLayout,
  revalidateConfigKey,
} = await import("./revalidate");

describe("revalidate helpers", () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    revalidateTag.mockClear();
  });

  it("revalidateTripPages purges the listing, every trip detail page, and the homepage", () => {
    revalidateTripPages();
    expect(revalidatePath).toHaveBeenCalledWith("/viajes");
    expect(revalidatePath).toHaveBeenCalledWith("/viajes/[slug]", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledTimes(3);
  });

  it("revalidateAbout purges only /about", () => {
    revalidateAbout();
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/about");
  });

  it("revalidateFundamentos purges only /fundamentos", () => {
    revalidateFundamentos();
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/fundamentos");
  });

  it("revalidateHome purges only /", () => {
    revalidateHome();
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("revalidateLayout purges every route under the root layout", () => {
    revalidateLayout();
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/", "layout");
  });

  it("revalidateConfigKey busts both the per-key cache tag and the shared layout", () => {
    revalidateConfigKey("whatsapp_phone_number");
    expect(revalidateTag).toHaveBeenCalledExactlyOnceWith("config:whatsapp_phone_number");
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/", "layout");
  });
});
