import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This planner has transformed how I manage my school. Every deadline, every compliance item — it's all right here.",
    name: "Dr. Priya Mehta",
    role: "Principal, DPS Gurugram",
  },
  {
    quote: "Finally, a planner designed by someone who understands what principals actually need. The CBSE compliance section alone is worth it.",
    name: "Mr. Rajesh Kumar",
    role: "Principal, Kendriya Vidyalaya",
  },
  {
    quote: "I ordered 5 copies for my entire leadership team. The weekly planner and activity calendar are game changers.",
    name: "Mrs. Sunita Rao",
    role: "Director, Ryan International",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 lg:py-28 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="font-body text-sm font-semibold text-gold tracking-widest uppercase">
          What Principals Say
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mt-3">
          Trusted by School Leaders
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-cream rounded-xl p-8 border border-border relative"
          >
            <Quote className="w-8 h-8 text-gold/40 absolute top-6 right-6" />
            <p className="font-body text-foreground leading-relaxed mb-6 italic">
              "{t.quote}"
            </p>
            <div>
              <p className="font-display font-bold text-navy">{t.name}</p>
              <p className="font-body text-sm text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
