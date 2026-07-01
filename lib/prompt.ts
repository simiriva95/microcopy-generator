import type {
  GenerateInput,
  GenerateOptions,
  Tono,
  Obiettivo,
  Sezione,
} from "./schema";

// Concrete, differentiated directives per tone — this is the lever that makes
// "cambiando tono il copy cambia in modo evidente e coerente" actually true.
const TONO_DIRETTIVE: Record<Tono, string> = {
  autorevole:
    "Tono AUTOREVOLE: sicuro, competente, basato su dati e credibilità. Lessico preciso e professionale, frasi affermative. Evita punti esclamativi, slang, emoji. Trasmetti expertise e affidabilità.",
  amichevole:
    "Tono AMICHEVOLE: caldo, colloquiale, come un consiglio da un amico. Usa 'tu', domande retoriche, linguaggio semplice e rassicurante. Vicinanza e empatia, mai formale.",
  audace:
    "Tono AUDACE: provocatorio, energico, che sfida lo status quo. Frasi brevi e incisive, verbi forti, contrasti netti. Può usare un punto esclamativo. Deve colpire e spingere all'azione.",
  minimale:
    "Tono MINIMALE: essenziale, asciutto, zero fronzoli. Poche parole ad altissima densità di significato. Nessun aggettivo superfluo. Chiarezza chirurgica, stile alla Apple.",
};

const OBIETTIVO_DIRETTIVE: Record<Obiettivo, string> = {
  iscrizione:
    "Obiettivo: ISCRIZIONE (newsletter/waitlist/account gratuito). Enfatizza basso attrito, gratuità, valore immediato ricevuto iscrivendosi.",
  acquisto:
    "Obiettivo: ACQUISTO. Enfatizza valore vs prezzo, trasformazione ottenuta, riduzione del rischio percepito (garanzie, prova).",
  download:
    "Obiettivo: DOWNLOAD (app/risorsa/guida). Enfatizza immediatezza, cosa si ottiene subito, assenza di barriere.",
  contatto:
    "Obiettivo: CONTATTO (demo/preventivo/parlare con vendite). Enfatizza consulenza, risposta a un bisogno specifico, nessun impegno.",
};

const SEZIONE_DIRETTIVE: Record<Sezione, string> = {
  "hero headline":
    "Sezione: HERO HEADLINE. Il titolo principale in cima alla pagina. Massimo impatto, comunica il beneficio centrale in ~3-9 parole. Idealmente < 60 caratteri.",
  subheadline:
    "Sezione: SUBHEADLINE. Frase di supporto sotto l'headline: chiarisce, aggiunge specificità, gestisce l'obiezione principale. 1-2 frasi, ~10-20 parole.",
  "CTA button":
    "Sezione: CTA BUTTON. Testo del pulsante. Inizia SEMPRE con un verbo d'azione in prima persona o imperativo (es. 'Inizia gratis', 'Ottieni la demo'). 2-5 parole, < 30 caratteri.",
  "value proposition":
    "Sezione: VALUE PROPOSITION. Dichiarazione di valore: per chi, quale problema risolvi, in cosa sei diverso. Concreta e specifica, 1-2 frasi.",
  "social proof":
    "Sezione: SOCIAL PROOF. Micro-copy di riprova sociale (es. sopra/sotto una CTA o una fascia loghi): numeri, categorie di clienti, risultati. Credibile e verificabile nel tono, mai numeri palesemente inventati.",
};

