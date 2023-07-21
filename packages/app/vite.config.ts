import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.VITE_BASE_URL": JSON.stringify(process.env.VITE_BASE_URL),
  },
  plugins: [react()],
});
