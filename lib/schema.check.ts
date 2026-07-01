// Runnable self-check for parseVariants. Run: npx tsx lib/schema.check.ts
import assert from "node:assert";
import { parseVariants } from "./schema";

// 1. Clean JSON with { varianti: [...] }
const clean = parseVariants(
  JSON.stringify({
    varianti: [
      {
        variante: "A",
        testo: "Inizia gratis",
        razionale_ux: "Verbo d'azione + gratuità riduce l'attrito.",
        principio_psicologico: "riduzione attrito",
        lunghezza_caratteri: 999, // wrong on purpose, must be recomputed
        punteggio_chiarezza_1_10: 9,
      },
    ],
  })
);
assert.equal(clean.length, 1, "clean: 1 variante");
assert.equal(clean[0].lunghezza_caratteri, "Inizia gratis".length, "char count recomputed");

// 2. JSON wrapped in prose (fallback balanced-brace scan)
const prose = parseVariants(
  'Ecco le varianti:\n{"varianti":[{"testo":"Scopri di più","razionale_ux":"x","principio_psicologico":"curiosity gap","punteggio_chiarezza_1_10":7}]}\nSpero siano utili!'
);
assert.equal(prose.length, 1, "prose-wrapped parsed");
assert.equal(prose[0].variante, "A", "variante defaulted to A");

// 3. Bare array
const arr = parseVariants('[{"testo":"Prova ora"},{"testo":"Attiva subito"}]');
assert.equal(arr.length, 2, "bare array parsed");
assert.equal(arr[1].variante, "B", "index -> letter");

// 4. Garbage -> []
assert.equal(parseVariants("non è json qui").length, 0, "garbage -> empty");
assert.equal(parseVariants("").length, 0, "empty -> empty");

// 5. Malformed items dropped (no testo)
const mixed = parseVariants('{"varianti":[{"testo":""},{"testo":"Valido"}]}');
assert.equal(mixed.length, 1, "empty-testo dropped");

// 6. Score clamped
const clamp = parseVariants('[{"testo":"x","punteggio_chiarezza_1_10":50}]');
assert.equal(clamp[0].punteggio_chiarezza_1_10, 10, "score clamped to 10");

console.log("✓ parseVariants: all checks passed");
