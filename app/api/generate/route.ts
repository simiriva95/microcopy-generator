import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, buildUserPrompt, buildHeroPrompt } from "@/lib/prompt";
import {
  parseVariants,
  parseHeroes,
  TONI,
  OBIETTIVI,
  SEZIONI,
  type GenerateInput,
} from "@/lib/schema";

export const runtime = "nodejs";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function validate(body: unknown): GenerateInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const descrizione = typeof b.descrizione === "string" ? b.descrizione.trim() : "";
  const target = typeof b.target === "string" ? b.target.trim() : "";
  if (descrizione.length < 3 || target.length < 2) return null;
  if (!TONI.includes(b.tono as never)) return null;
  if (!OBIETTIVI.includes(b.obiettivo as never)) return null;
  // In "completa" mode sezione is irrelevant; default it so validation passes.
  const sezione = SEZIONI.includes(b.sezione as never)
    ? (b.sezione as GenerateInput["sezione"])
    : "hero headline";
  return {
    descrizione: descrizione.slice(0, 1000),
    target: target.slice(0, 500),
    tono: b.tono as GenerateInput["tono"],
    obiettivo: b.obiettivo as GenerateInput["obiettivo"],
    sezione,
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY non configurata. Aggiungila in .env.local." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const input = validate(body);
  if (!input) {
    return NextResponse.json(
      { error: "Input mancante o non valido. Compila descrizione e target." },
      { status: 400 }
    );
  }

  // Optional refine/regenerate options.
  const b = body as Record<string, unknown>;
  const rawCount = Number(b.count);
  const opts = {
    count: Number.isFinite(rawCount) ? Math.min(4, Math.max(1, rawCount)) : 4,
    raffina: typeof b.raffina === "string" ? b.raffina.slice(0, 200) : undefined,
    evita: Array.isArray(b.evita)
      ? b.evita.filter((x): x is string => typeof x === "string").slice(0, 12)
      : undefined,
  };

  const completa = b.modo === "completa";
  const groq = new Groq({ apiKey });

  let content: string;
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature: 0.8,
      max_tokens: completa ? 3072 : 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: completa
            ? buildHeroPrompt(input, opts)
            : buildUserPrompt(input, opts),
        },
      ],
    });
    content = completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore chiamata modello.";
    return NextResponse.json(
      { error: `Modello non raggiungibile: ${msg}` },
      { status: 502 }
    );
  }

  if (completa) {
    const heroes = parseHeroes(content);
    if (heroes.length === 0) {
      return NextResponse.json(
        { error: "Impossibile interpretare la risposta del modello. Riprova." },
        { status: 502 }
      );
    }
    return NextResponse.json({ heroes });
  }

  const variants = parseVariants(content);
  if (variants.length === 0) {
    return NextResponse.json(
      { error: "Impossibile interpretare la risposta del modello. Riprova." },
      { status: 502 }
    );
  }

  return NextResponse.json({ variants });
}
