import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type PrivacyStatus = { type: "success" | "error"; message: string } | null

interface PrivacySettingsTabProps {
  privacyStatus: PrivacyStatus
  privacySettings: {
    shareWithEmergency: boolean
    emergencyAccess: boolean
    profileVisibility: "private" | "providers-only" | "network"
    researchParticipation: boolean
    analyticsOptOut: boolean
  }
  setPrivacySettings: React.Dispatch<
    React.SetStateAction<{
      shareWithEmergency: boolean
      emergencyAccess: boolean
      profileVisibility: "private" | "providers-only" | "network"
      researchParticipation: boolean
      analyticsOptOut: boolean
    }>
  >
  handleSavePrivacySettings: () => Promise<void>
  isSavingPrivacy: boolean
  isLoadingPrivacy: boolean
}

export default function PrivacySettingsTab({
  privacyStatus,
  privacySettings,
  setPrivacySettings,
  handleSavePrivacySettings,
  isSavingPrivacy,
  isLoadingPrivacy,
}: PrivacySettingsTabProps) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Privacy Preferences</h4>
        <div className="mt-3 space-y-3">
          {privacyStatus ? (
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              privacyStatus.type === "success"
                ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400"
            }`}>
              {privacyStatus.type === "success" ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <XCircleIcon className="size-4" />
              )}
              <span>{privacyStatus.message}</span>
            </div>
          ) : null}
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Share data with emergency contacts</span>
            <Switch
              checked={privacySettings.shareWithEmergency}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({ ...prev, shareWithEmergency: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Enable expanded emergency access</span>
            <Switch
              checked={privacySettings.emergencyAccess}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({ ...prev, emergencyAccess: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Research participation</span>
            <Switch
              checked={privacySettings.researchParticipation}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({ ...prev, researchParticipation: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Opt out of analytics</span>
            <Switch
              checked={privacySettings.analyticsOptOut}
              onCheckedChange={(checked) =>
                setPrivacySettings((prev) => ({ ...prev, analyticsOptOut: checked }))
              }
            />
          </label>
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Profile Visibility</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { value: "private", label: "Private" },
                { value: "providers-only", label: "Providers Only" },
                { value: "network", label: "Network" },
              ].map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={privacySettings.profileVisibility === option.value ? "default" : "outline"}
                  onClick={() =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      profileVisibility: option.value as "private" | "providers-only" | "network",
                    }))
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() => void handleSavePrivacySettings()}
            disabled={isSavingPrivacy || isLoadingPrivacy}
          >
            {isSavingPrivacy ? "Saving..." : "Save Privacy Preferences"}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Consent and Data Actions</h4>
        <div className="mt-3 space-y-3 text-sm">
          <div className="rounded-md border p-3">
            <p className="font-medium">Manage Consent Grants</p>
            <p className="mt-1 text-muted-foreground">Review, grant, and revoke provider access.</p>
            <a href="/consent" className="mt-2 inline-block text-primary underline">
              Open Consent Management
            </a>
          </div>
          <div className="rounded-md border p-3">
            <p className="font-medium">Download My Data</p>
            <p className="mt-1 text-muted-foreground">Export profile and clinical metadata.</p>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Request Export
            </Button>
          </div>
          <div className="rounded-md border p-3">
            <p className="font-medium">Delete Account / Data</p>
            <p className="mt-1 text-muted-foreground">Submit deletion request with compliance confirmation.</p>
            <Button type="button" variant="destructive" size="sm" className="mt-2">
              Start Deletion Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}