import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/legaleyes-logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Guide Portal", path: "/guide" },
  { label: "AI Analyser", path: "/analyser" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LegalEyes" width={36} height={36} className="w-9 h-9" />
            <span className="font-display text-xl font-bold text-foreground">
              Legal<span className="text-gradient-gold">Eyes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-gold text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">

                  {/* ✅ USERNAME DISPLAY */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
                    <User className="w-4 h-4 text-gold" />
                    <span className="text-foreground/80 font-medium max-w-[120px] truncate">
                      {user.username || user.email}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>

                </div>
              ) : (
                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-gradient-gold text-primary-foreground hover:opacity-90 gap-1.5 font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="px-4 py-3 space-y-1">

              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-gold text-primary-foreground"
                        : "text-foreground/70 hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-border mt-2">
                {user ? (
                  <>
                    {/* ✅ MOBILE USERNAME */}
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80">
                      <User className="w-4 h-4 text-gold" />
                      {user.username || user.email}
                    </div>

                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-secondary transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-gold text-primary-foreground text-center"
                  >
                    Login
                  </Link>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;