import { Suspense, lazy, useCallback, useEffect, useState } from "react"
import { PencilIcon, Loader2Icon, CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData, SecurityRefreshTokenSession, SecuritySession } from "@/lib/api/types"
import {
  changePassword,
  getRecoveryOptions,
  getNotificationSettings,
  getUserConsentSettings,
  listSecuritySessions,
  revokeAllOtherSecuritySessions,
  revokeSecuritySession,
  updateNotificationSettings,
  updateProfile,
  updateRecoveryOptions,
  updateUserConsentSettings,
} from "@/lib/api/curanet"
import { ApiError } from "@/lib/api/client"

const SecuritySettingsTab = lazy(() => import("@/components/settings-tabs/security-settings-tab"))
const PrivacySettingsTab = lazy(() => import("@/components/settings-tabs/privacy-settings-tab"))
const NotificationsSettingsTab = lazy(() => import("@/components/settings-tabs/notifications-settings-tab"))

interface ProfilePageProps {
  dashboard: DashboardData | null
  formatFieldValue: (value: unknown) => string
  onLogout?: () => void
  accessToken: string | null
}

type SettingsTab =
  | "overview"
  | "profile"
  | "security"
  | "privacy"
  | "notifications"
  | "audit"
  | "support"

type ConfirmAction =
  | { kind: "change-password" }
  | { kind: "revoke-session"; sessionId: string; sessionLabel: string }
  | { kind: "revoke-others" }

