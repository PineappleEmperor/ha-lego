import { css } from "lit";

/*
 * Every colour, size, space and radius below comes from a Home Assistant theme
 * variable or an --ha- token; each --ha- token carries the value the frontend
 * lists for it, for an older frontend that lacks the token. The series colours
 * are the one exception, kept in palette.ts.
 */
export const TOKENS = css`
  :host {
    --lego-text: var(--primary-text-color, #141414);
    --lego-text-2: var(--secondary-text-color, #5e5e5e);
    --lego-surface: var(--card-background-color, #fff);
    --lego-ground: var(--primary-background-color, #fafafa);
    --lego-outline: var(--divider-color, rgba(0, 0, 0, 0.12));
    --lego-primary: var(--primary-color, #009ac7);
    --lego-on-primary: var(--text-primary-color, #fff);
    --lego-focus: var(--ha-color-focus, var(--primary-color));
    /* Selected pills: the primary at a tint, text in the primary's dark step. */
    --lego-pick: color-mix(
      in srgb,
      var(--primary-color, #009ac7) 14%,
      transparent
    );
    --lego-on-pick: var(--ha-color-on-primary-normal, var(--primary-color));
    /* Status text sits on the card surface, so it takes the on-* tokens. */
    --lego-own: var(--ha-color-on-success-normal, #036730);
    --lego-want: var(--ha-color-on-warning-normal, #9d3800);
    --lego-bad: var(--ha-color-on-danger-normal, #b30532);
    --lego-own-fill: var(--ha-color-fill-success-loud-resting, #00883c);
    --lego-on-own-fill: var(--ha-color-on-success-loud, #fff);
    --lego-radius: var(
      --ha-card-border-radius,
      var(--ha-border-radius-lg, 12px)
    );
    --lego-line: var(--ha-border-width-sm, 1px);
    color: var(--lego-text);
  }
`;

/** The row frame: header with fold arrow, icon, title and actions, then body. */
export const ROW = css`
  /* A block, or the container queries below have no box to measure. */
  :host {
    container-type: inline-size;
    display: block;
  }
  .row {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius);
    padding: var(--ha-space-1, 4px) var(--ha-space-4, 16px)
      var(--ha-space-4, 16px);
  }
  :host([bare]) .row {
    background: none;
    border: 0;
  }
  .row.folded {
    padding-bottom: var(--ha-space-1, 4px);
  }
  .row.dragging {
    opacity: 0.5;
  }
  .row.over {
    box-shadow: inset 0 var(--ha-border-width-md, 2px) 0 var(--lego-primary);
  }
  .rowhead {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    min-height: 56px;
  }
  .fold {
    flex: 1 1 200px;
    align-items: center;
    appearance: none;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: var(--ha-space-2, 8px);
    min-height: 48px;
    min-width: 0;
    padding: 0;
    text-align: left;
  }
  .chev {
    --mdc-icon-size: 24px;
    color: var(--lego-text-2);
    flex: none;
    transition: transform var(--ha-animation-duration-fast, 150ms);
  }
  .chev.open {
    transform: rotate(90deg);
  }
  .rowicon {
    --mdc-icon-size: 24px;
    color: var(--lego-primary);
    flex: none;
  }
  .titles {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  h2 {
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: var(--ha-font-weight-bold, 700);
    line-height: var(--ha-line-height-condensed, 1.2);
    margin: 0;
  }
  .sub {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    justify-content: flex-end;
    max-width: 100%;
  }
  /* A narrow row, on a phone or in a dashboard column: the title keeps its line
     with the handle, and the controls drop to a line of their own. */
  @container (max-width: 720px) {
    .fold {
      flex-basis: 0;
    }
    .drag {
      order: 2;
    }
    /* The title and its line beneath fill the header's height, so give them
       room above rather than letting them sit against the row's edge. */
    .rowhead {
      padding-top: var(--ha-space-2, 8px);
    }
    .actions {
      flex-basis: 100%;
      justify-content: flex-start;
      order: 3;
      padding-bottom: var(--ha-space-2, 8px);
    }
    .actions .pills {
      max-width: 100%;
      overflow-x: auto;
    }
  }
  .drag {
    appearance: none;
    background: none;
    border: 0;
    color: var(--lego-text-2);
    cursor: grab;
    display: grid;
    /* A finger on the handle drags the row rather than scrolling the page. */
    touch-action: none;
    flex: none;
    min-height: 48px;
    min-width: 48px;
    place-items: center;
  }
  .muted {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-m, 14px);
    margin: var(--ha-space-3, 12px) 0 0;
  }
  .caveat {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
    line-height: var(--ha-line-height-normal, 1.6);
    margin: var(--ha-space-2, 8px) 0 0;
  }
  .caveat.bad {
    color: var(--lego-bad);
  }
  .subsection {
    border-top: var(--lego-line) solid var(--lego-outline);
    margin-top: var(--ha-space-3, 12px);
  }
  .subsection > .fold h3 {
    font-size: var(--ha-font-size-l, 16px);
    font-weight: var(--ha-font-weight-bold, 700);
    margin: 0;
  }
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: var(--ha-border-width-md, 2px) solid var(--lego-focus);
    outline-offset: var(--ha-border-width-md, 2px);
  }
`;

