import { motion } from "framer-motion";
import { Scale, Target, Heart, Zap } from "lucide-react";
import logo from "@/assets/legaleyes-logo.png";
import sectionBg from "@/assets/section-bg.jpg";

const values = [
  { icon: Target, title: "Accessibility", desc: "Making legal knowledge accessible to every citizen regardless of background." },
  { icon: Heart, title: "Simplicity", desc: "Transforming complex legal jargon into clear, actionable guidance." },
  { icon: Zap, title: "Innovation", desc: "Leveraging AI technology to revolutionize how people interact with legal documents." },
  { icon: Scale, title: "Trust", desc: "Providing accurate, verified information sourced from official government portals." },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={sectionBg} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            src={logo}
            alt="LegalEyes"
            width={80}
            height={80}
            className="mx-auto w-20 h-20 mb-6"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            About <span className="text-gradient-gold">LegalEyes</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            We're on a mission to democratize legal knowledge in India. LegalEyes combines AI technology with comprehensive government guidelines to help citizens navigate legal procedures with confidence.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-foreground text-center mb-12"
          >
            Our Core <span className="text-gradient-gold">Values</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-navy" />
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Built for the People of India
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            Every citizen deserves to understand their legal rights. LegalEyes is committed to making that a reality — one document at a time.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
