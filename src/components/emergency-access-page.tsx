import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { accessPublicEmergencyShare } from "@/lib/api/curanet"
import type { PublicEmergencyAccessResponse } from "@/lib/api/types"
import { getApiErrorMessages } from "@/lib/api/client"

interface EmergencyAccessPageProps {
  token: string
}

export function EmergencyAccessPage({ token }: EmergencyAccessPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PublicEmergencyAccessResponse | null>(null)

  const formatDateTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    []
  )

  const loadEmergencyData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await accessPublicEmergencyShare(token)
      setData(response)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to access emergency data")[0]
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadEmergencyData()
  }, [loadEmergencyData])

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-4 sm:p-6 print:bg-white print:p-0" aria-busy="true" aria-live="polite">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <div className="rounded-xl border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-9 w-28" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 print:bg-white print:p-0">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-destructive/40 bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-xl font-semibold text-destructive">Access Denied</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "This emergency link is invalid, expired, or has already been used."}
            </p>
            <div className="mt-4 flex justify-center gap-2 print:hidden">
              <Button onClick={() => void loadEmergencyData()}>Try Again</Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print Error
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              If you believe this is an error, please contact the patient who shared this link.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const { data: emergencyData, warning, accessed_at, scope, accessCount, lastAccessedAt } = data
  const criticalFields = [
    { label: "Blood Group", value: emergencyData.blood_group },
    { label: "Allergies", value: emergencyData.allergies },
    { label: "Chronic Conditions", value: emergencyData.chronic_conditions },
  ].filter((field) => field.value)

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 print:min-h-0 print:bg-white print:p-2 print:text-black">
      <div className="mx-auto w-full max-w-4xl space-y-4 print:max-w-none print:space-y-1">
        {/* Header */}
        <header className="rounded-xl border bg-card p-5 sm:p-6 print:rounded-none print:border-zinc-300 print:bg-white print:p-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:mb-1">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase print:text-[10px]">Emergency Access</p>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl print:text-base print:text-black">Emergency Health Information</h1>
              <p className="mt-1 text-sm text-muted-foreground print:text-xs print:mt-0">{emergencyData.emergency_access_notice}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={() => void loadEmergencyData()}>
                Refresh
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                Print
              </Button>
            </div>
          </div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 print:hidden">
            <span className="text-4xl">🚨</span>
          </div>
        </header>

        {/* Warning Banner */}
        <section className="rounded-xl border bg-muted/50 p-4 sm:p-5 print:rounded-none print:border-zinc-300 print:bg-white print:p-2" aria-label="Security Notice">
          <div className="flex items-start gap-3">
            <span className="text-2xl print:hidden">⚠️</span>
            <div className="flex-1">
              <p className="font-medium text-foreground print:text-black print:text-xs">Security Notice</p>
              <p className="mt-1 text-sm text-muted-foreground print:text-[10px] print:mt-0">{warning}</p>
              <p className="mt-2 text-xs text-muted-foreground print:text-[10px] print:mt-0">
                Accessed at: {formatDateTime.format(new Date(accessed_at))}
              </p>
              {accessCount !== undefined && accessCount > 0 && (
                <p className="text-xs font-medium text-primary print:text-[10px]">
                  This link has been accessed {accessCount} {accessCount === 1 ? "time" : "times"}
                  {lastAccessedAt && ` (Previous access: ${formatDateTime.format(new Date(lastAccessedAt))})`}
                </p>
              )}
              <p className="text-xs text-muted-foreground print:text-[10px]">
                Data scope: {scope.join(", ")}
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Information Cards */}
        <section className="space-y-4 print:space-y-1">
          {emergencyData.basic_info ? (
            <div className="rounded-xl border bg-muted/50 p-6 print:rounded-none print:border-zinc-300 print:bg-white print:p-2">
              <h2 className="mb-4 text-lg font-semibold print:text-sm print:mb-1">👤 Patient Information</h2>
              <div className="grid gap-3 md:grid-cols-2 print:gap-1">
                <div>
                  <p className="text-xs text-muted-foreground print:text-[10px]">Name</p>
                  <p className="mt-1 font-medium print:text-xs print:mt-0">{emergencyData.basic_info.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground print:text-[10px]">Health ID</p>
                  <p className="mt-1 font-mono text-sm font-medium print:text-xs print:mt-0">{emergencyData.basic_info.health_id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground print:text-[10px]">Phone</p>
                  <p className="mt-1 font-medium print:text-xs print:mt-0">{emergencyData.basic_info.phone}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Critical Information - Highlighted */}
          <div className="rounded-xl border border-destructive/40 bg-card p-6 print:rounded-none print:border-zinc-300 print:bg-white print:p-2">
            <h2 className="mb-4 text-lg font-semibold text-destructive print:text-black print:text-sm print:mb-1">🩸 Critical Medical Information</h2>
            {criticalFields.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 print:gap-1">
                {criticalFields.map((field) => (
                  <div key={field.label} className="rounded-lg border bg-background p-3 md:last:col-span-2 print:rounded-none print:border-zinc-300 print:bg-white print:p-1">
                    <p className="text-xs font-semibold uppercase text-destructive/80 print:text-black print:text-[10px]">{ field.label}</p>
                    <p className="mt-1 font-medium text-foreground whitespace-pre-wrap print:text-black print:text-xs print:mt-0">{field.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No critical medical information is available in this link scope.</p>
            )}
          </div>

          {/* Additional Information */}
          {(emergencyData.current_medications || emergencyData.emergency_contact || emergencyData.medical_conditions) ? (
            <div className="rounded-xl border bg-muted/50 p-6 print:rounded-none print:border-zinc-300 print:bg-white print:p-2">
              <h2 className="mb-4 text-lg font-semibold print:text-sm print:mb-1">📋 Additional Information</h2>
              <div className="space-y-3 print:space-y-1">
                {emergencyData.current_medications ? (
                  <div>
                    <p className="text-xs text-muted-foreground print:text-[10px]">Current Medications</p>
                    <p className="mt-1 font-medium print:text-xs print:mt-0">{emergencyData.current_medications}</p>
                  </div>
                ) : null}
                
                {emergencyData.emergency_contact ? (
                  <div>
                    <p className="text-xs text-muted-foreground print:text-[10px]">Emergency Contact</p>
                    <p className="mt-1 font-medium print:text-xs print:mt-0">{emergencyData.emergency_contact}</p>
                  </div>
                ) : null}
                
                {emergencyData.medical_conditions ? (
                  <div>
                    <p className="text-xs text-muted-foreground print:text-[10px]">Medical Conditions</p>
                    <p className="mt-1 font-medium print:text-xs print:mt-0">{emergencyData.medical_conditions}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        {/* Footer */}
        <footer className="text-center print:text-left">
          <div className="rounded-xl border bg-muted/50 p-4 print:rounded-none print:border-zinc-300 print:bg-white print:p-2">
            <p className="text-sm text-muted-foreground print:text-[10px]">
              This emergency information is provided through CuraNet&apos;s secure health platform.
              <br />
              This emergency link remains active until it expires or is revoked by the patient.
            </p>
          </div>

        </footer>
      </div>
    </main>
  )
}
