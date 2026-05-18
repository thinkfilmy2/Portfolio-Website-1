import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["framer-motion", "lucide-react", "react", "react-dom"],
    exclude: ["gsap-trial"],
  },
  server: {
    host: true,
    port: 5173,
  },
});
