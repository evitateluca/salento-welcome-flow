import { Wifi, Copy, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/LanguageContext";

const WIFI_NAME = "Casa_Salento_Flow";
const WIFI_PASSWORD = "ulivo2024";

export function WifiCard() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("wifi:open", handler);
    return () => window.removeEventListener("wifi:open", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WIFI_PASSWORD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="close"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative m-3 w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent"
          aria-label="close"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Wifi className="h-6 w-6" style={{ color: "var(--olive)" }} />
        </div>

        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {t.wifi.label}
        </p>
        <h2 className="mt-1 text-2xl font-medium">{WIFI_NAME}</h2>

        <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Password
          </p>
          <p className="mt-1 select-all font-mono text-lg">{WIFI_PASSWORD}</p>
        </div>

        <button
          onClick={handleCopy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition active:scale-[0.98]"
          style={{
            backgroundColor: copied ? "var(--olive)" : "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? t.wifi.copied : t.wifi.copy}
        </button>
      </div>
    </div>
  );
}
