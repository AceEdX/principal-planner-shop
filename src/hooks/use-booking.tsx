import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const initial = { originalPrice: 1999, salePrice: 1499, prebookingOpen: true };
const BookingContext = createContext({ priceConfig: initial, configLoaded: false, configError: "", overlayOpen: false, setOverlayOpen: (_value: boolean) => {} });
export function BookingProvider({ children }: { children: ReactNode }) {
  const [priceConfig, setPriceConfig] = useState(initial);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  useEffect(() => {
    supabase.from("site_config").select("value").eq("key", "price_config").single().then(({ data, error }) => {
      if (error || !data) { setConfigError("Unable to load booking settings. Please refresh and try again."); return; }
      setPriceConfig(data.value as typeof initial); setConfigLoaded(true);
    }).catch(() => setConfigError("Unable to load booking settings. Please refresh and try again."));
  }, []);
  return <BookingContext.Provider value={{ priceConfig, configLoaded, configError, overlayOpen, setOverlayOpen }}>{children}</BookingContext.Provider>;
}
export const useBooking = () => useContext(BookingContext);