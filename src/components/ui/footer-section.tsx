import * as React from "react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Facebook,
  Instagram,
  Linkedin,
  Moon,
  Send,
  Sun,
  Twitter,
} from "lucide-react"

function Footerdemo() {
  const { theme, setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const syncResolvedTheme = () => {
      const resolvedDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches)
      setIsDarkMode(resolvedDark)
    }

    syncResolvedTheme()
    mediaQuery.addEventListener("change", syncResolvedTheme)

    return () => {
      mediaQuery.removeEventListener("change", syncResolvedTheme)
    }
  }, [theme])

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected to CuraNet</h2>
            <p className="mb-6 text-muted-foreground">
              Get updates on secure records access, appointment workflows,
              consent controls, and emergency sharing improvements.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your work or personal email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Explore CuraNet</h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block transition-colors hover:text-primary">
                Landing Page
              </a>
              <a href="/signup" className="block transition-colors hover:text-primary">
                Create Account
              </a>
              <a href="/login" className="block transition-colors hover:text-primary">
                Sign In
              </a>
              <a href="/appointments" className="block transition-colors hover:text-primary">
                Appointments
              </a>
              <a href="/consent" className="block transition-colors hover:text-primary">
                Consent Management
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Care Coordination</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>CuraNet Patient Experience Team</p>
              <p>Clinical Access & Consent Operations</p>
              <p>Email: support@curanet.in</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow the Platform</h3>
            <TooltipProvider>
              <div className="mb-6 flex space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow CuraNet on Facebook</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow CuraNet on X</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow CuraNet on Instagram</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with the CuraNet team on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 CuraNet. Secure patient access, consent-aware sharing, and emergency-ready care workflows.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="/settings/privacy" className="transition-colors hover:text-primary">
              Privacy Controls
            </a>
            <a href="/consent" className="transition-colors hover:text-primary">
              Consent Policy
            </a>
            <a href="/emergency" className="transition-colors hover:text-primary">
              Emergency Access
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
