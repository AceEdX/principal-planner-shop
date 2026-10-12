import { motion } from "framer-motion";
import { BookOpen, Calendar, Users, CheckCircle, Target, Shield } from "lucide-react";

import { PRODUCT } from "@/lib/product";

const features = [
  {
    icon: BookOpen,
    title: "Plan Your Monthly Priorities",
    desc: "Use monthly action plans to organise important tasks and prepare ahead.",
  },
  {
    icon: Calendar,
    title: "Structure Your Working Week",
    desc: "Use weekly planning pages to organise meetings, follow-ups, and leadership priorities.",
  },
  {
    icon: Users,
    title: "Keep Academic Leadership in Focus",
    desc: "Use practical guidance to support academic planning and conversations with your team.",
  },
  {
    icon: CheckCircle,
    title: "Prepare for Compliance Reviews",
    desc: "Use inspection and compliance checklists to organise documents and identify items requiring attention.",
  },
  {
    icon: Target,
    title: "Coordinate School Activities",
    desc: "Plan school events, activities, and important observances using the calendar pages.",
  },
  {
    icon: Shield,
    title: "Make Time for Reflection",
    desc: "Use reflection and self-care sections to review your priorities and personal wellbeing.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 lg:py-28 bg-cream">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="font-body text-sm font-semibold text-primary uppercase">
          Everything You Need
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mt-3">
          Practical Support for Your Everyday School Leadership
        </h2>
        <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Monthly priorities, weekly plans and practical guidance for April 2027 to April 2028, inclusive.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-8 shadow-navy/5 shadow-lg hover:shadow-xl transition-shadow border border-border group"
          >
            <div className="w-14 h-14 rounded-lg gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <f.icon className="w-7 h-7 text-navy" />
            </div>
            <h3 className="font-display text-xl font-bold text-navy mb-3">{f.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{f.desc}</p>
            {f.title === "Prepare for Compliance Reviews" && <p className="text-sm text-muted-foreground mt-4">Provisional — verify against the latest CBSE circular.</p>}
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-gold pl-4 mt-8 max-w-4xl">{PRODUCT.compliance}</p>
    </div>
  </section>
);

export default FeaturesSection;
