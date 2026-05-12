import { Phone, MessageCircle, Siren, Stethoscope, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Contact {
  label: string;
  sub: string;
  number: string;
  icon: LucideIcon;
  emergency?: boolean;
  whatsapp?: boolean;
}

const CONTACTS: Contact[] = [
  { label: "Host — Marco", sub: "Per qualsiasi necessità", number: "+393331234567", icon: Phone, whatsapp: true },
  { label: "Emergenze (112)", sub: "Numero unico europeo", number: "112", icon: Siren, emergency: true },
  { label: "Guardia Medica", sub: "Notturno e festivi", number: "0832123456", icon: Stethoscope },
  { label: "Vigili del Fuoco", sub: "Solo in caso di pericolo", number: "115", icon: Flame, emergency: true },
];

export function Contacts() {
  return (
    <section className="px-4">
      <header className="mb-4 flex items-center gap-2">
        <Phone className="h-5 w-5" style={{ color: "var(--olive)" }} />
        <h2 className="text-2xl font-medium">Contatti</h2>
      </header>
      <div className="space-y-3">
        {CONTACTS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-3"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: c.emergency ? "color-mix(in oklab, var(--destructive) 15%, transparent)" : "var(--accent)",
                }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: c.emergency ? "var(--destructive)" : "var(--olive)" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.label}</p>
                <p className="truncate text-xs text-muted-foreground">{c.sub}</p>
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
                  Chiama
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
