import { DatabaseWithRestApiDemo } from "@/components/ui/database-with-rest-api-demo"
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects"
import { Footerdemo } from "@/components/ui/footer-section"
import { HeroSection } from "@/components/ui/hero-section-1"
import { usePageSeo } from "@/hooks/use-page-seo"

export function Demo() {
  usePageSeo({
    path: "/",
    title: "CuraNet — Secure Health Data Platform",
    description:
      "CuraNet is a secure, consent-driven health data platform. Manage medical records, appointments, and emergency access with confidence.",
    jsonLdId: "ld-home",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "CuraNet",
      url: "https://curanet.in",
      description:
        "Secure, consent-driven health data platform for managing medical records, appointments, and emergency access.",
      applicationCategory: "HealthApplication",
    },
  })

  return (
    <div>
      <HeroSection />
      <FeaturesSectionWithHoverEffects />
      <DatabaseWithRestApiDemo />
      <Footerdemo />
    </div>
  )
}
