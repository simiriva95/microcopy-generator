export type Variant = {
  variante: string; // "A" | "B" | "C" | "D"
  testo: string;
  razionale_ux: string;
  principio_psicologico: string;
  lunghezza_caratteri: number;
  punteggio_chiarezza_1_10: number;
};

export const TONI = ["autorevole", "amichevole", "audace", "minimale"] as const;
export const OBIETTIVI = ["iscrizione", "acquisto", "download", "contatto"] as const;
export const SEZIONI = [
  "hero headline",
  "subheadline",
  "CTA button",
  "value proposition",
  "social proof",
] as const;

export type Tono = (typeof TONI)[number];
export type Obiettivo = (typeof OBIETTIVI)[number];
export type Sezione = (typeof SEZIONI)[number];

export type GenerateInput = {
  descrizione: string;
  target: string;
  tono: Tono;
  obiettivo: Obiettivo;
  sezione: Sezione;
};

// Extra options for the /api/generate endpoint (refine + regenerate flows).
export type GenerateOptions = {
  count?: number; // how many variants (1-4, default 4)
  raffina?: string; // extra directive, e.g. "più corte", "più incisive"
  evita?: string[]; // existing texts the model should NOT repeat
};

// "Hero completa" mode: every section generated together as cohesive variants.
export type HeroVariant = {
  variante: string;
  headline: string;
  subheadline: string;
  cta: string;
  value_proposition: string;
  social_proof: string;
  razionale_ux: string;
  principio_psicologico: string;
};

export const HERO_PARTS = [
  { key: "headline", label: "Headline" },
  { key: "subheadline", label: "Subheadline" },
  { key: "cta", label: "CTA" },
  { key: "value_proposition", label: "Value proposition" },
  { key: "social_proof", label: "Social proof" },
] as const;

export const SEZIONE_TUTTE = "hero completa (tutte)";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Extract first balanced {...} or [...] block from a string that may wrap JSON in prose.
function extractJsonBlock(raw: string): string | null {
  const start = raw.search(/[{[]/);
  if (start === -1) return null;
  const open = raw[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return raw.slice(start, i + 1);
    }
  }
  return null;
}

function coerceVariant(v: unknown, index: number): Variant | null {
  if (!isRecord(v)) return null;
  const testo = typeof v.testo === "string" ? v.testo.trim() : "";
  if (!testo) return null; // no text = useless, drop it
  const razionale =
    typeof v.razionale_ux === "string" ? v.razionale_ux.trim() : "";
  // Keep the principle a short label even if the model returns a full sentence:
  // take the clause before the first comma/period, cap length.
  const principioRaw =
    typeof v.principio_psicologico === "string"
      ? v.principio_psicologico.trim()
      : "";
  const principio =
    (principioRaw.split(/[,.;:]/)[0] || principioRaw).slice(0, 40).trim() ||
    "n/d";
  const rawScore = Number(v.punteggio_chiarezza_1_10);
  const score = Number.isFinite(rawScore)
    ? Math.min(10, Math.max(1, Math.round(rawScore)))
    : 5;
  return {
    // Always derive the label from position so letters are unique (A, B, C, D),
    // regardless of what the model returned. Keeps React keys + selection safe.
    variante: String.fromCharCode(65 + index),
    testo,
    razionale_ux: razionale || "Nessun razionale fornito.",
    principio_psicologico: principio,
    lunghezza_caratteri: testo.length, // recomputed server-side, don't trust model
    punteggio_chiarezza_1_10: score,
  };
}

/**
 * Robust parse: accepts a raw model string (JSON mode output or prose-wrapped).
 * Looks for { varianti: [...] }, a bare array, or a single object. Returns [] on failure.
 */
export function parseVariants(raw: string): Variant[] {
  const attempt = (s: string): unknown => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };

  let data: unknown = attempt(raw);
  if (data === undefined) {
    const block = extractJsonBlock(raw);
    if (block) data = attempt(block);
  }
  if (data === undefined) return [];

  let list: unknown[];
  if (Array.isArray(data)) list = data;
  else if (isRecord(data) && Array.isArray(data.varianti)) list = data.varianti;
  else if (isRecord(data)) list = [data];
  else return [];

  return list
    .map((v, i) => coerceVariant(v, i))
    .filter((v): v is Variant => v !== null);
}

// --- Hero completa parsing ---

function shortLabel(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  return (s.split(/[,.;:]/)[0] || s).slice(0, 40).trim() || "n/d";
}

function coerceHero(v: unknown, index: number): HeroVariant | null {
  if (!isRecord(v)) return null;
  const str = (k: string) => (typeof v[k] === "string" ? (v[k] as string).trim() : "");
  const headline = str("headline") || str("hero_headline") || str("titolo");
  if (!headline) return null; // a hero without a headline is useless
  return {
    variante: String.fromCharCode(65 + index),
    headline,
    subheadline: str("subheadline") || str("sottotitolo"),
    cta: str("cta") || str("cta_button") || str("call_to_action"),
    value_proposition: str("value_proposition") || str("valore"),
    social_proof: str("social_proof") || str("riprova_sociale"),
    razionale_ux: str("razionale_ux") || "Nessun razionale fornito.",
    principio_psicologico: shortLabel(v.principio_psicologico),
  };
}

/** Robust parse for "hero completa" mode. Returns [] on failure. */
export function parseHeroes(raw: string): HeroVariant[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    const block = extractJsonBlock(raw);
    if (!block) return [];
    try {
      data = JSON.parse(block);
    } catch {
      return [];
    }
  }
  let list: unknown[];
  if (Array.isArray(data)) list = data;
  else if (isRecord(data) && Array.isArray(data.varianti)) list = data.varianti;
  else if (isRecord(data) && Array.isArray(data.heroes)) list = data.heroes;
  else if (isRecord(data)) list = [data];
  else return [];

  return list
    .map((v, i) => coerceHero(v, i))
    .filter((v): v is HeroVariant => v !== null);
}
