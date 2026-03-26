import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ErrorBoundary } from "@/components/error-boundary"
import { SmoothScrolling } from "@/components/smooth-scrolling"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

// Register Workbox service worker (vite-plugin-pwa auto-generates at build time)
// This is a no-op in dev mode; the SW only activates in production builds.
if ("serviceWorker" in navigator && import.meta.env.MODE === "production") {
  void (async () => {
    try {
      const { registerSW } = await import("virtual:pwa-register")
      registerSW({ immediate: false })
    } catch {
      // Virtual module only available after build; dev mode silently skips
    }
  })()
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <SmoothScrolling>
            <App />
          </SmoothScrolling>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)
