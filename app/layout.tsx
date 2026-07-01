import type { Metadata } from "next";
import { Spectral, Hanken_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const serif = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Extra display/mono faces for the style presets (brutalism, pop, retro/tech).
const displayAlt = Archivo({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-display-alt",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Microcopy Generator — copy che converte, con razionale UX",
  description:
    "Genera headline, sottotitoli e CTA per landing page in varianti A/B, ognuna con razionale UX e principio psicologico.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={cn(
          sans.variable,
          serif.variable,
          displayAlt.variable,
          mono.variable,
          "font-sans min-h-screen"
        )}
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
