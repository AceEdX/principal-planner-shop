import aceedxLogo from "@/assets/aceedx-logo.png";

const FooterSection = () => (
  <footer className="gradient-navy py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={aceedxLogo} alt="AceEdX Logo" className="w-12 h-12 rounded-lg" />
          <div>
            <p className="font-display text-lg font-bold text-primary-foreground">AceEdX</p>
            <p className="font-body text-xs text-gold-light">Powering Education Systems</p>
          </div>
        </div>

        <p className="font-body text-sm text-primary-foreground/60 text-center">
          A Planner. A Guide. A Partner in Your Leadership Journey. ⭐
        </p>

        <p className="font-body text-xs text-primary-foreground/40">
          © 2026 AceEdX. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterSection;
