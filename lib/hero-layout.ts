import {
  FONT_STACK,
  GOOGLE_FONT,
  type Theme,
  type FontKind,
} from "./design-presets";
import type { HeroVariant, GenerateInput } from "./schema";

// --- Editable layout model (session-only; export is how you "save") ---

export type BlockType =
  | "eyebrow"
  | "headline"
  | "subheadline"
  | "valueprop"
  | "cta"
  | "social";

export type Block = {
  id: BlockType;
  label: string;
  tag: "p" | "h1" | "h2" | "a" | "div";
  cls: string; // export CSS class
  text: string;
  visible: boolean;
  fontKind: FontKind;
  fontSize: number; // rem
  weight: number;
  align: "left" | "center" | "right";
  color: string; // css color
  marginTop: number; // rem
  // cta / shape extras
  bg?: string;
  radius?: number; // px
  padX?: number; // rem
  padY?: number; // rem
};

export type HeroLayout = {
  align: "left" | "center";
  maxWidth: number; // ch for the text column
  bg: string;
  padX: number; // rem
  padY: number; // rem
  blocks: Block[];
};

// Build a fresh editable layout from a generated hero + a visual theme.
export function seedLayout(hero: HeroVariant, theme: Theme): HeroLayout {
  const c = theme.colors;
  const blocks: Block[] = [
    {
      id: "eyebrow",
      label: "Eyebrow",
      tag: "p",
      cls: "hero__eyebrow",
      text: "Il tuo brand",
      visible: true,
      fontKind: theme.body,
      fontSize: 0.78,
      weight: 700,
      align: "left",
      color: c.accent,
      marginTop: 0,
    },
    {
      id: "headline",
      label: "Headline",
      tag: "h1",
      cls: "hero__headline",
      text: hero.headline,
      visible: true,
      fontKind: theme.display,
      fontSize: 3.2,
      weight: 800,
      align: "left",
      color: c.text,
      marginTop: 1.1,
    },
    {
      id: "subheadline",
      label: "Subheadline",
      tag: "p",
      cls: "hero__sub",
      text: hero.subheadline,
      visible: !!hero.subheadline,
      fontKind: theme.body,
      fontSize: 1.2,
      weight: 400,
      align: "left",
      color: c.muted,
      marginTop: 1.1,
    },
    {
      id: "valueprop",
      label: "Value proposition",
      tag: "p",
      cls: "hero__value",
      text: hero.value_proposition,
      visible: false,
      fontKind: theme.body,
      fontSize: 1.05,
      weight: 500,
      align: "left",
      color: c.text,
      marginTop: 1,
    },
    {
      id: "cta",
      label: "CTA",
      tag: "a",
      cls: "hero__cta",
      text: hero.cta,
      visible: !!hero.cta,
      fontKind: theme.body,
      fontSize: 1,
      weight: 700,
      align: "left",
      color: c.accentText,
      marginTop: 2,
      bg: c.accent,
      radius: theme.radius,
      padX: 1.8,
      padY: 0.9,
    },
    {
      id: "social",
      label: "Social proof",
      tag: "div",
      cls: "hero__proof",
      text: hero.social_proof,
      visible: !!hero.social_proof,
      fontKind: theme.body,
      fontSize: 0.9,
      weight: 500,
      align: "left",
      color: c.muted,
      marginTop: 2,
    },
  ];
  return {
    align: "left",
    maxWidth: 46,
    bg: theme.bgGradient ?? c.bg,
    padX: 3,
    padY: 4.5,
    blocks,
  };
}

// --- Export: HTML + CSS + Markdown spec ---

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function usedFonts(layout: HeroLayout): FontKind[] {
  return Array.from(new Set(layout.blocks.filter((b) => b.visible).map((b) => b.fontKind)));
}

