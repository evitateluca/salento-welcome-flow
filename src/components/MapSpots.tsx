import { useEffect, useState } from "react";
import { MapPin, ShoppingBasket, Cross, UtensilsCrossed, Waves, Sparkles, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type Category = "essenziali" | "locali";
type SpotKey = "conad" | "farmacia" | "leZie" | "natale" | "pescoluse" | "baiaTurchi" | "frantoio";
type SpotType = "supermercato" | "farmacia" | "ristorante" | "spiaggia" | "chicca";

interface Spot {
  key: SpotKey;
  category: Category;
  type: SpotType;
  mapsQuery: string;
}

const SPOTS: Spot[] = [
  { key: "conad", category: "essenziali", type: "supermercato", mapsQuery: "Conad Lecce" },
  { key: "farmacia", category: "essenziali", type: "farmacia", mapsQuery: "Farmacia Lecce centro" },
  { key: "leZie", category: "locali", type: "ristorante", mapsQuery: "Trattoria Le Zie Lecce" },
  { key: "natale", category: "locali", type: "ristorante", mapsQuery: "Pasticceria Natale Lecce" },
  { key: "pescoluse", category: "locali", type: "spiaggia", mapsQuery: "Pescoluse Maldive Salento" },
  { key: "baiaTurchi", category: "locali", type: "spiaggia", mapsQuery: "Baia dei Turchi Otranto" },
  { key: "frantoio", category: "locali", type: "chicca", mapsQuery: "Frantoio ipogeo Salento" },
];

const TYPE_META: Record<SpotType, { icon: LucideIcon; color: string }> = {
  supermercato: { icon: ShoppingBasket, color: "var(--olive)" },
  farmacia: { icon: Cross, color: "var(--destructive)" },
  ristorante: { icon: UtensilsCrossed, color: "var(--sun)" },
  spiaggia: { icon: Waves, color: "var(--sea)" },
  chicca: { icon: Sparkles, color: "var(--olive)" },
};

export function MapSpots() {
  const { t } = useT();
  const [tab, setTab] = useState<Category>("essenziali");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Category;
      if (detail === "essenziali" || detail === "locali") {
        setTab(detail);
        setPulse(true);
        setTimeout(() => setPulse(false), 900);
      }
    };
    window.addEventListener("mapspots:set-tab", handler);
    return () => window.removeEventListener("mapspots:set-tab", handler);
  }, []);

  const filtered = SPOTS.filter((s) => s.category === tab);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.map.title}</h2>
      </header>

      <div className="mb-4 inline-flex rounded-full bg-muted p-1">
        {(["essenziali", "locali"] as const).map((c) => {
          const active = tab === c;
          return (
            <button
              key={c}
              onClick={() => setTab(c)}
              className="rounded-full px-4 py-1.5 text-xs font-medium capitalize transition"
              style={{
                backgroundColor: active ? "var(--primary)" : "transparent",
                color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                boxShadow: active && pulse ? "0 0 0 4px color-mix(in oklab, var(--olive) 30%, transparent)" : "none",
                transition: "background-color 0.2s, color 0.2s, box-shadow 0.4s",
              }}
            >
              {c === "essenziali" ? t.map.tabs.essentials : t.map.tabs.locals}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const meta = TYPE_META[s.type];
          const Icon = meta.icon;
          const info = t.map.spots[s.key];
          return (
            <a
              key={s.key}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapsQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 transition active:scale-[0.98]"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Icon className="h-5 w-5" style={{ color: meta.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{info.name}</p>
                <p className="truncate text-xs text-muted-foreground">{info.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
