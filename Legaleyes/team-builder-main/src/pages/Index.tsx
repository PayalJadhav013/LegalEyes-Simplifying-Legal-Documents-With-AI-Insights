import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, BookOpen, FileSearch, Sparkles, Shield, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/legaleyes-logo.png";

const features = [
  { icon: FileSearch, title: "AI Document Analysis", desc: "Upload legal documents and get instant AI-powered summaries and insights." },
  { icon: BookOpen, title: "Guide Portal", desc: "Step-by-step procedures for Indian government certificates and documents." },
  { icon: Shield, title: "Risk Detection", desc: "Identify potential risks and red flags in contracts and agreements." },
  { icon: Sparkles, title: "Plain Language", desc: "Complex legal jargon simplified into easy-to-understand language." },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/30"
            style={{ left: `${15 + i * 18}%`, top: `${20 + i * 12}%` }}
            animate={{
              y: [-10, -30, -10],
              x: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-8"
          >
            <img src={logo} alt="LegalEyes" className="mx-auto w-24 h-24 drop-shadow-lg floating" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border mb-6"
          >
            <Scale className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted-foreground">AI-Powered Legal Assistance</span>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            Understand Your <span className="text-gradient-gold">Legal Documents</span> with Ease
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10"
          >
            Upload, analyze, and simplify legal documents using AI. Get step-by-step guidance and legal procedures — all in one place.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/analyser">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground shadow-lg gap-2 px-8">
                <FileSearch className="w-5 h-5" />
                Try AI Analyser
              </Button>
            </Link>

            <Link to="/guide">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <BookOpen className="w-5 h-5" />
                Guide Portal
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for <span className="text-gradient-gold">Legal Clarity</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to navigate the legal landscape with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center rounded-xl mb-4">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 text-center">
        <div className="absolute inset-0 bg-gradient-navy" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Simplify Your Legal Journey?
          </h2>
          <p className="text-white/70 mb-8">
            Start analyzing documents or explore our comprehensive guide portal today.
          </p>
          <Link to="/analyser">
            <Button size="lg" className="bg-gradient-gold text-white px-8">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* 🔥 UPDATED FOOTER */}
      <footer className="py-10 border-t border-border bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Left */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <img src={logo} className="w-7 h-7" />
              <span className="font-bold text-lg">
                Legal<span className="text-gradient-gold">Eyes</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Simplifying Legal Understanding with AI
            </p>
          </div>

          {/* Center Links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-gold">Home</Link>
            <Link to="/analyser" className="hover:text-gold">Analyzer</Link>
            <Link to="/guide" className="hover:text-gold">Guide</Link>
            <Link to="/contact" className="hover:text-gold">Contact</Link>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex gap-4">
              <Instagram className="w-5 h-5 hover:text-gold cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-gold cursor-pointer" />
              <Linkedin className="w-5 h-5 hover:text-gold cursor-pointer" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LegalEyes. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Index;