export function buildCss(layout: HeroLayout, theme: Theme): string {
  const lines: string[] = [];
  lines.push(
    `.hero{background:${layout.bg};padding:${layout.padY}rem ${layout.padX}rem;text-align:${layout.align};}`,
    `.hero__inner{max-width:${layout.maxWidth}ch;${layout.align === "center" ? "margin:0 auto;" : ""}}`
  );
  for (const b of layout.blocks) {
    if (!b.visible) continue;
    const rules = [
      `font-family:${FONT_STACK[b.fontKind]}`,
      `font-size:${b.fontSize}rem`,
      `font-weight:${b.weight}`,
      `text-align:${b.align}`,
      `color:${b.color}`,
      `margin-top:${b.marginTop}rem`,
      b.id === "headline" ? "line-height:1.05;letter-spacing:-0.02em" : "line-height:1.5",
    ];
    if (b.id === "cta") {
      rules.push(
        "display:inline-block",
        "text-decoration:none",
        `background:${b.bg}`,
        `border-radius:${b.radius}px`,
        `padding:${b.padY}rem ${b.padX}rem`
      );
    }
    lines.push(`.${b.cls}{${rules.join(";")};}`);
  }
  lines.push(
    `.hero__proof{display:flex;align-items:center;gap:.7rem;}`,
    `.hero__proof .avatars{display:flex;}`,
    `.hero__proof .avatars span{width:30px;height:30px;border-radius:999px;background:${theme.colors.accent};border:2px solid ${theme.colors.surface};margin-left:-8px;}`,
    `.hero__proof .avatars span:first-child{margin-left:0;}`
  );
  return lines.join("\n");
}

export function buildHtml(layout: HeroLayout, theme: Theme, standalone = true): string {
  const inner = layout.blocks
    .filter((b) => b.visible)
    .map((b) => {
      if (b.id === "cta") return `    <a class="${b.cls}" href="#">${esc(b.text)}</a>`;
      if (b.id === "social")
        return `    <div class="${b.cls}"><div class="avatars"><span></span><span></span><span></span><span></span></div><span>${esc(b.text)}</span></div>`;
      return `    <${b.tag} class="${b.cls}">${esc(b.text)}</${b.tag}>`;
    })
    .join("\n");
  const section = `<section class="hero">\n  <div class="hero__inner">\n${inner}\n  </div>\n</section>`;
  if (!standalone) return section;

  const fonts = usedFonts(layout)
    .map((k) => `family=${GOOGLE_FONT[k]}`)
    .join("&");
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hero — ${theme.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet" />
<style>
*{margin:0;box-sizing:border-box;}
body{background:${theme.colors.bg};}
${buildCss(layout, theme)}
</style>
</head>
<body>
${section}
</body>
</html>`;
}

// Markdown spec designed to be fed to another AI to rebuild the hero.
export function buildMd(
  layout: HeroLayout,
  theme: Theme,
  input: GenerateInput
): string {
  const rows = layout.blocks
    .filter((b) => b.visible)
    .map(
      (b, i) =>
        `${i + 1}. **${b.label}** — "${b.text}"\n   - font: ${b.fontKind}, ${b.fontSize}rem / peso ${b.weight}, allineamento ${b.align}, colore \`${b.color}\`, margine-sopra ${b.marginTop}rem${
          b.id === "cta" ? `, sfondo \`${b.bg}\`, radius ${b.radius}px, padding ${b.padY}rem ${b.padX}rem` : ""
        }`
    )
    .join("\n");
  const c = theme.colors;
  return `# Hero spec — stile "${theme.name}"

Spec pronta per un'AI: ricrea questa hero section fedelmente.

## Contesto
- Prodotto: ${input.descrizione}
- Target: ${input.target}
- Tono: ${input.tono} · Obiettivo: ${input.obiettivo}

## Palette (OKLCH)
- Sfondo: \`${c.bg}\`
- Superficie: \`${c.surface}\`
- Testo: \`${c.text}\` · Tenue: \`${c.muted}\`
- Accento: \`${c.accent}\` (testo su accento: \`${c.accentText}\`)
- Bordo: \`${c.border}\`

## Tipografia
- Display: ${theme.display} · Body: ${theme.body}

## Layout
- Allineamento: ${layout.align} · Colonna testo max ${layout.maxWidth}ch
- Padding hero: ${layout.padY}rem (verticale) / ${layout.padX}rem (orizzontale)
- Sfondo hero: \`${layout.bg}\`

## Struttura (in ordine)
${rows}

## Note
${theme.blurb}
`;
}
