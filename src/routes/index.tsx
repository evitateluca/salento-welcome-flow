import { createFileRoute } from "@tanstack/react-router";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { WifiCard } from "@/components/WifiCard";
import { MapSpots } from "@/components/MapSpots";
import { HouseManual } from "@/components/HouseManual";
import { Contacts } from "@/components/Contacts";
import { QuickAccess } from "@/components/QuickAccess";
import { TodaySuggestion } from "@/components/TodaySuggestion";
import { LanguageProvider, useT } from "@/i18n/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import heroHouse from "@/assets/hero-house.jpg";
import { houseConfig } from "@/config/house";

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

const GUEST_NAME = houseConfig.guestName;

function Index() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  );
}

function Page() {
  const { t } = useT();

  return (
    <div className="min-h-screen bg-background pb-16">
      <WelcomeAnimation guestName={GUEST_NAME} />

      {/* Top bar with language toggle */}
      <div className="fixed right-3 top-3 z-50">
        <LanguageToggle />
      </div>

      <WifiCard />


      {/* Hero with house image */}
      <header className="px-5 pb-2 pt-8 text-center">
        <div className="relative mx-auto mb-7 aspect-[16/10] max-w-md overflow-hidden rounded-[2rem] border border-border">
          <img
            src={heroHouse}
            alt="Casa nel Salento"
            width={1536}
            height={1024}
            className="h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to top, color-mix(in oklab, var(--background) 85%, transparent), transparent 55%)",
            }}
          />
        </div>

        <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          {t.hero.kicker}
        </p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-balance">
          {t.hero.greetingPrefix}{" "}
          <span className="italic" style={{ color: "var(--olive)" }}>{GUEST_NAME}</span>
          {t.hero.greetingSuffix}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground text-balance">
          {t.hero.subtitle}
        </p>
        <div className="mx-auto mt-7 h-px w-16" style={{ backgroundColor: "var(--olive)" }} />
      </header>

      <main className="mt-8 space-y-12">
        <QuickAccess />
        <TodaySuggestion />
        <div id="mappa" className="scroll-mt-20">
          <MapSpots />
        </div>
        <div id="manuale" className="scroll-mt-20">
          <HouseManual />
        </div>
        <div id="contatti" className="scroll-mt-20">
          <Contacts />
        </div>
      </main>

      <footer className="mt-16 px-6 text-center">
        <p className="text-xs text-muted-foreground">{t.footer}</p>
      </footer>
    </div>
  );
}
