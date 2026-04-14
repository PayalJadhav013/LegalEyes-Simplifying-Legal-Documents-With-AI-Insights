import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ NEW

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="233701657275-c8g7gh2eg1ol6dli944hn0ico9m5dd0p.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);