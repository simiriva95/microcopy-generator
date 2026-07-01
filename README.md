# Microcopy Generator

Genera **headline, sottotitoli e CTA** per landing page in varianti A/B — ognuna con **razionale UX** e **principio psicologico**. Include uno **studio di stili grafici** (9 temi tipo Figma: editoriale, neo-brutalismo, dark luxury, retro-futurista, …) e un'**anteprima della hero nel contesto reale** (landing, admin, portfolio, e-commerce, designer/art, dashboard).

Modalità **Hero Completa**: genera tutte le sezioni insieme (headline + subheadline + CTA + value proposition + social proof) e le mostra assemblate nella preview, con export **HTML pronto da incollare**.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- **Groq** (`llama-3.3-70b-versatile`) via route handler, output JSON con parsing robusto e fallback

## Setup

```bash
npm install
cp .env.example .env.local   # inserisci la tua GROQ_API_KEY
npm run dev
```

Chiave: https://console.groq.com/keys

### Variabili d'ambiente

| Var | Obbligatoria | Default |
|-----|--------------|---------|
| `GROQ_API_KEY` | sì | — |
| `GROQ_MODEL` | no | `llama-3.3-70b-versatile` |

## Funzionalità

- 3-4 varianti A/B per sezione, con razionale specifico + punteggio di chiarezza
- Raffina (più corte / più incisive / più semplici), rigenera singola variante
- Studio stili grafici con studio del colore, contesti pagina, preview desktop/mobile
- Export: copia, Markdown, CSV, JSON, HTML della hero
- Cronologia di sessione, preferiti, tema chiaro/scuro
- Nessun browser storage; rate limiting client-side (debounce)

## Deploy

Deployabile su Vercel. Imposta `GROQ_API_KEY` fra le Environment Variables del progetto.
