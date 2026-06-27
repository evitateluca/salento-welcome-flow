// 🏠 Pannello di configurazione centrale — modifica qui per riusare la guida
// in un altro appartamento. Tutti i componenti leggono da questo file.

export type SpotCategory = "essenziali" | "locali";
export type SpotType = "supermercato" | "farmacia" | "ristorante" | "spiaggia" | "chicca";

export interface SpotConfig {
  key: string; // chiave usata in i18n/translations.ts -> map.spots
  category: SpotCategory;
  type: SpotType;
  mapsQuery: string;
  lat: number;
  lng: number;
}

export interface ContactConfig {
  key: "host" | "emergency" | "doctor" | "fire";
  number: string;
  whatsapp?: boolean;
  emergency?: boolean;
}

export const houseConfig = {
  guestName: "Luca",
  hostName: "Mascia",

  wifi: {
    ssid: "WINDTRE-3D39D8",
    password: "9fc8bu2kr9rcra8a",
  },

  // Centro mappa + zoom iniziale (coordinate della casa)
  map: {
    center: { lat: 40.3515, lng: 18.1750 }, // Lecce centro — sostituire con la posizione reale
    zoom: 10.2,
    mapboxToken:
      "pk.eyJ1IjoibGFrYTkiLCJhIjoiY21vcmhnbGxmMjJ4azJxcGhzaTBjZXR2OCJ9.E9j5lBoFlxdJTiz0QPCyOw",
  },

  // Chiave OpenWeather (opzionale — TodaySuggestion usa Open-Meteo che non richiede chiave)
  weather: {
    openWeatherApiKey: "3d077df02032678818434432344df329",
  },

  contacts: [
    { key: "host", number: "+39 3204488439", whatsapp: true },
    { key: "emergency", number: "112", emergency: true },
    { key: "medical guard", number: "0836 812361" },
    { key: "fire", number: "115", emergency: true },
  ] satisfies ContactConfig[],

  spots: [
    {
      key: "conad",
      category: "essenziali",
      type: "supermercato",
      mapsQuery: "Conad Lecce",
      lat: 40.3580,
      lng: 18.1660,
    },
    {
      key: "farmacia",
      category: "essenziali",
      type: "farmacia",
      mapsQuery: "Farmacia Lecce centro",
      lat: 40.3528,
      lng: 18.1718,
    },
    {
      key: "leZie",
      category: "locali",
      type: "ristorante",
      mapsQuery: "Trattoria Le Zie Lecce",
      lat: 40.3470,
      lng: 18.1810,
    },
    {
      key: "natale",
      category: "locali",
      type: "ristorante",
      mapsQuery: "Pasticceria Natale Lecce",
      lat: 40.3534,
      lng: 18.1736,
    },
    {
      key: "pescoluse",
      category: "locali",
      type: "spiaggia",
      mapsQuery: "Pescoluse Maldive Salento",
      lat: 39.8463,
      lng: 18.3438,
    },
    {
      key: "baiaTurchi",
      category: "locali",
      type: "spiaggia",
      mapsQuery: "Baia dei Turchi Otranto",
      lat: 40.1763,
      lng: 18.5083,
    },
    {
      key: "frantoio",
      category: "locali",
      type: "chicca",
      mapsQuery: "Frantoio ipogeo Salento",
      lat: 40.1330,
      lng: 18.3500,
    },
  ] satisfies SpotConfig[],
};

export type HouseConfig = typeof houseConfig;
