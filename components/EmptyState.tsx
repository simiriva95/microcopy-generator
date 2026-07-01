"use client";

import type { GenerateInput } from "@/lib/schema";
import { PenLine, Layers, Lightbulb, ArrowRight } from "lucide-react";

// Curated starting points — clicking one fills the form and generates.
export const PRESETS: { title: string; input: GenerateInput }[] = [
  {
    title: "App di produttività",
    input: {
      descrizione:
        "Un'app che trasforma le note vocali in task organizzati automaticamente",
      target: "Freelance e professionisti sempre di corsa",
      tono: "amichevole",
      obiettivo: "iscrizione",
      sezione: "hero headline",
    },
  },
  {
    title: "Corso online",
    input: {
      descrizione:
        "Un corso online di fotografia con esercizi pratici e feedback settimanale",
      target: "Aspiranti fotografi che partono da zero",
      tono: "autorevole",
      obiettivo: "acquisto",
      sezione: "CTA button",
    },
  },
  {
    title: "SaaS B2B",
    input: {
      descrizione:
        "Piattaforma che automatizza la rendicontazione spese per i team finance",
      target: "Responsabili finance di aziende medio-grandi",
      tono: "minimale",
      obiettivo: "contatto",
      sezione: "value proposition",
    },
  },
];

const STEPS = [
  { icon: PenLine, title: "Descrivi", body: "Prodotto, target, tono e obiettivo." },
  { icon: Layers, title: "Genera", body: "4 varianti A/B in un click." },
  { icon: Lightbulb, title: "Capisci", body: "Ogni variante spiega perché funziona." },
];

export function EmptyState({
  onPreset,
}: {
  onPreset: (input: GenerateInput) => void;
}) {
  return (
    <div className="animate-rise flex flex-col rounded-xl border border-dashed bg-card/40 p-8 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Come funziona
      </p>
      <h2 className="mt-2 max-w-lg font-serif text-2xl font-semibold leading-tight text-pretty sm:text-[1.75rem]">
        Copy per landing page che converte, con il ragionamento dietro ogni scelta.
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-muted-foreground tabular">
                0{i + 1}
              </span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-sm leading-snug text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-9 border-t border-border/60 pt-6">
        <p className="text-sm font-medium text-muted-foreground">
          Non sai da dove partire? Prova un esempio:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              onClick={() => onPreset(p.input)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {p.title}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
