"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Sezione, HeroVariant } from "@/lib/schema";
import { THEMES, CONTEXTS, getTheme, getContext } from "@/lib/design-presets";
import { ContextFrame } from "@/components/preview/ContextFrame";
import { PalettePanel } from "@/components/preview/PalettePanel";
import type { HeroFull } from "@/components/preview/HeroMock";
import { heroToHtml, download } from "@/lib/export";
import { MapPin, Monitor, Smartphone, Shuffle, Code2 } from "lucide-react";

export function PreviewStudio({
  count,
  previewIdx,
  onPreviewIdx,
  sezione,
  text,
  full,
  heroForExport,
}: {
  count: number;
  previewIdx: number;
  onPreviewIdx: (i: number) => void;
  sezione: Sezione;
  text: string;
  full?: HeroFull | null;
  heroForExport?: HeroVariant | null;
}) {
  const [themeId, setThemeId] = useState("editoriale");
  const [contextId, setContextId] =
    useState<(typeof CONTEXTS)[number]["id"]>("landing");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const theme = getTheme(themeId);
  const context = getContext(contextId);

  const surprise = () => {
    // vary by current id so it actually changes
    const others = THEMES.filter((t) => t.id !== themeId);
    const pick = others[Math.floor(Math.random() * others.length)];
    setThemeId(pick.id);
    toast.success(`Stile: ${pick.name}`, { description: pick.blurb });
  };

  const exportHtml = () => {
    if (!heroForExport) return;
    download(
      `hero-${theme.id}.html`,
      heroToHtml(theme, heroForExport),
      "text/html"
    );
    toast.success("Hero esportata in HTML", {
      description: `Stile ${theme.name}, pronta da incollare.`,
    });
  };

  return (
    <section className="space-y-4">
      <div className="space-y-3">
        <PickerRow label="Stile grafico">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeId(t.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                t.id === themeId
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              <span className="flex -space-x-1">
                {(["surface", "text", "muted", "accent"] as const).map((k) => (
                  <span
                    key={k}
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ background: t.colors[k] }}
                  />
                ))}
              </span>
              {t.name}
            </button>
          ))}
          <button
            onClick={surprise}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Shuffle className="h-3.5 w-3.5" /> Sorprendimi
          </button>
        </PickerRow>

        <PickerRow label="Contesto pagina">
          {CONTEXTS.map((cx) => (
            <button
              key={cx.id}
              onClick={() => setContextId(cx.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                cx.id === contextId
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {cx.name}
            </button>
          ))}
        </PickerRow>
      </div>

      {/* toolbar: variant switcher + device toggle + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Anteprima
          </h2>
          {count > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onPreviewIdx(i)}
                  aria-label={`Variante ${String.fromCharCode(65 + i)}`}
                  className={`h-8 w-8 rounded-md border font-serif text-sm font-medium transition-colors ${
                    i === previewIdx
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                aria-label={d === "desktop" ? "Desktop" : "Mobile"}
                className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
                  device === d ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
              >
                {d === "desktop" ? (
                  <Monitor className="h-4 w-4" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
          {heroForExport && (
            <button
              onClick={exportHtml}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              <Code2 className="h-3.5 w-3.5" /> Esporta HTML
            </button>
          )}
        </div>
      </div>

      {/* framed preview */}
      <div className={device === "mobile" ? "mx-auto w-full max-w-[400px]" : ""}>
        <div
          className="overflow-hidden rounded-xl border shadow-sm transition-all"
          style={{
            background: theme.bgGradient ?? theme.colors.bg,
            borderColor: theme.colors.border,
          }}
        >
          <ContextFrame
            theme={theme}
            context={device === "mobile" ? "landing" : context.id}
            sezione={sezione}
            text={text}
            full={full}
          />
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground text-pretty">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          <strong className="font-semibold text-foreground">{context.name}:</strong>{" "}
          {context.blurb}
        </span>
      </div>

      <PalettePanel theme={theme} />
    </section>
  );
}

function PickerRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-auto">
        {label}
      </span>
      {children}
    </div>
  );
}
