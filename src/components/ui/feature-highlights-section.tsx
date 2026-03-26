import type { ReactNode } from "react"

import {
  BellRing,
  CalendarClock,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Siren,
} from "lucide-react"

import { cn } from "@/lib/utils"

type FeatureItem = {
  title: string
  description: string
  icon: ReactNode
}

const features: FeatureItem[] = [
  {
    title: "Patient Dashboard Overview",
    description:
      "See appointments, records, consent status, and account context in one operational snapshot.",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    title: "Records You Can Navigate",
    description:
      "Review encounters and observations in focused views with detail dialogs built for fast scanning.",
    icon: <FileText className="size-5" />,
  },
  {
    title: "Appointment Lifecycle",
    description:
      "Schedule, edit eligible pending requests, and track upcoming versus historical consultations.",
    icon: <CalendarClock className="size-5" />,
  },
  {
    title: "Consent by Scope and Expiry",
    description:
      "Grant, reject, revoke, and inspect consent access with clear scope boundaries and expiry controls.",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    title: "Emergency Link Sharing",
    description:
      "Generate time-limited emergency links with visibility into active, used, expired, and revoked states.",
    icon: <Siren className="size-5" />,
  },
  {
    title: "Privacy and Security Controls",
    description:
      "Control profile visibility, sharing preferences, and account security operations from settings.",
    icon: <Lock className="size-5" />,
  },
  {
    title: "Health-Centric User Experience",
    description:
      "Patient-facing flows prioritize readable states, reliable actions, and understandable feedback.",
    icon: <HeartPulse className="size-5" />,
  },
  {
    title: "Notification Preferences",
    description:
      "Manage delivery channels, quiet hours, and update cadence for a calmer care experience.",
    icon: <BellRing className="size-5" />,
  },
]

export function FeatureHighlightsSection() {
  return (
    <section className="bg-background px-6 pb-16 pt-6 md:pb-24 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            CuraNet Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Healthcare workflows designed for clarity, speed, and controlled sharing
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Every section aligns with how CuraNet is used in practice: from
            daily scheduling and records access to consent-based data sharing
            and emergency readiness.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 py-2 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Feature({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: ReactNode
  index: number
}) {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 ? (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      ) : (
        <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
      )}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  )
}
