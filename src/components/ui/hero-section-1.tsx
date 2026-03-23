import React from "react"
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  Lock,
  Menu,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sun,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

type AppLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const Link = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ href, children, ...props }, ref) => {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    )
  }
)
Link.displayName = "Link"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const customerIcons = [
  { label: "Records", icon: FileText },
  { label: "Appointments", icon: CalendarClock },
  { label: "Consent", icon: ShieldCheck },
  { label: "Emergency", icon: Siren },
  { label: "Privacy", icon: Lock },
  { label: "Care", icon: HeartPulse },
]

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 isolate z-[2] hidden contain-strict opacity-50 lg:block"
        >
          <div className="absolute left-0 top-0 h-[80rem] w-[35rem] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute left-0 top-0 h-[80rem] w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute left-0 top-0 h-[80rem] w-56 -translate-y-[350px] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring" as const,
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=3276&q=80"
                alt="Healthcare professionals collaborating"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                width={3276}
                height={4095}
              />
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=3276&q=80"
                alt="Patient consultation and digital healthcare workflow"
                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:hidden"
                width={3276}
                height={4095}
              />
            </AnimatedGroup>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border bg-muted p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 hover:bg-background dark:border-t-white/5 dark:shadow-zinc-950 dark:hover:border-t-border"
                  >
                    <span className="text-foreground text-sm">
                      Patient-first workflows with consent-aware access
                    </span>
                    <span className="block h-4 w-0.5 border-l bg-white dark:border-background dark:bg-zinc-700"></span>

                    <div className="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-muted">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <h1 className="mx-auto mt-8 max-w-4xl text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                    CuraNet keeps records, appointments, and emergency access in one secure place
                  </h1>
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                    Built for everyday care coordination and high-urgency moments:
                    schedule visits, manage consent, and share emergency details
                    through controlled, auditable links.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div key={1} className="rounded-[14px] border bg-foreground/10 p-0.5">
                    <Button asChild size="lg" className="rounded-xl px-5 text-base">
                      <Link href="/signup">
                        <span className="text-nowrap">Create Secure Account</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10 rounded-xl px-5"
                  >
                    <Link href="/login">
                      <span className="text-nowrap">Open Dashboard</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent from-35% to-background"
                />
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg shadow-zinc-950/10 ring-1 ring-background">
                  <div className="relative z-[2] aspect-15/8 overflow-hidden rounded-2xl border bg-background p-4">
                    <div className="absolute inset-0 opacity-8 dark:opacity-12">
                      <img
                        className="h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=2200&q=80"
                        alt="Clinical monitoring context"
                        width={2200}
                        height={1200}
                      />
                    </div>

                    <div className="relative grid h-full grid-cols-1 gap-4 md:grid-cols-5">
                      <div className="rounded-xl bg-muted/50 p-4 md:col-span-2">
                        <div className="mb-3 flex items-center gap-2">
                          <img src="/CuraNet.png" alt="CuraNet" className="size-4" />
                          <p className="text-xs font-medium text-muted-foreground">CuraNet Snapshot</p>
                        </div>
                        <h3 className="text-lg font-semibold">Patient Dashboard</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Unified view of records, consent state, appointments,
                          and emergency-sharing readiness.
                        </p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between rounded-lg border bg-background px-2 py-1.5 text-xs">
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <FileText className="size-3.5" /> Records Synced
                            </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">Up to date</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border bg-background px-2 py-1.5 text-xs">
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <CalendarClock className="size-3.5" /> Next Appointment
                            </span>
                            <span className="font-medium">Tomorrow, 10:30</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border bg-background px-2 py-1.5 text-xs">
                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <ShieldCheck className="size-3.5" /> Consent Status
                            </span>
                            <span className="font-medium text-cyan-700 dark:text-cyan-300">Active scopes</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:col-span-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-muted/50 p-4">
                            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                              <Siren className="size-3" /> Emergency Link
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Time-limited access ready for urgent care scenarios.
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <BadgeCheck className="size-3.5" /> Active and auditable
                            </p>
                          </div>
                          <div className="rounded-xl bg-muted/50 p-4">
                            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                              <Lock className="size-3" /> Privacy Controls
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Visibility, sharing, and notification controls per user.
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                              <ShieldAlert className="size-3.5" /> Least-privilege access
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-muted/50 p-4">
                          <p className="mb-2 text-sm text-muted-foreground">Recent activity</p>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between rounded-md border bg-background px-2 py-1.5">
                              <span className="inline-flex items-center gap-1.5">
                                <HeartPulse className="size-3.5 text-pink-600 dark:text-pink-300" /> Observation reviewed
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Clock3 className="size-3" /> 12m ago
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border bg-background px-2 py-1.5">
                              <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck className="size-3.5 text-cyan-700 dark:text-cyan-300" /> Consent granted
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Clock3 className="size-3" /> 27m ago
                              </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border bg-background px-2 py-1.5">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarClock className="size-3.5 text-amber-700 dark:text-amber-300" /> Appointment confirmed
                              </span>
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Clock3 className="size-3" /> 1h ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-8 pt-8 md:pb-12 md:pt-10">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/" className="block text-sm duration-150 hover:opacity-75">
                <span> Explore CuraNet Workflows</span>

                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 transition-all duration-500 group-hover:opacity-50 group-hover:blur-xs sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 md:mt-8">
              {customerIcons.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center justify-center gap-2 rounded-lg border p-3">
                  <Icon className="size-4" />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Security", href: "/security" },
  { name: "How Security Works", href: "/how-security-works" },
  { name: "Contact", href: "/contact" },
]

export const HeroHeader = () => {
  const { theme, setTheme } = useTheme()
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
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

  const toggleTheme = React.useCallback(() => {
    setTheme(isDarkMode ? "light" : "dark")
  }, [isDarkMode, setTheme])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <header>
      <nav data-state={menuState && "active"} className="group fixed z-20 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "max-w-4xl rounded-2xl border bg-background/50 backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 group-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:group-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="relative inline-flex h-8 w-16 items-center rounded-full border bg-background transition-colors duration-300"
                >
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[7px]">
                    <Sun
                      className={cn(
                        "z-10 h-3.5 w-3.5 transition-colors",
                        isDarkMode ? "text-zinc-500" : "text-amber-500"
                      )}
                    />
                    <Moon
                      className={cn(
                        "z-10 h-3.5 w-3.5 transition-colors",
                        isDarkMode ? "text-slate-200" : "text-slate-400"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "pointer-events-none absolute left-[2px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border shadow-sm transition-[transform,background-color,border-color] duration-300 ease-in-out",
                      isDarkMode
                        ? "translate-x-[36px] border-zinc-200 bg-white"
                        : "translate-x-0 border-zinc-900 bg-black"
                    )}
                  />
                </button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="/login">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
                  <Link href="/signup">
                    <span>Sign Up</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                >
                  <Link href="/signup">
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img src="/CuraNet.png" alt="CuraNet logo" className="size-6 object-contain" />
      <span className="text-sm font-semibold tracking-tight">CuraNet</span>
    </div>
  )
}
