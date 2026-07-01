// Runnable check for the export serializers. Run: npx tsx lib/hero-layout.check.ts
import assert from "node:assert";
import { getTheme } from "./design-presets";
import { seedLayout, buildHtml, buildCss, buildMd } from "./hero-layout";
import type { HeroVariant, GenerateInput } from "./schema";

const hero: HeroVariant = {
  variante: "A",
  headline: "Organizza <con> facilità",
  subheadline: "Sub di prova",
  cta: "Inizia ora",
  value_proposition: "Valore di prova",
  social_proof: "1.000 clienti",
  razionale_ux: "x",
  principio_psicologico: "chiarezza",
};
const input: GenerateInput = {
  descrizione: "App test",
  target: "Tutti",
  tono: "audace",
  obiettivo: "acquisto",
  sezione: "hero headline",
};

const theme = getTheme("brutalismo");
const layout = seedLayout(hero, theme);

const html = buildHtml(layout, theme);
assert.ok(html.includes("<!doctype html>"), "standalone html doc");
assert.ok(html.includes("Organizza &lt;con&gt; facilità"), "html escapes < >");
assert.ok(html.includes('class="hero__cta"'), "cta rendered");
assert.ok(html.includes("fonts.googleapis.com"), "google fonts linked");
// hidden block (valueprop is visible:false by seed) must NOT appear
assert.ok(!html.includes("hero__value"), "hidden block excluded");

const css = buildCss(layout, theme);
assert.ok(css.includes(".hero__headline{"), "headline css rule");
assert.ok(css.includes(theme.colors.accent), "accent color present");

const md = buildMd(layout, theme, input);
assert.ok(md.includes("# Hero spec"), "md title");
assert.ok(md.includes("Organizza <con> facilità"), "md keeps raw text");
assert.ok(md.includes("Palette"), "md palette section");

// toggling visibility flows into export
layout.blocks.find((b) => b.id === "valueprop")!.visible = true;
assert.ok(buildHtml(layout, theme).includes("hero__value"), "shown block included");

console.log("✓ hero-layout export: all checks passed");
