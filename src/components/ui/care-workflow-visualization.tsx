import { motion } from "motion/react"
import { Folder, HeartHandshakeIcon, SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface CareWorkflowVisualizationProps {
  className?: string
  circleText?: string
  badgeTexts?: {
    first: string
    second: string
    third: string
    fourth: string
  }
  buttonTexts?: {
    first: string
    second: string
  }
  title?: string
  lightColor?: string
}

function CareWorkflowVisualization({
  className,
  circleText,
  badgeTexts,
  buttonTexts,
  title,
  lightColor,
}: CareWorkflowVisualizationProps) {
  const resolvedBadgeTexts = {
    first: badgeTexts?.first ?? "RECORD",
    second: badgeTexts?.second ?? "BOOK",
    third: badgeTexts?.third ?? "CONSENT",
    fourth: badgeTexts?.fourth ?? "EMERG",
  }

  const resolvedButtonTexts = {
    first: buttonTexts?.first ?? "Patient Portal",
    second: buttonTexts?.second ?? "care_updates",
  }

  const resolvedTitle =
    title ?? "CuraNet for appointments, records, consent, and emergency care"

  const resolvedCircleText = circleText ?? "CARE"

  return (
    <div
      className={cn(
        "relative flex h-[240px] w-full max-w-[500px] flex-col items-center overflow-hidden sm:h-[350px]",
        className
      )}
    >
      <svg
        className="h-full text-muted sm:w-full"
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
      >
        <g
          className="db-connector-lines"
          stroke="currentColor"
          fill="none"
          strokeWidth="0.4"
          strokeDasharray="100 100"
          pathLength="100"
        >
          <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 35" />
          <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 35" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 35" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 35" />
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        </g>
        <g mask="url(#db-mask-1)">
          <circle
            className="database db-light-1"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-2)">
          <circle
            className="database db-light-2"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-3)">
          <circle
            className="database db-light-3"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-4)">
          <circle
            className="database db-light-4"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g className="db-top-badges" stroke="currentColor" fill="none" strokeWidth="0.4">
          <g>
            <rect fill="#18181B" x="10" y="5" width="46" height="10" rx="5" />
            <DatabaseIcon x={14} y={7.5} />
            <text
              x="33"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="500"
              textAnchor="middle"
            >
              {resolvedBadgeTexts.first}
            </text>
          </g>
          <g>
            <rect fill="#18181B" x="60" y="5" width="40" height="10" rx="5" />
            <DatabaseIcon x={64} y={7.5} />
            <text
              x="80"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="500"
              textAnchor="middle"
            >
              {resolvedBadgeTexts.second}
            </text>
          </g>
          <g>
            <rect fill="#18181B" x="104" y="5" width="46" height="10" rx="5" />
            <DatabaseIcon x={108} y={7.5} />
            <text
              x="127"
              y="12"
              fill="white"
              stroke="none"
              fontSize="4.6"
              fontWeight="500"
              textAnchor="middle"
            >
              {resolvedBadgeTexts.third}
            </text>
          </g>
          <g>
            <rect fill="#18181B" x="154" y="5" width="40" height="10" rx="5" />
            <DatabaseIcon x={158} y={7.5} />
            <text
              x="174"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="500"
              textAnchor="middle"
            >
              {resolvedBadgeTexts.fourth}
            </text>
          </g>
        </g>
        <defs>
          <mask id="db-mask-1">
            <path
              d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 35"
              className="db-mask-path"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          <mask id="db-mask-2">
            <path
              d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 35"
              className="db-mask-path"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          <mask id="db-mask-3">
            <path
              d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 35"
              className="db-mask-path"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          <mask id="db-mask-4">
            <path
              d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 35"
              className="db-mask-path"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor={lightColor || "#00A6F5"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute bottom-3 flex w-full flex-col items-center sm:bottom-14 md:bottom-20">
        <div className="absolute bottom-1 h-[68px] w-[82%] rounded-lg bg-accent/30 sm:h-[100px] sm:w-[62%]" />
        <div className="absolute left-1/2 top-0 z-20 flex max-w-[94%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[#101112] px-2 py-1 text-white sm:max-w-[75%] sm:py-1.5">
          <SparklesIcon className="size-3" />
          <span className="ml-2 truncate whitespace-nowrap text-[8px] sm:text-[10px]">{resolvedTitle}</span>
        </div>
        <div className="absolute bottom-0 z-30 grid h-[48px] w-[48px] place-items-center rounded-full border-t bg-[#141516] text-[10px] font-semibold text-white sm:h-[60px] sm:w-[60px] sm:text-xs">
          {resolvedCircleText}
        </div>
        <div className="relative z-10 flex h-[150px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background shadow-md sm:h-[210px]">
          <div className="absolute bottom-12 left-1/2 z-10 flex h-7 -translate-x-1/2 items-center gap-2 rounded-full border bg-[#101112] px-3 text-[11px] text-white sm:bottom-14 md:bottom-6 md:left-12 md:translate-x-0 md:text-xs">
            <HeartHandshakeIcon className="size-4" />
            <span>{resolvedButtonTexts.first}</span>
          </div>
          <div className="absolute right-16 z-10 hidden h-7 items-center gap-2 rounded-full border bg-[#101112] px-3 text-xs text-white md:flex">
            <Folder className="size-4" />
            <span>{resolvedButtonTexts.second}</span>
          </div>
          <motion.div
            className="absolute -bottom-8 h-[70px] w-[70px] rounded-full border-t bg-accent/5 sm:-bottom-14 sm:h-[100px] sm:w-[100px]"
            animate={{
              scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-12 h-[96px] w-[96px] rounded-full border-t bg-accent/5 sm:-bottom-20 sm:h-[145px] sm:w-[145px]"
            animate={{
              scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[58px] h-[128px] w-[128px] rounded-full border-t bg-accent/5 sm:-bottom-[100px] sm:h-[190px] sm:w-[190px]"
            animate={{
              scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[74px] h-[156px] w-[156px] rounded-full border-t bg-accent/5 sm:-bottom-[120px] sm:h-[235px] sm:w-[235px]"
            animate={{
              scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  )
}

export default CareWorkflowVisualization

function DatabaseIcon({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}
