import { describe, it, expect } from "vitest";
import { computeContentIdsToDelete, normalizeTripContents } from "./trips";

describe("computeContentIdsToDelete", () => {
  // Regression guard for B2: the trip-content deletion filter
  // (`.not("id", "in", contentIds)` with a raw JS array) silently matched
  // nothing, so removing a content block in the admin UI never actually
  // deleted it from the database.
  it("marks a removed content block for deletion", () => {
    const existingIds = ["a", "b"];
    const incoming = [{ id: "a" }]; // "b" was removed in the edit form
    expect(computeContentIdsToDelete(existingIds, incoming)).toEqual(["b"]);
  });

  it("deletes nothing when every existing id is still present", () => {
    const existingIds = ["a", "b", "c"];
    const incoming = [{ id: "b" }, { id: "a" }, { id: "c" }]; // order doesn't matter
    expect(computeContentIdsToDelete(existingIds, incoming)).toEqual([]);
  });

  it("deletes everything when the incoming list has no ids (all new content)", () => {
    const existingIds = ["a", "b"];
    const incoming = [{ id: undefined, title: "brand new, no id yet" }];
    expect(computeContentIdsToDelete(existingIds, incoming)).toEqual(["a", "b"]);
  });

  it("ignores null/undefined ids on incoming content (new, unsaved rows)", () => {
    const existingIds = ["a"];
    const incoming = [{ id: "a" }, { id: null }, { id: undefined }, {}];
    expect(computeContentIdsToDelete(existingIds, incoming)).toEqual([]);
  });

  it("returns an empty array when there are no existing contents", () => {
    expect(computeContentIdsToDelete([], [{ id: "a" }])).toEqual([]);
  });

  it("is unaffected by ids present in incoming but not in existing", () => {
    // e.g. a stale client payload referencing an id from a different trip —
    // should not appear in the deletion list either way.
    const existingIds = ["a"];
    const incoming = [{ id: "z" }];
    expect(computeContentIdsToDelete(existingIds, incoming)).toEqual(["a"]);
  });
});

describe("normalizeTripContents", () => {
  // Guards the nested-select refactor in plan 03: Supabase doesn't guarantee
  // nested ordering, so this sorts contents by `order` and each content's
  // images by `order_number` in memory, and renames trip_content_images ->
  // images to match the shape the rest of the app expects.
  it("sorts out-of-order contents by `order`", () => {
    const result = normalizeTripContents([
      { id: "c2", order: 2, title: "Second", description: "", image_url: "" },
      { id: "c0", order: 0, title: "First", description: "", image_url: "" },
      { id: "c1", order: 1, title: "Middle", description: "", image_url: "" },
    ] as never);
    expect(result.map((c) => c.id)).toEqual(["c0", "c1", "c2"]);
  });

  it("sorts each content's images by order_number and renames the key to `images`", () => {
    const result = normalizeTripContents([
      {
        id: "c0",
        order: 0,
        title: "First",
        description: "",
        image_url: "",
        trip_content_images: [
          { id: "img-b", order_number: 1, image_url: "b.jpg" },
          { id: "img-a", order_number: 0, image_url: "a.jpg" },
        ],
      },
    ] as never);
    expect(result[0]).not.toHaveProperty("trip_content_images");
    expect(result[0].images?.map((i) => i.id)).toEqual(["img-a", "img-b"]);
  });

  it("defaults missing order/order_number to 0 rather than throwing", () => {
    const result = normalizeTripContents([
      { id: "c0", title: "No order field", description: "", image_url: "" },
    ] as never);
    expect(result).toHaveLength(1);
  });

  it("returns an empty array for null/undefined input", () => {
    expect(normalizeTripContents(null)).toEqual([]);
    expect(normalizeTripContents(undefined)).toEqual([]);
  });
});
