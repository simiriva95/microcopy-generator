"use client";

import { toast } from "sonner";
import { PALETTE_ROLES, type Theme } from "@/lib/design-presets";

// The "studio del colore": each swatch with its role, click to copy the value.
export function PalettePanel({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {PALETTE_ROLES.map(({ key, label }) => {
          const value = theme.colors[key];
          return (
            <button
              key={key}
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success(`${label} copiato`, { description: value });
              }}
              className="group flex items-center gap-2 text-left"
              title={`Copia ${value}`}
            >
              <span
                className="h-7 w-7 shrink-0 rounded-md border border-border"
                style={{ background: value }}
              />
              <span className="text-xs">
                <span className="block font-medium">{label}</span>
                <span className="block text-[0.65rem] text-muted-foreground transition-colors group-hover:text-foreground">
                  copia
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground text-pretty">
        {theme.blurb}
      </p>
    </div>
  );
}
