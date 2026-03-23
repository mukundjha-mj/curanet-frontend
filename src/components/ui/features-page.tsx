import { useMemo } from "react"
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  FileCheck2,
  FileText,
  HeartPulse,
  Lock,
  ShieldCheck,
  Siren,
  Stethoscope,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Footerdemo } from "@/components/ui/footer-section"
import { HeroHeader } from "@/components/ui/hero-section-1"
import { usePageSeo } from "@/hooks/use-page-seo"

const highlights = [
  "Consent-aware sharing with clear scope boundaries",
  "Appointment lifecycle from request to completion",
  "Records and observations optimized for quick review",
  "Emergency access through time-limited secure links",
]

const featureCards = [
  {
    title: "Records You Can Act On",
    description:
      "Encounters and observations stay structured and readable so patients and care teams can move from information to action quickly.",
    icon: FileText,
  },
  {
    title: "Appointment Workflow Clarity",
    description:
      "From scheduling to updates and status changes, CuraNet keeps every appointment state transparent and easy to manage.",
    icon: CalendarClock,
  },
  {
    title: "Consent by Scope and Time",
    description:
      "Grant, review, revoke, and audit consent with explicit scopes and expiry controls that reduce accidental over-sharing.",
    icon: ShieldCheck,
  },
  {
    title: "Emergency-Ready Access",
    description:
      "Generate emergency links that are time-bound and auditable, so critical data is available in urgent situations without persistent exposure.",
    icon: Siren,
  },
  {
    title: "Privacy and Security Controls",
    description:
      "Account protection, profile visibility, and sharing preferences are designed as user-visible controls rather than hidden defaults.",
    icon: Lock,
  },
  {
    title: "Notification Intelligence",
    description:
      "Set channels, quiet hours, and frequency so health updates stay helpful and timely without overwhelming the user.",
    icon: BellRing,
  },
]

const workflowSteps = [
  {
    title: "Onboard Securely",
    text: "Create your account, verify identity, and start with trusted access boundaries.",
  },
  {
    title: "Coordinate Daily Care",
    text: "Use one dashboard to manage records, appointments, and consent decisions.",
  },
  {
    title: "Respond in Urgent Moments",
    text: "Share emergency data with controlled links while preserving audit visibility.",
  },
]

export function FeaturesPage() {
  const pageDescription =
    "Explore CuraNet features for secure health records, appointment coordination, consent-aware data sharing, and emergency-ready access workflows."

  const structuredData = useMemo(() => {
    const pageUrl = `${window.location.origin}/features`
    const ogImageUrl = `${window.location.origin}/CuraNet.png`

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "CuraNet Features",
      url: pageUrl,
      description: pageDescription,
      isPartOf: {
        "@type": "WebSite",
        name: "CuraNet",
        url: window.location.origin,
      },
      about: {
        "@type": "SoftwareApplication",
        name: "CuraNet",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        featureList: [
          "Medical records and observations review",
          "Appointment scheduling and tracking",
          "Consent management with scope and expiry",
          "Emergency link generation with controlled access",
          "Privacy and notification settings",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "CuraNet",
        url: window.location.origin,
        logo: ogImageUrl,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@curanet.in",
        },
      },
    }
  }, [pageDescription])

  usePageSeo({
    path: "/features",
    title: "CuraNet Features | Records, Appointments, Consent & Emergency Access",
    description: pageDescription,
    jsonLdId: "curanet-features-jsonld",
    jsonLd: structuredData,
    ogImagePath: "/social/features-og.svg",
    ogImageAlt: "CuraNet Features preview showing records, appointments, consent, and emergency workflow",
  })

  return (
    <div className="bg-background">
      <HeroHeader />

      <main className="pt-24 md:pt-28">
        <section className="px-6 pb-8 md:pb-12">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border bg-muted/20 p-6 md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                CuraNet Features
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                One platform for secure records, consent-aware sharing, and care continuity
              </h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                CuraNet is built for real healthcare workflows, from routine appointments
                to high-urgency access scenarios. Every feature balances speed, clarity,
                and patient data protection.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Start Free Access <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-5">
                  <a href="/how-security-works">See Workflow</a>
                </Button>
              </div>
            </div>

            <aside className="rounded-2xl border bg-muted/15 p-6 md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <FileCheck2 className="size-3.5" /> Outcome Highlights
              </div>
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="rounded-lg border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="px-6 pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Detailed Capabilities
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
                Designed around how patients and providers actually work
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border bg-muted/10 p-5">
                  <div className="mb-3 inline-flex rounded-lg border bg-background p-2">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-8 md:pb-14">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-muted/20 p-6 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Workflow Journey
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Built for daily care and urgent care, in one system
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="rounded-xl border bg-background/80 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-gradient-to-r from-muted/30 via-muted/20 to-muted/10 p-6 md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  <HeartPulse className="size-3.5" /> Conversion-Focused CTA
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
                  Ready to simplify care coordination with CuraNet?
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Start with secure onboarding, activate consent-aware data sharing,
                  and keep emergency access prepared without sacrificing privacy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Create Account <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-5">
                  <a href="/contact">
                    <Stethoscope className="mr-2 size-4" /> Talk to Support
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footerdemo />
    </div>
  )
}
