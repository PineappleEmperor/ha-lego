import { describe, expect, it } from "vitest";

import {
  accountCall,
  count,
  displayName,
  errorText,
  formatPrice,
  isNamed,
  ownershipCall,
  statisticPoints,
  topThemes,
  refreshCall,
  syncedAgo,
  whenLabel,
  whenTone,
  wishlistCall,
} from "../src/format";

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

describe("wishlist call", () => {
  it("flips wanted, leaving ownership alone", () => {
    const on = wishlistCall("abc123", { set_number: "10328-1", wanted: false });
    expect(on).toEqual({
      device_id: "abc123",
      set_number: "10328-1",
      wanted: true,
    });
    expect(
      wishlistCall("abc123", { set_number: "10328-1", wanted: true }).wanted,
    ).toBe(false);
  });
});

describe("ownership call", () => {
  it("takes a wanted set off the wishlist when it is got, and only then", () => {
    const got = { set_number: "1-1", owned: false, wanted: true };
    expect(ownershipCall("e", got)).toHaveProperty("wanted", false);
    expect(ownershipCall("e", { ...got, wanted: false })).not.toHaveProperty(
      "wanted",
    );
    // Removing a set from the collection leaves the wishlist alone.
    expect(
      ownershipCall("e", { set_number: "1-1", owned: true, wanted: true }),
    ).not.toHaveProperty("wanted");
  });

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

describe("price", () => {
  it("shows the RRP in the region's currency", () => {
    expect(formatPrice(99.99, "GBP", "en-GB")).toBe("£99.99");
    expect(formatPrice(649.99, "USD", "en-US")).toBe("$649.99");
  });

  it("shows nothing when Brickset has no price or no currency", () => {
    expect(formatPrice(null, "GBP", "en-GB")).toBe("");
    expect(formatPrice(99.99, null, "en-GB")).toBe("");
  });
});

describe("missing data and errors", () => {
  it("shows nothing for a price the payload left out", () => {
    // undefined once reached Intl and printed "£NaN" on every search result.
    expect(formatPrice(undefined, "GBP", "en-GB")).toBe("");
  });

  it("can round a total to whole units", () => {
    expect(formatPrice(4321.6, "GBP", "en-GB", true)).toBe("£4,322");
  });

  it("reads the message of a websocket rejection", () => {
    // Home Assistant rejects with {code, message}, not an Error.
    expect(
      errorText({ code: "not_found", message: "Unknown LEGO entry" }),
    ).toBe("Unknown LEGO entry");
    expect(errorText(new Error("boom"))).toBe("boom");
    expect(errorText("plain")).toBe("plain");
  });

  it("counts in the singular for one", () => {
    expect(count(1, "set owned", "sets owned")).toBe("1 set owned");
    expect(count(12, "set owned", "sets owned")).toBe("12 sets owned");
  });
});

describe("card dates", () => {
  const now = new Date("2026-05-15T12:00:00Z");
  const iso = (value: string) => value.slice(0, 10);

  it("says retired once the exit date has passed", () => {
    expect(
      whenLabel(
        { name: "A", available_from: null, available_until: "2025-12-27" },
        now,
        iso,
      ),
    ).toBe("Retired 2025-12-27");
    expect(
      whenLabel(
        { name: "A", available_from: null, available_until: "2026-12-27" },
        now,
        iso,
      ),
    ).toBe("Retires 2026-12-27");
  });

  it("says due before a launch and out after it", () => {
    expect(
      whenLabel(
        { name: "A", available_from: "2026-08-01", available_until: null },
        now,
        iso,
      ),
    ).toBe("Due 2026-08-01");
    expect(
      whenLabel(
        { name: "A", available_from: "2026-03-01", available_until: null },
        now,
        iso,
      ),
    ).toBe("Out 2026-03-01");
  });
});

describe("card dates on a row of releases", () => {
  const now = new Date("2026-05-15T12:00:00Z");
  const iso = (value: string) => value.slice(0, 10);
  // Both dates published, as for most sets on sale: which one leads depends on
  // what the row is about.
  const both = {
    name: "A",
    available_from: "2026-05-01",
    available_until: "2099-12-31",
  };

  it("leads with the release date, not a retirement years away", () => {
    expect(whenLabel(both, now, iso, "release")).toBe("Out 2026-05-01");
    expect(whenTone(both, now, "release")).toBe("");
    const due = { ...both, available_from: "2026-06-01" };
    expect(whenLabel(due, now, iso, "release")).toBe("Due 2026-06-01");
    expect(whenTone(due, now, "release")).toBe("due");
  });

  it("falls back to the retirement date when no release date is known", () => {
    expect(
      whenLabel({ ...both, available_from: null }, now, iso, "release"),
    ).toBe("Retires 2099-12-31");
  });

  it("still leads with retirement on a wishlist", () => {
    expect(whenLabel(both, now, iso)).toBe("Retires 2099-12-31");
  });
});

describe("card date tone", () => {
  const now = new Date("2026-05-15T12:00:00Z");
  const set = (from: string | null, until: string | null) => ({
    available_from: from,
    available_until: until,
  });

  it("marks a set not yet out as due", () => {
    expect(whenTone(set("2026-08-01", null), now)).toBe("due");
    expect(whenTone(set("2026-03-01", null), now)).toBe("");
  });

  it("flags a set leaving sale within two months, and one already gone", () => {
    expect(whenTone(set(null, "2026-06-30"), now)).toBe("retiring");
    expect(whenTone(set(null, "2026-12-31"), now)).toBe("");
    expect(whenTone(set(null, "2026-01-31"), now)).toBe("retired");
  });
});

describe("history and theme totals", () => {
  it("reads a TOTAL sensor's state and a MEASUREMENT sensor's mean", () => {
    expect(
      statisticPoints([
        { start: 1000, state: 10 },
        { start: 2000, mean: 12.5 },
        { start: 3000, state: null },
      ]),
    ).toEqual([
      { t: 1000, v: 10 },
      { t: 2000, v: 12.5 },
    ]);
  });

  it("keeps the biggest themes and folds the rest into Other", () => {
    const totals = [
      {
        theme: "Icons",
        value: 900,
        pieces: 5000,
        sets: 3,
        set_numbers: ["10307-1"],
      },
      {
        theme: "Technic",
        value: 300,
        pieces: 9000,
        sets: 2,
        set_numbers: ["42115-1"],
      },
      {
        theme: "City",
        value: 50,
        pieces: 400,
        sets: 1,
        set_numbers: ["60414-1"],
      },
      { theme: "Gear", value: 0, pieces: 0, sets: 1, set_numbers: ["853-1"] },
    ];
    expect(topThemes(totals, "value", 2)).toEqual([
      {
        theme: "Icons",
        amount: 900,
        sets: 3,
        setNumbers: ["10307-1"],
        other: false,
      },
      {
        theme: "Technic",
        amount: 300,
        sets: 2,
        setNumbers: ["42115-1"],
        other: false,
      },
      // The fold keeps the set numbers behind it, for the chart's tooltip.
      {
        theme: "Other (1 theme)",
        amount: 50,
        sets: 1,
        setNumbers: ["60414-1"],
        other: true,
      },
    ]);
    expect(topThemes(totals, "pieces", 1)[0].theme).toBe("Technic");
  });
});
