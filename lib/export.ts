import type { Variant, GenerateInput, HeroVariant } from "./schema";
import type { Theme, FontKind } from "./design-presets";

const FONT_STACK: Record<FontKind, string> = {
  serif: "'Spectral', Georgia, serif",
  sans: "'Hanken Grotesk', system-ui, sans-serif",
  alt: "'Archivo', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

const GOOGLE_FONT: Record<FontKind, string> = {
  serif: "Spectral:wght@400;600;800",
  sans: "Hanken+Grotesk:wght@400;500;700",
  alt: "Archivo:wght@600;800;900",
  mono: "JetBrains+Mono:wght@400;700",
};

// A self-contained, dev-ready hero snippet in the chosen visual style.
export function heroToHtml(theme: Theme, hero: HeroVariant): string {
  const c = theme.colors;
  const disp = FONT_STACK[theme.display];
  const body = FONT_STACK[theme.body];
  const fonts = Array.from(new Set([theme.display, theme.body]))
    .map((k) => `family=${GOOGLE_FONT[k]}`)
    .join("&");
  const bg = theme.bgGradient ?? c.bg;
  const brutal = theme.id === "brutalismo";

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hero — ${theme.name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  body { background: ${bg}; color: ${c.text}; font-family: ${body}; }
  .hero { max-width: 1100px; margin: 0 auto; padding: clamp(3rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); }
  .eyebrow { color: ${c.accent}; font-weight: 700; font-size: .78rem; letter-spacing: ${theme.letterSpacing ?? "0.05em"}; text-transform: ${theme.uppercaseLabels ? "uppercase" : "none"}; margin-bottom: 1.25rem; }
  .headline { font-family: ${disp}; font-weight: 800; line-height: 1.04; letter-spacing: -0.02em; font-size: clamp(2.2rem, 6vw, 4rem); max-width: 18ch; }
  .sub { color: ${c.muted}; font-size: clamp(1.05rem, 2.2vw, 1.3rem); line-height: 1.5; max-width: 46ch; margin-top: 1.25rem; }
  .cta { display: inline-block; margin-top: 2.25rem; background: ${c.accent}; color: ${c.accentText}; font-family: ${body}; font-weight: 700; text-decoration: none; padding: .95rem 1.8rem; border-radius: ${theme.radius}px; ${brutal ? `border: ${theme.borderWidth}px solid ${c.border}; box-shadow: ${theme.shadow};` : ""} }
  .proof { display: flex; align-items: center; gap: .7rem; margin-top: 2rem; color: ${c.muted}; font-size: .9rem; }
  .proof .avatars { display: flex; }
  .proof .avatars span { width: 30px; height: 30px; border-radius: 999px; background: ${c.accent}; border: 2px solid ${c.surface}; margin-left: -8px; }
  .proof .avatars span:first-child { margin-left: 0; }
</style>
</head>
<body>
  <section class="hero">
    <p class="eyebrow">Il tuo brand</p>
    <h1 class="headline">${esc(hero.headline)}</h1>
    ${hero.subheadline ? `<p class="sub">${esc(hero.subheadline)}</p>` : ""}
    ${hero.cta ? `<a class="cta" href="#">${esc(hero.cta)}</a>` : ""}
    ${
      hero.social_proof
        ? `<div class="proof"><div class="avatars"><span></span><span></span><span></span><span></span></div><span>${esc(hero.social_proof)}</span></div>`
        : ""
    }
  </section>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function heroToMarkdown(input: GenerateInput, heroes: HeroVariant[]): string {
  const head = `# Hero completa\n\n- **Prodotto:** ${input.descrizione}\n- **Target:** ${input.target}\n- **Tono:** ${input.tono}\n- **Obiettivo:** ${input.obiettivo}\n`;
  const body = heroes
    .map(
      (h) =>
        `\n## Variante ${h.variante} — ${h.principio_psicologico}\n\n- **Headline:** ${h.headline}\n- **Subheadline:** ${h.subheadline}\n- **CTA:** ${h.cta}\n- **Value proposition:** ${h.value_proposition}\n- **Social proof:** ${h.social_proof}\n- **Razionale:** ${h.razionale_ux}`
    )
    .join("\n");
  return head + body + "\n";
}

export function toMarkdown(input: GenerateInput, variants: Variant[]): string {
  const head = `# Microcopy — ${input.sezione}\n\n- **Prodotto:** ${input.descrizione}\n- **Target:** ${input.target}\n- **Tono:** ${input.tono}\n- **Obiettivo:** ${input.obiettivo}\n`;
  const body = variants
    .map(
      (v) =>
        `\n## Variante ${v.variante}\n\n> ${v.testo}\n\n- **Principio:** ${v.principio_psicologico}\n- **Caratteri:** ${v.lunghezza_caratteri}\n- **Chiarezza:** ${v.punteggio_chiarezza_1_10}/10\n- **Razionale:** ${v.razionale_ux}`
    )
    .join("\n");
  return head + body + "\n";
}

export function toCSV(variants: Variant[]): string {
  const esc = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
  const header = [
    "variante",
    "testo",
    "principio_psicologico",
    "lunghezza_caratteri",
    "punteggio_chiarezza_1_10",
    "razionale_ux",
  ].join(",");
  const rows = variants.map((v) =>
    [
      v.variante,
      v.testo,
      v.principio_psicologico,
      v.lunghezza_caratteri,
      v.punteggio_chiarezza_1_10,
      v.razionale_ux,
    ]
      .map(esc)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function toPlainText(variants: Variant[]): string {
  return variants.map((v) => `${v.variante}. ${v.testo}`).join("\n");
}

// Client-only file download via Blob. No server round-trip, no storage.
export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
