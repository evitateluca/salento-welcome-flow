import { createFileRoute } from "@tanstack/react-router";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { WifiCard } from "@/components/WifiCard";
import { MapSpots } from "@/components/MapSpots";
import { HouseManual } from "@/components/HouseManual";
import { Contacts } from "@/components/Contacts";
import { QuickAccess } from "@/components/QuickAccess";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Salento Flow — Welcome Book" },
      { name: "description", content: "Guida digitale al tuo soggiorno: Wi-Fi, mappa, manuale di casa e contatti utili." },
      { name: "theme-color", content: "#f5efe2" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap",
      },
    ],
  }),
});

const GUEST_NAME = "Luca";

function Index() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <WelcomeAnimation guestName={GUEST_NAME} />

      <div className="pt-3">
        <WifiCard />
      </div>

      {/* Hero */}
      <header className="px-5 pb-2 pt-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          Casa nel Salento
        </p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-balance">
          Ciao <span className="italic" style={{ color: "var(--olive)" }}>{GUEST_NAME}</span>,<br />
          benvenuto a casa.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground text-balance">
          Tutto ciò che ti serve per vivere il Salento con calma — Wi-Fi, mappa, manuale di casa e contatti utili.
        </p>
        <div className="mx-auto mt-7 h-px w-16" style={{ backgroundColor: "var(--olive)" }} />
      </header>

      <main className="mt-10 space-y-12">
        <MapSpots />
        <HouseManual />
        <Contacts />
      </main>

      <footer className="mt-16 px-6 text-center">
        <p className="text-xs text-muted-foreground">Buon soggiorno · Salento Flow</p>
      </footer>
    </div>
  );
}
