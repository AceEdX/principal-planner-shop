import { motion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import bookHero from "@/assets/book-hero.jpg";

const HeroSection = () => {
  const scrollToPrebook = () => {
    document.getElementById("prebook")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen gradient-navy overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold-light blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-0 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary-foreground"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-gold" />
                ))}
              </div>
              <span className="text-gold-light text-sm font-body font-medium tracking-wide">
                TRUSTED BY 500+ PRINCIPALS
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Principal's
              <br />
              <span className="text-gold">Handbook & Planner</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">2026–27</span>
            </h1>

            <p className="font-body text-lg md:text-xl opacity-90 mb-4 max-w-lg leading-relaxed">
              Your complete leadership companion — plan, lead, and inspire with India's most comprehensive school management planner.
            </p>

            <p className="font-body text-sm text-gold-light mb-8 font-medium">
              By AceEdX — Powering Education Systems
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToPrebook}
                className="gradient-gold text-navy font-body font-bold px-8 py-4 rounded-lg text-lg shadow-gold hover:scale-105 transition-transform"
              >
                Pre-Book Your Copy Now
              </button>
              <button
                onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-gold text-gold font-body font-semibold px-8 py-4 rounded-lg text-lg hover:bg-gold hover:text-navy transition-all"
              >
                See Inside ↓
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span>124 Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span>CBSE Aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span>NEP 2020 Ready</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Book Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/20 rounded-3xl blur-2xl" />
              <img
                src={bookHero}
                alt="Principal's Handbook & Planner 2026-27"
                className="relative rounded-2xl shadow-2xl max-w-sm lg:max-w-md w-full object-cover"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -top-4 -right-4 gradient-gold text-navy font-body font-bold px-4 py-2 rounded-full text-sm shadow-lg"
              >
                Limited Edition!
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-light cursor-pointer"
        onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ArrowDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
