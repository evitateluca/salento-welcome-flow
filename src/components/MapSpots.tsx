import { useEffect, useState } from "react";
import { MapPin, ShoppingBasket, Cross, UtensilsCrossed, Waves, Sparkles, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Category = "essenziali" | "locali";

interface Spot {
  name: string;
  desc: string;
  category: Category;
  type: "supermercato" | "farmacia" | "ristorante" | "spiaggia" | "chicca";
  mapsQuery: string;
}

const SPOTS: Spot[] = [
  { name: "Supermercato Conad", desc: "A 5 min a piedi — aperto 8:00–21:00", category: "essenziali", type: "supermercato", mapsQuery: "Conad Lecce" },
  { name: "Farmacia Centrale", desc: "Turno notturno il martedì", category: "essenziali", type: "farmacia", mapsQuery: "Farmacia Lecce centro" },
  { name: "Trattoria Le Zie", desc: "Cucina salentina autentica — prenotare", category: "locali", type: "ristorante", mapsQuery: "Trattoria Le Zie Lecce" },
  { name: "Pasticceria Natale", desc: "Pasticciotto leccese imperdibile", category: "locali", type: "ristorante", mapsQuery: "Pasticceria Natale Lecce" },
  { name: "Spiaggia di Pescoluse", desc: "Le 'Maldive del Salento' — 40 min auto", category: "locali", type: "spiaggia", mapsQuery: "Pescoluse Maldive Salento" },
  { name: "Baia dei Turchi", desc: "Acqua cristallina, pineta ombrosa", category: "locali", type: "spiaggia", mapsQuery: "Baia dei Turchi Otranto" },
  { name: "Frantoio Ipogeo", desc: "Chicca nascosta — antico frantoio sotterraneo", category: "locali", type: "chicca", mapsQuery: "Frantoio ipogeo Salento" },
];

const TYPE_META: Record<Spot["type"], { icon: LucideIcon; color: string }> = {
  supermercato: { icon: ShoppingBasket, color: "var(--olive)" },
  farmacia: { icon: Cross, color: "var(--destructive)" },
  ristorante: { icon: UtensilsCrossed, color: "var(--sun)" },
  spiaggia: { icon: Waves, color: "var(--sea)" },
  chicca: { icon: Sparkles, color: "var(--olive)" },
};

export function MapSpots() {
  const [tab, setTab] = useState<Category>("essenziali");
  const filtered = SPOTS.filter((s) => s.category === tab);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">Mappa & Spot</h2>
      </header>

      <div className="mb-4 inline-flex rounded-full bg-muted p-1">
        {(["essenziali", "locali"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className="rounded-full px-4 py-1.5 text-xs font-medium capitalize transition"
            style={{
              backgroundColor: tab === c ? "var(--primary)" : "transparent",
              color: tab === c ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {c === "essenziali" ? "Essenziali" : "Spot Locali"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const meta = TYPE_META[s.type];
          const Icon = meta.icon;
          return (
            <a
              key={s.name}
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
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
