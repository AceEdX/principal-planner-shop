import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

import previewYearly from "@/assets/preview-yearly.png";
import previewMonthly from "@/assets/preview-monthly.png";
import previewActivities from "@/assets/preview-activities.png";
import previewCompliance from "@/assets/preview-compliance.png";
import previewSelfcare from "@/assets/preview-selfcare.png";
import previewPlatform from "@/assets/preview-platform.png";

const previews = [
  { img: previewYearly, title: "Year at a Glance", desc: "Full academic year overview with monthly themes, key milestones, and CBSE compliance calendar." },
  { img: previewMonthly, title: "Monthly Overview & Weekly Planner", desc: "Calendar view with weekly planning tables for academic tasks, meetings, observations, and follow-ups." },
  { img: previewActivities, title: "Activities & Holiday Calendar", desc: "World Days, Indian Holidays, class activities from Pre-Primary to Grade 10 — all mapped out." },
  { img: previewCompliance, title: "Inspection & Compliance Checklist", desc: "CBSE compliance checklist with status tracking, responsible persons, and verification dates." },
  { img: previewSelfcare, title: "Self-Care & Bucket List", desc: "Personal wellness trackers for physical, mental, emotional, and spiritual well-being." },
  { img: previewPlatform, title: "AceEdX Platform Guide", desc: "Quick-start guide to India's smartest school OS — integrated right into your planner." },
];

const PreviewSection = () => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const next = () => setActive((a) => (a + 1) % previews.length);
  const prev = () => setActive((a) => (a - 1 + previews.length) % previews.length);

  return (
    <section id="preview" className="py-20 lg:py-28 gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-body text-sm font-semibold text-gold tracking-widest uppercase">
            Look Inside
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-3">
            What's Inside the Planner
          </h2>
          <p className="font-body text-primary-foreground/70 mt-4 max-w-xl mx-auto">
            67 beautifully designed pages packed with everything a modern principal needs.
          </p>
        </motion.div>

        {/* Main preview */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card/5 backdrop-blur rounded-2xl p-4 border border-gold/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative cursor-pointer group"
                onClick={() => setZoomed(true)}
              >
                <img
                  src={previews[active].img}
                  alt={previews[active].title}
                  className="w-full rounded-xl object-cover max-h-[500px] object-top"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors rounded-xl flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center hover:scale-110 transition-transform"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Caption */}
          <div className="text-center mt-6">
            <h3 className="font-display text-2xl font-bold text-gold">{previews[active].title}</h3>
            <p className="font-body text-primary-foreground/70 mt-2 max-w-lg mx-auto">
              {previews[active].desc}
            </p>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {previews.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? "border-gold scale-110" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setZoomed(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={previews[active].img}
              alt={previews[active].title}
              className="max-w-full max-h-full rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PreviewSection;
