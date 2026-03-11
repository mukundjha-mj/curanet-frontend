import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmergencyLinkGenerationModalContentProps {
  generatedShare: {
    share_id: string
    token: string
    short_url: string
    expires_at: string
    expires_in_seconds: number
    scope: string[]
    qr_data: string
  } | null
  shareExpiryHours: number
  onShareExpiryChange: (hours: number) => void
  emergencyShareError: string | null
  creatingShare: boolean
  onGenerateShare: () => Promise<void>
  onClose: () => void
  onResetShare: () => void
  copyToClipboard: (text: string) => void
}

export function EmergencyLinkGenerationModalContent({
  generatedShare,
  shareExpiryHours,
  onShareExpiryChange,
  emergencyShareError,
  creatingShare,
  onGenerateShare,
  onClose,
  onResetShare,
  copyToClipboard,
}: EmergencyLinkGenerationModalContentProps) {
  if (!generatedShare) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create a secure emergency access link that expires after a set duration.
          You can share this link with first responders or trusted emergency contacts.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expiration time</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 6, 12, 24].map((hours) => (
              <Button
                key={hours}
                type="button"
                variant={shareExpiryHours === hours ? "default" : "outline"}
                onClick={() => onShareExpiryChange(hours)}
                className="w-full"
              >
                {hours}h
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">⚠️ Security Notice</p>
          <ul className="mt-1 list-disc pl-5 text-xs">
            <li>The link can be opened multiple times until it expires</li>
            <li>All access is logged for security</li>
            <li>It includes critical emergency health details</li>
          </ul>
        </div>

        {emergencyShareError ? (
          <p className="text-sm text-destructive">{emergencyShareError}</p>
        ) : null}

        <div className="flex gap-2">
          <Button
            onClick={onGenerateShare}
            disabled={creatingShare}
            className="flex-1"
          >
            {creatingShare ? "Generating..." : "Generate link"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-center">
        <p className="text-sm font-medium text-emerald-900">✅ Emergency link generated</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center rounded-lg border bg-white p-4">
        <QRCodeSVG value={generatedShare.short_url} size={200} />
      </div>

      {/* Link */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Emergency link</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={generatedShare.short_url}
              readOnly
              className="flex-1 font-mono text-xs"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(generatedShare.short_url)}
            >
              Copy
            </Button>
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={() => window.open(generatedShare.short_url, '_blank')}
          >
            Open link
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium">Expires:</span>{" "}
          {new Date(generatedShare.expires_at).toLocaleString()}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium">Valid for:</span>{" "}
          {Math.floor(generatedShare.expires_in_seconds / 3600)} hours
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium">Scope:</span> {generatedShare.scope.join(", ")}
        </p>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
        <p className="font-medium">💡 Tips:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Screenshot the QR code for offline access</li>
          <li>Link expires after {Math.floor(generatedShare.expires_in_seconds / 3600)} hours</li>
          <li>Can be accessed multiple times until expiration</li>
          <li>Revoke it from "My Emergency Links" if needed</li>
        </ul>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            onResetShare()
            onClose()
          }}
          className="flex-1"
        >
          Close
        </Button>
        <Button
          variant="outline"
          onClick={onResetShare}
        >
          Generate another
        </Button>
      </div>
    </div>
  )
}
