import { useEffect, useState } from "react";
import { MapPin, ShoppingBasket, Cross, UtensilsCrossed, Waves, Sparkles, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { useHouseConfig } from "@/config/houseContext";
import type { SpotCategory, SpotType } from "@/lib/houseConfigTypes";
import { InteractiveMap } from "./InteractiveMap";

const CATEGORIES: SpotCategory[] = ["supermercati", "ristoranti", "essenziali", "locali"];

const TYPE_META: Record<SpotType, { icon: LucideIcon; color: string }> = {
  supermercato: { icon: ShoppingBasket, color: "var(--olive)" },
  farmacia: { icon: Cross, color: "var(--destructive)" },
  ristorante: { icon: UtensilsCrossed, color: "var(--sun)" },
  spiaggia: { icon: Waves, color: "var(--sea)" },
  chicca: { icon: Sparkles, color: "var(--olive)" },
};

export function MapSpots() {
  const { t, lang } = useT();
  const { config } = useHouseConfig();
  const [tab, setTab] = useState<SpotCategory>("supermercati");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as SpotCategory;
      if (CATEGORIES.includes(detail)) {
        setTab(detail);
        setPulse(true);
        setTimeout(() => setPulse(false), 900);
      }
    };
    window.addEventListener("mapspots:set-tab", handler);
    return () => window.removeEventListener("mapspots:set-tab", handler);
  }, []);

  const filtered = (config?.spots ?? []).filter((s) => s.category === tab);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.map.title}</h2>
      </header>

      <div className="mb-4 flex flex-wrap gap-1.5 rounded-3xl bg-muted p-1">
        {CATEGORIES.map((c) => {
          const active = tab === c;
          return (
            <button key={c} onClick={() => setTab(c)}
              className="flex-1 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition whitespace-nowrap"
              style={{
                backgroundColor: active ? "var(--primary)" : "transparent",
                color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                boxShadow: active && pulse ? "0 0 0 4px color-mix(in oklab, var(--olive) 30%, transparent)" : "none",
                transition: "background-color 0.2s, color 0.2s, box-shadow 0.4s",
              }}>
              {t.map.tabs[c]}
            </button>
          );
        })}
      </div>

      <div className="mb-4"><InteractiveMap category={tab} /></div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const meta = TYPE_META[s.type];
          const Icon = meta.icon;
          const name = lang === "en" ? s.name_en : s.name_it;
          const desc = lang === "en" ? s.desc_en : s.desc_it;
          return (
            <a key={s.id} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.maps_query)}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 transition active:scale-[0.98]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--accent)" }}>
                <Icon className="h-5 w-5" style={{ color: meta.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
