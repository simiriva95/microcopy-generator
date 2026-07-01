"use client";

import type { Variant } from "@/lib/schema";

// Side-by-side comparison of two selected variants with their metrics.
export function ABCompare({ a, b }: { a: Variant; b: Variant }) {
  return (
    <div className="animate-rise rounded-xl border bg-card p-5">
      <h3 className="mb-4 font-serif text-lg font-semibold">Confronto A/B</h3>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
        {[a, b].map((v, i) => (
          <div key={i} className="space-y-3 bg-card p-4">
            <span className="font-serif text-sm font-semibold text-primary">
              Variante {v.variante}
            </span>
            <p className="font-serif text-lg leading-snug text-pretty">{v.testo}</p>
            <dl className="space-y-1.5 text-xs tabular">
              <Row label="Principio" value={v.principio_psicologico} />
              <Row label="Caratteri" value={String(v.lunghezza_caratteri)} />
              <Row
                label="Chiarezza"
                value={`${v.punteggio_chiarezza_1_10}/10`}
              />
            </dl>
            <p className="border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground text-pretty">
              {v.razionale_ux}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium capitalize">{value}</dd>
    </div>
  );
}
