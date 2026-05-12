import { BookOpen, Trash2, Snowflake, KeyRound, Cigarette, PawPrint, Clock, Droplets, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/LanguageContext";

type ItemKey = "trash" | "ac" | "water" | "keys" | "checkout" | "smoke" | "pets";

const ITEMS: { key: ItemKey; icon: LucideIcon }[] = [
  { key: "trash", icon: Trash2 },
  { key: "ac", icon: Snowflake },
  { key: "water", icon: Droplets },
  { key: "keys", icon: KeyRound },
  { key: "checkout", icon: Clock },
  { key: "smoke", icon: Cigarette },
  { key: "pets", icon: PawPrint },
];

export function HouseManual() {
  const { t } = useT();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.manual.title}</h2>
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {ITEMS.map((it, i) => {
          const Icon = it.icon;
          const open = openIdx === i;
          const info = t.manual.items[it.key];
          return (
            <div key={it.key} className={i > 0 ? "border-t border-border" : ""}>
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
                <span className="flex-1 text-sm font-medium">{info.title}</span>
                <ChevronDown
                  className="h-4 w-4 text-muted-foreground transition-transform"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              {open && (
                <p className="px-4 pb-4 pl-16 pr-6 text-sm leading-relaxed text-muted-foreground">
                  {info.body}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
