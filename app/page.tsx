"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  SEZIONE_TUTTE,
  type GenerateInput,
  type Variant,
  type HeroVariant,
} from "@/lib/schema";
import { GeneratorForm, type FormValue } from "@/components/GeneratorForm";
import { VariantCard } from "@/components/VariantCard";
import { HeroVariantCard } from "@/components/HeroVariantCard";
import { PreviewStudio } from "@/components/PreviewStudio";
import { HeroEditor } from "@/components/HeroEditor";
import { ABCompare } from "@/components/ABCompare";
import { ResultsToolbar, type ExportKind } from "@/components/ResultsToolbar";
import { EmptyState } from "@/components/EmptyState";
import { HistoryPanel, type HistoryEntry } from "@/components/HistoryPanel";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  toMarkdown,
  toCSV,
  toPlainText,
  heroToMarkdown,
  download,
} from "@/lib/export";
import { Loader2, Feather } from "lucide-react";

const DEFAULT_FORM: FormValue = {
  descrizione: "",
  target: "",
  tono: "autorevole",
  obiettivo: "iscrizione",
  sezione: "hero headline",
};

const wantsFull = (f: FormValue): boolean => f.sezione === SEZIONE_TUTTE;
const normalize = (f: FormValue): GenerateInput => ({
  descrizione: f.descrizione,
  target: f.target,
  tono: f.tono,
  obiettivo: f.obiettivo,
  sezione: f.sezione === SEZIONE_TUTTE ? "hero headline" : f.sezione,
});

type ApiOpts = { count?: number; raffina?: string | null; evita?: string[] };

async function post(base: GenerateInput, complete: boolean, opts: ApiOpts) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...base,
      ...opts,
      raffina: opts.raffina ?? undefined,
      modo: complete ? "completa" : undefined,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Errore imprevisto.");
  return data as { variants?: Variant[]; heroes?: HeroVariant[] };
}

