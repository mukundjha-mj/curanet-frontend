import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData, EmergencyShare } from "@/lib/api/types"

interface EmergencyRouteSectionProps {
  dashboard: DashboardData | null
  setGenerateShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  emergencyShareMessage: string | null
  emergencyShareError: string | null
  loadEmergencyShares: () => Promise<void>
  loadingEmergencyShares: boolean
  emergencyShares: EmergencyShare[]
  handleOpenShareDetails: (share: EmergencyShare) => Promise<void>
  handleRevokeEmergencyShare: (shareId: string) => Promise<void>
  revokingShareId: string | null
}

export default function EmergencyRouteSection({
  dashboard,
  setGenerateShareModalOpen,
  emergencyShareMessage,
  emergencyShareError,
  loadEmergencyShares,
  loadingEmergencyShares,
  emergencyShares,
  handleOpenShareDetails,
  handleRevokeEmergencyShare,
  revokingShareId,
}: EmergencyRouteSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
        <h3 className="text-lg font-semibold">Emergency Card</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Patient</p>
            <p className="font-medium">{dashboard?.emergencyCard?.name ?? "Not provided"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Blood Group</p>
            <p className="font-medium">{dashboard?.emergencyCard?.blood_group ?? "Not provided"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{dashboard?.emergencyCard?.phone ?? "Not provided"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Allergies</p>
            <p className="font-medium">{dashboard?.emergencyCard?.allergies ?? "Not provided"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Emergency Contact</p>
            <p className="font-medium">{dashboard?.emergencyCard?.emergency_contact ?? "Not provided"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Chronic Conditions</p>
            <p className="font-medium">{dashboard?.emergencyCard?.chronic_conditions ?? "None reported"}</p>
          </div>
          <div className="rounded-lg border bg-background p-3 md:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">Current Medications</p>
            <p className="font-medium">{dashboard?.emergencyCard?.current_medications ?? "None reported"}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button onClick={() => setGenerateShareModalOpen(true)}>Generate Emergency Link</Button>
          {emergencyShareMessage ? <p className="text-sm text-emerald-600">{emergencyShareMessage}</p> : null}
          {emergencyShareError ? <p className="text-sm text-destructive">{emergencyShareError}</p> : null}
        </div>
      </div>

      <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">My Emergency Links</h3>
          <Button variant="outline" size="sm" onClick={() => void loadEmergencyShares()} disabled={loadingEmergencyShares}>
            {loadingEmergencyShares ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          {loadingEmergencyShares ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : emergencyShares.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No emergency links created yet. Generate one above to get started.
            </p>
          ) : (
            emergencyShares.map((share) => {
              const isExpired = new Date(share.expiresAt) < new Date()
              const isActive = !share.used && !isExpired

              return (
                <div
                  key={share.id}
                  onClick={() => void handleOpenShareDetails(share)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent/50 ${isActive ? "bg-background" : "bg-muted opacity-70"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{isActive ? "🟢 Active" : share.used ? "🔴 Used" : "⚫ Expired"}</p>
                        <span className="text-xs text-muted-foreground">{share.shareId.substring(0, 8)}...</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Created: {new Date(share.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(share.expiresAt).toLocaleString()}
                      </p>
                      {share.used && share.usedAt ? (
                        <p className="text-sm text-muted-foreground">
                          Accessed: {new Date(share.usedAt).toLocaleString()}
                          {share.accessedBy ? ` by ${share.accessedBy}` : ""}
                        </p>
                      ) : null}
                      {share.accessCount !== undefined && share.accessCount > 0 ? (
                        <p className="text-sm font-medium text-blue-600">
                          Access count: {share.accessCount} {share.accessCount === 1 ? "time" : "times"}
                          {share.lastAccessedAt ? (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Last: {new Date(share.lastAccessedAt).toLocaleDateString()})
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">Scope: {(share.scope as string[]).join(", ")}</p>
                    </div>
                    {isActive ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleRevokeEmergencyShare(share.shareId)
                        }}
                        disabled={revokingShareId === share.shareId}
                      >
                        {revokingShareId === share.shareId ? "Revoking..." : "Revoke"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}