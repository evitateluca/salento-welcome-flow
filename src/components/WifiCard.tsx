import { Wifi, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/LanguageContext";

const WIFI_NAME = "Casa_Salento_Flow";
const WIFI_PASSWORD = "ulivo2024";

export function WifiCard() {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WIFI_PASSWORD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="sticky top-3 z-40 mx-3">
      <div className="glass-card rounded-3xl border border-border/60 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Wifi className="h-5 w-5" style={{ color: "var(--olive)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.wifi.label}</p>
            <p className="truncate text-sm font-medium">{WIFI_NAME}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{WIFI_PASSWORD}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex h-10 items-center gap-1.5 rounded-2xl px-3 text-xs font-medium transition active:scale-95"
            style={{
              backgroundColor: copied ? "var(--olive)" : "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t.wifi.copied : t.wifi.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
