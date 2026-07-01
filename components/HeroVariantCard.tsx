"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HERO_PARTS, type HeroVariant } from "@/lib/schema";
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
import { Check, Copy, ChevronDown, RefreshCw, Star, Lightbulb } from "lucide-react";

export function HeroVariantCard({
  hero,
  index,
  active,
  onActivate,
  favorite,
  onToggleFavorite,
  onRegenerate,
  regenerating,
}: {
  hero: HeroVariant;
  index: number;
  active: boolean;
  onActivate: () => void;
  favorite: boolean;
  onToggleFavorite: () => void;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const [open, setOpen] = useState(false);

  const copyAll = () => {
    const text = HERO_PARTS.map(
      (p) => `${p.label}: ${hero[p.key]}`
    ).join("\n");
    navigator.clipboard.writeText(text);
    toast.success(`Hero ${hero.variante} copiata`);
  };

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onActivate}
      className={`animate-rise group flex cursor-pointer flex-col rounded-lg border bg-card p-5 transition-shadow hover:shadow-[0_1px_20px_-8px_var(--foreground)] ${
        active ? "border-primary" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold text-primary">
            Hero {hero.variante}
          </span>
          {active && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary">
              in anteprima
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          <IconBtn label={favorite ? "Rimuovi dai preferiti" : "Preferito"} onClick={onToggleFavorite} active={favorite}>
            <Star className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : ""}`} />
          </IconBtn>
          <IconBtn label="Copia hero completa" onClick={copyAll}>
            <Copy className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Rigenera questa hero" onClick={onRegenerate} disabled={regenerating}>
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
          </IconBtn>
        </div>
      </div>

      <div className="space-y-2.5" onClick={(e) => e.stopPropagation()}>
        {HERO_PARTS.map((p) => {
          const value = hero[p.key];
          if (!value) return null;
          return <Part key={p.key} label={p.label} value={value} isHeadline={p.key === "headline"} />;
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4" onClick={(e) => e.stopPropagation()}>
        <Badge variant="secondary" className="max-w-[60%] whitespace-normal font-normal normal-case first-letter:uppercase">
          {hero.principio_psicologico}
        </Badge>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Razionale
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
        </Collapsible>
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty" onClick={(e) => e.stopPropagation()}>
            {hero.razionale_ux}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </article>
  );
}

function Part({
  label,
  value,
  isHeadline,
}: {
  label: string;
  value: string;
  isHeadline?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="group/part flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={isHeadline ? "font-serif text-base font-medium leading-snug" : "text-sm leading-snug"}>
          {value}
        </span>
      </div>
      <button
        onClick={copy}
        aria-label={`Copia ${label}`}
        className="mt-0.5 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/part:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
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
