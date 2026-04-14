import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/legaleyes-logo.png";
import { apiRegister } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profession, setProfession] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ CALL API (NO PURPOSE)
      const data = await apiRegister(
        email,
        password,
        fullName,
        username,
        profession
      );

      // ✅ STORE USER DATA (include username)
      localStorage.setItem("le_token", data.token);
      localStorage.setItem(
        "le_user",
        JSON.stringify({
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          username: data.username,
          profession: data.profession,
        })
      );

      toast.success("Account created! Welcome, " + data.fullName + "!");
      navigate("/");
      window.location.reload(); // refresh auth state

    } catch (err: any) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="LegalEyes" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join LegalEyes for free
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Username */}
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Profession Dropdown */}
            <select
              value={profession}
              onChange={e => setProfession(e.target.value)}
              className="w-full p-2 rounded-md border bg-transparent text-foreground"
              required
            >
              <option value="">Select Profession</option>
              <option>Student</option>
              <option>Job Seeker</option>
              <option>Private Employee</option>
              <option>Government Employee</option>
              <option>Business Owner</option>
              <option>Freelancer / Self-Employed</option>
              <option>Homemaker</option>
              <option>Retired Person</option>
              <option>Farmer</option>
              <option>Startup Founder</option>
              <option>NGO Worker</option>
              <option>Lawyer / Advocate</option>
              <option>Police</option>
              <option>Other</option>
            </select>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 pr-10"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 font-semibold"
              disabled={loading}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating account..." : "Create Account"}
            </Button>

          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-gold-dark font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;