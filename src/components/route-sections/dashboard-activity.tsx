import type { DashboardData } from "@/lib/api/types"

interface DashboardActivityProps {
  dashboard: DashboardData | null
}

export function DashboardActivity({ dashboard }: DashboardActivityProps) {
  // Collect recent activities from appointments and records
  const activities = [
    ...(dashboard?.appointments ?? [])
      .filter((apt) => apt.updatedAt || apt.createdAt)
      .slice(-5)
      .map((apt) => ({
        type: "appointment" as const,
        id: apt.id,
        title: `Appointment: ${apt.reasonForVisit ?? "General consultation"}`,
        time: (apt.updatedAt || apt.createdAt) as string,
        status: apt.status,
      })),
    ...(dashboard?.encounters ?? []).slice(-5).map((enc) => ({
      type: "encounter" as const,
      id: enc.id,
      title: `Encounter recorded`,
      time: enc.startTime,
      status: "completed" as const,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "appointment":
        return status === "PENDING" ? "📅" : status === "COMPLETED" ? "✅" : "⏸️"
      case "encounter":
        return "📋"
      default:
        return "📌"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "text-amber-600"
      case "COMPLETED":
        return "text-emerald-600"
      case "CANCELLED":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="rounded-lg border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">No recent activity yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div key={`${activity.type}-${activity.id}`} className="rounded-lg border bg-background p-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getActivityIcon(activity.type, activity.status)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status ?? "Active"} • {new Date(activity.time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-dashed bg-accent/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
