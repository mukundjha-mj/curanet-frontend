import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import type { Plugin, PluginOption } from "vite"

/**
 * Emits `_headers` (Netlify / Render / Cloudflare Pages) and `vercel.json`
 * inside `dist/` after every production build so the CDN can push
 * `Link: rel=preload` hints for vendor chunks — the closest static-hosting
 * equivalent to HTTP/2 Server Push.
 */
const generateDeploymentHeaders = (): Plugin => ({
  name: "generate-deployment-headers",
  apply: "build" as const,
  generateBundle(_, bundle) {
    // Collect vendor + index chunk paths (the ones browsers need first)
    // Bundle keys are like "assets/vendor-react-ABC123.js"
    const priorityChunks = Object.keys(bundle)
      .filter((f) => f.endsWith(".js") && (f.includes("vendor") || f.includes("index")))
      .map((f) => `/${f}`) // Already includes "assets/" prefix

    const linkHeaders = priorityChunks
      .map((p) => `<${p}>; rel=modulepreload; as=script`)
      .join(", ")

    // ── Netlify / Render / Cloudflare Pages ──────────────────────────────
    this.emitFile({
      type: "asset",
      fileName: "_headers",
      source: `/*\n  Link: ${linkHeaders}\n`,
    })

    // ── Vercel ────────────────────────────────────────────────────────────
    const vercelHeaders = priorityChunks.map((p) => ({
      source: p,
      headers: [{ key: "Link", value: `<${p}>; rel=modulepreload; as=script` }],
    }))
    this.emitFile({
      type: "asset",
      fileName: "vercel.json",
      source: JSON.stringify({ headers: vercelHeaders }, null, 2),
    })
  },
})

// https://vite.dev/config/
const plugins: PluginOption[] = [
  react(),
  tailwindcss(),
  generateDeploymentHeaders(),
  VitePWA({
    registerType: "autoUpdate",
    // Don't inject a manifest — this is a private health app, not a public PWA
    manifest: false,
    workbox: {
      // Pre-cache all built assets (JS, CSS, HTML)
      globPatterns: ["**/*.{js,css,html,woff2}"],
      // Never cache API calls — they carry auth tokens and live data
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          // Lazy JS chunks: CacheFirst so second-visit loads are instant
          urlPattern: ({ request }) => request.destination === "script",
          handler: "CacheFirst",
          options: {
            cacheName: "js-chunks",
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
        {
          // CSS: CacheFirst
          urlPattern: ({ request }) => request.destination === "style",
          handler: "CacheFirst",
          options: {
            cacheName: "css-assets",
            expiration: { maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        {
          // Web fonts: CacheFirst, very long TTL
          urlPattern: ({ request }) => request.destination === "font",
          handler: "CacheFirst",
          options: {
            cacheName: "fonts",
            expiration: { maxAgeSeconds: 365 * 24 * 60 * 60 },
          },
        },
      ],
    },
  }),
]

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined
          }

          if (id.includes("react") || id.includes("scheduler")) {
            return "vendor-react"
          }

          if (id.includes("radix-ui")) {
            return "vendor-radix"
          }

          if (id.includes("lucide-react")) {
            return "vendor-icons"
          }

          if (id.includes("qrcode.react")) {
            return "vendor-qr"
          }

          return "vendor"
        },
      },
    },
  },
})
