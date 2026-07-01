// Curated visual style presets ("temi alla Figma") + page contexts where a hero
// can live. Colors are OKLCH, chosen as small studied palettes with clear roles.

export type FontKind = "serif" | "sans" | "alt" | "mono";

export const FONT: Record<FontKind, string> = {
  serif: "var(--font-serif), Georgia, serif",
  sans: "var(--font-sans), system-ui, sans-serif",
  alt: "var(--font-display-alt), system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
};

// Real font stacks + Google Fonts specs for standalone HTML/CSS export.
export const FONT_STACK: Record<FontKind, string> = {
  serif: "'Spectral', Georgia, serif",
  sans: "'Hanken Grotesk', system-ui, sans-serif",
  alt: "'Archivo', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

export const GOOGLE_FONT: Record<FontKind, string> = {
  serif: "Spectral:ital,wght@0,400;0,600;0,800;1,400",
  sans: "Hanken+Grotesk:wght@400;500;700",
  alt: "Archivo:wght@600;800;900",
  mono: "JetBrains+Mono:wght@400;700",
};

export type ThemeColors = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
};

export type Theme = {
  id: string;
  name: string;
  blurb: string; // one-line design rationale (the "why")
  colors: ThemeColors;
  display: FontKind;
  body: FontKind;
  radius: number; // px
  borderWidth: number; // px
  shadow: string; // css box-shadow for cards/CTA
  uppercaseLabels: boolean;
  letterSpacing?: string;
  bgGradient?: string; // overrides flat bg when set
};

export const THEMES: Theme[] = [
  {
    id: "editoriale",
    name: "Editoriale",
    blurb: "Carta calda, serif elegante, un accento claret raro. Autorevole ma umano.",
    colors: {
      bg: "oklch(0.968 0.008 83)",
      surface: "oklch(0.995 0.004 83)",
      text: "oklch(0.24 0.02 55)",
      muted: "oklch(0.5 0.017 58)",
      accent: "oklch(0.47 0.14 24)",
      accentText: "oklch(0.98 0.01 83)",
      border: "oklch(0.88 0.01 74)",
    },
    display: "serif",
    body: "sans",
    radius: 8,
    borderWidth: 1,
    shadow: "0 1px 30px -14px oklch(0.24 0.02 55 / 0.5)",
    uppercaseLabels: true,
    letterSpacing: "0.22em",
  },
  {
    id: "brutalismo",
    name: "Neo-brutalismo",
    blurb: "Bordi neri spessi, ombre dure, giallo elettrico. Grezzo, diretto, senza scuse.",
    colors: {
      bg: "oklch(0.95 0.02 100)",
      surface: "oklch(1 0 0)",
      text: "oklch(0.14 0 0)",
      muted: "oklch(0.34 0 0)",
      accent: "oklch(0.82 0.19 95)",
      accentText: "oklch(0.14 0 0)",
      border: "oklch(0.12 0 0)",
    },
    display: "alt",
    body: "sans",
    radius: 0,
    borderWidth: 3,
    shadow: "6px 6px 0 oklch(0.12 0 0)",
    uppercaseLabels: true,
    letterSpacing: "0.02em",
  },
  {
    id: "svizzero",
    name: "Minimal svizzero",
    blurb: "Griglia, rosso segnale, tipografia stretta. Ordine e funzione, zero decorazione.",
    colors: {
      bg: "oklch(0.99 0 0)",
      surface: "oklch(1 0 0)",
      text: "oklch(0.12 0 0)",
      muted: "oklch(0.45 0 0)",
      accent: "oklch(0.55 0.22 27)",
      accentText: "oklch(1 0 0)",
      border: "oklch(0.84 0 0)",
    },
    display: "sans",
    body: "sans",
    radius: 0,
    borderWidth: 1,
    shadow: "none",
    uppercaseLabels: true,
    letterSpacing: "0.08em",
  },
  {
    id: "luxury",
    name: "Dark luxury",
    blurb: "Fondo notte, oro champagne, serif ad alto contrasto. Percezione di premium.",
    colors: {
      bg: "oklch(0.17 0.005 60)",
      surface: "oklch(0.21 0.006 60)",
      text: "oklch(0.95 0.01 85)",
      muted: "oklch(0.72 0.012 80)",
      accent: "oklch(0.8 0.11 85)",
      accentText: "oklch(0.17 0.01 60)",
      border: "oklch(0.32 0.008 60)",
    },
    display: "serif",
    body: "sans",
    radius: 6,
    borderWidth: 1,
    shadow: "0 20px 60px -30px oklch(0.8 0.11 85 / 0.4)",
    uppercaseLabels: true,
    letterSpacing: "0.28em",
  },
  {
    id: "vetro",
    name: "Vetro / soft tech",
    blurb: "Gradiente profondo, superfici traslucide, accento cyan. Tono prodotto tech moderno.",
    colors: {
      bg: "oklch(0.28 0.09 285)",
      surface: "oklch(0.98 0.02 285 / 0.1)",
      text: "oklch(0.98 0.01 285)",
      muted: "oklch(0.82 0.04 285)",
      accent: "oklch(0.78 0.14 200)",
      accentText: "oklch(0.2 0.05 285)",
      border: "oklch(1 0 0 / 0.16)",
    },
    display: "sans",
    body: "sans",
    radius: 18,
    borderWidth: 1,
    shadow: "0 24px 70px -30px oklch(0.5 0.2 280 / 0.7)",
    uppercaseLabels: false,
    bgGradient:
      "radial-gradient(120% 120% at 10% 0%, oklch(0.42 0.14 300) 0%, oklch(0.26 0.09 275) 55%, oklch(0.2 0.06 250) 100%)",
  },
  {
    id: "retro",
    name: "Retro-futurista",
    blurb: "Indaco profondo, cyan al neon, monospazio. Estetica terminale/Y2K.",
    colors: {
      bg: "oklch(0.16 0.03 295)",
      surface: "oklch(0.2 0.04 295)",
      text: "oklch(0.92 0.03 200)",
      muted: "oklch(0.7 0.05 250)",
      accent: "oklch(0.78 0.15 190)",
      accentText: "oklch(0.16 0.03 295)",
      border: "oklch(0.42 0.09 295)",
    },
    display: "mono",
    body: "mono",
    radius: 2,
    borderWidth: 1,
    shadow: "0 0 0 1px oklch(0.78 0.15 190 / 0.3), 0 18px 50px -30px oklch(0.78 0.15 190 / 0.5)",
    uppercaseLabels: true,
    letterSpacing: "0.14em",
  },
  {
    id: "organico",
    name: "Organico / naturale",
    blurb: "Salvia e terracotta, angoli morbidi, serif umanista. Caldo, sostenibile, calmo.",
    colors: {
      bg: "oklch(0.95 0.022 125)",
      surface: "oklch(0.985 0.015 125)",
      text: "oklch(0.3 0.03 145)",
      muted: "oklch(0.5 0.03 140)",
      accent: "oklch(0.56 0.11 45)",
      accentText: "oklch(0.98 0.01 90)",
      border: "oklch(0.85 0.025 125)",
    },
    display: "serif",
    body: "sans",
    radius: 22,
    borderWidth: 1,
    shadow: "0 16px 44px -28px oklch(0.4 0.06 130 / 0.6)",
    uppercaseLabels: false,
    letterSpacing: "0.14em",
  },
  {
    id: "pop",
    name: "Playful / pop",
    blurb: "Magenta acceso, angoli tondi, sans grassetto. Energico e amichevole per un pubblico giovane.",
    colors: {
      bg: "oklch(0.97 0.03 330)",
      surface: "oklch(1 0 0)",
      text: "oklch(0.2 0.02 320)",
      muted: "oklch(0.5 0.03 320)",
      accent: "oklch(0.64 0.23 350)",
      accentText: "oklch(1 0 0)",
      border: "oklch(0.2 0.02 320)",
    },
    display: "alt",
    body: "sans",
    radius: 24,
    borderWidth: 2,
    shadow: "0 10px 0 -2px oklch(0.64 0.23 350 / 0.25)",
    uppercaseLabels: false,
    letterSpacing: "0.04em",
  },
  {
    id: "saas",
    name: "Corporate SaaS",
    blurb: "Indaco pulito, grigi neutri, sans. Affidabile e leggibile per prodotti B2B.",
    colors: {
      bg: "oklch(0.98 0.005 255)",
      surface: "oklch(1 0 0)",
      text: "oklch(0.25 0.02 260)",
      muted: "oklch(0.55 0.02 260)",
      accent: "oklch(0.55 0.17 265)",
      accentText: "oklch(1 0 0)",
      border: "oklch(0.9 0.01 260)",
    },
    display: "sans",
    body: "sans",
    radius: 12,
    borderWidth: 1,
    shadow: "0 12px 34px -22px oklch(0.55 0.17 265 / 0.5)",
    uppercaseLabels: true,
    letterSpacing: "0.12em",
  },
];

