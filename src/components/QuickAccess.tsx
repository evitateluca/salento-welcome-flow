import { Wifi, MapPin, ShoppingBasket, UtensilsCrossed, Waves, BookOpen, HelpCircle, Phone, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type TileKey = "wifi" | "map" | "supermarkets" | "restaurants" | "beaches" | "localSpots" | "manual" | "rules" | "contacts";

interface Tile {
  key: TileKey;
  icon: LucideIcon;
  target: string;
  tab?: "essenziali" | "locali";
  color?: string;
}

const TILES: Tile[] = [
  { key: "wifi", icon: Wifi, target: "wifi" },
  { key: "map", icon: MapPin, target: "mappa" },
  { key: "supermarkets", icon: ShoppingBasket, target: "mappa", tab: "essenziali" },
  { key: "restaurants", icon: UtensilsCrossed, target: "mappa", tab: "locali", color: "var(--sun)" },
  { key: "beaches", icon: Waves, target: "mappa", tab: "locali", color: "var(--sea)" },
  { key: "localSpots", icon: Sparkles, target: "mappa", tab: "locali" },
  { key: "manual", icon: BookOpen, target: "manuale" },
  { key: "rules", icon: HelpCircle, target: "manuale" },
  { key: "contacts", icon: Phone, target: "contatti" },
];

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 12;
  const start = window.scrollY;
  const distance = top - start;
  const duration = 650;
  const startTime = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function QuickAccess() {
  const { t } = useT();

  const handleClick = (tile: Tile) => {
    if (tile.tab) {
      window.dispatchEvent(new CustomEvent("mapspots:set-tab", { detail: tile.tab }));
    }
    setTimeout(() => smoothScrollTo(tile.target), 60);
  };

  return (
    <section className="px-4">
      <header className="mb-4 px-1">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {t.quickAccess.kicker}
        </p>
      </header>
      <div className="grid grid-cols-3 gap-3">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.key}
              onClick={() => handleClick(tile)}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border border-border bg-card p-3 text-center transition active:scale-95"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Icon className="h-5 w-5" style={{ color: tile.color ?? "var(--olive)" }} />
              </div>
              <span className="text-[11px] font-medium leading-tight">{t.quickAccess.tiles[tile.key]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
