import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/romantic-blessing-page/",
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        public: resolve(__dirname, "public/index.html")
      }
    }
  },
  plugins: [react()]
});
