import { PRODUCT } from "@/lib/product";
import aceedxLogo from "@/assets/aceedx-logo.png";

const FooterSection = () => (
  <footer className="bg-card border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={aceedxLogo} alt="AceEdX Logo" className="w-12 h-12 rounded-lg" />
          <div>
            <p className="font-display text-lg font-bold text-foreground">AceEdX</p>
            <p className="font-body text-xs text-muted-foreground">Powering Education Systems</p>
          </div>
        </div>

        <p className="font-body text-sm text-muted-foreground text-center">
          A Planner. A Guide. A Partner in Your Leadership Journey. ⭐
        </p>

        <p className="font-body text-xs text-muted-foreground">
          © 2026 AceEdX. All rights reserved.
        </p>
      </div>
      <a href={PRODUCT.telephone} className="block mt-6 text-center text-sm text-primary underline underline-offset-4">{PRODUCT.support}</a>
      <a href="https://www.aceedx.com" className="block text-center mt-3 text-sm text-primary underline">www.aceedx.com</a>
    </div>
  </footer>
);

export default FooterSection;
