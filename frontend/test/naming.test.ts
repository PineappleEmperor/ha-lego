import { describe, expect, it } from "vitest";

import {
  accountCall,
  displayName,
  isNamed,
  ownershipCall,
  refreshCall,
  syncedAgo,
} from "../src/lego-panel";

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
    expect(displayName({ name: undefined as unknown as string })).toBe(
      "Name tbd",
    );
  });

  it("keeps a name that merely contains braces", () => {
    expect(isNamed({ name: "Set {special}" })).toBe(true);
  });
});

describe("ownership call", () => {
  it("always sends device_id, which the action requires", () => {
    const data = ownershipCall("abc123", {
      set_number: "10497-1",
      owned: false,
    });

    expect(data).toHaveProperty("device_id", "abc123");
    expect(data).toHaveProperty("set_number", "10497-1");
  });

  it("flips owned rather than repeating it", () => {
    expect(ownershipCall("e", { set_number: "1-1", owned: false }).owned).toBe(
      true,
    );
    expect(ownershipCall("e", { set_number: "1-1", owned: true }).owned).toBe(
      false,
    );
  });

  it("never omits the device id, even when the dashboard has not loaded", () => {
    // The panel passes "" in that case; the key must still be present, since a
    // missing key is a schema rejection while an empty one is a clear error.
    expect(
      "device_id" in ownershipCall("", { set_number: "1-1", owned: false }),
    ).toBe(true);
  });
});

describe("refresh call", () => {
  it("targets the account's device", () => {
    expect(refreshCall("dev1")).toEqual({ device_id: "dev1" });
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
    expect({
      ...accountCall("lego/collection", "e1"),
      filter: "owned",
    }).toEqual({
      type: "lego/collection",
      config_entry_id: "e1",
      filter: "owned",
    });
  });
});

describe("sync age", () => {
  const now = new Date("2026-08-05T15:30:00Z");

  it("says so when nothing has synced yet", () => {
    expect(syncedAgo(null, now)).toBe("Not synced yet");
  });

  it("reads naturally from a minute to days", () => {
    expect(syncedAgo("2026-08-05T15:29:40Z", now)).toBe("Updated just now");
    expect(syncedAgo("2026-08-05T15:25:00Z", now)).toBe(
      "Updated 5 minutes ago",
    );
    expect(syncedAgo("2026-08-05T12:00:00Z", now)).toBe("Updated 3 hours ago");
    expect(syncedAgo("2026-08-02T15:30:00Z", now)).toBe("Updated 3 days ago");
  });
});
