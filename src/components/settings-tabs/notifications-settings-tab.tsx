import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type NotificationStatus = { type: "success" | "error"; message: string } | null
type NotificationFrequency = "IMMEDIATE" | "HOURLY" | "DAILY" | "WEEKLY" | "NEVER"

interface NotificationsSettingsTabProps {
  notificationStatus: NotificationStatus
  notificationSettings: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    appointmentReminders: boolean
    recordUpdates: boolean
    securityAlerts: boolean
    billingNotifications: boolean
    labResults: boolean
    prescriptionUpdates: boolean
    marketingEmails: boolean
    frequency: NotificationFrequency
    quietHoursStart: string
    quietHoursEnd: string
    timezone: string
  }
  setNotificationSettings: React.Dispatch<
    React.SetStateAction<{
      emailNotifications: boolean
      smsNotifications: boolean
      pushNotifications: boolean
      appointmentReminders: boolean
      recordUpdates: boolean
      securityAlerts: boolean
      billingNotifications: boolean
      labResults: boolean
      prescriptionUpdates: boolean
      marketingEmails: boolean
      frequency: NotificationFrequency
      quietHoursStart: string
      quietHoursEnd: string
      timezone: string
    }>
  >
  handleSaveNotificationSettings: () => Promise<void>
  isSavingNotifications: boolean
  isLoadingNotifications: boolean
}

export default function NotificationsSettingsTab({
  notificationStatus,
  notificationSettings,
  setNotificationSettings,
  handleSaveNotificationSettings,
  isSavingNotifications,
  isLoadingNotifications,
}: NotificationsSettingsTabProps) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Notification Channels</h4>
        <div className="mt-3 space-y-3">
          {notificationStatus ? (
            <div className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              notificationStatus.type === "success"
                ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400"
            }`}>
              {notificationStatus.type === "success" ? (
                <CheckCircle2Icon className="size-4" />
              ) : (
                <XCircleIcon className="size-4" />
              )}
              <span>{notificationStatus.message}</span>
            </div>
          ) : null}
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Email notifications</span>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>SMS notifications</span>
            <Switch
              checked={notificationSettings.smsNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, smsNotifications: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Push notifications</span>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Appointment reminders</span>
            <Switch
              checked={notificationSettings.appointmentReminders}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, appointmentReminders: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Record updates</span>
            <Switch
              checked={notificationSettings.recordUpdates}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, recordUpdates: checked }))
              }
            />
          </label>
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Delivery Frequency</p>
            <select
              className="mt-2 flex h-9 w-full rounded-md border bg-background px-3 text-sm outline-none"
              value={notificationSettings.frequency}
              onChange={(event) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  frequency: event.target.value as NotificationFrequency,
                }))
              }
            >
              <option value="IMMEDIATE">Immediate</option>
              <option value="HOURLY">Hourly</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="NEVER">Never</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background p-4">
        <h4 className="text-sm font-semibold">Operational Alerts</h4>
        <div className="mt-3 space-y-3">
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Security alerts</span>
            <Switch
              checked={notificationSettings.securityAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, securityAlerts: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Billing notifications</span>
            <Switch
              checked={notificationSettings.billingNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, billingNotifications: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Lab results</span>
            <Switch
              checked={notificationSettings.labResults}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, labResults: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Prescription updates</span>
            <Switch
              checked={notificationSettings.prescriptionUpdates}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, prescriptionUpdates: checked }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-md border p-3 text-sm">
            <span>Marketing emails</span>
            <Switch
              checked={notificationSettings.marketingEmails}
              onCheckedChange={(checked) =>
                setNotificationSettings((prev) => ({ ...prev, marketingEmails: checked }))
              }
            />
          </label>
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Quiet Hours</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Input
                type="time"
                value={notificationSettings.quietHoursStart}
                onChange={(event) =>
                  setNotificationSettings((prev) => ({ ...prev, quietHoursStart: event.target.value }))
                }
              />
              <Input
                type="time"
                value={notificationSettings.quietHoursEnd}
                onChange={(event) =>
                  setNotificationSettings((prev) => ({ ...prev, quietHoursEnd: event.target.value }))
                }
              />
            </div>
          </div>
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium">Timezone</p>
            <Input
              className="mt-2"
              value={notificationSettings.timezone}
              onChange={(event) =>
                setNotificationSettings((prev) => ({ ...prev, timezone: event.target.value }))
              }
              placeholder="UTC"
            />
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={() => void handleSaveNotificationSettings()}
            disabled={isSavingNotifications || isLoadingNotifications}
          >
            {isSavingNotifications ? "Saving..." : "Save Notification Preferences"}
          </Button>
        </div>
      </div>
    </div>
  )
}