/**
 * Unit tests for the localStorage helpers (the persistence layer behind both the
 * cache and favorites). Verifies the round-trip plus the resilience guarantees
 * that matter in practice: missing keys and corrupt data must fall back, never throw.
 */
import { readStorage, writeStorage, STORAGE_KEYS } from "@/lib/storage";

describe("storage helpers", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips a JSON-serializable value", () => {
    writeStorage("nums", [1, 2, 3]);
    expect(readStorage("nums", [])).toEqual([1, 2, 3]);
  });

  it("returns the fallback when the key is missing", () => {
    expect(readStorage("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback (not a throw) when stored JSON is corrupt", () => {
    localStorage.setItem("bad", "{ not valid json");
    expect(readStorage<null>("bad", null)).toBeNull();
  });

  it("namespaces keys to avoid collisions", () => {
    expect(STORAGE_KEYS.favorites).toBe("side:favorites");
    expect(STORAGE_KEYS.properties).toBe("side:properties");
  });
});
