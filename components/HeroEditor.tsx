"use client";

import { useRef, useState, type CSSProperties } from "react";
import { toast } from "sonner";
import type { HeroVariant, GenerateInput } from "@/lib/schema";
import {
  THEMES,
  getTheme,
  FONT_STACK,
  PALETTE_ROLES,
  type Theme,
  type FontKind,
} from "@/lib/design-presets";
import {
  seedLayout,
  buildHtml,
  buildCss,
  buildMd,
  type HeroLayout,
  type Block,
} from "@/lib/hero-layout";
import { download } from "@/lib/export";
import {
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
  GripVertical,
  Code2,
  FileCode2,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const FONT_KINDS: { k: FontKind; label: string }[] = [
  { k: "sans", label: "Sans" },
  { k: "serif", label: "Serif" },
  { k: "alt", label: "Display" },
  { k: "mono", label: "Mono" },
];

// Re-color/re-font a layout to a new theme while keeping the user's content,
// order and visibility. (Structural edits survive a style switch.)
function applyTheme(old: HeroLayout, hero: HeroVariant, theme: Theme): HeroLayout {
  const fresh = seedLayout(hero, theme);
  const byId = Object.fromEntries(fresh.blocks.map((b) => [b.id, b]));
  return {
    ...fresh,
    align: old.align,
    maxWidth: old.maxWidth,
    padX: old.padX,
    padY: old.padY,
    blocks: old.blocks.map((ob) => ({
      ...byId[ob.id],
      text: ob.text,
      visible: ob.visible,
    })),
  };
}

export function HeroEditor({
  hero,
  input,
}: {
  hero: HeroVariant;
  input: GenerateInput;
}) {
  const [themeId, setThemeId] = useState("editoriale");
  const theme = getTheme(themeId);
  const [layout, setLayout] = useState<HeroLayout>(() => seedLayout(hero, theme));
  const [selected, setSelected] = useState<Block["id"] | "hero">("headline");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const dragFrom = useRef<number | null>(null);

  const switchTheme = (id: string) => {
    setThemeId(id);
    setLayout((l) => applyTheme(l, hero, getTheme(id)));
  };

  const patchBlock = (id: Block["id"], patch: Partial<Block>) =>
    setLayout((l) => ({
      ...l,
      blocks: l.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));

  const patchHero = (patch: Partial<HeroLayout>) =>
    setLayout((l) => ({ ...l, ...patch }));

  const move = (from: number, to: number) =>
    setLayout((l) => {
      if (to < 0 || to >= l.blocks.length) return l;
      const blocks = [...l.blocks];
      const [x] = blocks.splice(from, 1);
      blocks.splice(to, 0, x);
      return { ...l, blocks };
    });

  const exportFile = (kind: "html" | "css" | "md") => {
    const map = {
      html: () => [buildHtml(layout, theme), "hero.html", "text/html"] as const,
      css: () => [buildCss(layout, theme), "hero.css", "text/css"] as const,
      md: () => [buildMd(layout, theme, input), "hero-spec.md", "text/markdown"] as const,
    };
    const [content, name, mime] = map[kind]();
    download(name, content, mime);
    toast.success(`Esportato ${name}`);
  };

  const sel = layout.blocks.find((b) => b.id === selected);

  return (
    <section className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Stile
          </span>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              title={t.name}
              className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 ${
                t.id === themeId ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
              }`}
              style={{ background: t.colors.accent, borderColor: t.colors.border }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
                  device === d ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
              >
                {d === "desktop" ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
              </button>
            ))}
          </div>
          <ExportBtn icon={<Code2 className="h-3.5 w-3.5" />} label="HTML" onClick={() => exportFile("html")} />
          <ExportBtn icon={<FileCode2 className="h-3.5 w-3.5" />} label="CSS" onClick={() => exportFile("css")} />
          <ExportBtn icon={<FileText className="h-3.5 w-3.5" />} label="MD" onClick={() => exportFile("md")} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
        {/* CANVAS */}
        <div className={device === "mobile" ? "mx-auto w-full max-w-[400px]" : ""}>
          <EditableCanvas
            layout={layout}
            theme={theme}
            selected={selected}
            onSelect={setSelected}
            onText={(id, text) => patchBlock(id, { text })}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Clicca un elemento per modificarlo · doppio clic sul testo per riscriverlo.
          </p>
        </div>

        {/* INSPECTOR */}
        <aside className="space-y-3 rounded-xl border bg-card p-3">
          {/* layers */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Livelli
            </h3>
            <ul className="space-y-1">
              {layout.blocks.map((b, i) => (
                <li
                  key={b.id}
                  draggable
                  onDragStart={() => (dragFrom.current = i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragFrom.current !== null) move(dragFrom.current, i);
                    dragFrom.current = null;
                  }}
                  onClick={() => setSelected(b.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs ${
                    selected === b.id ? "bg-accent" : "hover:bg-secondary"
                  }`}
                >
                  <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground" />
                  <span className={`flex-1 truncate ${b.visible ? "" : "text-muted-foreground line-through"}`}>
                    {b.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      patchBlock(b.id, { visible: !b.visible });
                    }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={b.visible ? "Nascondi" : "Mostra"}
                  >
                    {b.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border/60 pt-3">
            <div className="mb-2 flex gap-1 text-xs">
              <TabBtn active={selected !== "hero"} onClick={() => setSelected(sel?.id ?? "headline")}>
                Elemento
              </TabBtn>
              <TabBtn active={selected === "hero"} onClick={() => setSelected("hero")}>
                Hero
              </TabBtn>
            </div>

            {selected === "hero" ? (
              <HeroControls layout={layout} theme={theme} onChange={patchHero} />
            ) : sel ? (
              <BlockControls block={sel} theme={theme} onChange={(p) => patchBlock(sel.id, p)} />
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

// ---------- canvas ----------

function blockStyle(b: Block): CSSProperties {
  const base: CSSProperties = {
    fontFamily: FONT_STACK[b.fontKind],
    fontSize: `${b.fontSize}rem`,
    fontWeight: b.weight,
    textAlign: b.align,
    color: b.color,
    marginTop: `${b.marginTop}rem`,
    lineHeight: b.id === "headline" ? 1.05 : 1.5,
    letterSpacing: b.id === "headline" ? "-0.02em" : b.id === "eyebrow" ? "0.12em" : "normal",
    textTransform: b.id === "eyebrow" ? "uppercase" : "none",
    outline: "none",
  };
  if (b.id === "cta") {
    return {
      ...base,
      display: "inline-block",
      background: b.bg,
      borderRadius: b.radius,
      padding: `${b.padY}rem ${b.padX}rem`,
    };
  }
  return base;
}

function EditableCanvas({
  layout,
  theme,
  selected,
  onSelect,
  onText,
}: {
  layout: HeroLayout;
  theme: Theme;
  selected: Block["id"] | "hero";
  onSelect: (id: Block["id"] | "hero") => void;
  onText: (id: Block["id"], text: string) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{ borderColor: theme.colors.border }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: theme.colors.surface, borderBottom: `1px solid ${theme.colors.border}` }}>
        {["#e0605a", "#e6b34a", "#5ab877"].map((x) => (
          <span key={x} className="h-2.5 w-2.5 rounded-full" style={{ background: x }} />
        ))}
      </div>
      <div
        onClick={() => onSelect("hero")}
        style={{
          background: layout.bg,
          padding: `${layout.padY}rem ${layout.padX}rem`,
          textAlign: layout.align,
        }}
      >
        <div style={{ maxWidth: `${layout.maxWidth}ch`, margin: layout.align === "center" ? "0 auto" : undefined }}>
          {layout.blocks
            .filter((b) => b.visible)
            .map((b) => (
              <CanvasBlock
                key={b.id}
                block={b}
                theme={theme}
                selected={selected === b.id}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelect(b.id);
                }}
                onText={(t) => onText(b.id, t)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function CanvasBlock({
  block: b,
  theme,
  selected,
  onSelect,
  onText,
}: {
  block: Block;
  theme: Theme;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onText: (text: string) => void;
}) {
  const ring = selected ? { boxShadow: `0 0 0 2px ${theme.colors.accent}`, borderRadius: 4 } : {};
  const editable = {
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => onText(e.currentTarget.textContent ?? ""),
  };

  if (b.id === "social") {
    return (
      <div onClick={onSelect} style={{ ...blockStyle(b), display: "flex", alignItems: "center", gap: "0.7rem", ...ring }}>
        <div style={{ display: "flex" }}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 26, height: 26, borderRadius: 999, marginLeft: i ? -8 : 0, background: theme.colors.accent, opacity: 0.5 + i * 0.12, border: `2px solid ${theme.colors.surface}` }} />
          ))}
        </div>
        <span {...editable} style={{ outline: "none", fontWeight: 600, color: theme.colors.text }}>
          {b.text}
        </span>
      </div>
    );
  }

  const style = { ...blockStyle(b), ...ring };
  const props = { onClick: onSelect, style, ...editable };
  if (b.id === "headline") return <h1 {...props}>{b.text}</h1>;
  if (b.id === "cta") return <a {...props}>{b.text}</a>;
  return <p {...props}>{b.text}</p>;
}

// ---------- inspector controls ----------

function BlockControls({
  block: b,
  theme,
  onChange,
}: {
  block: Block;
  theme: Theme;
  onChange: (p: Partial<Block>) => void;
}) {
  return (
    <div className="space-y-3">
      <Field label="Testo">
        <textarea
          value={b.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={2}
          className="w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-xs"
        />
      </Field>
      <Range label="Dimensione" value={b.fontSize} min={0.6} max={5} step={0.05} unit="rem" onChange={(v) => onChange({ fontSize: v })} />
      <Field label="Peso">
        <select
          value={b.weight}
          onChange={(e) => onChange({ weight: Number(e.target.value) })}
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        >
          {[300, 400, 500, 600, 700, 800, 900].map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </Field>
      <Field label="Font">
        <div className="flex gap-1">
          {FONT_KINDS.map((f) => (
            <button
              key={f.k}
              onClick={() => onChange({ fontKind: f.k })}
              className={`flex-1 rounded border px-1 py-1 text-[0.65rem] ${b.fontKind === f.k ? "border-primary bg-primary/5" : "border-border"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Field>
      <AlignField value={b.align} onChange={(align) => onChange({ align })} />
      <ColorField label="Colore testo" theme={theme} value={b.color} onChange={(color) => onChange({ color })} />
      <Range label="Spazio sopra" value={b.marginTop} min={0} max={6} step={0.1} unit="rem" onChange={(v) => onChange({ marginTop: v })} />

      {b.id === "cta" && (
        <>
          <div className="border-t border-border/60 pt-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Bottone
          </div>
          <ColorField label="Sfondo" theme={theme} value={b.bg ?? ""} onChange={(bg) => onChange({ bg })} />
          <Range label="Forma (radius)" value={b.radius ?? 0} min={0} max={40} step={1} unit="px" onChange={(v) => onChange({ radius: v })} />
          <Range label="Padding orizz." value={b.padX ?? 1.8} min={0.4} max={4} step={0.1} unit="rem" onChange={(v) => onChange({ padX: v })} />
          <Range label="Padding vert." value={b.padY ?? 0.9} min={0.2} max={2.5} step={0.1} unit="rem" onChange={(v) => onChange({ padY: v })} />
        </>
      )}
    </div>
  );
}

function HeroControls({
  layout,
  theme,
  onChange,
}: {
  layout: HeroLayout;
  theme: Theme;
  onChange: (p: Partial<HeroLayout>) => void;
}) {
  return (
    <div className="space-y-3">
      <Field label="Allineamento colonna">
        <div className="flex gap-1">
          {(["left", "center"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onChange({ align: a })}
              className={`flex-1 rounded border px-2 py-1 text-xs capitalize ${layout.align === a ? "border-primary bg-primary/5" : "border-border"}`}
            >
              {a === "left" ? "Sinistra" : "Centro"}
            </button>
          ))}
        </div>
      </Field>
      <Range label="Larghezza testo" value={layout.maxWidth} min={24} max={80} step={1} unit="ch" onChange={(v) => onChange({ maxWidth: v })} />
      <ColorField label="Sfondo hero" theme={theme} value={layout.bg} onChange={(bg) => onChange({ bg })} />
      <Range label="Padding vert." value={layout.padY} min={1} max={9} step={0.25} unit="rem" onChange={(v) => onChange({ padY: v })} />
      <Range label="Padding orizz." value={layout.padX} min={1} max={7} step={0.25} unit="rem" onChange={(v) => onChange({ padX: v })} />
    </div>
  );
}

// ---------- primitives ----------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[0.7rem] font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={`${label} · ${value}${unit}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </Field>
  );
}

function AlignField({
  value,
  onChange,
}: {
  value: "left" | "center" | "right";
  onChange: (v: "left" | "center" | "right") => void;
}) {
  const opts = [
    { v: "left" as const, icon: <AlignLeft className="h-3.5 w-3.5" /> },
    { v: "center" as const, icon: <AlignCenter className="h-3.5 w-3.5" /> },
    { v: "right" as const, icon: <AlignRight className="h-3.5 w-3.5" /> },
  ];
  return (
    <Field label="Allineamento">
      <div className="flex gap-1">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`flex flex-1 items-center justify-center rounded border py-1.5 ${value === o.v ? "border-primary bg-primary/5" : "border-border"}`}
          >
            {o.icon}
          </button>
        ))}
      </div>
    </Field>
  );
}

function ColorField({
  label,
  theme,
  value,
  onChange,
}: {
  label: string;
  theme: Theme;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-1.5">
        {PALETTE_ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => onChange(theme.colors[r.key])}
            title={r.label}
            className="h-6 w-6 rounded border border-border transition-transform hover:scale-110"
            style={{ background: theme.colors[r.key] }}
          />
        ))}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1 font-mono text-[0.65rem]"
          spellCheck={false}
        />
      </div>
    </Field>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md px-2 py-1.5 font-medium transition-colors ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function ExportBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
    >
      {icon} {label}
    </button>
  );
}
