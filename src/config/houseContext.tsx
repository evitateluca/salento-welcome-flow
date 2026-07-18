import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { HouseConfigData } from "@/lib/houseConfigTypes";

// Mapbox token stays in code (publishable). Everything else comes from DB.
export const MAPBOX_TOKEN =
  "pk.eyJ1IjoibGFrYTkiLCJhIjoiY21vcmhnbGxmMjJ4azJxcGhzaTBjZXR2OCJ9.E9j5lBoFlxdJTiz0QPCyOw";

interface Ctx {
  config: HouseConfigData | null;
  configId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const HouseConfigContext = createContext<Ctx>({
  config: null,
  configId: null,
  loading: true,
  error: null,
  refetch: async () => {},
});

export function HouseConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HouseConfigData | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("house_config" as never)
      .select("id, data")
      .limit(1)
      .maybeSingle();
    if (error) {
      setError(error.message);
    } else if (data) {
      const row = data as unknown as { id: string; data: HouseConfigData };
      setConfig(row.data);
      setConfigId(row.id);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <HouseConfigContext.Provider value={{ config, configId, loading, error, refetch: load }}>
      {children}
    </HouseConfigContext.Provider>
  );
}

export function useHouseConfig() {
  return useContext(HouseConfigContext);
}
