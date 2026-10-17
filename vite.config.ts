import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { CSP_META } from "./security/csp.js";

// Ships the CSP meta for builds only. Dev stays clear of it: Tailwind v4 streams
// <style> elements in at runtime and `style-src 'self'` would block them, while the
// build emits a plain linked stylesheet.
function systemCsp(): Plugin {
  return {
    name: "system-csp",
    apply: "build",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return {
          html,
          tags: [
            {
              tag: "meta",
              attrs: { "http-equiv": "Content-Security-Policy", content: CSP_META },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [systemCsp(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    target: "es2020",
  },
});
