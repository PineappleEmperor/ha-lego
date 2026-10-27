import {
  html,
  nothing,
  svg,
  type SVGTemplateResult,
  type TemplateResult,
} from "lit";

/** An SVG element as data, written by scripts/generate_brand.py. */
export interface SvgNode {
  tag: string;
  attrs: Record<string, string>;
  children?: SvgNode[];
}

/**
 * Draw a generated drawing through ordinary attribute bindings, which Lit escapes,
 * rather than as markup. Only the tags the generator writes are drawn; anything
 * else is dropped, so the data cannot smuggle in a script or a foreign object.
 */
export function drawSvg(root: SvgNode): TemplateResult {
  return html`<svg
    viewBox=${root.attrs.viewBox ?? nothing}
    aria-hidden="true"
    focusable="false"
  >
    ${(root.children ?? []).map(drawNode)}
  </svg>`;
}

function drawNode(node: SvgNode): SVGTemplateResult | typeof nothing {
  const a = (key: string) => node.attrs[key] ?? nothing;
  const kids = () => (node.children ?? []).map(drawNode);
  switch (node.tag) {
    case "g":
      return svg`<g transform=${a("transform")} fill=${a("fill")} stroke=${a("stroke")}
        stroke-width=${a("stroke-width")} stroke-linecap=${a("stroke-linecap")}
        stroke-linejoin=${a("stroke-linejoin")} style=${a("style")}>${kids()}</g>`;
    case "polygon":
      return svg`<polygon points=${a("points")} fill=${a("fill")} stroke=${a("stroke")}
        stroke-width=${a("stroke-width")} stroke-linejoin=${a("stroke-linejoin")}
        style=${a("style")}></polygon>`;
    case "path":
      return svg`<path d=${a("d")} fill=${a("fill")} stroke=${a("stroke")}
        stroke-width=${a("stroke-width")} stroke-linecap=${a("stroke-linecap")}
        stroke-linejoin=${a("stroke-linejoin")} style=${a("style")}></path>`;
    case "ellipse":
      return svg`<ellipse cx=${a("cx")} cy=${a("cy")} rx=${a("rx")} ry=${a("ry")}
        fill=${a("fill")} style=${a("style")}></ellipse>`;
    case "circle":
      return svg`<circle cx=${a("cx")} cy=${a("cy")} r=${a("r")} fill=${a("fill")}
        style=${a("style")}></circle>`;
    case "line":
      return svg`<line x1=${a("x1")} y1=${a("y1")} x2=${a("x2")} y2=${a("y2")}
        stroke=${a("stroke")} stroke-width=${a("stroke-width")}
        style=${a("style")}></line>`;
    default:
      return nothing;
  }
}
