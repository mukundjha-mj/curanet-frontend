import { useMemo } from "react"
import { ArrowRight, BadgeCheck, Eye, Fingerprint, KeyRound, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Footerdemo } from "@/components/ui/footer-section"
import { HeroHeader } from "@/components/ui/hero-section-1"
import { usePageSeo } from "@/hooks/use-page-seo"

const securityLifecycleSteps = [
  {
    title: "Identity Proof and Access Start",
    description:
      "User entry begins with verification-first identity controls to establish a trusted session baseline.",
  },
  {
    title: "Policy-Bound Authorization",
    description:
      "Access decisions are constrained by consent scope, role boundaries, and least-privilege exposure rules.",
  },
  {
    title: "Controlled Sharing Execution",
    description:
      "Time-bounded sharing and emergency guardrails reduce persistent exposure while preserving urgent access paths.",
  },
  {
    title: "Audit, Review, and Response",
    description:
      "Every critical action remains reviewable for governance, anomaly triage, and post-incident evidence needs.",
  },
]

const securityControlOutcomes = [
  "Authorization is purpose-bound and expiration-aware.",
  "Data exposure is reduced through minimum-necessary principles.",
  "Emergency access remains rapid without becoming permanent.",
  "Security operations are traceable and governance-ready.",
]

const domainControls = [
  {
    title: "Identity and Session Layer",
    details:
      "Verification and session protections reduce account takeover probability and unauthorized persistence risk.",
    icon: Fingerprint,
  },
  {
    title: "Authorization and Scope Layer",
    details:
      "Role-aware constraints and consent scope checks keep access decisions deterministic and policy aligned.",
    icon: ShieldCheck,
  },
  {
    title: "Audit and Governance Layer",
    details:
      "Reviewable access evidence supports compliance workflows, forensic analysis, and operational accountability.",
    icon: Eye,
  },
  {
    title: "Credential and Token Layer",
    details:
      "Credential and token handling controls reduce replay risk, leakage blast radius, and long-lived abuse windows.",
    icon: KeyRound,
  },
]

export function HowItWorksPage() {
  const pageDescription =
    "Understand how CuraNet security works: identity verification, policy-bound authorization, controlled sharing, and audit-ready governance workflows."

  const structuredData = useMemo(() => {
    const pageUrl = `${window.location.origin}/how-security-works`
    const ogImageUrl = `${window.location.origin}/CuraNet.png`

    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How CuraNet Security Works",
      url: pageUrl,
      description: pageDescription,
      step: securityLifecycleSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: step.description,
      })),
      publisher: {
        "@type": "Organization",
        name: "CuraNet",
        url: window.location.origin,
        logo: ogImageUrl,
      },
    }
  }, [pageDescription])

  usePageSeo({
    path: "/how-security-works",
    title: "How CuraNet Security Works | Access Control, Guardrails, and Auditability",
    description: pageDescription,
    jsonLdId: "curanet-how-security-works-jsonld",
    jsonLd: structuredData,
    ogImagePath: "/social/how-security-works-og.svg",
    ogImageAlt:
      "CuraNet security workflow preview showing identity, authorization, and audit lifecycle",
  })

  return (
    <div className="bg-background">
      <HeroHeader />
      <main className="pt-24 md:pt-28">
        <section className="px-6 pb-8 md:pb-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border bg-muted/20 p-6 md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Security Workflow
              </p>
              <h1 className="mt-3 max-w-5xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                How security controls execute across the CuraNet access lifecycle
              </h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                This page explains the security execution model only: how identity,
                authorization, controlled sharing, and audit evidence work together to
                reduce risk in healthcare data access.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Start Secure Onboarding <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-5">
                  <a href="/contact">Request Security Walkthrough</a>
                </Button>
              </div>
            </div>

            <aside className="rounded-2xl border bg-muted/15 p-6 md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <BadgeCheck className="size-3.5" /> Security Outcomes
              </div>
              <ul className="space-y-3">
                {securityControlOutcomes.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border bg-background/70 px-3 py-2 text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="px-6 pb-8 md:pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Step-by-Step Security Flow
              </p>
              <h2 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight md:text-4xl">
                Four execution stages from trusted identity to governance-ready review
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {securityLifecycleSteps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border bg-muted/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Stage {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-muted/20 p-6 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Security Domain Model
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Control domains and enforcement intent
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {domainControls.map(({ title, details, icon: Icon }) => (
                <article key={title} className="rounded-xl border bg-background/80 p-4">
                  <div className="mb-3 inline-flex rounded-lg border bg-background p-2">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-gradient-to-r from-muted/30 via-muted/20 to-muted/10 p-6 md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
                  Ready to deploy a policy-bound healthcare access model?
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Start with secure identity controls, enforce least-privilege authorization,
                  and keep every critical access event evidence-ready.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Launch Secure Setup <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-5">
                  <a href="mailto:support@curanet.in">Email Security Team</a>
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
