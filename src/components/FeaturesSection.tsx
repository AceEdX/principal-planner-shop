import { motion } from "framer-motion";
import { BookOpen, Calendar, Users, CheckCircle, Target, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Guidance",
    desc: "Practical strategies and best practices for effective school leadership, aligned with NEP 2020.",
  },
  {
    icon: Calendar,
    title: "Year-Long Planning",
    desc: "Monthly overviews, weekly planners, and structured planning pages from April 2026 to March 2027.",
  },
  {
    icon: Users,
    title: "Lead With Impact",
    desc: "Resources and insights to inspire your school community, staff, and drive academic excellence.",
  },
  {
    icon: CheckCircle,
    title: "CBSE Compliance Ready",
    desc: "Complete CBSE compliance calendar, inspection checklists, and regulatory deadlines built in.",
  },
  {
    icon: Target,
    title: "Activity Planner",
    desc: "World Days, Indian Holidays, class activities, and co-curricular event planning for every month.",
  },
  {
    icon: Shield,
    title: "Self-Care & Wellness",
    desc: "Dedicated sections for personal goals, self-care checklists, travel bucket lists, and reflection.",
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
        <span className="font-body text-sm font-semibold text-gold tracking-widest uppercase">
          Everything You Need
        </span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mt-3">
          Why Principals Love This Planner
        </h2>
        <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
          Designed exclusively for school principals who want to plan smarter, lead better, and make every day count.
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
            className="bg-card rounded-xl p-8 shadow-navy/5 shadow-lg hover:shadow-xl transition-shadow border border-border group"
          >
            <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <f.icon className="w-7 h-7 text-navy" />
            </div>
            <h3 className="font-display text-xl font-bold text-navy mb-3">{f.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
