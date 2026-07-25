import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";
import { WifiCard } from "@/components/WifiCard";
import { MapSpots } from "@/components/MapSpots";
import { HouseManual } from "@/components/HouseManual";
import { Contacts } from "@/components/Contacts";
import { EventsList } from "@/components/EventsList";
import { QuickAccess } from "@/components/QuickAccess";
import { TodaySuggestion } from "@/components/TodaySuggestion";
import { useT } from "@/i18n/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import heroHouseFallback from "@/assets/hero-house.avif";
import { useHouseConfig } from "@/config/houseContext";
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";


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
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" },
    ],
  }),
});

function Index() {
  const { t, lang } = useT();
  const { config, loading } = useHouseConfig();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setIsAdmin(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);


  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">…</div>;
  }

  const guestName = config?.guest_name ?? "";
  const heroImage = config?.hero_image_url || heroHouseFallback;
  const kicker = lang === "en" ? config?.hero.kicker_en : config?.hero.kicker_it;
  const subtitle = lang === "en" ? config?.hero.subtitle_en : config?.hero.subtitle_it;

  return (
    <div className="min-h-screen bg-background pb-16">
      <WelcomeAnimation guestName={guestName} />

      <div className="fixed right-3 top-3 z-50 flex items-center gap-2">
        {isAdmin && (
          <Link to="/admin" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition hover:bg-accent" aria-label="Admin">
            <Settings className="h-4 w-4" style={{ color: "var(--olive)" }} />
          </Link>
        )}
        <LanguageToggle />
      </div>


      <WifiCard />

      <header className="px-5 pb-2 pt-8 text-center">
        <div className="relative mx-auto mb-7 aspect-[16/10] max-w-md overflow-hidden rounded-[2rem] border border-border">
          <img src={heroImage} alt="Casa nel Salento" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--background) 85%, transparent), transparent 55%)" }} />
        </div>

        <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">{kicker || t.hero.kicker}</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-balance">
          {t.hero.greetingPrefix}{" "}
          <span className="italic" style={{ color: "var(--olive)" }}>{guestName}</span>
          {t.hero.greetingSuffix}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground text-balance">{subtitle || t.hero.subtitle}</p>
        <div className="mx-auto mt-7 h-px w-16" style={{ backgroundColor: "var(--olive)" }} />
      </header>

      <main className="mt-8 space-y-12">
        <QuickAccess />
        <TodaySuggestion />
        <div id="mappa" className="scroll-mt-20"><MapSpots /></div>
        <div id="eventi" className="scroll-mt-20"><EventsList /></div>
        <div id="manuale" className="scroll-mt-20"><HouseManual /></div>
        <div id="contatti" className="scroll-mt-20"><Contacts /></div>
      </main>


      <footer className="mt-16 px-6 text-center">
        <p className="text-xs text-muted-foreground">{t.footer}</p>
      </footer>
    </div>
  );
}
