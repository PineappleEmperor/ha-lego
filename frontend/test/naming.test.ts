import { describe, expect, it } from "vitest";

import { accountCall, displayName, isNamed, ownershipCall } from "../src/panel";

describe("set naming", () => {
  it("treats a normal name as named", () => {
    expect(isNamed({ name: "Tulip Bouquet" })).toBe(true);
    expect(displayName({ name: "Tulip Bouquet" })).toBe("Tulip Bouquet");
  });

  it("recognises Brickset's unannounced placeholder", () => {
    expect(isNamed({ name: "{?}" })).toBe(false);
    expect(displayName({ name: "{?}" })).toBe("Name tbd");
  });

  it("does not print the placeholder padded with whitespace either", () => {
    expect(displayName({ name: "  {?}  " })).toBe("Name tbd");
  });

  it("handles an empty or absent name the same way", () => {
    expect(displayName({ name: "" })).toBe("Name tbd");
    expect(displayName({ name: undefined as unknown as string })).toBe("Name tbd");
  });

  it("keeps a name that merely contains braces", () => {
    expect(isNamed({ name: "Set {special}" })).toBe(true);
  });
});

describe("ownership call", () => {
  it("always sends config_entry_id, which the action requires", () => {
    const data = ownershipCall("abc123", { set_number: "10497-1", owned: false });

    expect(data).toHaveProperty("config_entry_id", "abc123");
    expect(data).toHaveProperty("set_number", "10497-1");
  });

  it("flips owned rather than repeating it", () => {
    expect(ownershipCall("e", { set_number: "1-1", owned: false }).owned).toBe(true);
    expect(ownershipCall("e", { set_number: "1-1", owned: true }).owned).toBe(false);
  });

  it("never omits the entry id, even when the dashboard has not loaded", () => {
    // The panel passes "" in that case; the key must still be present, since a
    // missing key is a schema rejection while an empty one is a clear error.
    expect("config_entry_id" in ownershipCall("", { set_number: "1-1", owned: false })).toBe(
      true,
    );
  });
});

describe("addressing an account", () => {
  it("names the account when one is selected", () => {
    expect(accountCall("lego/dashboard", "abc123")).toEqual({
      type: "lego/dashboard",
      config_entry_id: "abc123",
    });
  });

  it("omits the key entirely when no account is selected yet", () => {
    // An empty string passes vol.Optional(str) and then resolves to no entry, so
    // the key has to be absent for the server to fall back to the stored choice.
    const call = accountCall("lego/dashboard", "");
    expect(call).toEqual({ type: "lego/dashboard" });
    expect("config_entry_id" in call).toBe(false);
  });

  it("keeps the caller's own fields when spread alongside", () => {
    expect({ ...accountCall("lego/collection", "e1"), filter: "owned" }).toEqual({
      type: "lego/collection",
      config_entry_id: "e1",
      filter: "owned",
    });
  });
});
