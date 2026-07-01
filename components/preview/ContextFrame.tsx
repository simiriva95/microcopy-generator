"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Sezione } from "@/lib/schema";
import { FONT, type Theme, type ContextId } from "@/lib/design-presets";
import { HeroMock, type HeroFull } from "./HeroMock";

// Wraps HeroMock in mock page chrome (nav, sidebar, product grid…) so the user
// sees the hero *in situ* for a given kind of site.
export function ContextFrame({
  theme,
  context,
  sezione,
  text,
  full,
}: {
  theme: Theme;
  context: ContextId;
  sezione: Sezione;
  text: string;
  full?: HeroFull | null;
}) {
  const c = theme.colors;
  const body = FONT[theme.body];
  const rounded = Math.min(theme.radius, 10);

  const soft = (o: number) =>
    `color-mix(in oklab, ${c.text} ${o}%, transparent)`;
  const accentSoft = (o: number) =>
    `color-mix(in oklab, ${c.accent} ${o}%, transparent)`;

  const label: CSSProperties = {
    fontFamily: body,
    color: soft(55),
    fontSize: "0.72rem",
    fontWeight: 600,
  };

  const brand = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: theme.id === "brutalismo" ? 0 : 6,
          background: c.accent,
        }}
      />
      <span style={{ fontFamily: FONT[theme.display], fontWeight: 700, color: c.text, fontSize: "0.9rem" }}>
        Brand
      </span>
    </div>
  );

  const navLinks = (items: string[]) => (
    <div style={{ display: "flex", gap: 18 }}>
      {items.map((l) => (
        <span key={l} style={label}>
          {l}
        </span>
      ))}
    </div>
  );

  const ctaPill = (
    <span
      style={{
        fontFamily: body,
        background: c.accent,
        color: c.accentText,
        borderRadius: rounded,
        padding: "0.4rem 0.9rem",
        fontSize: "0.72rem",
        fontWeight: 700,
        border: theme.id === "brutalismo" ? `2px solid ${c.border}` : "none",
      }}
    >
      Inizia
    </span>
  );

  const box = (h: number, extra?: CSSProperties): CSSProperties => ({
    background: soft(6),
    border: `1px solid ${soft(10)}`,
    borderRadius: rounded,
    height: h,
    ...extra,
  });

  const bar: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.85rem 1.4rem",
    borderBottom: `${theme.borderWidth}px solid ${c.border}`,
    background: c.surface,
  };

  const heroPad = (node: ReactNode, pad = "3rem 2.5rem"): ReactNode => (
    <div style={{ padding: pad }}>{node}</div>
  );

  const hero = (dense = false) => (
    <HeroMock theme={theme} sezione={sezione} text={text} dense={dense} full={full} />
  );

  const sidebar = (
    <aside
      style={{
        width: 168,
        flexShrink: 0,
        background: c.surface,
        borderRight: `${theme.borderWidth}px solid ${c.border}`,
        padding: "1.1rem 0.9rem",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {brand}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
        {["Dashboard", "Progetti", "Team", "Report", "Impostazioni"].map((it, i) => (
          <div
            key={it}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.4rem 0.5rem",
              borderRadius: rounded,
              background: i === 0 ? accentSoft(14) : "transparent",
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 4, background: i === 0 ? c.accent : soft(20) }} />
            <span style={{ ...label, color: i === 0 ? c.text : soft(50) }}>{it}</span>
          </div>
        ))}
      </div>
    </aside>
  );

  switch (context) {
    case "admin":
    case "dashboard":
      return (
        <div style={{ display: "flex", minHeight: 360 }}>
          {sidebar}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={bar}>
              <div style={box(28, { width: 200, background: soft(8) })} />
              <span style={{ width: 28, height: 28, borderRadius: 999, background: soft(14) }} />
            </div>
            <div style={{ padding: "1.6rem", flex: 1 }}>
              <div
                style={{
                  background: context === "dashboard" ? "transparent" : c.surface,
                  border:
                    context === "dashboard"
                      ? `2px dashed ${c.border}`
                      : `${theme.borderWidth}px solid ${c.border}`,
                  borderRadius: theme.radius,
                  boxShadow: context === "admin" ? theme.shadow : "none",
                  padding: "2rem",
                }}
              >
                {hero(true)}
              </div>
              {context === "admin" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={box(64)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "portfolio":
      return (
        <div style={{ background: c.bg }}>
          <div style={{ ...bar, background: "transparent", borderBottom: "none", paddingTop: "1.4rem" }}>
            <span style={{ fontFamily: FONT[theme.display], fontWeight: 700, color: c.text }}>
              Nome Cognome
            </span>
            {navLinks(["Lavori", "Info", "Contatti"])}
          </div>
          {heroPad(hero(false), "2.5rem 2.5rem 2rem")}
          <div style={{ padding: "0 2.5rem 2.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={box(110)} />
            ))}
          </div>
        </div>
      );

    case "ecommerce":
      return (
        <div style={{ background: c.bg }}>
          <div style={bar}>
            {brand}
            <div style={box(30, { width: 220, background: soft(8) })} />
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: soft(18) }} />
              <span style={{ width: 20, height: 20, borderRadius: 999, background: c.accent }} />
            </div>
          </div>
          <div
            style={{
              margin: "1.4rem",
              borderRadius: theme.radius,
              background: accentSoft(10),
              border: `${theme.borderWidth}px solid ${c.border}`,
              padding: "2.2rem 2rem",
            }}
          >
            {hero(true)}
          </div>
          <div style={{ padding: "0 1.4rem 1.6rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={box(96)} />
                <div style={box(10, { width: "70%" })} />
                <span style={{ ...label, color: c.accent, fontWeight: 700 }}>€ 49</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "art":
      return (
        <div style={{ position: "relative", background: c.bg, minHeight: 380 }}>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <span style={{ fontFamily: FONT[theme.display], fontWeight: 700, color: c.text, fontSize: "0.85rem" }}>
              STUDIO
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[0, 1].map((i) => (
                <span key={i} style={{ width: 20, height: 2, background: c.text }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", minHeight: 300, padding: "4rem 2.5rem 2.5rem" }}>
            {hero(false)}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "0 2.5rem 1.6rem" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={box(48, { flex: 1 })} />
            ))}
          </div>
        </div>
      );

    case "landing":
    default:
      return (
        <div style={{ background: c.bg }}>
          <div style={bar}>
            {brand}
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {navLinks(["Prodotto", "Prezzi", "Blog"])}
              {ctaPill}
            </div>
          </div>
          {heroPad(hero(false))}
          <div style={{ padding: "0 2.5rem 2.5rem", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: rounded, background: accentSoft(20) }} />
                <div style={box(9, { width: "60%" })} />
                <div style={box(9, { width: "85%" })} />
              </div>
            ))}
          </div>
        </div>
      );
  }
}
