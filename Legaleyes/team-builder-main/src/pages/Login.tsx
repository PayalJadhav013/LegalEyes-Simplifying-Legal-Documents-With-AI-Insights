import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/legaleyes-logo.png";
import { apiLogin } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Manual Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiLogin(email, password);

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

      toast.success("Welcome back, " + data.fullName + "!");
      navigate("/");
      window.location.reload();

    } catch (err: any) {
      console.error("Manual login error:", err);
      toast.error(err.message || "Login failed");
    }

    setLoading(false);
  };

  // ✅ Google Login
  const handleGoogleLogin = async (credentialResponse: any) => {
    console.log("Google Response:", credentialResponse);

    if (!credentialResponse?.credential) {
      toast.error("Google token not received");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

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

      toast.success("Welcome, " + data.fullName + "!");
      navigate("/");
      window.location.reload();

    } catch (err: any) {
      console.error("Google login error:", err);
      toast.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="LegalEyes" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your LegalEyes account
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">

          {/* Manual Login */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2 font-semibold"
              disabled={loading}
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error("Google Login UI Error");
                toast.error("Google Login Failed");
              }}
            />
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-gold-dark font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;