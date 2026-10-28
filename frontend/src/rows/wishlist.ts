import { html, type TemplateResult } from "lit";

import { LegoRow, define } from "../base";
import { count } from "../format";

const HINT = "Hold + on any set to add it to your wishlist.";

/** The wanted sets, soonest to retire first, with the bricks filling the rest. */
export class LegoWishlistRow extends LegoRow {
  protected readonly row = "wishlist";

  protected subtitle(): string {
    return count(this.dash?.wishlist.length ?? 0, "set", "sets");
  }

  protected body(): TemplateResult {
    const sets = this.dash?.wishlist ?? [];
    if (!sets.length)
      return this.filler(`Nothing on your wishlist yet. ${HINT}`);
    return html`<div class="carousel">
      ${sets.map((item) =>
        this.card(item, "retirement", this.themeColour(item.theme)),
      )}
      ${this.tail(HINT)}
    </div>`;
  }
}

define("lego-wishlist-row", LegoWishlistRow);
