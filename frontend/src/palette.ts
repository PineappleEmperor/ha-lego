import { css } from "lit";

/**
 * The chart colours: the dataviz skill's validated categorical palette, eight
 * hues with their own light and dark steps. Home Assistant's --color-N palette was
 * measured and fails in dark mode (lightness band, chroma floor and colour-blind
 * separation), so it is not used for data. Text never wears these colours.
 */
export const SERIES_COLOURS = css`
  :host {
    --lego-series-1: #2a78d6;
    --lego-series-2: #eb6834;
    --lego-series-3: #1baf7a;
    --lego-series-4: #eda100;
    --lego-series-5: #e87ba4;
    --lego-series-6: #008300;
    --lego-series-7: #6250d6;
    --lego-series-8: #e34948;
    --lego-series-other: #9e9e9e;
  }
  :host([dark]) {
    --lego-series-1: #3987e5;
    --lego-series-2: #d95926;
    --lego-series-3: #199e70;
    --lego-series-4: #c98500;
    --lego-series-5: #d55181;
    --lego-series-6: #008300;
    --lego-series-7: #9085e9;
    --lego-series-8: #e66767;
  }
`;

/** Slots 1 to 8, in the palette's fixed order, by the hue each one is. */
const BLUE = 1,
  ORANGE = 2,
  AQUA = 3,
  YELLOW = 4,
  MAGENTA = 5,
  GREEN = 6,
  VIOLET = 7,
  RED = 8;

/**
 * Themes with a colour people already associate with them. Grey for Technic was
 * tried and fails the chroma floor, reading as "Other"; purple for Harry Potter
 * was not wanted.
 */
const SEMANTIC: Record<string, number> = {
  "star wars": BLUE,
  botanicals: GREEN,
  "botanical collection": GREEN,
  icons: YELLOW,
  "creator expert": YELLOW,
  technic: VIOLET,
  "harry potter": RED,
  city: AQUA,
};

/** The order other themes take the slots no semantic theme in view has claimed. */
const FREE_ORDER = [ORANGE, MAGENTA, BLUE, AQUA, YELLOW, GREEN, VIOLET, RED];

/**
 * Give each theme in view a slot: its own hue where it has one, else the next
 * free slot in a fixed order, so a theme's colour follows the theme rather than
 * where it ranks. Past eight distinct slots a theme shares "Other"'s grey.
 */
export function themeSlots(themes: string[]): Map<string, number | "other"> {
  const slots = new Map<string, number | "other">();
  const used = new Set<number>();
  for (const theme of themes) {
    const slot = SEMANTIC[theme.toLowerCase()];
    if (slot && !used.has(slot)) {
      slots.set(theme, slot);
      used.add(slot);
    }
  }
  for (const theme of themes) {
    if (slots.has(theme)) continue;
    const slot = FREE_ORDER.find((s) => !used.has(s));
    if (slot === undefined) {
      slots.set(theme, "other");
    } else {
      slots.set(theme, slot);
      used.add(slot);
    }
  }
  return slots;
}

/** The CSS colour for a slot. */
export function slotColour(slot: number | "other" | undefined): string {
  return slot === undefined || slot === "other"
    ? "var(--lego-series-other)"
    : `var(--lego-series-${slot})`;
}
