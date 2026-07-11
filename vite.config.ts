import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages: https://ryuta-pt.github.io/youtsu-navi/
export default defineConfig({
  plugins: [react()],
  base: "/youtsu-navi/",
});
