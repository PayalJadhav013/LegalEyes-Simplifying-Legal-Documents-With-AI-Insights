import { motion } from "framer-motion";
import { Phone, Mail, Instagram, Twitter, Linkedin, Share2 } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-navy opacity-95" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Get In <span className="text-gradient-gold">Touch</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg">
            Have questions about our services? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h2 className="font-display text-3xl font-bold text-foreground text-center mb-10">
              Contact <span className="text-gradient-gold">Details</span>
            </h2>

            {/* UPDATED GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {/* Phone */}
              <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-4 hover:scale-105 transition">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground">+91 7972372864</p>
                  <p className="text-muted-foreground">+91 8623004425</p>
                </div>
              </div>

              {/* Email */}
              <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-4 hover:scale-105 transition">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">legaleyespdea@gmail.com</p>
                  <p className="text-muted-foreground">legalsupport@gmail.com</p>
                </div>
              </div>

              {/* ⭐ NEW: Social Media */}
              <div className="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-4 hover:scale-105 transition">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Follow Us</h3>

                  <div className="flex gap-4 justify-center mt-3">
                    <a href="#" target="_blank">
                      <Instagram className="w-5 h-5 hover:text-gold transition cursor-pointer" />
                    </a>
                    <a href="#" target="_blank">
                      <Twitter className="w-5 h-5 hover:text-gold transition cursor-pointer" />
                    </a>
                    <a href="#" target="_blank">
                      <Linkedin className="w-5 h-5 hover:text-gold transition cursor-pointer" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;