export const SYSTEM_PROMPT = `Sei un copywriter senior specializzato in conversion copywriting per landing page, con solide basi di UX writing e psicologia comportamentale.

PRINCIPI DI COPYWRITING (obbligatori):
- SPECIFICITÀ > GENERICITÀ: preferisci dettagli concreti, numeri e sostantivi precisi a frasi vaghe e riempitive.
- BENEFICIO > FEATURE: comunica il risultato per l'utente, non la caratteristica tecnica.
- VERBI D'AZIONE nelle CTA: ogni call-to-action inizia con un verbo forte e concreto.
- CHIAREZZA > INTELLIGENZA: se una battuta o un gioco di parole riduce la comprensione, eliminalo.

DIVIETI ASSOLUTI:
- Vietato inventare claim falsi, dati non verificabili o promesse iperboliche ("il migliore del mondo", "risultati garantiti al 100%", numeri inventati).
- Vietato il riempitivo generico ("soluzioni innovative", "la qualità che cerchi") privo di sostanza.
- Vietato copiare marchi altrui o fare affermazioni comparative non supportabili.

PRINCIPI PSICOLOGICI che puoi applicare (dichiara sempre quale usi e come): urgenza, scarsità, riprova sociale, avversione alla perdita, reciprocità, ancoraggio, effetto autorità, curiosity gap, bias dell'impegno, framing del beneficio.

REGOLE DI OUTPUT:
- Genera il numero di varianti richiesto nel messaggio utente, tutte distinte tra loro (angoli/leve psicologiche diversi, non riformulazioni cosmetiche).
- Ogni razionale_ux deve essere SPECIFICO a QUEL testo: cita il principio applicato e spiega perché funziona su questa esatta formulazione e su questo target. Niente razionali generici riutilizzabili.
- Il campo principio_psicologico è un'ETICHETTA BREVE di 1-3 parole (es. "urgenza", "riprova sociale", "avversione alla perdita"). NON scrivere una frase: la spiegazione va in razionale_ux.
- Rispondi SOLO con JSON valido, senza testo prima o dopo, in questo formato esatto:
{"varianti":[{"variante":"A","testo":"...","razionale_ux":"...","principio_psicologico":"...","lunghezza_caratteri":0,"punteggio_chiarezza_1_10":8}]}
- Tutti i testi in italiano.`;

// "Hero completa": all sections at once, as cohesive full-hero variants.
export function buildHeroPrompt(
  input: GenerateInput,
  opts: GenerateOptions = {}
): string {
  const count = Math.min(3, Math.max(1, opts.count ?? 3));
  const lines = [
    `PRODOTTO/SERVIZIO: ${input.descrizione}`,
    `TARGET AUDIENCE: ${input.target}`,
    "",
    TONO_DIRETTIVE[input.tono],
    OBIETTIVO_DIRETTIVE[input.obiettivo],
    "",
    `Genera ${count} varianti di HERO SECTION COMPLETE e coerenti al loro interno (headline, subheadline, cta, value_proposition, social_proof lavorano insieme come un unico blocco).`,
    "Vincoli per campo: headline < 60 caratteri; subheadline 1-2 frasi; cta 2-5 parole che iniziano con un verbo d'azione; value_proposition 1-2 frasi; social_proof breve e credibile (niente numeri palesemente inventati).",
  ];
  if (opts.raffina && opts.raffina.trim()) {
    lines.push(`INDICAZIONE DI RAFFINAZIONE (prioritaria): ${opts.raffina.trim()}`);
  }
  if (opts.evita && opts.evita.length) {
    lines.push(
      "NON riproporre queste headline già generate:",
      ...opts.evita.slice(0, 12).map((t) => `- ${t}`)
    );
  }
  lines.push(
    "",
    'Rispondi SOLO con JSON valido in questo formato esatto:',
    '{"varianti":[{"variante":"A","headline":"...","subheadline":"...","cta":"...","value_proposition":"...","social_proof":"...","razionale_ux":"...","principio_psicologico":"..."}]}',
    "razionale_ux spiega perché QUESTA hero funziona nel suo insieme. principio_psicologico è un'etichetta breve (1-3 parole). Tutto in italiano."
  );
  return lines.join("\n");
}

export function buildUserPrompt(
  input: GenerateInput,
  opts: GenerateOptions = {}
): string {
  const count = Math.min(4, Math.max(1, opts.count ?? 4));
  const lines = [
    `PRODOTTO/SERVIZIO: ${input.descrizione}`,
    `TARGET AUDIENCE: ${input.target}`,
    "",
    TONO_DIRETTIVE[input.tono],
    OBIETTIVO_DIRETTIVE[input.obiettivo],
    SEZIONE_DIRETTIVE[input.sezione],
  ];

  if (opts.raffina && opts.raffina.trim()) {
    lines.push("", `INDICAZIONE DI RAFFINAZIONE (prioritaria): ${opts.raffina.trim()}`);
  }
  if (opts.evita && opts.evita.length) {
    lines.push(
      "",
      "NON riproporre né parafrasare questi testi già generati:",
      ...opts.evita.slice(0, 12).map((t) => `- ${t}`)
    );
  }

  lines.push(
    "",
    `Genera ESATTAMENTE ${count} variant${count === 1 ? "e" : "i"} A/B per questa sezione, rispettando tono, obiettivo e vincoli di lunghezza. Ricorda: razionale specifico al testo, nessun claim falso, output solo JSON nel formato {"varianti":[...]}.`
  );

  return lines.join("\n");
}
