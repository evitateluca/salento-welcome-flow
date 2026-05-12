import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, CloudLightning, CloudFog, Snowflake, Wind, Waves, Mountain, Coffee } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type SuggestionKey = "sea" | "inland" | "cozy" | "windy";
type ConditionKey = "clear" | "cloudy" | "rain" | "storm" | "fog" | "snow";

interface Weather {
  tempMax: number;
  wind: number;
  condition: ConditionKey;
  suggestion: SuggestionKey;
}

const CONDITION_ICONS: Record<ConditionKey, LucideIcon> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
  fog: CloudFog,
  snow: Snowflake,
};

const SUGGESTION_ICONS: Record<SuggestionKey, LucideIcon> = {
  sea: Waves,
  inland: Mountain,
  cozy: Coffee,
  windy: Wind,
};

const SUGGESTION_COLORS: Record<SuggestionKey, string> = {
  sea: "var(--sea)",
  inland: "var(--olive)",
  cozy: "var(--sun)",
  windy: "var(--sea)",
};

// WMO weather codes → our buckets
function mapCondition(code: number): ConditionKey {
  if ([0, 1].includes(code)) return "clear";
  if ([2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([95, 96, 99].includes(code)) return "storm";
  if (code >= 71 && code <= 77) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86)) return "rain";
  return "cloudy";
}

function pickSuggestion(c: ConditionKey, tempMax: number, wind: number): SuggestionKey {
  if (wind >= 30) return "windy";
  if (c === "rain" || c === "storm" || c === "snow" || c === "fog") return "cozy";
  if (c === "clear" && tempMax >= 24) return "sea";
  if (c === "cloudy" && tempMax >= 28) return "sea";
  return "inland";
}

export function TodaySuggestion() {
  const { t } = useT();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=40.355&longitude=18.172&daily=weather_code,temperature_2m_max,wind_speed_10m_max&timezone=Europe%2FRome&forecast_days=1";
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (cancelled) return;
        const code = d?.daily?.weather_code?.[0] ?? 0;
        const tempMax = Math.round(d?.daily?.temperature_2m_max?.[0] ?? 0);
        const wind = Math.round(d?.daily?.wind_speed_10m_max?.[0] ?? 0);
        const condition = mapCondition(code);
        setWeather({ tempMax, wind, condition, suggestion: pickSuggestion(condition, tempMax, wind) });
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <Sun className="h-5 w-5" style={{ color: "var(--sun)" }} />
        <h2 className="text-2xl font-medium">{t.today.title}</h2>
      </header>

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        {!weather && !error && (
          <div className="flex items-center gap-3 px-4 py-6">
            <div className="h-3 w-3 animate-pulse rounded-full" style={{ backgroundColor: "var(--sun)" }} />
            <p className="text-sm text-muted-foreground">{t.today.loading}</p>
          </div>
        )}

        {error && (
          <div className="px-4 py-6">
            <p className="text-sm text-muted-foreground">{t.today.error}</p>
          </div>
        )}

        {weather && (
          <>
            {/* Weather strip */}
            <div
              className="flex items-center gap-4 px-4 py-4"
              style={{ backgroundColor: "color-mix(in oklab, var(--sun) 12%, transparent)" }}
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--card)" }}
              >
                {(() => {
                  const Icon = CONDITION_ICONS[weather.condition];
                  return <Icon className="h-7 w-7" style={{ color: "var(--sun)" }} />;
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.today.conditions[weather.condition]}</p>
                <p className="text-xs text-muted-foreground">
                  {t.today.maxLabel} {weather.tempMax}°C · {t.today.windLabel} {weather.wind} km/h
                </p>
              </div>
            </div>

            {/* Suggestion */}
            <div className="border-t border-border px-4 py-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {(() => {
                    const Icon = SUGGESTION_ICONS[weather.suggestion];
                    return (
                      <Icon className="h-5 w-5" style={{ color: SUGGESTION_COLORS[weather.suggestion] }} />
                    );
                  })()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                      style={{
                        backgroundColor: "color-mix(in oklab, var(--olive) 15%, transparent)",
                        color: "var(--olive)",
                      }}
                    >
                      {t.today.suggestions[weather.suggestion].badge}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{t.today.suggestions[weather.suggestion].title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t.today.suggestions[weather.suggestion].body}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
