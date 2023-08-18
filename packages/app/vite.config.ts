import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.API_ENDPOINT": JSON.stringify(process.env.API_ENDPOINT),
  },
  plugins: [react()],
});