/** Pills and chips: the span pills, theme chips and the Update pill. */
export const CONTROLS = css`
  .pills {
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-pill, 9999px);
    display: inline-flex;
    overflow: hidden;
  }
  .pill {
    appearance: none;
    background: var(--lego-surface);
    border: 0;
    color: var(--lego-text-2);
    cursor: pointer;
    font: inherit;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
    min-height: 40px;
    padding: 0 var(--ha-space-3, 12px);
    white-space: nowrap;
  }
  .pill.on {
    background: var(--lego-pick);
    color: var(--lego-on-pick);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-2, 8px);
    margin: var(--ha-space-1, 4px) 0 var(--ha-space-2, 8px);
  }
  .chip {
    align-items: center;
    appearance: none;
    background: none;
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--lego-text-2);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    gap: var(--ha-space-2, 8px);
    min-height: 40px;
    padding: 0 var(--ha-space-4, 16px);
  }
  .chip.on {
    background: var(--lego-primary);
    border-color: var(--lego-primary);
    color: var(--lego-on-primary);
  }
  /* Present to be found, but not yet switched on in the options. */
  .chip.off {
    color: var(--lego-text-2);
    opacity: 0.6;
  }
  .divider {
    align-self: stretch;
    background: var(--lego-outline);
    margin: var(--ha-space-1, 4px);
    width: var(--lego-line);
  }
  .key {
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--lego-surface);
    display: inline-block;
    flex: none;
    height: 10px;
    width: 10px;
  }
  .update {
    align-items: center;
    appearance: none;
    background: var(--lego-primary);
    border: 0;
    border-radius: var(--ha-border-radius-pill, 9999px);
    color: var(--lego-on-primary);
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    gap: var(--ha-space-2, 8px);
    min-height: 40px;
    padding: 0 var(--ha-space-4, 16px);
    --mdc-icon-size: 18px;
  }
  .update:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  .update .sep {
    background: currentColor;
    border-radius: 50%;
    height: 4px;
    width: 4px;
  }
  .update .cost {
    font-weight: var(--ha-font-weight-normal, 400);
  }
  .link {
    appearance: none;
    background: none;
    border: 0;
    color: var(--lego-primary);
    cursor: pointer;
    font: inherit;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-medium, 500);
    min-height: 48px;
    padding: 0 var(--ha-space-2, 8px);
  }
  /* Asks a window still running an older bundle to reload. */
  .updated {
    align-items: center;
    background: var(--lego-pick);
    border-radius: var(--ha-border-radius-md, 8px);
    display: flex;
    flex-wrap: wrap;
    font-size: var(--ha-font-size-m, 14px);
    gap: 0 var(--ha-space-2, 8px);
    justify-content: space-between;
    padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-4, 16px);
  }
`;

