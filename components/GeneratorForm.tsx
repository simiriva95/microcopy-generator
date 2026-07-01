"use client";

import { useRef } from "react";
import {
  TONI,
  OBIETTIVI,
  SEZIONI,
  SEZIONE_TUTTE,
  type GenerateInput,
} from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoHint } from "@/components/InfoHint";
import { Loader2, Sparkles } from "lucide-react";

const DEBOUNCE_MS = 700;

const HINTS: Record<string, string> = {
  descrizione:
    "Cosa fa il tuo prodotto, in parole semplici. Più sei specifico, migliore è il copy.",
  target: "A chi parli? Es. «freelance», «genitori indaffarati», «team di vendita».",
  tono: "La personalità della voce. Cambia radicalmente il modo in cui suona il copy.",
  obiettivo: "L'azione che vuoi far compiere. Orienta la leva persuasiva.",
  sezione:
    "Quale pezzo scrivere. Scegli «hero completa» per generare tutte le sezioni insieme e vederle assemblate in anteprima.",
};

export type FormValue = Omit<GenerateInput, "sezione"> & {
  sezione: GenerateInput["sezione"] | typeof SEZIONE_TUTTE;
};

export function GeneratorForm({
  value,
  onChange,
  loading,
  onSubmit,
}: {
  value: FormValue;
  onChange: (patch: Partial<FormValue>) => void;
  loading: boolean;
  onSubmit: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valid =
    value.descrizione.trim().length >= 3 && value.target.trim().length >= 2;

  // Debounced submit = lightweight client-side rate limiting.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onSubmit, DEBOUNCE_MS);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Descrizione prodotto/servizio" hint={HINTS.descrizione} htmlFor="descrizione">
        <Textarea
          id="descrizione"
          rows={4}
          placeholder="Es. Un'app che trasforma le note vocali in task organizzati automaticamente…"
          value={value.descrizione}
          onChange={(e) => onChange({ descrizione: e.target.value })}
          maxLength={1000}
          className="resize-none"
        />
      </Field>

      <Field label="Target audience" hint={HINTS.target} htmlFor="target">
        <Input
          id="target"
          placeholder="Es. Freelance e professionisti sempre di corsa"
          value={value.target}
          onChange={(e) => onChange({ target: e.target.value })}
          maxLength={500}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tono" hint={HINTS.tono}>
          <Select
            value={value.tono}
            onValueChange={(v) => onChange({ tono: v as FormValue["tono"] })}
          >
            <SelectTrigger className="capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONI.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Obiettivo" hint={HINTS.obiettivo}>
          <Select
            value={value.obiettivo}
            onValueChange={(v) =>
              onChange({ obiettivo: v as FormValue["obiettivo"] })
            }
          >
            <SelectTrigger className="capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBIETTIVI.map((o) => (
                <SelectItem key={o} value={o} className="capitalize">
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Sezione da generare" hint={HINTS.sezione}>
        <Select
          value={value.sezione}
          onValueChange={(v) => onChange({ sezione: v as FormValue["sezione"] })}
        >
          <SelectTrigger className="capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SEZIONE_TUTTE} className="font-medium capitalize">
              ✦ {SEZIONE_TUTTE}
            </SelectItem>
            {SEZIONI.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={!valid || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Genero varianti…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> Genera varianti A/B
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={htmlFor} className="text-[0.8rem] font-medium">
          {label}
        </Label>
        {hint && <InfoHint text={hint} />}
      </div>
      {children}
    </div>
  );
}
