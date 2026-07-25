export const translations = {
  it: {
    welcome: {
      kicker: "Salento Flow",
      line1: "Benvenuto a Casa,",
    },
    hero: {
      kicker: "Casa nel Salento",
      greetingPrefix: "Ciao",
      greetingSuffix: ", benvenuto a casa.",
      subtitle:
        "Tutto ciò che ti serve per vivere il Salento con calma — Wi-Fi, mappa, manuale di casa e contatti utili.",
    },
    quickAccess: {
      kicker: "Tutto a portata di mano",
      tiles: {
        wifi: "Wi-Fi",
        map: "Mappa",
        supermarkets: "Supermercati",
        restaurants: "Ristoranti",
        essentials: "Essenziali",
        localSpots: "Spot locali",
        events: "Eventi",
        manual: "Manuale casa",
        rules: "Regole & FAQ",
        contacts: "Contatti",
      },
    },
    wifi: {
      label: "Wi-Fi",
      copy: "Copia",
      copied: "Copiata",
    },
    today: {
      title: "Cosa fare oggi",
      loading: "Sto leggendo il meteo…",
      error: "Meteo non disponibile",
      maxLabel: "Max",
      windLabel: "Vento",
      suggestions: {
        sea: {
          title: "Giornata da mare",
          body: "Sole pieno e temperature ideali — è il momento perfetto per Pescoluse o Baia dei Turchi. Parti presto per trovare parcheggio.",
          badge: "Mare",
        },
        inland: {
          title: "Esplora i borghi",
          body: "Tempo mite e gradevole — perfetto per una passeggiata tra Otranto, Lecce barocca o Galatina. Pranzo lento in una trattoria.",
          badge: "Borghi",
        },
        cozy: {
          title: "Giornata d'ombra",
          body: "Cielo coperto o pioggia — visita un frantoio ipogeo, il MUST di Lecce, o concediti pasticciotti caldi e un buon libro in terrazza.",
          badge: "Relax",
        },
        windy: {
          title: "Vento forte",
          body: "Bene per surf e kite a Torre Vado. Per il mare scegli baie riparate sull'Adriatico come Porto Badisco.",
          badge: "Vento",
        },
      },
      conditions: {
        clear: "Sereno",
        cloudy: "Nuvoloso",
        rain: "Pioggia",
        storm: "Temporali",
        fog: "Nebbia",
        snow: "Neve",
      },
    },
    map: {
      title: "Mappa & Spot",
      tabs: {
        supermercati: "Supermercati",
        ristoranti: "Ristoranti",
        essenziali: "Essenziali",
        locali: "Spot locali",
      },
    },
    events: {
      title: "Eventi",
      empty: "Nessun evento in programma al momento.",
    },
    manual: {
      title: "Manuale & FAQ",
    },
    contacts: {
      title: "Contatti",
      callBtn: "Chiama",
    },
    footer: "Buon soggiorno · Salento Flow",
  },
  en: {
    welcome: {
      kicker: "Salento Flow",
      line1: "Welcome Home,",
    },
    hero: {
      kicker: "A house in Salento",
      greetingPrefix: "Hi",
      greetingSuffix: ", welcome home.",
      subtitle:
        "Everything you need to enjoy Salento at your own pace — Wi-Fi, map, house manual and useful contacts.",
    },
    quickAccess: {
      kicker: "Everything at your fingertips",
      tiles: {
        wifi: "Wi-Fi",
        map: "Map",
        supermarkets: "Supermarkets",
        restaurants: "Restaurants",
        essentials: "Essentials",
        localSpots: "Local gems",
        events: "Events",
        manual: "House manual",
        rules: "Rules & FAQ",
        contacts: "Contacts",
      },
    },
    wifi: {
      label: "Wi-Fi",
      copy: "Copy",
      copied: "Copied",
    },
    today: {
      title: "What to do today",
      loading: "Reading the weather…",
      error: "Weather unavailable",
      maxLabel: "High",
      windLabel: "Wind",
      suggestions: {
        sea: {
          title: "A day by the sea",
          body: "Bright sun and ideal temperatures — it's the perfect day for Pescoluse or Baia dei Turchi. Leave early to find parking.",
          badge: "Beach",
        },
        inland: {
          title: "Explore the villages",
          body: "Mild and pleasant — perfect for a stroll through Otranto, baroque Lecce, or Galatina. End with a slow lunch in a trattoria.",
          badge: "Villages",
        },
        cozy: {
          title: "A cozy day",
          body: "Cloudy or rainy — visit an underground oil mill, Lecce's MUST museum, or enjoy warm pasticciotti and a good book on the terrace.",
          badge: "Relax",
        },
        windy: {
          title: "Windy day",
          body: "Great for surf and kite at Torre Vado. For swimming pick sheltered Adriatic coves like Porto Badisco.",
          badge: "Wind",
        },
      },
      conditions: {
        clear: "Clear",
        cloudy: "Cloudy",
        rain: "Rain",
        storm: "Storms",
        fog: "Fog",
        snow: "Snow",
      },
    },
    map: {
      title: "Map & Spots",
      tabs: {
        supermercati: "Supermarkets",
        ristoranti: "Restaurants",
        essenziali: "Essentials",
        locali: "Local gems",
      },
    },
    events: {
      title: "Events",
      empty: "No upcoming events right now.",
    },
    manual: {
      title: "Manual & FAQ",
    },
    contacts: {
      title: "Contacts",
      callBtn: "Call",
    },
    footer: "Enjoy your stay · Salento Flow",
  },
};

export type Lang = keyof typeof translations;
export type Translation = (typeof translations)["it"];
