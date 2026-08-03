// Shape of the JSONB blob stored in public.house_config.data

export type SpotCategory = "supermercati" | "ristoranti" | "essenziali" | "locali";
export type SpotType = "supermercato" | "farmacia" | "ristorante" | "spiaggia" | "chicca";
export type ContactKey = "host" | "emergency" | "doctor" | "fire";
export type ManualIcon = "trash" | "snowflake" | "droplets" | "key" | "clock" | "cigarette" | "paw" | "book";

export interface ContactData {
  key: string;
  number: string;
  whatsapp?: boolean;
  emergency?: boolean;
  label_it: string;
  label_en: string;
  sub_it: string;
  sub_en: string;
}

export interface SpotData {
  id: string;
  category: SpotCategory;
  type: SpotType;
  maps_query: string;
  lat: number;
  lng: number;
  name_it: string;
  name_en: string;
  desc_it: string;
  desc_en: string;
}

export interface ManualItemData {
  id: string;
  icon: ManualIcon | string;
  title_it: string;
  title_en: string;
  body_it: string;
  body_en: string;
}

export interface EventData {
  id: string;
  date: string; // ISO yyyy-mm-dd (optional format)
  date_end?: string; // ISO yyyy-mm-dd, optional multi-day end date
  title_it: string;
  title_en: string;
  desc_it: string;
  desc_en: string;
  location: string;
  maps_query?: string;
}

export interface HouseConfigData {
  guest_name: string;
  host_name: string;
  hero_image_url: string;
  wifi: { ssid: string; password: string };
  map: { center_lat: number; center_lng: number; zoom: number };
  hero: {
    kicker_it: string;
    kicker_en: string;
    subtitle_it: string;
    subtitle_en: string;
  };
  contacts: ContactData[];
  spots: SpotData[];
  manual: ManualItemData[];
  events: EventData[];
}
