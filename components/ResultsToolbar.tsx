"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  Scissors,
  Flame,
  Baby,
  Download,
  ClipboardCopy,
  ChevronDown,
} from "lucide-react";

export type ExportKind = "copy" | "md" | "csv" | "json";

const REFINE = [
  { label: "Rigenera", directive: null, icon: RefreshCw },
  { label: "Più corte", directive: "Accorcia sensibilmente tutte le varianti mantenendo l'impatto.", icon: Scissors },
  { label: "Più incisive", directive: "Rendi le varianti più incisive, dirette e memorabili.", icon: Flame },
  { label: "Più semplici", directive: "Semplifica il linguaggio: parole comuni, zero gergo.", icon: Baby },
] as const;

export function ResultsToolbar({
  onRefine,
  onExport,
  refining,
  disabled,
}: {
  onRefine: (directive: string | null) => void;
  onExport: (kind: ExportKind) => void;
  refining: boolean;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Raffina
      </span>
      {REFINE.map(({ label, directive, icon: Icon }) => (
        <button
          key={label}
          onClick={() => onRefine(directive)}
          disabled={refining || disabled}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground/30 hover:bg-accent disabled:opacity-40"
        >
          <Icon className={`h-3.5 w-3.5 ${refining && directive === null ? "animate-spin" : ""}`} />
          {label}
        </button>
      ))}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" /> Esporta
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Esporta varianti</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onExport("copy")}>
              <ClipboardCopy className="mr-2 h-4 w-4" /> Copia tutte (testo)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onExport("md")}>
              Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("csv")}>
              CSV (.csv)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")}>
              JSON (.json)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
