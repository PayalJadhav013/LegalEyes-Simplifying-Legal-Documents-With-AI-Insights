import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Coins, ScrollText, FileText, MapPin, Phone, Clock, ExternalLink, Lightbulb, Globe, ChevronRight, ChevronDown, ChevronUp, Monitor, Navigation, Building2, Gavel, LogIn, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Category = "domicile" | "income" | "caste";

const categories = [
  { id: "domicile" as Category, label: "Domicile", icon: Home },
  { id: "income" as Category, label: "Income", icon: Coins },
  { id: "caste" as Category, label: "Caste", icon: ScrollText },
];

const guideData: Record<Category, {
  title: string; emoji: string; description: string;
  documents: string[];
  procedures: {
    title: string; icon: "building" | "monitor"; desc: string;
    steps?: { title: string; desc: string }[];
    portalLink?: { label: string; url: string };
  }[];
  centres: { name: string; address: string; hours: string; phone: string; distance: string }[];
  mapQuery: string;
  officialSource: { title: string; source: string; summary: string; url: string };
  tips: string[];
}> = {
  domicile: {
    title: "Domicile Certificate", emoji: "🏠",
    description: "A Domicile Certificate is an official document issued by the state government that proves a person is a permanent resident of that state. It is required for educational admissions, government jobs, and various welfare schemes.",
    documents: ["Aadhaar Card", "School LC (Leaving Certificate)", "Resident Certificate", "Father's Domicile Certificate", "Passport-size photographs", "Birth Certificate"],
    procedures: [
      {
        title: "Option A — e-Seva Centre", icon: "building",
        desc: "Visit your nearest e-Seva or Seva Kendra. Submit all required documents. Pay the nominal fee. Certificate issued within 7–15 working days.",
        steps: undefined,
      },
      {
        title: "Option B — Online Portal (Aaple Sarkar)", icon: "monitor",
        desc: "Apply online through the Aaple Sarkar MahaOnline portal — Maharashtra's official e-governance platform for all government certificates.",
        steps: [
          { title: "Register on Aaple Sarkar", desc: "Go to aaplesarkar.mahaonline.gov.in → Click 'New User? Register Here' → Enter Aadhaar number, mobile, email → Create username & password." },
          { title: "Login & Select Service", desc: "Login with your credentials → Navigate to 'Revenue Department' → Select 'Domicile Certificate' from the list of services." },
          { title: "Fill Application Form", desc: "Enter personal details, address, and domicile information → Select your district, taluka, and village → Fill all mandatory fields marked with *." },
          { title: "Upload Documents", desc: "Upload scanned copies of Aadhaar, School LC, Resident Certificate, photos → Ensure each file is under 1MB in PDF/JPG format." },
          { title: "Pay Fee & Submit", desc: "Pay the application fee (₹15–50) via net banking, UPI, or debit card → Submit the application → Note down the Application ID for tracking." },
          { title: "Track Status", desc: "Login again → Go to 'Track Your Application' → Enter Application ID → Certificate typically issued within 7–15 working days after verification." },
        ],
        portalLink: { label: "Open Aaple Sarkar Portal", url: "https://aaplesarkar.mahaonline.gov.in" },
      },
    ],
    centres: [
      { name: "Shivaji Nagar e-Seva Kendra", address: "Plot No. 12, Shivaji Nagar, Pune 411005", hours: "Mon–Sat: 9:00 AM – 5:00 PM", phone: "+91 20 2553 1234", distance: "1.2 km" },
      { name: "Kothrud Seva Kendra", address: "Near Dahanukar Colony, Kothrud, Pune 411038", hours: "Mon–Sat: 9:30 AM – 5:30 PM", phone: "+91 20 2546 5678", distance: "3.5 km" },
      { name: "Hadapsar e-Seva Centre", address: "Magarpatta Road, Hadapsar, Pune 411028", hours: "Mon–Fri: 10:00 AM – 4:00 PM", phone: "+91 20 2689 9012", distance: "5.8 km" },
      { name: "Aundh District Office", address: "ITI Road, Aundh, Pune 411007", hours: "Mon–Sat: 9:00 AM – 6:00 PM", phone: "+91 20 2588 3456", distance: "4.1 km" },
    ],
    mapQuery: "e-Seva+Kendra+Pune",
    officialSource: { title: "Aaple Sarkar — Maharashtra e-Governance", source: "MahaOnline", summary: "Official portal for applying to all Maharashtra government certificates online including Domicile, Income, Caste, and more. Register, upload documents, pay fees, and track application status — all in one place.", url: "https://aaplesarkar.mahaonline.gov.in" },
    tips: ["Keep scanned copies of all documents ready", "Processing time varies by state (7-30 days)", "Some states offer expedited processing for an additional fee", "Fee ranges from ₹15–50 depending on the state"],
  },
  income: {
    title: "Income Certificate", emoji: "💰",
    description: "An Income Certificate is issued by the state government certifying a person's annual income. Required for scholarships, fee waivers, and government schemes.",
    documents: ["Aadhaar Card", "Ration Card", "Salary Slip / Income Proof", "Self-declaration affidavit", "Passport-size photographs"],
    procedures: [
      {
        title: "Option A — e-Seva Centre", icon: "building",
        desc: "Visit your nearest e-Seva or Seva Kendra. Submit all required documents along with income proof. Pay the nominal fee. Certificate issued within 7–15 working days.",
        steps: undefined,
      },
      {
        title: "Option B — Online Portal (Aaple Sarkar)", icon: "monitor",
        desc: "Apply through the Aaple Sarkar e-District portal for income certificate.",
        steps: [
          { title: "Register / Login", desc: "Go to aaplesarkar.mahaonline.gov.in → Register or login with existing credentials." },
          { title: "Select Income Certificate", desc: "Navigate to 'Revenue Department' → Select 'Income Certificate' service." },
          { title: "Fill Details & Upload", desc: "Enter income details, employer information → Upload salary slips, bank statements, and Aadhaar." },
          { title: "Pay & Track", desc: "Pay the application fee → Submit → Track status using Application ID." },
        ],
        portalLink: { label: "Open Aaple Sarkar Portal", url: "https://aaplesarkar.mahaonline.gov.in" },
      },
    ],
    centres: [
      { name: "Shivaji Nagar e-Seva Kendra", address: "Plot No. 12, Shivaji Nagar, Pune 411005", hours: "Mon–Sat: 9:00 AM – 5:00 PM", phone: "+91 20 2553 1234", distance: "1.2 km" },
      { name: "Kothrud Seva Kendra", address: "Near Dahanukar Colony, Kothrud, Pune 411038", hours: "Mon–Sat: 9:30 AM – 5:30 PM", phone: "+91 20 2546 5678", distance: "3.5 km" },
      { name: "Hadapsar e-Seva Centre", address: "Magarpatta Road, Hadapsar, Pune 411028", hours: "Mon–Fri: 10:00 AM – 4:00 PM", phone: "+91 20 2689 9012", distance: "5.8 km" },
      { name: "Pune Tehsildar Office", address: "Collector Office Complex, Pune", hours: "Mon–Fri: 10:00 AM – 5:00 PM", phone: "+91 20 2612 5678", distance: "2.0 km" },
    ],
    mapQuery: "e-Seva+Kendra+Pune",
    officialSource: { title: "Aaple Sarkar — Maharashtra e-Governance", source: "MahaOnline", summary: "Income certificate required for various government schemes. Apply at Tehsildar office or online through Aaple Sarkar portal.", url: "https://aaplesarkar.mahaonline.gov.in" },
    tips: ["Income certificate is usually valid for one year", "Get it renewed before expiry", "Mention all sources of income", "Keep salary slips and bank statements ready"],
  },
  caste: {
    title: "Caste Certificate", emoji: "📜",
    description: "A Caste Certificate certifies that a person belongs to a specific caste category (SC/ST/OBC/NT). Essential for reservation benefits in education and employment.",
    documents: ["Aadhaar Card", "School Leaving Certificate", "Father's Caste Certificate", "Ration Card", "Birth Certificate", "Passport-size photographs"],
    procedures: [
      {
        title: "Option A — e-Seva Centre", icon: "building",
        desc: "Visit your nearest e-Seva or Seva Kendra. Submit all required documents including Father's Caste Certificate. Pay the nominal fee. Verification process takes 15–30 days.",
        steps: undefined,
      },
      {
        title: "Option B — Online Portal (Aaple Sarkar)", icon: "monitor",
        desc: "Apply through the Aaple Sarkar or e-District portal for caste certificate.",
        steps: [
          { title: "Register / Login", desc: "Go to aaplesarkar.mahaonline.gov.in → Register or login." },
          { title: "Select Caste Certificate", desc: "Navigate to 'Revenue Department' → Select 'Caste Certificate' service." },
          { title: "Fill Form & Upload Documents", desc: "Enter caste details → Upload Aadhaar, School LC, Father's Caste Certificate, Birth Certificate." },
          { title: "Pay Fee & Submit", desc: "Pay the application fee → Submit → Note Application ID for tracking." },
          { title: "Attend Verification", desc: "If called, attend verification at Tehsildar office → Certificate issued in 15–30 days." },
        ],
        portalLink: { label: "Open Aaple Sarkar Portal", url: "https://aaplesarkar.mahaonline.gov.in" },
      },
    ],
    centres: [
      { name: "Shivaji Nagar e-Seva Kendra", address: "Plot No. 12, Shivaji Nagar, Pune 411005", hours: "Mon–Sat: 9:00 AM – 5:00 PM", phone: "+91 20 2553 1234", distance: "1.2 km" },
      { name: "Kothrud Seva Kendra", address: "Near Dahanukar Colony, Kothrud, Pune 411038", hours: "Mon–Sat: 9:30 AM – 5:30 PM", phone: "+91 20 2546 5678", distance: "3.5 km" },
      { name: "Hadapsar e-Seva Centre", address: "Magarpatta Road, Hadapsar, Pune 411028", hours: "Mon–Fri: 10:00 AM – 4:00 PM", phone: "+91 20 2689 9012", distance: "5.8 km" },
      { name: "District Caste Verification Committee", address: "Collector Office, Pune", hours: "Mon–Fri: 10:30 AM – 4:30 PM", phone: "+91 20 2612 9012", distance: "2.1 km" },
    ],
    mapQuery: "e-Seva+Kendra+Pune",
    officialSource: { title: "Aaple Sarkar — Maharashtra e-Governance", source: "MahaOnline", summary: "Caste certificate is mandatory for availing reservation benefits. Validity committee verification required for some categories.", url: "https://aaplesarkar.mahaonline.gov.in" },
    tips: ["Apply well in advance as verification takes time", "Father's caste certificate is crucial", "Keep the original safe — reissuance is complex", "Caste validity certificate may be needed separately"],
  },
};

