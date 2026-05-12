import { useT } from "@/i18n/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useT();
  const next = lang === "it" ? "en" : "it";
  const flag = lang === "it" ? "🇮🇹" : "🇬🇧";
  const code = lang.toUpperCase();

  return (
    <button
      onClick={() => setLang(next)}
      aria-label={`Switch to ${next === "it" ? "Italian" : "English"}`}
      className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition active:scale-95"
    >
      <span className="text-base leading-none">{flag}</span>
      <span className="tracking-wider">{code}</span>
    </button>
  );
}
