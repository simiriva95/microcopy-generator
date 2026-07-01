"use client";

import type { GenerateInput, Variant, HeroVariant } from "@/lib/schema";
import { Star, History, RotateCcw } from "lucide-react";

export type HistoryEntry = {
  id: string;
  input: GenerateInput;
  full: boolean;
  variants: Variant[];
  heroes: HeroVariant[];
  ts: number;
  fav: boolean;
};

export function HistoryPanel({
  entries,
  activeId,
  onRestore,
  onToggleFav,
}: {
  entries: HistoryEntry[];
  activeId: string | null;
  onRestore: (e: HistoryEntry) => void;
  onToggleFav: (id: string) => void;
}) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort(
    (a, b) => Number(b.fav) - Number(a.fav) || b.ts - a.ts
  );

  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <History className="h-3.5 w-3.5" /> Cronologia sessione
      </div>
      <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
        {sorted.map((e) => (
          <li key={e.id}>
            <div
              className={`group flex items-center gap-2 rounded-md px-2 py-2 text-left transition-colors ${
                e.id === activeId ? "bg-accent" : "hover:bg-secondary"
              }`}
            >
              <button
                onClick={() => onToggleFav(e.id)}
                aria-label={e.fav ? "Rimuovi dai preferiti" : "Preferito"}
                className="shrink-0 text-muted-foreground hover:text-primary"
              >
                <Star className={`h-3.5 w-3.5 ${e.fav ? "fill-primary text-primary" : ""}`} />
              </button>
              <button
                onClick={() => onRestore(e)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-[0.8rem] font-medium">
                  {e.input.descrizione || "—"}
                </p>
                <p className="truncate text-[0.7rem] text-muted-foreground capitalize">
                  {e.full ? "hero completa" : e.input.sezione} · {e.input.tono}
                </p>
              </button>
              <RotateCcw className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
