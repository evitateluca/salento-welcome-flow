import { CalendarDays, ExternalLink } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { useHouseConfig } from "@/config/houseContext";

export function EventsList() {
  const { t, lang } = useT();
  const { config } = useHouseConfig();
  const events = config?.events ?? [];

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.events.title}</h2>
      </header>

      {events.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
          {t.events.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const title = lang === "en" ? e.title_en : e.title_it;
            const desc = lang === "en" ? e.desc_en : e.desc_it;
            const date = e.date
              ? new Date(e.date).toLocaleDateString(lang === "en" ? "en-GB" : "it-IT", {
                  day: "2-digit",
                  month: "short",
                })
              : "";
            const href = e.maps_query
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.maps_query)}`
              : undefined;
            const Wrapper: React.ElementType = href ? "a" : "div";
            const wrapperProps = href
              ? { href, target: "_blank", rel: "noreferrer" as const }
              : {};
            return (
              <Wrapper
                key={e.id}
                {...wrapperProps}
                className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3 transition active:scale-[0.98]"
              >
                <div
                  className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-center"
                  style={{ backgroundColor: "var(--accent)", color: "var(--olive)" }}
                >
                  {date ? (
                    <span className="text-[11px] font-medium leading-tight">{date}</span>
                  ) : (
                    <CalendarDays className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {desc}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                </div>
                {href && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
              </Wrapper>
            );
          })}
        </div>
      )}
    </section>
  );
}