const ProcedureAccordion = ({ proc, index, centres, mapQuery }: { proc: typeof guideData.domicile.procedures[0]; index: number; centres?: typeof guideData.domicile.centres; mapQuery?: string }) => {
  const [open, setOpen] = useState(index === 0);
  const Icon = proc.icon === "monitor" ? Monitor : Building2;
  const showMap = proc.icon === "building" && centres && centres.length > 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-gold-dark" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-gold-dark">{proc.title}</h4>
          <p className="text-sm text-muted-foreground">Click to expand details</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              <p className="text-foreground/80 leading-relaxed">{proc.desc}</p>

              {/* Map & Centres inside Option A */}
              {showMap && (
                <>
                  <h5 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" /> Nearby e-Seva Centres
                  </h5>
                  <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="relative">
                      <a
                        href={`https://www.google.com/maps/search/${mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-gold-dark font-medium text-sm hover:bg-secondary transition-colors shadow-md"
                      >
                        Open in Maps <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapQuery}&zoom=12`}
                        width="100%"
                        height="280"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Nearby centres map"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {centres!.map((centre) => (
                      <div key={centre.name} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h6 className="font-semibold text-foreground text-sm">{centre.name}</h6>
                          <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full">{centre.distance}</span>
                        </div>
                        <div className="space-y-1 text-xs text-foreground/70">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gold/60" /> {centre.address}</p>
                          <p className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gold/60" /> {centre.hours}</p>
                          <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-gold/60" /> {centre.phone}</p>
                        </div>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(centre.name + " " + centre.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gold-dark font-medium mt-2 hover:underline">
                          <Navigation className="w-3 h-3" /> Get directions →
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {proc.steps && (
                <div className="space-y-4">
                  {proc.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-gold-dark">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-foreground mb-1">{step.title}</h5>
                        <p className="text-foreground/70 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {proc.portalLink && (
                <a
                  href={proc.portalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-gold-dark font-medium text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Monitor className="w-4 h-4" />
                  {proc.portalLink.label}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GuidePortal = () => {
  const [active, setActive] = useState<Category>("domicile");
  const data = guideData[active];
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [loading, user]);

  return (
    <>
    <Dialog open={showAuthDialog && !loading && !user} onOpenChange={(open) => {
      setShowAuthDialog(open);
      if (!open && !user) navigate("/");
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <LogIn className="w-5 h-5 text-gold" />
            Login Required
          </DialogTitle>
          <DialogDescription>
            You need to be logged in to use the Guide Portal. Please login or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            Go Back Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:block w-56 shrink-0"
        >
          <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-4 uppercase">Navigate</p>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-gold text-primary-foreground shadow-md"
                      : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t border-border px-2 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  active === cat.id ? "bg-gradient-gold text-primary-foreground" : "text-foreground/70"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-w-0 pb-20 md:pb-0"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">Guidance Portal</h1>
            <p className="text-muted-foreground mb-8">Step-by-step procedures for Indian government services.</p>

            {/* Title */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{data.emoji}</span>
              <h2 className="font-display text-2xl font-bold text-foreground">{data.title}</h2>
              <Badge className="bg-gold/20 text-gold-dark border-gold/30 font-medium">Guide</Badge>
            </div>

            {/* Description */}
            <div className="border-l-4 border-gold/50 bg-secondary/60 rounded-r-xl px-6 py-4 mb-10">
              <p className="text-foreground/80 leading-relaxed">{data.description}</p>
            </div>

            {/* Documents */}
            <div className="mb-10">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" /> Documents Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.documents.map((doc) => (
                  <span key={doc} className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground/80 font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-border mb-10" />

            {/* Procedures - Accordion style */}
            <div className="mb-10">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-gold" /> Procedure to Apply
              </h3>
              <div className="space-y-4">
                {data.procedures.map((proc, i) => (
                  <ProcedureAccordion key={proc.title} proc={proc} index={i} centres={data.centres} mapQuery={data.mapQuery} />
                ))}
              </div>
            </div>

            <hr className="border-border mb-10" />

            {/* Official Source */}
            <div className="mb-10">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold" /> Live Content from Official Sources
              </h3>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{data.officialSource.title}</h4>
                  <Badge className="bg-gold/20 text-gold-dark border-gold/30 text-xs">{data.officialSource.source}</Badge>
                </div>
                <p className="text-foreground/70 leading-relaxed mb-3">{data.officialSource.summary}</p>
                <a href={data.officialSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gold-dark font-medium hover:underline">
                  View official source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 bg-gold/5 border-gold/20"
            >
              <h3 className="font-display text-lg font-semibold text-gold-dark mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Pro Tips
              </h3>
              <ul className="space-y-2">
                {data.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-foreground/70">
                    <ChevronRight className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default GuidePortal;
