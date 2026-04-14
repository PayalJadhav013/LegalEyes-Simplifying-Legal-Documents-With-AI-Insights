import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 5173,           // Frontend on 5173 (Spring Boot uses 8080)
    proxy: {
      "/api": {
        target: "http://localhost:8080",   // Spring Boot
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
});