export type ContextId =
  | "landing"
  | "admin"
  | "portfolio"
  | "ecommerce"
  | "art"
  | "dashboard";

export type PageContext = {
  id: ContextId;
  name: string;
  blurb: string; // where the hero sits + advice
};

export const CONTEXTS: PageContext[] = [
  {
    id: "landing",
    name: "Landing marketing",
    blurb:
      "Hero a tutta larghezza subito sotto la nav. Headline + subheadline + una sola CTA primaria. È il primo schermo: massimo impatto, zero distrazioni.",
  },
  {
    id: "admin",
    name: "Portale admin",
    blurb:
      "Hero come banner di benvenuto nell'area contenuti, accanto alla sidebar. Tienilo compatto: l'utente è qui per lavorare, non per essere convinto.",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    blurb:
      "Hero editoriale grande sopra la griglia dei lavori. La headline racconta chi sei; la CTA porta ai progetti o al contatto.",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    blurb:
      "Hero banner promozionale sopra i prodotti in evidenza. Punta su offerta/beneficio e una CTA d'acquisto forte.",
  },
  {
    id: "art",
    name: "Designer / Art",
    blurb:
      "Hero immersivo a tutto schermo, nav minima. Il testo è pochissimo e potente: lascia respirare l'immagine e la parola.",
  },
  {
    id: "dashboard",
    name: "App / Dashboard",
    blurb:
      "Hero come empty-state o card di onboarding dentro l'app. Copy che spiega il primo passo e invita all'azione principale.",
  },
];

export const getTheme = (id: string) =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];
export const getContext = (id: string) =>
  CONTEXTS.find((c) => c.id === id) ?? CONTEXTS[0];

// Color-study roles shown to the user (learning the "why" of each swatch).
export const PALETTE_ROLES: { key: keyof ThemeColors; label: string }[] = [
  { key: "bg", label: "Sfondo" },
  { key: "surface", label: "Superficie" },
  { key: "text", label: "Testo" },
  { key: "muted", label: "Testo tenue" },
  { key: "accent", label: "Accento" },
  { key: "border", label: "Bordo" },
];
