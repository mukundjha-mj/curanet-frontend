import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { EmergencyShare, ShareAccessLogsResponse } from "@/lib/api/types"

interface EmergencyShareDetailsDialogContentProps {
  selectedShare: EmergencyShare
  accessLogs: ShareAccessLogsResponse["data"] | null
  loadingAccessLogs: boolean
  copyToClipboard: (text: string) => void
  close: () => void
}

export default function EmergencyShareDetailsDialogContent({
  selectedShare,
  accessLogs,
  loadingAccessLogs,
  copyToClipboard,
  close,
}: EmergencyShareDetailsDialogContentProps) {
  const selectedShareUrl = accessLogs?.shortUrl ?? selectedShare.shortUrl

  return (
    <div className="space-y-4">
      <div className={`rounded-md border p-3 ${!selectedShare.used && new Date(selectedShare.expiresAt) > new Date() ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"}`}>
        <p className="text-sm font-medium">
          {!selectedShare.used && new Date(selectedShare.expiresAt) > new Date() ? "✅ Active Link" : "⚫ Inactive Link"}
        </p>
      </div>

      {selectedShareUrl ? (
        <div className="flex justify-center rounded-lg border bg-white p-4">
          <QRCodeSVG value={selectedShareUrl} size={200} />
        </div>
      ) : null}

      {selectedShareUrl ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Emergency Link</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input value={selectedShareUrl} readOnly className="flex-1 font-mono text-xs" />
              <Button variant="outline" onClick={() => copyToClipboard(selectedShareUrl)}>
                Copy
              </Button>
            </div>
            <Button variant="default" className="w-full" onClick={() => window.open(selectedShareUrl, "_blank")}>
              Open link
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          Real link/QR is unavailable for this older share. Generate a new emergency link to get a visible URL and QR.
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground">Share ID</p>
            <p className="font-mono text-xs">{selectedShare.shareId.substring(0, 16)}...</p>
          </div>
          <div>
            <p className="text-muted-foreground">Access Count</p>
            <p className="font-semibold text-blue-600">{selectedShare.accessCount || 0} times</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground">Created</p>
            <p>{new Date(selectedShare.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expires</p>
            <p>{new Date(selectedShare.expiresAt).toLocaleString()}</p>
          </div>
        </div>
        {selectedShare.lastAccessedAt ? (
          <div>
            <p className="text-muted-foreground">Last Accessed</p>
            <p>{new Date(selectedShare.lastAccessedAt).toLocaleString()}</p>
          </div>
        ) : null}
        <div>
          <p className="text-muted-foreground">Scope</p>
          <p>{(selectedShare.scope as string[]).join(", ")}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Access History</h4>
        {loadingAccessLogs ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : accessLogs && accessLogs.accessLogs.length > 0 ? (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {accessLogs.accessLogs.map((log) => (
              <div key={log.id} className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground text-xs">Accessed At</p>
                    <p className="font-medium">{new Date(log.accessedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">IP Address</p>
                    <p className="font-mono text-xs">{log.ipAddress || "Unknown"}</p>
                  </div>
                </div>
                {log.userAgent ? (
                  <div className="mt-2">
                    <p className="text-muted-foreground text-xs">User Agent</p>
                    <p className="break-all text-xs">{log.userAgent}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No access history yet.</p>
        )}
      </div>

      <Button onClick={close} className="w-full">
        Close
      </Button>
    </div>
  )
}