import book from "@/assets/principal-handbook-prebook-clean.jpg";
import { Button } from "@/components/ui/button";
import { PRODUCT } from "@/lib/product";
import { useBooking } from "@/hooks/use-booking";
import { Truck, CalendarDays, BookOpen } from "lucide-react";

export default function HeroSection() {
  const { priceConfig } = useBooking();
  return <section className="product-opening relative bg-cream border-b border-border pt-20 pb-8 lg:pt-28 lg:pb-16">
    <img src={book} alt="Principal’s Handbook & Planner 2027–28, navy leather hardbound with gold embossing — pre-book now" className="opening-book hidden lg:block absolute right-0 top-16 h-[calc(100%-4rem)] w-1/2 object-contain" />
    <div className="container mx-auto px-4 relative">
      <div className="lg:w-1/2 lg:pr-8">
        <p className="text-sm text-muted-foreground mb-3 font-semibold">ACEEDX · 130 PAGES · 2027–28 EDITION</p>
        <h1 className="font-display text-3xl md:text-5xl lg:text-5xl leading-tight text-foreground mb-4">Principal’s<br />Handbook &amp; Planner<br /><span className="text-2xl md:text-4xl">2027–28</span></h1>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl mb-4">Bring structure to your school year with monthly action plans, weekly planning pages, activity calendars, and practical leadership guidance—all in one beautifully crafted handbook.</p>
        <p className="text-2xl font-semibold text-foreground mb-3">₹{priceConfig.salePrice.toLocaleString("en-IN")} <span className="text-base font-normal text-muted-foreground">per copy</span></p>
        <ul className="space-y-2 text-sm text-foreground mb-4">
          <li className="flex gap-2"><Truck className="w-4 h-4 shrink-0 text-primary" />Free shipping across India · Delivery in March 2027</li>
          <li className="flex gap-2"><CalendarDays className="w-4 h-4 shrink-0 text-primary" />Covers {PRODUCT.coverage}</li>
          <li className="flex gap-2"><BookOpen className="w-4 h-4 shrink-0 text-primary" />{PRODUCT.format}</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <Button asChild variant="secondary" className="h-11 font-bold"><a href="#prebook">Pre-Book — ₹{priceConfig.salePrice.toLocaleString("en-IN")}</a></Button>
          <Button asChild variant="outline" className="h-11"><a href="#preview">Preview Sample Pages</a></Button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground max-w-lg">{PRODUCT.delivery}</p>
      </div>
      <img src={book} alt="Leather hardbound Principal’s Handbook & Planner 2027–28" className="lg:hidden block w-full max-w-sm mx-auto mt-6" />
    </div>
  </section>;
}