export default function Home() {
  const [form, setForm] = useState<FormValue>(DEFAULT_FORM);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [heroes, setHeroes] = useState<HeroVariant[]>([]);
  const [shownInput, setShownInput] = useState<GenerateInput>(normalize(DEFAULT_FORM));
  const [full, setFull] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [regenId, setRegenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [previewIdx, setPreviewIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [compareOn, setCompareOn] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const updateForm = (patch: Partial<FormValue>) =>
    setForm((f) => ({ ...f, ...patch }));

  const pushHistory = (
    input: GenerateInput,
    complete: boolean,
    vs: Variant[],
    hs: HeroVariant[]
  ) => {
    const id = crypto.randomUUID();
    setHistory((h) =>
      [
        { id, input, full: complete, variants: vs, heroes: hs, ts: Date.now(), fav: false },
        ...h,
      ].slice(0, 20)
    );
    setActiveId(id);
  };

  const resetSelection = () => {
    setPreviewIdx(0);
    setSelected([]);
    setFavorites([]);
  };

  const generate = async (f: FormValue) => {
    const complete = wantsFull(f);
    const base = normalize(f);
    setLoading(true);
    setError(null);
    try {
      const data = await post(base, complete, { count: complete ? 3 : 4 });
      if (complete) {
        setHeroes(data.heroes ?? []);
        setVariants([]);
      } else {
        setVariants(data.variants ?? []);
        setHeroes([]);
      }
      setShownInput(base);
      setFull(complete);
      resetSelection();
      pushHistory(base, complete, data.variants ?? [], data.heroes ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore.");
      setVariants([]);
      setHeroes([]);
      toast.error("Generazione non riuscita", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const refine = async (directive: string | null) => {
    if ((full ? heroes : variants).length === 0) return;
    setRefining(true);
    try {
      const evita = full ? heroes.map((h) => h.headline) : variants.map((v) => v.testo);
      const data = await post(shownInput, full, {
        count: full ? 3 : 4,
        raffina: directive,
        evita,
      });
      if (full) setHeroes(data.heroes ?? []);
      else setVariants(data.variants ?? []);
      resetSelection();
      pushHistory(shownInput, full, data.variants ?? [], data.heroes ?? []);
      toast.success(directive ? "Raffinate" : "Nuove varianti generate");
    } catch (e) {
      toast.error("Operazione non riuscita", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setRefining(false);
    }
  };

  const regenerateVariant = async (target: Variant) => {
    setRegenId(target.variante);
    try {
      const data = await post(shownInput, false, {
        count: 1,
        raffina: "Proponi UNA variante nuova e diversa dalle precedenti.",
        evita: variants.map((v) => v.testo),
      });
      const fresh = data.variants?.[0];
      if (fresh)
        setVariants((vs) =>
          vs.map((v) => (v.variante === target.variante ? { ...fresh, variante: target.variante } : v))
        );
      toast.success(`Variante ${target.variante} rigenerata`);
    } catch (e) {
      toast.error("Rigenerazione non riuscita", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setRegenId(null);
    }
  };

  const regenerateHero = async (target: HeroVariant) => {
    setRegenId(target.variante);
    try {
      const data = await post(shownInput, true, {
        count: 1,
        raffina: "Proponi UNA hero completa nuova e diversa dalle precedenti.",
        evita: heroes.map((h) => h.headline),
      });
      const fresh = data.heroes?.[0];
      if (fresh)
        setHeroes((hs) =>
          hs.map((h) => (h.variante === target.variante ? { ...fresh, variante: target.variante } : h))
        );
      toast.success(`Hero ${target.variante} rigenerata`);
    } catch (e) {
      toast.error("Rigenerazione non riuscita", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setRegenId(null);
    }
  };

  const toggleSelect = (v: Variant, checked: boolean) => {
    setCompareOn(true);
    setSelected((prev) =>
      checked
        ? [...prev.filter((x) => x !== v.variante), v.variante].slice(-2)
        : prev.filter((x) => x !== v.variante)
    );
  };

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const restore = (e: HistoryEntry) => {
    setForm({ ...e.input, sezione: e.full ? SEZIONE_TUTTE : e.input.sezione });
    setShownInput(e.input);
    setFull(e.full);
    setVariants(e.variants);
    setHeroes(e.heroes);
    setActiveId(e.id);
    resetSelection();
    setError(null);
  };

  const toggleHistoryFav = (id: string) =>
    setHistory((h) => h.map((e) => (e.id === id ? { ...e, fav: !e.fav } : e)));

  const onExport = (kind: ExportKind) => {
    const stamp = (full ? "hero-completa" : shownInput.sezione).replace(/\s+/g, "-");
    if (full) {
      if (heroes.length === 0) return;
      if (kind === "copy") {
        navigator.clipboard.writeText(heroes.map((h) => `${h.variante}. ${h.headline}`).join("\n"));
        toast.success("Headline copiate");
        return;
      }
      if (kind === "md")
        download(`${stamp}.md`, heroToMarkdown(shownInput, heroes), "text/markdown");
      if (kind === "csv") {
        const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
        const rows = heroes.map((h) =>
          [h.variante, h.headline, h.subheadline, h.cta, h.value_proposition, h.social_proof, h.principio_psicologico]
            .map(esc)
            .join(",")
        );
        download(
          `${stamp}.csv`,
          ["variante,headline,subheadline,cta,value_proposition,social_proof,principio", ...rows].join("\n"),
          "text/csv"
        );
      }
      if (kind === "json")
        download(`${stamp}.json`, JSON.stringify({ input: shownInput, heroes }, null, 2), "application/json");
      toast.success(`Esportato in ${kind.toUpperCase()}`);
      return;
    }
    if (variants.length === 0) return;
    if (kind === "copy") {
      navigator.clipboard.writeText(toPlainText(variants));
      toast.success("Varianti copiate");
      return;
    }
    if (kind === "md") download(`microcopy-${stamp}.md`, toMarkdown(shownInput, variants), "text/markdown");
    if (kind === "csv") download(`microcopy-${stamp}.csv`, toCSV(variants), "text/csv");
    if (kind === "json")
      download(`microcopy-${stamp}.json`, JSON.stringify({ input: shownInput, variants }, null, 2), "application/json");
    toast.success(`Esportato in ${kind.toUpperCase()}`);
  };

  const compareVariants =
    !full && compareOn && selected.length === 2
      ? (selected.map((id) => variants.find((v) => v.variante === id)).filter(Boolean) as Variant[])
      : null;

  const hasResults = full ? heroes.length > 0 : variants.length > 0;
  const count = full ? heroes.length : variants.length;
  const selHero = heroes[previewIdx] ?? heroes[0] ?? null;
  const selVariant = variants[previewIdx] ?? variants[0] ?? null;

  return (
    <div className="min-h-screen paper-grain">
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Feather className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Microcopy Studio
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Microcopy Generator
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
              Headline, sottotitoli e CTA per landing page in varianti A/B — con
              razionale UX, stili grafici pronti e anteprima nel contesto reale.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(340px,380px)_1fr]">
          <div className="space-y-5 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
              <GeneratorForm
                value={form}
                onChange={updateForm}
                loading={loading}
                onSubmit={() => generate(form)}
              />
            </div>
            <HistoryPanel
              entries={history}
              activeId={activeId}
              onRestore={restore}
              onToggleFav={toggleHistoryFav}
            />
          </div>

          <div className="space-y-6">
            {error && !hasResults && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading && !hasResults && (
              <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">
                  {wantsFull(form) ? "Compongo la hero completa…" : "Scrivo le tue varianti…"}
                </p>
              </div>
            )}

            {!hasResults && !loading && <EmptyState onPreset={generate} />}

            {hasResults && (
              <>
                {full && (
                  <div className="flex rounded-lg border border-border p-0.5 w-fit">
                    {[
                      { k: false, label: "Anteprima stili" },
                      { k: true, label: "✎ Editor canvas" },
                    ].map((o) => (
                      <button
                        key={String(o.k)}
                        onClick={() => setEditing(o.k)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          editing === o.k
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}

                {full && editing && selHero ? (
                  <HeroEditor
                    key={`${selHero.variante}-${selHero.headline}`}
                    hero={selHero}
                    input={shownInput}
                  />
                ) : (
                  <PreviewStudio
                    count={count}
                    previewIdx={previewIdx}
                    onPreviewIdx={setPreviewIdx}
                    sezione={shownInput.sezione}
                    text={full ? selHero?.headline ?? "" : selVariant?.testo ?? ""}
                    full={
                      full && selHero
                        ? {
                            headline: selHero.headline,
                            subheadline: selHero.subheadline,
                            cta: selHero.cta,
                            socialProof: selHero.social_proof,
                          }
                        : null
                    }
                    heroForExport={full ? selHero : null}
                  />
                )}

                <ResultsToolbar
                  onRefine={refine}
                  onExport={onExport}
                  refining={refining}
                  disabled={loading}
                />

                {!full && compareVariants && (
                  <ABCompare a={compareVariants[0]} b={compareVariants[1]} />
                )}
                {!full && compareOn && selected.length < 2 && (
                  <p className="text-xs text-muted-foreground">
                    Seleziona 2 varianti (icona confronto sulle card) per affiancarle.
                  </p>
                )}

                {full ? (
                  <section className="grid gap-4 sm:grid-cols-2">
                    {heroes.map((h, i) => (
                      <HeroVariantCard
                        key={h.variante}
                        hero={h}
                        index={i}
                        active={i === previewIdx}
                        onActivate={() => setPreviewIdx(i)}
                        favorite={favorites.includes(h.variante)}
                        onToggleFavorite={() => toggleFavorite(h.variante)}
                        onRegenerate={() => regenerateHero(h)}
                        regenerating={regenId === h.variante}
                      />
                    ))}
                  </section>
                ) : (
                  <section className="grid gap-4 sm:grid-cols-2">
                    {variants.map((v, i) => (
                      <VariantCard
                        key={v.variante}
                        variant={v}
                        index={i}
                        selected={selected.includes(v.variante)}
                        onToggleSelect={toggleSelect}
                        favorite={favorites.includes(v.variante)}
                        onToggleFavorite={() => toggleFavorite(v.variante)}
                        onRegenerate={regenerateVariant}
                        regenerating={regenId === v.variante}
                      />
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
