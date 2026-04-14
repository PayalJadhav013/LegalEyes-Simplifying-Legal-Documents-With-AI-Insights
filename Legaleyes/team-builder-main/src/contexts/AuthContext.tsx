import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const BASE = "/api";

// ✅ Updated User interface (REMOVED purpose)
interface User {
  userId: string;
  email: string;
  fullName: string;
  username?: string;
  profession?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signOut: () => void;
  setAuth: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signOut: () => {},
  setAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ✅ Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("le_token");
    const storedUser = localStorage.getItem("le_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ set auth globally
  const setAuth = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("le_token", token);
    localStorage.setItem("le_user", JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("le_token");
    localStorage.removeItem("le_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Auth API helpers ──────────────────────────────────────────────

// ✅ UPDATED REGISTER API (REMOVED purpose param)
export async function apiRegister(
  email: string,
  password: string,
  fullName: string,
  username: string,
  profession: string
) {
  const r = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      fullName,
      username,
      profession,
    }),
  });

  const data = await r.json();

  if (!r.ok) {
    throw new Error(data.message || data.error || "Registration failed");
  }

  return data as {
    token: string;
    userId: string;
    email: string;
    fullName: string;
    username?: string;
    profession?: string;
  };
}

// ✅ LOGIN API
export async function apiLogin(email: string, password: string) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await r.json();

  if (!r.ok) {
    throw new Error(data.message || data.error || "Invalid email or password");
  }

  return data as {
    token: string;
    userId: string;
    email: string;
    fullName: string;
    username?: string;
    profession?: string;
  };
}