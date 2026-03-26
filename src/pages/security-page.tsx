import { useMemo } from "react"
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Fingerprint,
  KeyRound,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FooterSection } from "@/components/ui/footer-section"
import { HeroHeader } from "@/components/ui/hero-section"
import { usePageSeo } from "@/hooks/use-page-seo"

const securityPillars = [
  {
    title: "Consent-Aware Authorization",
    description:
      "Data access is constrained by explicit consent scopes, purpose boundaries, and expiry windows so authorization remains controlled and policy-aligned.",
    icon: ShieldCheck,
  },
  {
    title: "Least-Privilege Data Exposure",
    description:
      "Role-aware boundaries enforce minimum-necessary exposure, reducing risk of over-disclosure across operational and emergency workflows.",
    icon: Lock,
  },
  {
    title: "Audit Trail Visibility",
    description:
      "Access events and emergency actions are traceable for evidence-based review, governance checks, and post-incident investigation.",
    icon: Eye,
  },
  {
    title: "Identity and Session Protection",
    description:
      "Identity verification and controlled session behavior harden account entry points and reduce unauthorized persistence risk.",
    icon: Fingerprint,
  },
  {
    title: "Emergency Access Guardrails",
    description:
      "Emergency sharing is engineered for rapid response without long-lived exposure, using strict expiry, bounded access, and measurable usage.",
    icon: Siren,
  },
  {
    title: "Credential and Token Hardening",
    description:
      "Credential and token safeguards are designed to reduce replay, leakage, and session abuse while preserving operational continuity.",
    icon: KeyRound,
  },
]

const controls = [
  {
    area: "Access Control",
    details:
      "Scope-bound consent, role-aware constraints, and minimum-necessary defaults aligned to healthcare data protection principles.",
  },
  {
    area: "Data Sharing",
    details:
      "Time-limited emergency sharing with explicit purpose visibility, constrained windows, and revocation-ready control points.",
  },
  {
    area: "Monitoring",
    details:
      "Reviewable access telemetry supports audit evidence, anomaly triage, and ongoing policy conformance checks.",
  },
  {
    area: "Identity and Sessions",
    details:
      "Verification and session control support trusted identity posture and help reduce unauthorized session continuation risk.",
  },
]

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
    title: "Audit Review and Response",
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

const threatPosture = [
  "Unauthorized over-access risk is reduced through explicit scope and role boundaries.",
  "Extended emergency exposure risk is reduced through strict expiry and bounded sharing controls.",
  "Operational blind spots are reduced through traceable, review-ready access history.",
  "Credential compromise blast radius is reduced through hardened session and token controls.",
]

export function SecurityPage() {
  const pageDescription =
    "CuraNet Security: governance-ready healthcare controls with consent-aware authorization, least-privilege exposure, audit visibility, identity/session protection, and emergency-access guardrails."

  const structuredData = useMemo(() => {
    const pageUrl = `${window.location.origin}/security`
    const ogImageUrl = `${window.location.origin}/CuraNet.png`

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "CuraNet Security",
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
          "Consent-aware authorization controls",
          "Least-privilege data exposure",
          "Audit trail visibility and evidence readiness",
          "Identity and session protection",
          "Emergency access guardrails with expiry controls",
          "Credential and token hardening",
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
    path: "/security",
    title: "CuraNet Security | Governance-Ready Controls and Healthcare Data Protection",
    description: pageDescription,
    jsonLdId: "curanet-security-jsonld",
    jsonLd: structuredData,
    ogImagePath: "/social/security-og.svg",
    ogImageAlt: "CuraNet Security preview highlighting privacy-first healthcare access controls",
  })

  return (
    <div className="bg-background">
      <HeroHeader />
      <main className="pt-24 md:pt-28">
        <section className="px-6 pb-8 md:pb-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border bg-muted/20 p-6 md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Security Architecture
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Governance-ready security controls built into every healthcare access path
              </h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                CuraNet security posture is designed for operational trust: policy-aligned
                authorization, evidence-ready auditability, and risk-reducing emergency
                guardrails that protect sensitive workflows without slowing care delivery.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Activate Security Controls <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl px-5">
                  <a href="/contact">Request Security Guidance</a>
                </Button>
              </div>
            </div>

            <aside className="rounded-2xl border bg-muted/15 p-6 md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <BadgeCheck className="size-3.5" /> Threat Posture
              </div>
              <ul className="space-y-3">
                {threatPosture.map((item) => (
                  <li key={item} className="rounded-lg border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
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
                Control Pillars
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
                Six control domains protecting access, exposure, and operational integrity
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {securityPillars.map(({ title, description, icon: Icon }) => (
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

        <section className="px-6 pb-8 md:pb-12">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-muted/20 p-6 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Security Controls Matrix
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Governance-focused security areas and enforcement intent
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {controls.map((item) => (
                <article key={item.area} className="rounded-xl border bg-background/80 p-4">
                  <h3 className="text-lg font-semibold">{item.area}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.details}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-security-works" className="px-6 pb-8 md:pb-12">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border bg-muted/20 p-6 md:p-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                How Security Works
              </p>
              <h2 className="mt-3 max-w-5xl text-balance text-2xl font-semibold tracking-tight md:text-4xl">
                Four execution stages from trusted identity to governance-ready review
              </h2>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
                CuraNet security runs as a lifecycle: identity verification,
                policy-bound authorization, controlled sharing, and audit-ready
                review so sensitive healthcare access remains measurable and safe.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {securityLifecycleSteps.map((step, index) => (
                  <article key={step.title} className="rounded-xl border bg-background/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Stage {index + 1}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </article>
                ))}
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

        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-gradient-to-r from-muted/30 via-muted/20 to-muted/10 p-6 md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  <ShieldAlert className="size-3.5" /> Security CTA
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">
                  Need enterprise-grade security posture for healthcare access?
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Start with governance-ready controls, audit-visible access patterns,
                  and risk-aware sharing boundaries designed for high-trust operations.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-xl px-5">
                  <a href="/signup">
                    Start With Secure Setup <ArrowRight className="ml-2 size-4" />
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
      <FooterSection />
    </div>
  )
}
