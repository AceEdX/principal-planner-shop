import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/use-booking";

export default function MobilePurchaseBar() {
  const { priceConfig, configLoaded, overlayOpen } = useBooking();
  const [orderVisible, setOrderVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById("order-button");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setOrderVisible(entry.isIntersecting));
    observer.observe(target); return () => observer.disconnect();
  }, [configLoaded]);
  if (orderVisible || overlayOpen || !configLoaded || !priceConfig.prebookingOpen) return null;
  return <aside aria-label="Mobile pre-booking" className="mobile-purchase-bar md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border px-4 pt-2">
    <p className="text-xs text-muted-foreground text-center mb-2">Free shipping · Delivery March 2027</p>
    <Button asChild variant="secondary" className="w-full h-11 font-semibold"><a href="#prebook">Pre-Book — ₹{priceConfig.salePrice.toLocaleString("en-IN")}</a></Button>
  </aside>;
}