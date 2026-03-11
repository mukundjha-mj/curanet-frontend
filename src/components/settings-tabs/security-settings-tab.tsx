import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SecurityRefreshTokenSession, SecuritySession } from "@/lib/api/types"

type SecurityStatus = { type: "success" | "error"; message: string } | null

interface SecuritySettingsTabProps {
  securityForm: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  setSecurityForm: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }>
  >
  isChangingPassword: boolean
  requestPasswordChange: () => void
  securityStatus: SecurityStatus
  isLoadingSessions: boolean
  loadSecurityData: () => Promise<void>
  requestRevokeAllOtherSessions: () => void
  isRevokingAllSessions: boolean
  sessions: SecuritySession[]
  requestRevokeSession: (sessionId: string, sessionLabel: string) => void
  revokingSessionId: string | null
  formatDateTime: (value: string | null | undefined) => string
  recoveryForm: {
    backupEmail: string
    backupPhone: string
  }
  setRecoveryForm: React.Dispatch<
    React.SetStateAction<{
      backupEmail: string
      backupPhone: string
    }>
  >
  handleSaveRecoveryOptions: () => Promise<void>
  isSavingRecovery: boolean
  refreshSessions: SecurityRefreshTokenSession[]
}

export default function SecuritySettingsTab({
  securityForm,
  setSecurityForm,
  isChangingPassword,
  requestPasswordChange,
  securityStatus,
  isLoadingSessions,
  loadSecurityData,
  requestRevokeAllOtherSessions,
  isRevokingAllSessions,
  sessions,
  requestRevokeSession,
  revokingSessionId,
  formatDateTime,
  recoveryForm,
  setRecoveryForm,
  handleSaveRecoveryOptions,
  isSavingRecovery,
  refreshSessions,
}: SecuritySettingsTabProps) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Password Management</h4>
        <div className="mt-3 space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={securityForm.currentPassword}
            onChange={(event) =>
              setSecurityForm((prev) => ({ ...prev, currentPassword: event.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="New password"
            value={securityForm.newPassword}
            onChange={(event) =>
              setSecurityForm((prev) => ({ ...prev, newPassword: event.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={securityForm.confirmPassword}
            onChange={(event) =>
              setSecurityForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
            }
          />
          <Button
            type="button"
            className="w-full"
            onClick={requestPasswordChange}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? (
              <>
                <Loader2Icon className="mr-2 size-3.5 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Save Password"
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Access Security</h4>
        <div className="mt-3 space-y-3">
          {securityStatus ? (
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              securityStatus.type === "success"
                ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400"
            }`}>
              {securityStatus.type === "success" ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <XCircleIcon className="size-4" />
              )}
              <span>{securityStatus.message}</span>
            </div>
          ) : null}

          <div className="rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">Session Management</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void loadSecurityData()}
                  disabled={isLoadingSessions}
                >
                  Refresh
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={requestRevokeAllOtherSessions}
                  disabled={isRevokingAllSessions || isLoadingSessions}
                >
                  {isRevokingAllSessions ? "Revoking..." : "Revoke Others"}
                </Button>
              </div>
            </div>
            <p className="mt-1 text-muted-foreground">Review active sessions and sign out other devices.</p>

            <div className="mt-3 space-y-2">
              {isLoadingSessions ? (
                <p className="text-xs text-muted-foreground">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No active sessions found.</p>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="rounded-md border p-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        {session.browser || "Unknown Browser"} on {session.os || "Unknown OS"}
                      </p>
                      <div className="flex items-center gap-2">
                        {session.isCurrent ? (
                          <span className="rounded border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-xs text-green-700 dark:text-green-400">
                            Current
                          </span>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            requestRevokeSession(
                              session.id,
                              `${session.browser || "Unknown Browser"} on ${session.os || "Unknown OS"}`
                            )
                          }
                          disabled={session.isCurrent || revokingSessionId === session.id}
                        >
                          {revokingSessionId === session.id ? "Revoking..." : "Revoke"}
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      IP: {session.ipAddress || "Unknown"} | Last activity: {formatDateTime(session.lastActivity)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Recovery Options</p>
            <p className="mt-1 text-muted-foreground">Set backup email or phone for account recovery.</p>
            <div className="mt-2 space-y-2">
              <Input
                type="email"
                placeholder="Backup email"
                value={recoveryForm.backupEmail}
                onChange={(event) =>
                  setRecoveryForm((prev) => ({ ...prev, backupEmail: event.target.value }))
                }
              />
              <Input
                type="tel"
                placeholder="Backup phone"
                value={recoveryForm.backupPhone}
                onChange={(event) =>
                  setRecoveryForm((prev) => ({ ...prev, backupPhone: event.target.value }))
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => void handleSaveRecoveryOptions()}
                disabled={isSavingRecovery}
              >
                {isSavingRecovery ? "Saving..." : "Save Recovery Options"}
              </Button>
            </div>
          </div>

          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Refresh Token Sessions</p>
            <p className="mt-1 text-muted-foreground">Issued sessions tracked from refresh tokens.</p>
            <div className="mt-2 space-y-2">
              {isLoadingSessions ? (
                <p className="text-xs text-muted-foreground">Loading refresh sessions...</p>
              ) : refreshSessions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No refresh token sessions found.</p>
              ) : (
                refreshSessions.map((tokenSession) => (
                  <div key={tokenSession.id} className="rounded-md border p-2">
                    <p className="text-sm font-medium">{tokenSession.device || "Unknown device"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last used: {formatDateTime(tokenSession.lastUsed)} | Expires: {formatDateTime(tokenSession.expiresAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}