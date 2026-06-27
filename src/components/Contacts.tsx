import { Phone, MessageCircle, Siren, Stethoscope, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { houseConfig, type ContactConfig } from "@/config/house";

const ICONS: Record<ContactConfig["key"], LucideIcon> = {
  host: Phone,
  emergency: Siren,
  doctor: Stethoscope,
  fire: Flame,
};

const CONTACTS = houseConfig.contacts.map((c) => ({ ...c, icon: ICONS[c.key] }));

export function Contacts() {
  const { t } = useT();
  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <Phone className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">{t.contacts.title}</h2>
      </header>
      <div className="space-y-3">
        {CONTACTS.map((c) => {
          const Icon = c.icon;
          const info = t.contacts.items[c.key];
          return (
            <div
              key={c.key}
              className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: c.emergency
                    ? "color-mix(in oklab, var(--destructive) 15%, transparent)"
                    : "var(--accent)",
                }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: c.emergency ? "var(--destructive)" : "var(--olive)" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{info.label}</p>
                <p className="truncate text-xs text-muted-foreground">{info.sub}</p>
              </div>
              <div className="flex gap-2">
                {c.whatsapp && (
                  <a
                    href={`https://wa.me/${c.number.replace(/[^0-9]/g, "")}`}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl transition active:scale-95"
                    style={{ backgroundColor: "var(--accent)", color: "var(--olive)" }}
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={`tel:${c.number}`}
                  className="flex h-10 items-center gap-1.5 rounded-2xl px-3 text-xs font-medium transition active:scale-95"
                  style={{
                    backgroundColor: c.emergency ? "var(--destructive)" : "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t.contacts.callBtn}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
