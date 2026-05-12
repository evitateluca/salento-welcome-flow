import { Wifi, MapPin, ShoppingBasket, UtensilsCrossed, Waves, BookOpen, HelpCircle, Phone, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Tile {
  label: string;
  icon: LucideIcon;
  target: string; // element id
  tab?: "essenziali" | "locali"; // optional MapSpots tab
  color?: string;
}

const TILES: Tile[] = [
  { label: "Wi-Fi", icon: Wifi, target: "wifi" },
  { label: "Mappa", icon: MapPin, target: "mappa" },
  { label: "Supermercati", icon: ShoppingBasket, target: "mappa", tab: "essenziali" },
  { label: "Ristoranti", icon: UtensilsCrossed, target: "mappa", tab: "locali", color: "var(--sun)" },
  { label: "Spiagge", icon: Waves, target: "mappa", tab: "locali", color: "var(--sea)" },
  { label: "Spot locali", icon: Sparkles, target: "mappa", tab: "locali" },
  { label: "Manuale casa", icon: BookOpen, target: "manuale" },
  { label: "Regole & FAQ", icon: HelpCircle, target: "manuale" },
  { label: "Contatti", icon: Phone, target: "contatti" },
];

export function QuickAccess() {
  const handleClick = (t: Tile) => {
    if (t.tab) {
      window.dispatchEvent(new CustomEvent("mapspots:set-tab", { detail: t.tab }));
    }
    const el = document.getElementById(t.target);
    if (el) {
      // small delay to let tab state update before scroll
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  };

  return (
    <section className="px-4">
      <header className="mb-4 px-1">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Tutto a portata di mano
        </p>
      </header>
      <div className="grid grid-cols-3 gap-3">
        {TILES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.label}
              onClick={() => handleClick(t)}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border border-border bg-card p-3 text-center transition active:scale-95"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Icon className="h-5 w-5" style={{ color: t.color ?? "var(--olive)" }} />
              </div>
              <span className="text-[11px] font-medium leading-tight">{t.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
