interface AuthStatusToastProps {
  open: boolean
  title: string
  message: string
}

export function AuthStatusToast({ open, title, message }: AuthStatusToastProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        "pointer-events-none fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] transition-all duration-300 ease-out md:right-6 md:top-6",
        open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0",
      ].join(" ")}
    >
      <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
        <div className="p-4 text-white">
          <p className="text-sm font-semibold tracking-wide text-emerald-300">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{message}</p>
        </div>
      </div>
    </div>
  )
}
