import type { DashboardData } from "@/lib/api/types"

interface RecordsRouteSectionProps {
  activePath: string
  dashboard: DashboardData | null
  openRecordDetail: (
    type: "encounter" | "observation",
    data: Record<string, unknown>
  ) => void
}

export default function RecordsRouteSection({
  activePath,
  dashboard,
  openRecordDetail,
}: RecordsRouteSectionProps) {
  if (activePath === "/records") {
    const encounters = dashboard?.encounters ?? []
    const observations = dashboard?.observations ?? []

    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
          <h3 className="text-lg font-semibold">Encounters ({encounters.length})</h3>
          <div className="mt-3 space-y-2">
            {encounters.slice(0, 6).map((enc) => (
              <button
                key={enc.id}
                type="button"
                onClick={() => openRecordDetail("encounter", enc as unknown as Record<string, unknown>)}
                className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
              >
                <p className="font-medium">{enc.type}</p>
                <p className="text-sm text-muted-foreground">
                  {enc.reason ?? "No reason provided"} • {new Date(enc.startTime).toLocaleString()}
                </p>
              </button>
            ))}
            {encounters.length === 0 ? <p className="text-sm text-muted-foreground">No encounters available.</p> : null}
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
          <h3 className="text-lg font-semibold">Observations ({observations.length})</h3>
          <div className="mt-3 space-y-2">
            {observations.slice(0, 6).map((obs) => (
              <button
                key={obs.id}
                type="button"
                onClick={() => openRecordDetail("observation", obs as unknown as Record<string, unknown>)}
                className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
              >
                <p className="font-medium">{obs.code}</p>
                <p className="text-sm text-muted-foreground">{new Date(obs.recordedAt).toLocaleString()}</p>
              </button>
            ))}
            {observations.length === 0 ? <p className="text-sm text-muted-foreground">No observations available.</p> : null}
          </div>
        </div>
      </div>
    )
  }

  if (activePath === "/records/encounters") {
    return (
      <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
        <h3 className="text-lg font-semibold">Encounters ({dashboard?.encounters.length ?? 0})</h3>
        <div className="mt-3 space-y-2">
          {(dashboard?.encounters ?? []).slice(0, 12).map((enc) => (
            <button
              key={enc.id}
              type="button"
              onClick={() => openRecordDetail("encounter", enc as unknown as Record<string, unknown>)}
              className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
            >
              <p className="font-medium">{enc.type}</p>
              <p className="text-sm text-muted-foreground">
                {enc.reason ?? "No reason provided"} • {new Date(enc.startTime).toLocaleString()}
              </p>
            </button>
          ))}
          {(dashboard?.encounters.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No encounters available.</p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
      <h3 className="text-lg font-semibold">Observations ({dashboard?.observations.length ?? 0})</h3>
      <div className="mt-3 space-y-2">
        {(dashboard?.observations ?? []).slice(0, 12).map((obs) => (
          <button
            key={obs.id}
            type="button"
            onClick={() => openRecordDetail("observation", obs as unknown as Record<string, unknown>)}
            className="w-full rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent/50"
          >
            <p className="font-medium">{obs.code}</p>
            <p className="text-sm text-muted-foreground">{new Date(obs.recordedAt).toLocaleString()}</p>
          </button>
        ))}
        {(dashboard?.observations.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">No observations available.</p>
        ) : null}
      </div>
    </div>
  )
}