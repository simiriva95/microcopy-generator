"use client";

import type { Sezione } from "@/lib/schema";
import { FONT, type Theme } from "@/lib/design-presets";
import type { CSSProperties } from "react";

// The hero content itself, rendered in a given visual theme. Layout adapts to
// the section being generated and to `dense` (compact for admin/dashboard).
export type HeroFull = {
  headline: string;
  subheadline: string;
  cta: string;
  socialProof: string;
};

export function HeroMock({
  theme,
  sezione,
  text,
  dense = false,
  full,
}: {
  theme: Theme;
  sezione: Sezione;
  text: string;
  dense?: boolean;
  full?: HeroFull | null;
}) {
  const c = theme.colors;
  const displayFont = FONT[theme.display];
  const bodyFont = FONT[theme.body];

  const eyebrow: CSSProperties = {
    fontFamily: bodyFont,
    color: c.accent,
    textTransform: theme.uppercaseLabels ? "uppercase" : "none",
    letterSpacing: theme.letterSpacing ?? "0.05em",
    fontSize: "0.7rem",
    fontWeight: 700,
  };

  const headline: CSSProperties = {
    fontFamily: displayFont,
    color: c.text,
    fontWeight: theme.display === "mono" ? 700 : 800,
    lineHeight: 1.04,
    letterSpacing: theme.display === "serif" ? "-0.01em" : "-0.02em",
    fontSize: dense ? "clamp(1.4rem,3vw,2rem)" : "clamp(2rem,4.5vw,3.4rem)",
    textWrap: "balance",
    margin: 0,
  };

  const sub: CSSProperties = {
    fontFamily: theme.display === "mono" ? displayFont : bodyFont,
    color: c.muted,
    fontSize: dense ? "0.95rem" : "1.15rem",
    lineHeight: 1.5,
    maxWidth: "34ch",
    marginTop: "0.9rem",
  };

  const cta: CSSProperties = {
    fontFamily: bodyFont,
    background: c.accent,
    color: c.accentText,
    borderRadius: theme.radius,
    border: theme.id === "brutalismo" ? `${theme.borderWidth}px solid ${c.border}` : "none",
    boxShadow: theme.id === "brutalismo" ? theme.shadow : "none",
    padding: dense ? "0.6rem 1.1rem" : "0.85rem 1.6rem",
    fontWeight: 700,
    fontSize: dense ? "0.9rem" : "1rem",
    marginTop: dense ? "1.2rem" : "2rem",
    display: "inline-block",
    textTransform: theme.uppercaseLabels && theme.id !== "editoriale" ? "uppercase" : "none",
    letterSpacing: theme.uppercaseLabels ? "0.04em" : "normal",
  };

  const ghost: CSSProperties = {
    fontFamily: bodyFont,
    color: c.muted,
    opacity: 0.4,
    borderRadius: theme.radius,
    border: `1px solid ${c.border}`,
    padding: dense ? "0.6rem 1.1rem" : "0.85rem 1.6rem",
    fontWeight: 600,
    fontSize: dense ? "0.9rem" : "1rem",
    marginTop: dense ? "1.2rem" : "2rem",
    display: "inline-block",
  };

  const dummyHead: CSSProperties = { ...headline, color: c.text, opacity: 0.18 };
  const dummySub: CSSProperties = { ...sub, opacity: 0.35 };

  const Eyebrow = () => <div style={eyebrow}>Il tuo brand</div>;

  const slot = () => {
    switch (sezione) {
      case "hero headline":
        return (
          <>
            <h3 style={headline}>{text}</h3>
            <p style={dummySub}>Una frase di supporto che chiarisce il valore.</p>
            <span style={ghost}>Call to action</span>
          </>
        );
      case "subheadline":
        return (
          <>
            <h3 style={dummyHead}>Titolo della tua pagina</h3>
            <p style={{ ...sub, color: c.text }}>{text}</p>
            <span style={ghost}>Call to action</span>
          </>
        );
      case "CTA button":
        return (
          <>
            <h3 style={dummyHead}>Titolo della tua pagina</h3>
            <p style={dummySub}>Una frase di supporto che chiarisce il valore.</p>
            <span style={cta}>{text}</span>
          </>
        );
      case "value proposition":
        return (
          <>
            <h3 style={dummyHead}>Titolo della tua pagina</h3>
            <p style={{ ...sub, color: c.text, fontSize: dense ? "1rem" : "1.25rem" }}>
              {text}
            </p>
            <span style={ghost}>Call to action</span>
          </>
        );
      case "social proof":
        return (
          <>
            <h3 style={dummyHead}>Titolo della tua pagina</h3>
            <span style={ghost}>Call to action</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginTop: "1.6rem",
                fontFamily: bodyFont,
                color: c.muted,
                fontSize: "0.9rem",
              }}
            >
              <div style={{ display: "flex" }}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      marginLeft: i ? -8 : 0,
                      background: c.accent,
                      opacity: 0.5 + i * 0.12,
                      border: `2px solid ${c.surface}`,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: c.text, fontWeight: 600 }}>{text}</span>
            </div>
          </>
        );
      default:
        return <h3 style={headline}>{text}</h3>;
    }
  };

  const socialRow = (label: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginTop: dense ? "1.1rem" : "1.8rem",
        fontFamily: bodyFont,
        color: c.muted,
        fontSize: "0.85rem",
      }}
    >
      <div style={{ display: "flex" }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              marginLeft: i ? -8 : 0,
              background: c.accent,
              opacity: 0.5 + i * 0.12,
              border: `2px solid ${c.surface}`,
            }}
          />
        ))}
      </div>
      <span style={{ color: c.text, fontWeight: 600 }}>{label}</span>
    </div>
  );

  const fullSlot = () =>
    full ? (
      <>
        <h3 style={headline}>{full.headline}</h3>
        {full.subheadline && <p style={{ ...sub, color: c.text }}>{full.subheadline}</p>}
        {full.cta && <span style={cta}>{full.cta}</span>}
        {full.socialProof && socialRow(full.socialProof)}
      </>
    ) : null;

  return (
    <div>
      <div style={{ marginBottom: dense ? "0.7rem" : "1.1rem" }}>
        <Eyebrow />
      </div>
      {full ? fullSlot() : slot()}
    </div>
  );
}
