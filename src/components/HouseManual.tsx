import { BookOpen, Trash2, Snowflake, KeyRound, Cigarette, PawPrint, Clock, Droplets, ChevronDown, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/LanguageContext";
import { useHouseConfig } from "@/config/houseContext";

const ICONS: Record<string, LucideIcon> = {
  trash: Trash2,
  snowflake: Snowflake,
  droplets: Droplets,
  key: KeyRound,
  clock: Clock,
  cigarette: Cigarette,
  paw: PawPrint,
  book: BookOpen,
};

export function HouseManual() {
  const { t, lang } = useT();
  const { config } = useHouseConfig();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = config?.manual ?? [];

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.manual.title}</h2>
      </header>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] ?? HelpCircle;
          const open = openIdx === i;
          const title = lang === "en" ? it.title_en : it.title_it;
          const body = lang === "en" ? it.body_en : it.body_it;
          return (
            <div key={it.id} className={i > 0 ? "border-t border-border" : ""}>
              <button onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--accent)" }}>
                  <Icon className="h-4 w-4" style={{ color: "var(--olive)" }} />
                </div>
                <span className="flex-1 text-sm font-medium">{title}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {open && (
                <p className="px-4 pb-4 pl-16 pr-6 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{body}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