export function ProfilePage({ dashboard, formatFieldValue, onLogout, accessToken }: ProfilePageProps) {
  const profile = dashboard?.profile?.profile
  const user = dashboard?.profile?.user
  const [activeTab, setActiveTab] = useState<SettingsTab>("overview")
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [privacySettings, setPrivacySettings] = useState({
    shareWithEmergency: false,
    emergencyAccess: false,
    profileVisibility: "private" as "private" | "providers-only" | "network",
    researchParticipation: false,
    analyticsOptOut: true,
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    recordUpdates: true,
    securityAlerts: true,
    billingNotifications: true,
    labResults: true,
    prescriptionUpdates: true,
    marketingEmails: false,
    frequency: "IMMEDIATE" as "IMMEDIATE" | "HOURLY" | "DAILY" | "WEEKLY" | "NEVER",
    quietHoursStart: "",
    quietHoursEnd: "",
    timezone: "UTC",
  })
  const [activeEditField, setActiveEditField] = useState<string | null>(null)
  const [draftProfileValues, setDraftProfileValues] = useState<Record<string, string>>({})
  const [savedProfileValues, setSavedProfileValues] = useState<Record<string, string>>({})
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [securityStatus, setSecurityStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [sessions, setSessions] = useState<SecuritySession[]>([])
  const [refreshSessions, setRefreshSessions] = useState<SecurityRefreshTokenSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [isRevokingAllSessions, setIsRevokingAllSessions] = useState(false)
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null)
  const [recoveryForm, setRecoveryForm] = useState({
    backupEmail: "",
    backupPhone: "",
  })
  const [isSavingRecovery, setIsSavingRecovery] = useState(false)
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(false)
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false)
  const [privacyStatus, setPrivacyStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [notificationStatus, setNotificationStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)

  // Clear error/success messages when changing tabs
  useEffect(() => {
    setUpdateStatus(null)
    setActiveEditField(null)
  }, [activeTab])

  const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "privacy", label: "Privacy & Consent" },
    { id: "notifications", label: "Notifications" },
    { id: "audit", label: "Audit" },
    { id: "support", label: "Support" },
  ]

  // Consolidated profile fields - removed duplicates and technical metadata
  const mergedProfileFields: Array<{ key: string; label: string; value: unknown }> = [
    // Account Information (non-editable)
    { key: "user.healthId", label: "Health ID", value: user?.healthId },
    { key: "user.email", label: "Email", value: user?.email },
    { key: "user.phone", label: "Phone", value: user?.phone },
    { key: "user.role", label: "Role", value: user?.role },
    { key: "user.status", label: "Status", value: user?.status },
    { key: "user.verified", label: "Verified", value: user?.isVerified ? "Yes" : "No" },
    
    // Personal Information (editable)
    { key: "profile.firstName", label: "First Name", value: profile?.firstName },
    { key: "profile.lastName", label: "Last Name", value: profile?.lastName },
    { key: "profile.displayName", label: "Display Name", value: profile?.displayName },
    { key: "profile.dateOfBirth", label: "Date of Birth", value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null },
    { key: "profile.gender", label: "Gender", value: profile?.gender },
    { key: "profile.bloodGroup", label: "Blood Group", value: profile?.bloodGroup },
    
    // Emergency & Medical Information (editable)
    { key: "profile.emergencyContact", label: "Emergency Contact", value: profile?.emergencyContact },
    { key: "profile.emergencyPhone", label: "Emergency Phone", value: profile?.emergencyPhone },
    { key: "profile.allergies", label: "Allergies", value: profile?.allergies },
    { key: "profile.medications", label: "Medications", value: profile?.medications },
    { key: "profile.address", label: "Address", value: profile?.address },
    
    // Timestamps (non-editable)
    { key: "profile.createdAt", label: "Profile Created At", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : null },
    { key: "profile.updatedAt", label: "Profile Updated At", value: profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : null },
  ]

  // Fields that users cannot edit
  const nonEditableFields = new Set([
    "user.healthId",
    "user.email",
    "user.phone",
    "user.role",
    "user.status",
    "user.verified",
    "profile.createdAt",
    "profile.updatedAt",
  ])

  const totalRecords = (dashboard?.encountersCount ?? 0) + (dashboard?.observationsCount ?? 0)
  const hasDraftUpdates = Object.values(draftProfileValues).some((value) => value.trim().length > 0)
  const showProfileUpdateButton = activeEditField !== null || hasDraftUpdates

  const getProfileFieldDisplayValue = (fieldKey: string, fallbackValue: unknown): string => {
    const draftValue = draftProfileValues[fieldKey]
    if (draftValue && draftValue.trim().length > 0) {
      return draftValue
    }

    if (savedProfileValues[fieldKey] && savedProfileValues[fieldKey].trim().length > 0) {
      return savedProfileValues[fieldKey]
    }

    return formatFieldValue(fallbackValue)
  }

  const renderLazyTabFallback = () => (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-background p-4">
        <Skeleton className="h-5 w-40" />
        <div className="mt-3 space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
      <div className="rounded-lg border bg-background p-4">
        <Skeleton className="h-5 w-40" />
        <div className="mt-3 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )

  const handleEditEmptyField = (fieldKey: string) => {
    setActiveEditField(fieldKey)
    setDraftProfileValues((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey] ?? "",
    }))
  }

  const handleDraftBlur = (fieldKey: string) => {
    const nextValue = draftProfileValues[fieldKey]?.trim() ?? ""

    if (nextValue.length === 0) {
      setDraftProfileValues((prev) => {
        const copy = { ...prev }
        delete copy[fieldKey]
        return copy
      })
    }

    setActiveEditField((prev) => (prev === fieldKey ? null : prev))
  }

  const handleProfileUpdate = async () => {
    const trimmedEntries = Object.entries(draftProfileValues).filter(([, value]) => value.trim().length > 0)

    if (trimmedEntries.length === 0) {
      setActiveEditField(null)
      return
    }

    // Map field keys to API field names
    const fieldMapping: Record<string, string> = {
      "profile.firstName": "firstName",
      "profile.lastName": "lastName",
      "profile.displayName": "displayName",
      "profile.dateOfBirth": "dateOfBirth",
      "profile.gender": "gender",
      "profile.bloodGroup": "bloodGroup",
      "profile.emergencyContact": "emergencyContact",
      "profile.emergencyPhone": "emergencyPhone",
      "profile.allergies": "allergies",
      "profile.medications": "medications",
      "profile.address": "address",
    }

    const payload: Record<string, string> = {}
    for (const [key, value] of trimmedEntries) {
      const apiFieldName = fieldMapping[key]
      if (apiFieldName) {
        payload[apiFieldName] = value.trim()
      }
    }

    // Keep name fields included so profile updates stay complete.
    if (!payload.firstName && profile?.firstName) {
      payload.firstName = profile.firstName
    }
    if (!payload.lastName && profile?.lastName) {
      payload.lastName = profile.lastName
    }

    if (Object.keys(payload).length === 0) {
      setActiveEditField(null)
      return
    }

    setIsUpdatingProfile(true)
    setUpdateStatus(null)

    try {
      if (!accessToken) {
        if (onLogout) {
          onLogout()
        }
        return
      }

      await updateProfile(accessToken, payload)

      // Move drafts to saved state
      setSavedProfileValues((prev) => {
        const merged = { ...prev }
        for (const [key, value] of trimmedEntries) {
          merged[key] = value.trim()
        }
        return merged
      })

      setDraftProfileValues({})
      setActiveEditField(null)
      setUpdateStatus({ type: "success", message: "Profile updated successfully" })

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateStatus(null), 3000)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        if (onLogout) {
          onLogout()
        }
        return
      }
      
      setUpdateStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update profile",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const formatDateTime = (value: string | null | undefined): string => {
    if (!value) {
      return "Not available"
    }
    return new Date(value).toLocaleString()
  }

  const closeConfirmDialog = () => {
    setConfirmAction(null)
  }

  const handleSecurityApiError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof ApiError && error.status === 401) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setSecurityStatus({
      type: "error",
      message: error instanceof Error ? error.message : fallbackMessage,
    })
  }, [onLogout])

  const loadSecurityData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setIsLoadingSessions(true)
    setSecurityStatus(null)

    try {
      const [sessionsResponse, recoveryResponse] = await Promise.all([
        listSecuritySessions(accessToken),
        getRecoveryOptions(accessToken),
      ])

      setSessions(sessionsResponse.data.sessions)
      setRefreshSessions(sessionsResponse.data.refreshTokens)
      setRecoveryForm({
        backupEmail: recoveryResponse.data.emergencyContact ?? "",
        backupPhone: recoveryResponse.data.emergencyPhone ?? "",
      })
    } catch (error) {
      handleSecurityApiError(error, "Failed to load security details")
    } finally {
      setIsLoadingSessions(false)
    }
  }, [accessToken, handleSecurityApiError])

  const requestPasswordChange = () => {
    setConfirmAction({ kind: "change-password" })
  }

  const executePasswordChange = async () => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    const { currentPassword, newPassword, confirmPassword } = securityForm
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityStatus({ type: "error", message: "Please fill all password fields" })
      return
    }
    if (newPassword !== confirmPassword) {
      setSecurityStatus({ type: "error", message: "New password and confirm password do not match" })
      return
    }
    if (newPassword.length < 8) {
      setSecurityStatus({ type: "error", message: "New password must be at least 8 characters" })
      return
    }

    setIsChangingPassword(true)
    setSecurityStatus(null)

    try {
      const response = await changePassword(accessToken, {
        currentPassword,
        newPassword,
      })

      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSecurityStatus({ type: "success", message: response.message })
      closeConfirmDialog()
    } catch (error) {
      handleSecurityApiError(error, "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const requestRevokeSession = (sessionId: string, sessionLabel: string) => {
    setConfirmAction({ kind: "revoke-session", sessionId, sessionLabel })
  }

  const executeRevokeSession = async (sessionId: string) => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setRevokingSessionId(sessionId)
    setSecurityStatus(null)

    try {
      const response = await revokeSecuritySession(accessToken, sessionId)
      setSecurityStatus({ type: "success", message: response.message })
      await loadSecurityData()
      closeConfirmDialog()
    } catch (error) {
      handleSecurityApiError(error, "Failed to revoke session")
    } finally {
      setRevokingSessionId(null)
    }
  }

  const requestRevokeAllOtherSessions = () => {
    setConfirmAction({ kind: "revoke-others" })
  }

  const executeRevokeAllOtherSessions = async () => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setIsRevokingAllSessions(true)
    setSecurityStatus(null)

    try {
      const response = await revokeAllOtherSecuritySessions(accessToken)
      setSecurityStatus({ type: "success", message: response.message })
      await loadSecurityData()
      closeConfirmDialog()
    } catch (error) {
      handleSecurityApiError(error, "Failed to revoke other sessions")
    } finally {
      setIsRevokingAllSessions(false)
    }
  }

  const handleSaveRecoveryOptions = async () => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    const backupEmail = recoveryForm.backupEmail.trim()
    const backupPhone = recoveryForm.backupPhone.trim()

    if (!backupEmail && !backupPhone) {
      setSecurityStatus({ type: "error", message: "Add a backup email or backup phone" })
      return
    }

    setIsSavingRecovery(true)
    setSecurityStatus(null)

    try {
      const response = await updateRecoveryOptions(accessToken, {
        backupEmail: backupEmail || undefined,
        backupPhone: backupPhone || undefined,
      })
      setSecurityStatus({ type: "success", message: response.message })
      await loadSecurityData()
    } catch (error) {
      handleSecurityApiError(error, "Failed to update recovery options")
    } finally {
      setIsSavingRecovery(false)
    }
  }

  const handlePrivacyApiError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof ApiError && error.status === 401) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setPrivacyStatus({
      type: "error",
      message: error instanceof Error ? error.message : fallbackMessage,
    })
  }, [onLogout])

  const loadPrivacyData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setIsLoadingPrivacy(true)
    setPrivacyStatus(null)

    try {
      const response = await getUserConsentSettings(accessToken)
      setPrivacySettings({
        shareWithEmergency: response.consentSettings.dataSharing,
        emergencyAccess: response.consentSettings.emergencyAccess,
        profileVisibility: response.privacySettings.profileVisibility,
        researchParticipation: response.consentSettings.researchParticipation,
        analyticsOptOut: response.consentSettings.analyticsOptOut,
      })
    } catch (error) {
      handlePrivacyApiError(error, "Failed to load privacy settings")
    } finally {
      setIsLoadingPrivacy(false)
    }
  }, [accessToken, handlePrivacyApiError])

  const handleSavePrivacySettings = async () => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setIsSavingPrivacy(true)
    setPrivacyStatus(null)

    try {
      await updateUserConsentSettings(accessToken, {
        consentSettings: {
          dataSharing: privacySettings.shareWithEmergency,
          emergencyAccess: privacySettings.emergencyAccess,
          researchParticipation: privacySettings.researchParticipation,
          analyticsOptOut: privacySettings.analyticsOptOut,
        },
        privacySettings: {
          profileVisibility: privacySettings.profileVisibility,
        },
      })

      await loadPrivacyData()
      setPrivacyStatus({ type: "success", message: "Privacy preferences saved" })
    } catch (error) {
      handlePrivacyApiError(error, "Failed to save privacy settings")
    } finally {
      setIsSavingPrivacy(false)
    }
  }

  const handleNotificationApiError = useCallback((error: unknown, fallbackMessage: string) => {
    if (error instanceof ApiError && error.status === 401) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setNotificationStatus({
      type: "error",
      message: error instanceof Error ? error.message : fallbackMessage,
    })
  }, [onLogout])

  const loadNotificationData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setIsLoadingNotifications(true)
    setNotificationStatus(null)

    try {
      const response = await getNotificationSettings(accessToken)
      setNotificationSettings((prev) => ({
        ...prev,
        emailNotifications: response.emailNotifications,
        smsNotifications: response.smsNotifications,
        pushNotifications: response.pushNotifications,
        appointmentReminders: response.appointmentReminders,
        recordUpdates: response.recordUpdates,
        securityAlerts: response.securityAlerts,
        billingNotifications: response.billingNotifications,
        labResults: response.labResults,
        prescriptionUpdates: response.prescriptionUpdates,
        marketingEmails: response.marketingEmails,
        frequency: response.frequency,
        quietHoursStart: response.quietHoursStart ?? "",
        quietHoursEnd: response.quietHoursEnd ?? "",
        timezone: response.timezone,
      }))
    } catch (error) {
      handleNotificationApiError(error, "Failed to load notification settings")
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [accessToken, handleNotificationApiError])

  useEffect(() => {
    if (activeTab !== "security") {
      return
    }
    void loadSecurityData()
  }, [activeTab, loadSecurityData])

  useEffect(() => {
    if (activeTab !== "privacy") {
      return
    }
    void loadPrivacyData()
  }, [activeTab, loadPrivacyData])

  useEffect(() => {
    if (activeTab !== "notifications") {
      return
    }
    void loadNotificationData()
  }, [activeTab, loadNotificationData])

  const handleSaveNotificationSettings = async () => {
    if (!accessToken) {
      if (onLogout) {
        onLogout()
      }
      return
    }

    setIsSavingNotifications(true)
    setNotificationStatus(null)

    try {
      await updateNotificationSettings(accessToken, {
        emailNotifications: notificationSettings.emailNotifications,
        smsNotifications: notificationSettings.smsNotifications,
        pushNotifications: notificationSettings.pushNotifications,
        appointmentReminders: notificationSettings.appointmentReminders,
        recordUpdates: notificationSettings.recordUpdates,
        securityAlerts: notificationSettings.securityAlerts,
        billingNotifications: notificationSettings.billingNotifications,
        labResults: notificationSettings.labResults,
        prescriptionUpdates: notificationSettings.prescriptionUpdates,
        marketingEmails: notificationSettings.marketingEmails,
        frequency: notificationSettings.frequency,
        quietHoursStart: notificationSettings.quietHoursStart || null,
        quietHoursEnd: notificationSettings.quietHoursEnd || null,
        timezone: notificationSettings.timezone,
      })

      await loadNotificationData()
      setNotificationStatus({ type: "success", message: "Notification preferences saved" })
    } catch (error) {
      handleNotificationApiError(error, "Failed to save notification settings")
    } finally {
      setIsSavingNotifications(false)
    }
  }

  const confirmDialogTitle =
    confirmAction?.kind === "change-password"
      ? "Change password"
      : confirmAction?.kind === "revoke-session"
        ? "Revoke session"
        : confirmAction?.kind === "revoke-others"
          ? "Revoke other sessions"
          : ""

  const confirmDialogDescription =
    confirmAction?.kind === "change-password"
      ? "This will update your password immediately. Other signed-in devices may need to authenticate again."
      : confirmAction?.kind === "revoke-session"
        ? `This will sign out ${confirmAction.sessionLabel}.`
        : confirmAction?.kind === "revoke-others"
          ? "This will sign out every session except the one you are using right now."
          : ""

  const confirmDialogActionLabel =
    confirmAction?.kind === "change-password"
      ? "Change Password"
      : confirmAction?.kind === "revoke-session"
        ? "Revoke Session"
        : confirmAction?.kind === "revoke-others"
          ? "Revoke Others"
          : "Confirm"

  const handleConfirmAction = async () => {
    if (!confirmAction) {
      return
    }

    if (confirmAction.kind === "change-password") {
      await executePasswordChange()
      return
    }

    if (confirmAction.kind === "revoke-session") {
      await executeRevokeSession(confirmAction.sessionId)
      return
    }

    await executeRevokeAllOtherSessions()
  }

  return (
    <div className="rounded-xl bg-muted/50 p-4 md:min-h-min">
      <h3 className="text-lg font-semibold">Account settings overview</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account and personal profile information.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            size="sm"
            variant={activeTab === tab.id ? "default" : "outline"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="mt-2 text-xl font-semibold">{formatFieldValue(user?.role)}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">Verification</p>
              <p className="mt-2 text-xl font-semibold">{user?.isVerified ? "Verified" : "Pending"}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">Data Records</p>
              <p className="mt-2 text-xl font-semibold">{totalRecords}</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs text-muted-foreground">Appointments</p>
              <p className="mt-2 text-xl font-semibold">{dashboard?.appointments.length ?? 0}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Available Settings Areas</h4>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              <div className="rounded-md border p-3">Profile and identity details</div>
              <div className="rounded-md border p-3">Password and account security</div>
              <div className="rounded-md border p-3">Privacy defaults and consent controls</div>
              <div className="rounded-md border p-3">Notification channels and event preferences</div>
              <div className="rounded-md border p-3">Audit trail and compliance logs</div>
              <div className="rounded-md border p-3">Support and account help options</div>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "profile" ? (
        <div className="mt-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold">Profile Details</h4>
              {showProfileUpdateButton ? (
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2Icon className="mr-2 size-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              ) : null}
            </div>
            {updateStatus ? (
              <div className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                updateStatus.type === "success" 
                  ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400" 
                  : "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}>
                {updateStatus.type === "success" ? (
                  <CheckCircle2Icon className="size-4" />
                ) : (
                  <XCircleIcon className="size-4" />
                )}
                <span>{updateStatus.message}</span>
              </div>
            ) : null}
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {mergedProfileFields.map((field) => (
                <div key={field.key} className="min-w-0 rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  {activeEditField === field.key ? (
                    <Input
                      autoFocus
                      value={draftProfileValues[field.key] ?? ""}
                      onChange={(event) =>
                        setDraftProfileValues((prev) => ({
                          ...prev,
                          [field.key]: event.target.value,
                        }))
                      }
                      onBlur={() => handleDraftBlur(field.key)}
                      placeholder="Enter value"
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                      <p className="min-w-0 flex-1 wrap-anywhere text-sm font-medium whitespace-pre-wrap">
                        {getProfileFieldDisplayValue(field.key, field.value)}
                      </p>
                      {!nonEditableFields.has(field.key) ? (
                        <button
                          type="button"
                          className="inline-flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted"
                          aria-label={`Edit ${field.label}`}
                          onClick={() => handleEditEmptyField(field.key)}
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "security" ? (
        <Suspense fallback={renderLazyTabFallback()}>
          <SecuritySettingsTab
            securityForm={securityForm}
            setSecurityForm={setSecurityForm}
            isChangingPassword={isChangingPassword}
            requestPasswordChange={requestPasswordChange}
            securityStatus={securityStatus}
            isLoadingSessions={isLoadingSessions}
            loadSecurityData={loadSecurityData}
            requestRevokeAllOtherSessions={requestRevokeAllOtherSessions}
            isRevokingAllSessions={isRevokingAllSessions}
            sessions={sessions}
            requestRevokeSession={requestRevokeSession}
            revokingSessionId={revokingSessionId}
            formatDateTime={formatDateTime}
            recoveryForm={recoveryForm}
            setRecoveryForm={setRecoveryForm}
            handleSaveRecoveryOptions={handleSaveRecoveryOptions}
            isSavingRecovery={isSavingRecovery}
            refreshSessions={refreshSessions}
          />
        </Suspense>
      ) : null}

      {activeTab === "privacy" ? (
        <Suspense fallback={renderLazyTabFallback()}>
          <PrivacySettingsTab
            privacyStatus={privacyStatus}
            privacySettings={privacySettings}
            setPrivacySettings={setPrivacySettings}
            handleSavePrivacySettings={handleSavePrivacySettings}
            isSavingPrivacy={isSavingPrivacy}
            isLoadingPrivacy={isLoadingPrivacy}
          />
        </Suspense>
      ) : null}

      {activeTab === "notifications" ? (
        <Suspense fallback={renderLazyTabFallback()}>
          <NotificationsSettingsTab
            notificationStatus={notificationStatus}
            notificationSettings={notificationSettings}
            setNotificationSettings={setNotificationSettings}
            handleSaveNotificationSettings={handleSaveNotificationSettings}
            isSavingNotifications={isSavingNotifications}
            isLoadingNotifications={isLoadingNotifications}
          />
        </Suspense>
      ) : null}

      {activeTab === "audit" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Account Activity Summary</h4>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Account Created</p>
                <p className="font-medium">{formatFieldValue(user?.createdAt ? new Date(user.createdAt).toLocaleString() : null)}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Last Profile Update</p>
                <p className="font-medium">{formatFieldValue(profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : null)}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Total Appointments</p>
                <p className="font-medium">{dashboard?.appointments.length ?? 0}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Medical Records Tracked</p>
                <p className="font-medium">{totalRecords}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Compliance and Access Logs</h4>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-md border p-3">
                <p className="font-medium">Who accessed my data</p>
                <p className="mt-1 text-muted-foreground">Use Consent Management details to inspect audit trails per consent.</p>
                <a href="/consent" className="mt-2 inline-block text-primary underline">
                  Review Consent Audit Trail
                </a>
              </div>
              <div className="rounded-md border p-3">
                <p className="font-medium">Accepted Terms and Privacy Versions</p>
                <p className="mt-1 text-muted-foreground">Version history will appear here once policy history is available.</p>
              </div>
              <Button type="button" variant="outline" className="w-full">
                Export Audit Summary
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "support" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Help and Contact</h4>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-md border p-3">
                <p className="font-medium">Help Center</p>
                <p className="mt-1 text-muted-foreground">Find guides for profile, appointments, emergency links, and consent workflows.</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="font-medium">Contact Support</p>
                <p className="mt-1 text-muted-foreground">Reach the support team for account or app issues.</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <h4 className="text-sm font-semibold">Security and Privacy Escalation</h4>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-md border p-3">
                <p className="font-medium">Report Security Concern</p>
                <p className="mt-1 text-muted-foreground">Report suspicious logins, phishing, or unauthorized data access.</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Report Security Issue
                </Button>
              </div>
              <div className="rounded-md border p-3">
                <p className="font-medium">Data Privacy Request</p>
                <p className="mt-1 text-muted-foreground">Submit correction, restriction, or deletion requests for your personal data.</p>
                <Button type="button" variant="destructive" size="sm" className="mt-2">
                  Open Privacy Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog open={confirmAction !== null} onOpenChange={(open) => !open && closeConfirmDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialogTitle}</DialogTitle>
            <DialogDescription>{confirmDialogDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeConfirmDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={confirmAction?.kind === "change-password" ? "default" : "destructive"}
              onClick={() => void handleConfirmAction()}
              disabled={isChangingPassword || isRevokingAllSessions || revokingSessionId !== null}
            >
              {confirmDialogActionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
