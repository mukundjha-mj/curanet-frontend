import type { DashboardData } from "@/lib/api/types"

interface OverviewRouteSectionProps {
  dashboard: DashboardData | null
}

export function OverviewRouteSection({ dashboard }: OverviewRouteSectionProps) {
  return (
    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min">
      <h3 className="text-lg font-semibold">Live Snapshot</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs text-muted-foreground">User</p>
          <p className="mt-1 font-medium">
            {dashboard?.profile?.user.healthId ?? "Not connected"}
          </p>
          <p className="text-sm text-muted-foreground">
            {dashboard?.profile?.user.role ?? "-"}
          </p>
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs text-muted-foreground">Emergency Card</p>
          <p className="mt-1 font-medium">
            Blood Group: {dashboard?.emergencyCard?.blood_group ?? "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            Contact: {dashboard?.emergencyCard?.emergency_contact ?? "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}
