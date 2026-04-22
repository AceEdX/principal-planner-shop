import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

import previewYearly from "@/assets/preview-yearly.png";
import previewMonthly from "@/assets/preview-monthly.png";
import previewActivities from "@/assets/preview-activities.png";
import previewActionplan1 from "@/assets/preview-actionplan1.png";
import previewActionplan2 from "@/assets/preview-actionplan2.png";
import previewHolidays from "@/assets/preview-holidays.png";
import previewCompliance from "@/assets/preview-compliance.png";
import previewSelfcare from "@/assets/preview-selfcare.png";
import previewPlatform from "@/assets/preview-platform.png";
import previewApril from "@/assets/preview-april.png";

const previews = [
  { img: previewYearly, title: "Year at a Glance", desc: "Full academic year overview with monthly themes, key milestones, and CBSE compliance calendar." },
  { img: previewMonthly, title: "Monthly Overview & Weekly Planner", desc: "Calendar view with weekly planning tables for academic tasks, meetings, and follow-ups." },
  { img: previewActivities, title: "Activities & Holiday Calendar", desc: "World Days, Indian Holidays, and class activities from Pre-Primary to Grade 10." },
  { img: previewActionplan1, title: "Principal's Action Plan — August", desc: "Monthly action plans with 10+ tasks, principal tips, target dates, and checkboxes." },
  { img: previewActionplan2, title: "Principal's Action Plan — September", desc: "Half-yearly exams, PTM, board registrations — every critical task mapped out." },
  { img: previewHolidays, title: "September Activities & Events", desc: "World Days, Indian Holidays, pre-primary activities, and parent engagement ideas." },
  { img: previewCompliance, title: "Inspection & Compliance Checklist", desc: "CBSE compliance checklist with status tracking, responsible persons, and verification dates." },
  { img: previewSelfcare, title: "Self-Care & Bucket List", desc: "Personal wellness trackers for physical, mental, emotional, and spiritual well-being." },
  { img: previewPlatform, title: "AceEdX Platform Guide & Calendar", desc: "Year calendar and quick-start guide to India's smartest school OS." },
  { img: previewApril, title: "April Action Plan — 18 Tasks", desc: "Detailed action plan for academic year launch with NEP alignment and diagnostics." },
];

const PreviewSection = () => {
  const [active, setActive] = useState(0);

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
            Sneak Peek
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mt-3">
            What's Inside the Planner
          </h2>
          <p className="font-body text-primary-foreground/70 mt-4 max-w-xl mx-auto">
            124 beautifully designed pages packed with everything a modern principal needs. Here's a glimpse.
          </p>
        </motion.div>

        {/* Main preview — intentionally small & blurred to tease */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card/5 backdrop-blur rounded-2xl p-4 border border-gold/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-xl"
              >
                {/* Image shown at reduced size with a gradient overlay to obscure details */}
                <img
                  src={previews[active].img}
                  alt={previews[active].title}
                  className="w-full rounded-xl object-cover max-h-[360px] object-top scale-[0.92]"
                  style={{ filter: "blur(0.5px)" }}
                />
                {/* Gradient overlay to prevent full readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/80 rounded-xl" />
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-gold/80">
                  <Lock className="w-4 h-4" />
                  <span className="font-body text-sm font-medium">Pre-book to get the full planner</span>
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
            <p className="font-body text-xs text-primary-foreground/40 mt-1">
              {active + 1} / {previews.length} pages shown
            </p>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {previews.map((p, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-16 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? "border-gold scale-110" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top" style={{ filter: "blur(0.8px)" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
