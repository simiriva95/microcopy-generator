"use client";

import { useState } from "react";
import type { Variant } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  Copy,
  ChevronDown,
  RefreshCw,
  Star,
  GitCompareArrows,
} from "lucide-react";

function scoreTone(score: number) {
  if (score >= 8) return { label: "ottima", cls: "text-success" };
  if (score >= 5) return { label: "buona", cls: "text-primary" };
  return { label: "da rivedere", cls: "text-destructive" };
}

export function VariantCard({
  variant,
  index,
  selected,
  onToggleSelect,
  favorite,
  onToggleFavorite,
  onRegenerate,
  regenerating,
}: {
  variant: Variant;
  index: number;
  selected: boolean;
  onToggleSelect: (v: Variant, checked: boolean) => void;
  favorite: boolean;
  onToggleFavorite: (v: Variant) => void;
  onRegenerate: (v: Variant) => void;
  regenerating: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const score = scoreTone(variant.punteggio_chiarezza_1_10);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(variant.testo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard non disponibile */
    }
  };

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className={`animate-rise group relative flex flex-col rounded-lg border bg-card p-5 transition-shadow hover:shadow-[0_1px_20px_-8px_var(--foreground)] ${
        selected ? "border-primary" : "border-border"
      }`}
    >
      {/* top row: letter mark + actions */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-serif text-sm font-semibold text-primary">
          Variante {variant.variante}
        </span>
        <div className="flex items-center gap-0.5 text-muted-foreground">
          <IconBtn
            label={favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            onClick={() => onToggleFavorite(variant)}
            active={favorite}
          >
            <Star className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : ""}`} />
          </IconBtn>
          <IconBtn
            label={selected ? "Togli dal confronto" : "Aggiungi al confronto A/B"}
            onClick={() => onToggleSelect(variant, !selected)}
            active={selected}
          >
            <GitCompareArrows className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Rigenera questa variante"
            onClick={() => onRegenerate(variant)}
            disabled={regenerating}
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          </IconBtn>
        </div>
      </div>

      {/* the copy itself — the hero of the card */}
      <p className="font-serif text-xl leading-snug text-pretty">
        {variant.testo}
      </p>

      {/* metrics */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground tabular">
        <span>
          <strong className="font-semibold text-foreground">
            {variant.lunghezza_caratteri}
          </strong>{" "}
          caratteri
        </span>
        <span>
          Chiarezza{" "}
          <strong className={`font-semibold ${score.cls}`}>
            {variant.punteggio_chiarezza_1_10}/10
          </strong>{" "}
          <span className="opacity-70">· {score.label}</span>
        </span>
      </div>

      <Badge
        variant="secondary"
        className="mt-3 max-w-full whitespace-normal text-left font-normal normal-case first-letter:uppercase"
      >
        {variant.principio_psicologico}
      </Badge>

      {/* footer: copy + razionale */}
      <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" /> Copiato
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copia
            </>
          )}
        </button>

        <Collapsible open={open} onOpenChange={setOpen} className="ml-auto">
          <CollapsibleTrigger className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            Perché funziona
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            {variant.razionale_ux}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </article>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 ${
          active ? "text-primary" : ""
        }`}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
