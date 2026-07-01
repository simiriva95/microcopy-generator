"use client";

import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Small "?" next to a label that explains a field in plain language.
export function InfoHint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-label="Cosa significa"
        className="inline-flex text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[15rem] text-pretty leading-snug">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
