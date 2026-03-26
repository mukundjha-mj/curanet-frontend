import { CareWorkflowVisualSection } from "@/components/ui/care-workflow-visual-section"
import { FeatureHighlightsSection } from "@/components/ui/feature-highlights-section"
import { FooterSection } from "@/components/ui/footer-section"
import { HeroSection } from "@/components/ui/hero-section"
import { usePageSeo } from "@/hooks/use-page-seo"

export function Home() {
  usePageSeo({
    path: "/",
    title: "CuraNet | Secure Health Data Platform",
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
      <FeatureHighlightsSection />
      <CareWorkflowVisualSection />
      <FooterSection />
    </div>
  )
}