/** Set cards, the carousel and the grid. */
export const CARDS = css`
  /* Medium and large draw the picture two and three times the size; the card
     widens with it, and never past the row on a narrow screen. */
  :host {
    --lego-card-w: 156px;
    --lego-pic-h: 104px;
    --lego-stamp: 10px;
  }
  :host([picture-size="medium"]) {
    --lego-card-w: 296px;
    --lego-pic-h: 208px;
    --lego-stamp: 13px;
  }
  :host([picture-size="large"]) {
    --lego-card-w: 436px;
    --lego-pic-h: 312px;
    --lego-stamp: 16px;
  }
  .carousel {
    align-items: center;
    display: flex;
    gap: var(--ha-space-3, 12px);
    overflow-x: auto;
    padding-bottom: var(--ha-space-1, 4px);
    scroll-snap-type: x proximity;
  }
  /* Snapping helps a finger land on a card, but fights a wheel or a trackpad. */
  @media (pointer: fine) {
    .carousel {
      scroll-snap-type: none;
    }
  }
  .carousel .card {
    flex: 0 0 min(var(--lego-card-w), 85%);
    scroll-snap-align: start;
  }
  .grid {
    display: grid;
    gap: var(--ha-space-3, 12px);
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(var(--lego-card-w), 100%), 1fr)
    );
  }
  .card {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 236px;
    overflow: hidden;
    position: relative;
  }
  /* A rubber stamp pressed onto the picture's corner: a ruled border, spaced
     capitals and a tilt. */
  .stamp,
  .seal {
    /* Ink on paper in either theme: the photo behind is white, or the dark edge
       of the picture box, and only a paper backing reads on both. Paper and ink
       are both solid, so nothing in the photo shows through either. */
    --lego-stamp-ink: #b3121b;
    --lego-stamp-paper: #fffaf3;
  }
  .stamp {
    background: var(--lego-stamp-paper);
    border: 0.18em solid currentColor;
    border-radius: 0.35em;
    color: var(--lego-stamp-ink);
    font-size: var(--lego-stamp);
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: 0.16em;
    line-height: 1;
    padding: 0.35em 0.45em 0.3em 0.6em;
    pointer-events: none;
    position: absolute;
    left: calc(var(--ha-space-2, 8px) + 0.9em);
    text-transform: uppercase;
    top: calc(var(--ha-space-2, 8px) + 1.1em);
    transform: rotate(-9deg);
  }
  /* A round date stamp in the opposite corner, in black, on a wanted set that
     has left sale: a double ring, the word, and the year. */
  .seal {
    --lego-stamp-ink: #161616;
    align-content: center;
    background: var(--lego-stamp-paper);
    border: 0.16em solid currentColor;
    border-radius: 50%;
    box-shadow:
      inset 0 0 0 0.26em var(--lego-stamp-paper),
      inset 0 0 0 0.38em currentColor;
    box-sizing: border-box;
    color: var(--lego-stamp-ink);
    display: grid;
    font-size: var(--lego-stamp);
    font-weight: var(--ha-font-weight-bold, 700);
    gap: 0.12em;
    height: 5.6em;
    justify-items: center;
    line-height: 1;
    pointer-events: none;
    position: absolute;
    right: calc(var(--ha-space-2, 8px) + 0.3em);
    text-transform: uppercase;
    top: calc(var(--ha-space-2, 8px) + var(--lego-pic-h) - 6em);
    transform: rotate(12deg);
    width: 5.6em;
  }
  .seal span:first-child {
    font-size: 0.72em;
    letter-spacing: 0.08em;
  }
  .seal .year {
    font-size: 1.2em;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
  }
  /* Set photos come on white; inset and rounded they read as photos rather
     than as gaps in a dark card. */
  .pic {
    background: var(--lego-ground);
    border-radius: var(--ha-border-radius-md, 8px);
    display: block;
    height: var(--lego-pic-h);
    margin: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0;
    overflow: hidden;
    position: relative;
  }
  .pic img {
    box-sizing: border-box;
    height: 100%;
    inset: 0;
    object-fit: contain;
    position: absolute;
    width: 100%;
  }
  /* The sharper copy fades in over the standard one once it has loaded. */
  .pic img.sharp {
    opacity: 0;
    transition: opacity 240ms ease-out;
  }
  .pic img.sharp.ready {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .pic img.sharp {
      transition: none;
    }
  }
  /* Stand-in art, so it must read as absent rather than as the set. */
  .pic img.noart {
    opacity: 0.35;
    padding: var(--ha-space-6, 24px);
  }
  .meta {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-3, 12px);
  }
  .name {
    display: block;
    font-size: var(--ha-font-size-m, 14px);
    font-weight: var(--ha-font-weight-bold, 700);
    line-height: var(--ha-line-height-condensed, 1.2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* An unannounced set has no name worth reading, so the number leads. */
  .name.unnamed {
    color: var(--lego-text-2);
    font-style: italic;
    font-weight: var(--ha-font-weight-normal, 400);
  }
  .num {
    align-items: center;
    color: var(--lego-text-2);
    display: flex;
    font-size: var(--ha-font-size-s, 12px);
    font-variant-numeric: tabular-nums;
    gap: 6px;
  }
  .num .key {
    box-shadow: none;
    height: 8px;
    width: 8px;
  }
  .when {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-s, 12px);
  }
  /* Not out yet: a dot in the primary colour, so the text keeps its contrast. */
  .when.due::before {
    background: var(--lego-primary);
    border-radius: 50%;
    content: "";
    display: inline-block;
    height: 8px;
    margin-right: var(--ha-space-1, 4px);
    vertical-align: middle;
    width: 8px;
  }
  .when.retiring {
    color: var(--lego-want);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .foot {
    align-items: center;
    display: flex;
    gap: var(--ha-space-2, 8px);
    margin-top: auto;
    padding-top: var(--ha-space-2, 8px);
  }
  .state {
    color: var(--lego-text-2);
    flex: 1;
    font-size: var(--ha-font-size-s, 12px);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .state.own {
    color: var(--lego-own);
  }
  /* A 48px target drawing a 32px circle, so the card does not look crowded. */
  .act {
    appearance: none;
    background: none;
    border: 0;
    color: var(--lego-text-2);
    cursor: pointer;
    display: grid;
    height: 48px;
    margin: calc(-1 * var(--ha-space-2, 8px));
    padding: 0;
    place-items: center;
    position: relative;
    width: 48px;
    --mdc-icon-size: 18px;
  }
  .act::before {
    border: var(--lego-line) solid var(--lego-text-2);
    border-radius: 50%;
    content: "";
    inset: var(--ha-space-2, 8px);
    position: absolute;
  }
  .act ha-icon {
    position: relative;
  }
  .act.on {
    color: var(--lego-on-own-fill);
  }
  .act.on::before {
    background: var(--lego-own-fill);
    border-color: var(--lego-own-fill);
  }
  .act.pending {
    cursor: progress;
    opacity: 0.5;
  }
  /* What a hold does, shown on hover: the native title tooltip is slow, and
     some browsers never show one at all. */
  .act::after {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--ha-border-radius-sm, 4px);
    bottom: calc(100% - var(--ha-space-1, 4px));
    color: var(--lego-text);
    content: attr(data-hint);
    font-size: var(--ha-font-size-s, 12px);
    max-width: calc(var(--lego-card-w) - var(--ha-space-6, 24px));
    opacity: 0;
    padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
    pointer-events: none;
    position: absolute;
    right: var(--ha-space-1, 4px);
    text-align: end;
    transition: opacity var(--ha-animation-duration-fast, 150ms);
    width: max-content;
  }
  @media (hover: hover) {
    .act:hover::after {
      opacity: 1;
      transition-delay: 400ms;
    }
  }
  /* The picture and the name can be held too, so neither selects nor opens a
     menu on a long press. */
  .pic,
  .name {
    -webkit-touch-callout: none;
    user-select: none;
  }
  /* Held, the ring inks in red over the half second that makes it a hold. */
  .act.holding::before {
    border-color: #b3121b;
  }
  @media (prefers-reduced-motion: no-preference) {
    .act.holding::before {
      animation: inking 500ms linear forwards;
    }
  }
  @keyframes inking {
    from {
      box-shadow: 0 0 0 0 #b3121b;
    }
    to {
      box-shadow: 0 0 0 3px #b3121b;
    }
  }
  /* A stamp a hold has just put there comes down onto the picture. */
  @media (prefers-reduced-motion: no-preference) {
    .stamp.landed {
      animation: land var(--ha-animation-duration-slow, 350ms) ease-in;
    }
  }
  @keyframes land {
    from {
      opacity: 0;
      transform: rotate(-9deg) scale(1.6);
    }
    70% {
      opacity: 1;
      transform: rotate(-9deg) scale(0.94);
    }
    to {
      transform: rotate(-9deg) scale(1);
    }
  }
  .act:focus-visible {
    outline-offset: calc(-1 * var(--ha-space-1, 4px));
  }
  a.open {
    color: inherit;
    display: block;
    min-width: 0;
    overflow: hidden;
    text-decoration: none;
  }
  a.open:hover .name {
    text-decoration: underline;
  }
  /* The rainbow of real bricks standing in for cards that are not there: the
     bricks take the whole width, which lego-bricks fills, and the hint sits below. */
  .filler {
    display: flex;
    min-height: 236px;
  }
  /* The bricks sit in a card like the sets beside them, open at the right edge, as
     if the row ran on past it. */
  .fillcard {
    background: var(--lego-surface);
    border: var(--lego-line) solid var(--lego-outline);
    border-radius: var(--lego-radius) 0 0 var(--lego-radius);
    border-right: 0;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--ha-space-4, 16px);
    justify-content: center;
    min-width: 0;
    padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
  }
  /* After a short row of cards, the room the cards leave; none once they fill it. */
  .carousel .tail {
    align-self: stretch;
    container-type: inline-size;
    flex: 1 1 0;
    min-height: auto;
    min-width: 0;
  }
  /* Too little room for any bricks, so not even a sliver of empty card. */
  @container (max-width: 56px) {
    .tail .fillcard {
      display: none;
    }
  }
  @container (max-width: 240px) {
    .tail .hint {
      display: none;
    }
  }
  .filler .hint {
    color: var(--lego-text-2);
    font-size: var(--ha-font-size-m, 14px);
    line-height: var(--ha-line-height-normal, 1.6);
    max-width: 420px;
  }
`;
