import { useState } from "react";
import { Menu, X } from "lucide-react";
import aceedxLogo from "@/assets/aceedx-logo.png";

const links = [
  { label: "Features", href: "#features" },
  { label: "Look Inside", href: "#preview" },
  { label: "Pre-Book", href: "#prebook" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-navy/95 backdrop-blur-md border-b border-gold/10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <img src={aceedxLogo} alt="AceEdX" className="w-9 h-9 rounded-lg" />
          <span className="font-display text-lg font-bold text-primary-foreground hidden sm:block">
            AceEdX
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm text-primary-foreground/80 hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#prebook"
            className="gradient-gold text-navy font-body font-bold text-sm px-5 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Order Now
          </a>
        </div>

        <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden gradient-navy border-t border-gold/10 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-body text-primary-foreground/80 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#prebook"
            onClick={() => setOpen(false)}
            className="block gradient-gold text-navy font-body font-bold text-center py-2 rounded-lg"
          >
            Order Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
