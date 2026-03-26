import { useMemo } from "react"
import { ArrowRight, Clock3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FooterSection } from "@/components/ui/footer-section"
import { HeroHeader } from "@/components/ui/hero-section"
import { usePageSeo } from "@/hooks/use-page-seo"

const blogPosts = [
  {
    title: "Designing Consent-Aware Healthcare Workflows",
    excerpt:
      "How purpose-bound access and expiry windows improve trust in patient data sharing.",
    href: "/contact",
    readTime: "5 min read",
  },
  {
    title: "Emergency Access Without Long-Lived Exposure",
    excerpt:
      "A practical approach to rapid sharing with strict expiry and audit visibility.",
    href: "/security#how-security-works",
    readTime: "4 min read",
  },
  {
    title: "From Appointments to Records in One Patient Journey",
    excerpt:
      "Building a connected care experience that stays simple for patients and families.",
    href: "/features",
    readTime: "6 min read",
  },
]

export function BlogPage() {
  const pageDescription =
    "CuraNet Blog: practical insights on secure healthcare workflows, consent-aware access, and emergency-ready patient experiences."

  const structuredData = useMemo(() => {
    const pageUrl = `${window.location.origin}/blog`

    return {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "CuraNet Blog",
      url: pageUrl,
      description: pageDescription,
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `${window.location.origin}${post.href}`,
      })),
    }
  }, [pageDescription])

  usePageSeo({
    path: "/blog",
    title: "CuraNet Blog | Secure Healthcare Workflows and Patient Access Insights",
    description: pageDescription,
    jsonLdId: "curanet-blog-jsonld",
    jsonLd: structuredData,
  })

  return (
    <div className="bg-background">
      <HeroHeader />
      <main className="pt-24 md:pt-28">
        <section className="px-6 pb-8 md:pb-10">
          <div className="mx-auto max-w-7xl rounded-2xl border bg-muted/20 p-6 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
              CuraNet Blog
            </p>
            <h1 className="mt-3 max-w-4xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Insights on secure patient workflows and consent-aware care access
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
              Explore practical guides and product notes from the CuraNet team.
              Learn how we design safer access journeys across records,
              appointments, and emergency sharing.
            </p>
          </div>
        </section>

        <section className="px-6 pb-12 md:pb-16">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.title} className="rounded-2xl border bg-muted/10 p-5">
                <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" /> {post.readTime}
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <Button asChild variant="outline" className="mt-5 rounded-xl">
                  <a href={post.href}>
                    Read article <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
