import { BookOpen, Trash2, Snowflake, KeyRound, Cigarette, PawPrint, Clock, Droplets } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  body: string;
}

const ITEMS: Item[] = [
  {
    icon: Trash2,
    title: "Raccolta differenziata",
    body: "Lunedì: organico. Martedì: plastica e metalli. Giovedì: carta. Sabato: vetro. I bidoni sono nel cortile — esporre entro le 6:00.",
  },
  {
    icon: Snowflake,
    title: "Aria condizionata",
    body: "Telecomando sul comodino. Ti chiediamo di tenerla a 24°C e di spegnerla quando esci, per rispetto dell'ambiente e per il comfort serale.",
  },
  {
    icon: Droplets,
    title: "Acqua calda",
    body: "Lo scaldabagno si attiva automaticamente. Per docce molto lunghe, attendi 30 min tra un utilizzo e l'altro.",
  },
  {
    icon: KeyRound,
    title: "Chiavi & accesso",
    body: "Due mazzi di chiavi sul tavolo d'ingresso. Il portone si chiude automaticamente — porta sempre le chiavi con te.",
  },
  {
    icon: Clock,
    title: "Check-out",
    body: "Entro le 10:00. Lascia le chiavi sul tavolo della cucina e chiudi semplicemente la porta dietro di te.",
  },
  {
    icon: Cigarette,
    title: "No fumo in casa",
    body: "È possibile fumare in terrazza — trovi un posacenere sul tavolino esterno.",
  },
  {
    icon: PawPrint,
    title: "Animali",
    body: "Pet-friendly! Ciotole e copertina nello sgabuzzino. Per favore, non far salire gli animali sul divano bianco.",
  },
];

export function HouseManual() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">Manuale & FAQ</h2>
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const open = openIdx === i;
          return (
            <div key={it.title} className={i > 0 ? "border-t border-border" : ""}>
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--olive)" }} />
                </div>
                <span className="flex-1 text-sm font-medium">{it.title}</span>
                <ChevronDown
                  className="h-4 w-4 text-muted-foreground transition-transform"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              {open && (
                <p className="px-4 pb-4 pl-16 pr-6 text-sm leading-relaxed text-muted-foreground">
                  {it.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
