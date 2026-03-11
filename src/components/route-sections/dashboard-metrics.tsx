import type { DashboardData } from "@/lib/api/types"

interface DashboardMetricsProps {
  dashboard: DashboardData | null
}

export function DashboardMetrics({ dashboard }: DashboardMetricsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Total Appointments</p>
          <p className="mt-2 text-3xl font-bold">{dashboard?.appointments.length ?? 0}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all statuses</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Medical Records</p>
          <p className="mt-2 text-3xl font-bold">
            {(dashboard?.encounters.length ?? 0) + (dashboard?.observations.length ?? 0)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Encounters + Observations</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Emergency Card</p>
          <p className="mt-2 text-3xl font-bold">{dashboard?.emergencyCard ? "Active" : "Not Set"}</p>
          <p className="mt-1 text-xs text-muted-foreground">Status</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium mb-3">Appointment Status Breakdown</p>
          <div className="space-y-2">
            {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"].map((status) => {
              const count = dashboard?.appointments.filter((apt) => apt.status === status).length ?? 0
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium mb-3">Emergency Card Info</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Blood Group</span>
              <span className="font-medium">{dashboard?.emergencyCard?.blood_group ?? "N/A"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Allergies</span>
              <span className="font-medium">{dashboard?.emergencyCard?.allergies ?? "None listed"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contact</span>
              <span className="font-medium">{dashboard?.emergencyCard?.emergency_contact ?? "Not set"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
