import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative asset paths work for both milemario.github.io and /osinteusz/.
  base: "./",
});
