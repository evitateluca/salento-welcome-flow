import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useT } from "@/i18n/LanguageContext";
import { useHouseConfig, MAPBOX_TOKEN } from "@/config/houseContext";
import type { SpotData } from "@/lib/houseConfigTypes";

const TYPE_COLOR: Record<SpotData["type"], string> = {
  supermercato: "#7a8a4f",
  farmacia: "#c05050",
  ristorante: "#d49a3a",
  spiaggia: "#4f86a8",
  chicca: "#7a8a4f",
};

interface Props { category: "essenziali" | "locali"; }

export function InteractiveMap({ category }: Props) {
  const { lang } = useT();
  const { config } = useHouseConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !config) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [config.map.center_lng, config.map.center_lat],
      zoom: config.map.zoom,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    const houseEl = document.createElement("div");
    houseEl.style.cssText = "width:18px;height:18px;border-radius:50%;background:#2a1f15;border:3px solid #f5efe2;box-shadow:0 2px 6px rgba(0,0,0,.25);";
    new mapboxgl.Marker({ element: houseEl })
      .setLngLat([config.map.center_lng, config.map.center_lat])
      .setPopup(new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(`<strong style="font-family:'Cormorant Garamond',serif;font-size:16px;">🏠 Casa</strong>`))
      .addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [config]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !config) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const spots = config.spots.filter((s) => s.category === category);
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([config.map.center_lng, config.map.center_lat]);

    spots.forEach((s) => {
      const el = document.createElement("div");
      el.style.cssText = `width:22px;height:22px;border-radius:50%;background:${TYPE_COLOR[s.type]};border:3px solid #f5efe2;box-shadow:0 2px 5px rgba(0,0,0,.2);cursor:pointer;`;
      const name = lang === "en" ? s.name_en : s.name_it;
      const desc = lang === "en" ? s.desc_en : s.desc_it;
      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-family:Inter,sans-serif;max-width:200px;">
          <strong style="font-size:13px;">${name}</strong>
          <p style="margin:4px 0 6px;font-size:11px;color:#666;">${desc}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.maps_query)}" target="_blank" rel="noreferrer" style="font-size:11px;color:#7a8a4f;text-decoration:underline;">Google Maps ↗</a>
        </div>`
      );
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([s.lng, s.lat]).setPopup(popup).addTo(map);
      markersRef.current.push(marker);
      bounds.extend([s.lng, s.lat]);
    });

    if (spots.length > 0) map.fitBounds(bounds, { padding: 60, maxZoom: 11.5, duration: 800 });
  }, [category, lang, config]);

  return <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-3xl border border-border" aria-label="Mappa" />;
}
