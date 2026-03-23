import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Clock3, Mail, MessageSquareHeart, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footerdemo } from "@/components/ui/footer-section"
import { HeroHeader } from "@/components/ui/hero-section-1"
import { getApiErrorMessages } from "@/lib/api/client"
import { submitContactRequest } from "@/lib/api/curanet"
import { usePageSeo } from "@/hooks/use-page-seo"

export function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const pageDescription =
    "Contact CuraNet support by submitting a detailed request. A copy is sent to your email and the CuraNet support team at support@curanet.in."

  const structuredData = useMemo(() => {
    const pageUrl = `${window.location.origin}/contact`
    const ogImageUrl = `${window.location.origin}/CuraNet.png`

    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "CuraNet Contact",
      url: pageUrl,
      description: pageDescription,
      mainEntity: {
        "@type": "Organization",
        name: "CuraNet",
        url: window.location.origin,
        logo: ogImageUrl,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@curanet.in",
          availableLanguage: ["en", "hi"],
        },
      },
    }
  }, [pageDescription])

  usePageSeo({
    path: "/contact",
    title: "Contact CuraNet Support | Submit Request and Receive Email Copy",
    description: pageDescription,
    jsonLdId: "curanet-contact-jsonld",
    jsonLd: structuredData,
    ogImagePath: "/social/contact-og.svg",
    ogImageAlt: "CuraNet Contact preview with support information",
  })

  const phoneDigits = formData.phone.trim()
  const phoneIsValid = phoneDigits.length === 0 || /^\d{10}$/.test(phoneDigits)

  const canSubmit =
    [formData.fullName, formData.email, formData.subject, formData.message]
      .every((value) => value.trim().length > 0) &&
    phoneIsValid &&
    formData.message.trim().length >= 20

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    if (!canSubmit) {
      setSubmitError("Please fill required fields. Phone must be 10 digits when provided, and message must be at least 20 characters.")
      return
    }

    setSubmitting(true)
    try {
      const response = await submitContactRequest({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: phoneDigits.length > 0 ? `+91${phoneDigits}` : undefined,
        organization: formData.organization.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      })

      setSubmitSuccess(
        response.message ||
          "Request submitted successfully. A copy has been sent to your email and CuraNet support."
      )
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitError(getApiErrorMessages(error, "Failed to submit request")[0])
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background">
      <HeroHeader />
      <main className="pt-24 md:pt-28">
        <section className="px-6 pb-8 md:pb-10">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-2xl border bg-muted/20 p-6 md:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Contact CuraNet
              </p>
              <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Submit your support request and get an email copy instantly
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                Share complete details below. After submission, CuraNet support
                receives your message at support@curanet.in and you receive a
                confirmation copy on your email.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <article className="rounded-xl border bg-background/75 p-4">
                  <div className="mb-2 inline-flex rounded-lg border bg-background p-2">
                    <MessageSquareHeart className="size-4" />
                  </div>
                  <h2 className="text-base font-semibold">What to include</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add issue context, timeline, and expected outcome so support can resolve faster.
                  </p>
                </article>
                <article className="rounded-xl border bg-background/75 p-4">
                  <div className="mb-2 inline-flex rounded-lg border bg-background p-2">
                    <Clock3 className="size-4" />
                  </div>
                  <h2 className="text-base font-semibold">Response process</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Requests are reviewed in order. Complex security topics may include follow-up questions.
                  </p>
                </article>
              </div>

              <div className="mt-4 rounded-xl border bg-background/70 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4" /> Delivery assurance
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  On submit, one copy goes to <strong>support@curanet.in</strong> and one copy goes to your provided email.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/15 p-6 md:p-8">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Contact Form
              </p>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <Input
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  required
                />
                <div className="flex items-center rounded-md border bg-background">
                  <span className="px-3 text-sm text-muted-foreground">+91</span>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Phone (optional)"
                    value={formData.phone}
                    onChange={(event) => {
                      const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 10)
                      updateField("phone", digitsOnly)
                    }}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Input
                  placeholder="Organization (optional)"
                  value={formData.organization}
                  onChange={(event) => updateField("organization", event.target.value)}
                />
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(event) => updateField("subject", event.target.value)}
                  required
                />
                <Textarea
                  placeholder="Describe your request in detail (minimum 20 characters)"
                  value={formData.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={6}
                  required
                />

                {submitError ? (
                  <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {submitError}
                  </p>
                ) : null}

                {submitSuccess ? (
                  <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                    {submitSuccess}
                  </p>
                ) : null}

                <Button type="submit" disabled={!canSubmit || submitting} className="mt-1">
                  {submitting ? "Submitting..." : "Submit Contact Request"}
                </Button>
              </form>

              <a
                href="mailto:support@curanet.in"
                className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4" /> Direct mail: support@curanet.in
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footerdemo />
    </div>
  )
}
