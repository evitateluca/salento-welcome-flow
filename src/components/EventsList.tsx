import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { useHouseConfig } from "@/config/houseContext";
import type { EventData } from "@/lib/houseConfigTypes";

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parse = (s?: string) => {
  if (!s) return null;
  const d = new Date(`${s}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

export function EventsList() {
  const { t, lang } = useT();
  const { config } = useHouseConfig();
  const locale = lang === "en" ? "en-GB" : "it-IT";

  const events = useMemo(() => {
    const list = [...(config?.events ?? [])];
    return list.sort((a, b) => {
      const da = parse(a.date)?.getTime();
      const db = parse(b.date)?.getTime();
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  }, [config?.events]);

  const calendarOn = config?.events_calendar ?? false;

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
      ) : calendarOn ? (
        <EventsCalendar events={events} locale={locale} lang={lang} />
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} locale={locale} lang={lang} />
          ))}
        </div>
      )}
    </section>
  );
}

function EventCard({ event: e, locale, lang }: { event: EventData; locale: string; lang: string }) {
  const title = lang === "en" ? e.title_en : e.title_it;
  const desc = lang === "en" ? e.desc_en : e.desc_it;
  const fmt = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString(locale, { day: "2-digit", month: "short" });
  const start = parse(e.date) ? fmt(e.date) : "";
  const end = e.date_end && e.date_end !== e.date && parse(e.date_end) ? fmt(e.date_end) : "";
  const href = e.maps_query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.maps_query)}`
    : undefined;
  const Wrapper: React.ElementType = href ? "a" : "div";
  const wrapperProps = href ? { href, target: "_blank", rel: "noreferrer" as const } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="flex items-start gap-3 rounded-3xl border border-border bg-card px-4 py-3 transition active:scale-[0.98]"
    >
      <div
        className="flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-center"
        style={{ backgroundColor: "var(--accent)", color: "var(--olive)" }}
      >
        {start ? (
          <>
            <span className="text-[11px] font-medium leading-tight">{start}</span>
            {end && (
              <>
                <span className="text-[9px] leading-none opacity-70">→</span>
                <span className="text-[11px] font-medium leading-tight">{end}</span>
              </>
            )}
          </>
        ) : (
          <CalendarDays className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {desc && (
          <p className="mt-0.5 whitespace-pre-line break-words text-xs text-muted-foreground">{desc}</p>
        )}
        {e.location && (
          <p className="mt-0.5 break-words text-xs text-muted-foreground">{e.location}</p>
        )}
      </div>
      {href && <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />}
    </Wrapper>
  );
}

function EventsCalendar({
  events,
  locale,
  lang,
}: {
  events: EventData[];
  locale: string;
  lang: string;
}) {
  const firstEvent = events.find((e) => parse(e.date));
  const initial = parse(firstEvent?.date) ?? new Date();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(null);

  // map day -> events
  const byDay = useMemo(() => {
    const m = new Map<string, EventData[]>();
    for (const e of events) {
      const s = parse(e.date);
      if (!s) continue;
      const end = parse(e.date_end ?? "") ?? s;
      const d = new Date(s);
      let guard = 0;
      while (d <= end && guard < 366) {
        const k = dayKey(d);
        m.set(k, [...(m.get(k) ?? []), e]);
        d.setDate(d.getDate() + 1);
        guard++;
      }
    }
    return m;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; // monday first
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weekdays =
    lang === "en"
      ? ["M", "T", "W", "T", "F", "S", "S"]
      : ["L", "M", "M", "G", "V", "S", "D"];

  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            aria-label="prev"
            onClick={() => { setCursor(new Date(year, month - 1, 1)); setSelected(null); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium capitalize">
            {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
          </p>
          <button
            aria-label="next"
            onClick={() => { setCursor(new Date(year, month + 1, 1)); setSelected(null); }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          {weekdays.map((w, i) => (
            <span key={i} className="py-1">{w}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <span key={`e${i}`} />;
            const key = dayKey(new Date(year, month, day));
            const has = byDay.has(key);
            const isToday = key === dayKey(today);
            const isSel = key === selected;
            return (
              <button
                key={key}
                disabled={!has}
                onClick={() => setSelected(isSel ? null : key)}
                className="relative flex aspect-square items-center justify-center rounded-xl text-xs transition disabled:opacity-40"
                style={
                  isSel
                    ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
                    : has
                      ? { backgroundColor: "var(--accent)", color: "var(--olive)", fontWeight: 500 }
                      : undefined
                }
              >
                <span className={isToday && !isSel ? "underline underline-offset-2" : undefined}>
                  {day}
                </span>
                {has && !isSel && (
                  <span
                    className="absolute bottom-1 h-1 w-1 rounded-full"
                    style={{ backgroundColor: "var(--olive)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {(selected ? selectedEvents : events).map((e) => (
          <EventCard key={`${selected ?? "all"}-${e.id}`} event={e} locale={locale} lang={lang} />
        ))}
      </div>
    </div>
  );
}
