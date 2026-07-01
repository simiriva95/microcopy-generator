"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={dark ? "Tema chiaro" : "Tema scuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30"
    >
      <Sun className={`h-4 w-4 transition-all ${dark ? "scale-0 -rotate-90 absolute" : "scale-100 rotate-0"}`} />
      <Moon className={`h-4 w-4 transition-all ${dark ? "scale-100 rotate-0" : "scale-0 rotate-90 absolute"}`} />
    </button>
  );
}
