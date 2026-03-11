import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react"
import { useRouteHistory } from "@/hooks/use-route-history"

import { AppSidebar } from "@/components/app-sidebar"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { ProfileModal } from "@/components/profile-modal"
import { ProfileMenu } from "@/components/profile-menu"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"
import { ResetPasswordForm } from "@/components/reset-password-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  getDashboardData,
  getConsentRequests,
  loginWithEmail,
  requestAppointment,
  searchDoctors,
  updateAppointment,
  cancelAppointment,
  createEmergencyShare,
  listEmergencyShares,
  revokeEmergencyShare,
  verifyEmailToken,
  getShareAccessLogs,
  registerUser,
  refreshAccessToken,
} from "@/lib/api/curanet"
import { ApiError, API_BASE_URL, getApiErrorMessages } from "@/lib/api/client"
import { STORAGE_KEYS } from "@/lib/config"
import type { DashboardData, EmergencyShare, CreateEmergencyShareResponse, ShareAccessLogsResponse } from "@/lib/api/types"

const ProfilePage = lazy(() => import("@/components/profile-page").then((module) => ({ default: module.ProfilePage })))
const EmergencyAccessPage = lazy(() => import("@/components/emergency-access-page").then((module) => ({ default: module.EmergencyAccessPage })))
const ConsentManagement = lazy(() => import("@/components/consent-management").then((module) => ({ default: module.ConsentManagement })))
const AppointmentsRouteSection = lazy(() => import("@/components/route-sections/appointments-route-section"))
const EmergencyRouteSection = lazy(() => import("@/components/route-sections/emergency-route-section"))
const RecordsRouteSection = lazy(() => import("@/components/route-sections/records-route-section"))
const OverviewRouteSection = lazy(() => import("@/components/route-sections/overview-route-section").then((module) => ({ default: module.OverviewRouteSection })))
const DashboardMetrics = lazy(() => import("@/components/route-sections/dashboard-metrics").then((module) => ({ default: module.DashboardMetrics })))
const DashboardActivity = lazy(() => import("@/components/route-sections/dashboard-activity").then((module) => ({ default: module.DashboardActivity })))
const RecordDetailDialogContent = lazy(() => import("@/components/dialogs/record-detail-dialog-content"))
const EmergencyShareDetailsDialogContent = lazy(() => import("@/components/dialogs/emergency-share-details-dialog-content"))
const AppointmentDetailDialogContent = lazy(() => import("@/components/dialogs/appointment-detail-dialog-content").then((module) => ({ default: module.AppointmentDetailDialogContent })))
const EmergencyLinkGenerationModalContent = lazy(() => import("@/components/dialogs/emergency-link-generation-modal-content").then((module) => ({ default: module.EmergencyLinkGenerationModalContent })))

const ROUTE_MODULE_MAP: Record<string, () => Promise<unknown>> = {
  "/appointments": () => import("@/components/route-sections/appointments-route-section"),
  "/records": () => import("@/components/route-sections/records-route-section"),
  "/emergency": () => import("@/components/route-sections/emergency-route-section"),
  "/dashboard": () => import("@/components/route-sections/overview-route-section"),
  "/settings": () => import("@/components/profile-page"),
  "/consent": () => import("@/components/consent-management"),
}

const STATIC_PREDICTIONS: Record<string, string[]> = {
  "/appointments": ["/records", "/emergency", "/dashboard"],
  "/records": ["/appointments", "/emergency"],
  "/emergency": ["/records", "/settings"],
  "/dashboard": ["/appointments", "/records"],
  "/settings": ["/appointments", "/dashboard"],
  "/consent": ["/dashboard", "/appointments"],
}

export function App() {
  const currentPath = window.location.pathname
  const emergencyTokenMatch = currentPath.match(/^\/one\/([a-f0-9]+)$/)
  const isPublicEmergencyRoute = Boolean(emergencyTokenMatch)

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    isPublicEmergencyRoute ? null : localStorage.getItem(STORAGE_KEYS.accessToken)
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    isPublicEmergencyRoute ? null : localStorage.getItem(STORAGE_KEYS.refreshToken)
  )
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authErrors, setAuthErrors] = useState<string[]>([])
  const [authInfo, setAuthInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)
  const [pendingConsentCount, setPendingConsentCount] = useState(0)
  const [activePath, setActivePath] = useState("/dashboard/overview")
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const { recordVisit, getPredictedRoutes } = useRouteHistory()

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(null)
  const [emailVerificationState, setEmailVerificationState] = useState<{
    status: "idle" | "loading" | "success" | "error"
    message: string | null
  }>({ status: "idle", message: null })
  const [selectedRecord, setSelectedRecord] = useState<{
    type: "encounter" | "observation"
    data: Record<string, unknown>
  } | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardData["appointments"][number] | null>(null)
  const [doctorOptions, setDoctorOptions] = useState<
    Array<{ healthId: string; label: string; email: string | null }>
  >([])
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("")
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false)
  const [doctorLoading, setDoctorLoading] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: "",
    requestedTime: "",
    reasonForVisit: "",
  })
  const [appointmentMessage, setAppointmentMessage] = useState<string | null>(null)
  const [appointmentError, setAppointmentError] = useState<string | null>(null)
  const [submittingAppointment, setSubmittingAppointment] = useState(false)
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null)
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null)

  // Emergency share state
  const [emergencyShares, setEmergencyShares] = useState<EmergencyShare[]>([])
  const [loadingEmergencyShares, setLoadingEmergencyShares] = useState(false)
  const [generatedShare, setGeneratedShare] = useState<CreateEmergencyShareResponse["data"] | null>(null)
  const [generateShareModalOpen, setGenerateShareModalOpen] = useState(false)
  const [shareExpiryHours, setShareExpiryHours] = useState(6)
  const [creatingShare, setCreatingShare] = useState(false)
  const [revokingShareId, setRevokingShareId] = useState<string | null>(null)
  const [emergencyShareMessage, setEmergencyShareMessage] = useState<string | null>(null)
  const [emergencyShareError, setEmergencyShareError] = useState<string | null>(null)

  // Share details modal state
  const [shareDetailsModalOpen, setShareDetailsModalOpen] = useState(false)
  const [selectedShare, setSelectedShare] = useState<EmergencyShare | null>(null)
  const [accessLogs, setAccessLogs] = useState<ShareAccessLogsResponse["data"] | null>(null)
  const [loadingAccessLogs, setLoadingAccessLogs] = useState(false)

  const clearAuthAndRedirectToLogin = (message?: string) => {
    setAccessToken(null)
    setRefreshToken(null)
    setDashboard(null)
    setPendingConsentCount(0)
    setActivePath("/dashboard/overview")
    setAuthMode("login")
    setAuthErrors([])
    setAuthInfo(message ?? null)
    setDashboardError(null)
    localStorage.removeItem(STORAGE_KEYS.accessToken)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    window.history.replaceState({}, "", "/")
  }

  useEffect(() => {
    if (isPublicEmergencyRoute) {
      return
    }

    if (accessToken) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const verifyToken = params.get("verifyToken")

    if (!verifyToken || emailVerificationState.status !== "idle") {
      return
    }

    let isMounted = true

    const verify = async () => {
      setEmailVerificationState({ status: "loading", message: "Verifying your email..." })

      try {
        const response = await verifyEmailToken(verifyToken)
        if (!isMounted) return

        setEmailVerificationState({
          status: "success",
          message: response.message || "Email verified successfully. Please sign in.",
        })
        setAuthMode("login")
        setAuthInfo(response.message || "Email verified successfully. Please sign in.")
      } catch (error) {
        if (!isMounted) return

        const message = getApiErrorMessages(error, "Email verification failed")[0]
        setEmailVerificationState({ status: "error", message })
        setAuthErrors([message])
      } finally {
        window.history.replaceState({}, "", "/")
      }
    }

    void verify()

    return () => {
      isMounted = false
    }
  }, [accessToken, emailVerificationState.status, isPublicEmergencyRoute])

  useEffect(() => {
    if (isPublicEmergencyRoute) {
      return
    }

    if (!accessToken) {
      setDashboard(null)
      return
    }

    const load = async () => {
      setLoading(true)
      setDashboardError(null)

      try {
        const data = await getDashboardData(accessToken)
        setDashboard(data)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && refreshToken) {
          try {
            const newAccessToken = await refreshAccessToken(refreshToken)
            localStorage.setItem(STORAGE_KEYS.accessToken, newAccessToken)
            setAccessToken(newAccessToken)

            const retried = await getDashboardData(newAccessToken)
            setDashboard(retried)
            return
          } catch {
            clearAuthAndRedirectToLogin("Session expired. Please sign in again.")
            return
          }
        }

        if (error instanceof ApiError && error.status === 401) {
          clearAuthAndRedirectToLogin("Session expired. Please sign in again.")
          return
        }

        setDashboardError(error instanceof Error ? error.message : "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [accessToken, refreshToken, isPublicEmergencyRoute])

  useEffect(() => {
    if (isPublicEmergencyRoute || !accessToken) {
      setPendingConsentCount(0)
      return
    }

    let isMounted = true

    const loadPendingConsents = async () => {
      try {
        const response = await getConsentRequests(accessToken, "PENDING")
        if (!isMounted) {
          return
        }

        setPendingConsentCount(response.requests.length)
      } catch (error) {
        if (isMounted) {
          if (error instanceof ApiError && error.status === 401) {
            clearAuthAndRedirectToLogin("Session expired. Please sign in again.")
            return
          }

          setPendingConsentCount(0)
        }
      }
    }

    void loadPendingConsents()

    return () => {
      isMounted = false
    }
  }, [accessToken, isPublicEmergencyRoute])

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    setAuthErrors([])
    setAuthInfo(null)
    setLoading(true)

    try {
      const response = await loginWithEmail(email, password)
      setAccessToken(response.accessToken)
      setRefreshToken(response.refreshToken ?? null)
      setActivePath("/dashboard/overview")
      localStorage.setItem(STORAGE_KEYS.accessToken, response.accessToken)
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.refreshToken, response.refreshToken)
      }
    } catch (error) {
      setAuthErrors(getApiErrorMessages(error, "Login failed"))
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async ({
    name,
    email,
    phone,
    password,
    confirmPassword,
    role,
  }: {
    name: string
    email?: string
    phone?: string
    password: string
    confirmPassword: string
    role: "patient" | "doctor" | "pharmacy" | "admin"
  }) => {
    setAuthErrors([])
    setAuthInfo(null)

    const validationErrors: string[] = []
    if (!name.trim()) {
      validationErrors.push("Name is required")
    }
    if (!email && !phone) {
      validationErrors.push("Provide at least email or phone")
    }
    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters long")
    }
    if (password !== confirmPassword) {
      validationErrors.push("Password and confirm password do not match")
    }

    if (validationErrors.length > 0) {
      setAuthErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await registerUser({
        name: name.trim(),
        email,
        phone,
        password,
        role,
      })

      setAuthMode("login")
      setAuthInfo(response.message || "Registration successful. Please sign in.")
    } catch (error) {
      setAuthErrors(getApiErrorMessages(error, "Signup failed"))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthAndRedirectToLogin()
  }

  const sidebarUser = useMemo(() => {
    if (!dashboard?.profile) {
      return undefined
    }

    const profile = dashboard.profile.profile
    const user = dashboard.profile.user

    const computedName =
      profile?.displayName?.trim() ||
      `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
      user.healthId

    return {
      name: computedName,
      email: user.email ?? "No email",
      avatar: "",
    }
  }, [dashboard])

  const upcomingAppointments =
    dashboard?.appointments.filter((apt) => {
      const isOpenState = apt.status === "PENDING" || apt.status === "CONFIRMED"
      return isOpenState && new Date(apt.requestedTime).getTime() >= Date.now()
    }).length ?? 0

  const closedAppointments =
    dashboard?.appointments.filter((apt) => {
      return apt.status === "COMPLETED" || apt.status === "CANCELLED" || apt.status === "REJECTED"
    }).length ?? 0

  const pendingAppointments =
    dashboard?.appointments.filter((apt) => apt.status === "PENDING").length ?? 0

  const totalRecords =
    (dashboard?.encountersCount ?? 0) + (dashboard?.observationsCount ?? 0)

  const isPatient = dashboard?.profile?.user.role === "patient"

  useEffect(() => {
    if (!accessToken || !isPatient || !activePath.startsWith("/appointments")) {
      return
    }

    let ignore = false

    const loadDoctors = async () => {
      setDoctorLoading(true)
      try {
        const result = await searchDoctors(accessToken)
        if (ignore) {
          return
        }

        const options = result.data.doctors.map((doctor) => {
          const profile = doctor.healthProfile
          const displayName =
            profile.displayName?.trim() || `${profile.firstName} ${profile.lastName}`.trim() || doctor.healthId

          return {
            healthId: doctor.healthId,
            label: displayName,
            email: doctor.email,
          }
        })

        setDoctorOptions(options)

        if (options.length > 0 && !appointmentForm.doctorId) {
          setAppointmentForm((prev) => ({ ...prev, doctorId: options[0].healthId }))
          setDoctorSearchTerm(`${options[0].label} (${options[0].healthId})`)
        }
      } catch {
        if (!ignore) {
          setDoctorOptions([])
        }
      } finally {
        if (!ignore) {
          setDoctorLoading(false)
        }
      }
    }

    void loadDoctors()

    return () => {
      ignore = true
    }
  }, [accessToken, isPatient, activePath, appointmentForm.doctorId])

  const handleScheduleAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken || !isPatient) {
      return
    }

    setAppointmentError(null)
    setAppointmentMessage(null)

    if (!appointmentForm.doctorId || !appointmentForm.requestedTime) {
      setAppointmentError("Please select doctor and appointment date/time.")
      return
    }

    setSubmittingAppointment(true)
    try {
      if (editingAppointmentId) {
        await updateAppointment(accessToken, editingAppointmentId, {
          requestedTime: new Date(appointmentForm.requestedTime).toISOString(),
          reasonForVisit: appointmentForm.reasonForVisit.trim() || undefined,
        })
      } else {
        await requestAppointment(accessToken, {
          doctorId: appointmentForm.doctorId,
          requestedTime: new Date(appointmentForm.requestedTime).toISOString(),
          reasonForVisit: appointmentForm.reasonForVisit.trim() || undefined,
        })
      }

      const refreshed = await getDashboardData(accessToken)
      setDashboard(refreshed)
      setAppointmentMessage(
        editingAppointmentId ? "Appointment updated successfully." : "Appointment requested successfully."
      )
      setAppointmentForm((prev) => ({
        ...prev,
        requestedTime: "",
        reasonForVisit: "",
      }))
      setEditingAppointmentId(null)
    } catch (error) {
      const message = getApiErrorMessages(error, editingAppointmentId ? "Failed to update appointment" : "Failed to schedule appointment")[0]
      setAppointmentError(message)
    } finally {
      setSubmittingAppointment(false)
    }
  }

  const toDateTimeLocalValue = (isoDate: string): string => {
    const date = new Date(isoDate)
    const pad = (value: number) => String(value).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const getTomorrowMinDateTime = (): string => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const pad = (value: number) => String(value).padStart(2, "0")
    return `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T00:00`
  }

  const canEditPendingAppointment = (requestedTime: string): boolean => {
    const appointmentDate = new Date(requestedTime)
    const today = new Date()

    // Set both to start of day for comparison
    appointmentDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    // Can edit only if appointment is tomorrow or later
    const tomorrowStart = new Date(today)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    return appointmentDate.getTime() >= tomorrowStart.getTime()
  }

  const handleEditPendingAppointment = (appointment: DashboardData["appointments"][number]) => {
    if (appointment.status !== "PENDING") {
      return
    }

    if (!canEditPendingAppointment(appointment.requestedTime)) {
      setAppointmentMessage(null)
      setAppointmentError("Pending appointments can only be edited if scheduled for tomorrow or later.")
      return
    }

    const selectedDoctor = doctorOptions.find((doctor) => doctor.healthId === appointment.doctorId)
    setEditingAppointmentId(appointment.id)
    setAppointmentForm({
      doctorId: appointment.doctorId,
      requestedTime: toDateTimeLocalValue(appointment.requestedTime),
      reasonForVisit: appointment.reasonForVisit ?? "",
    })
    setDoctorSearchTerm(
      selectedDoctor
        ? `${selectedDoctor.label} (${selectedDoctor.healthId})`
        : appointment.doctorId
    )
    setAppointmentMessage(null)
    setAppointmentError(null)
    setActivePath("/appointments/schedule")
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!accessToken) return

    try {
      setCancellingAppointmentId(appointmentId)
      await cancelAppointment(accessToken, appointmentId)

      setSelectedAppointment(null)
      setAppointmentMessage("Appointment cancelled successfully.")
      setAppointmentError(null)

      // Refresh dashboard to get updated appointments
      const updatedDashboard = await getDashboardData(accessToken)
      setDashboard(updatedDashboard)
    } catch (error) {
      const message = getApiErrorMessages(error, "Failed to cancel appointment")[0]
      setAppointmentError(message)
    } finally {
      setCancellingAppointmentId(null)
    }
  }

  const loadEmergencyShares = useCallback(async () => {
    if (!accessToken) return

    try {
      setLoadingEmergencyShares(true)
      const response = await listEmergencyShares(accessToken)
      setEmergencyShares([...response.data.active_shares, ...response.data.used_shares])
    } catch (error) {
      const message = getApiErrorMessages(error, "Failed to load emergency shares")[0]
      setEmergencyShareError(message)
    } finally {
      setLoadingEmergencyShares(false)
    }
  }, [accessToken])

  const handleGenerateEmergencyShare = async () => {
    if (!accessToken) return

    try {
      setCreatingShare(true)
      setEmergencyShareError(null)

      const response = await createEmergencyShare(accessToken, {
        expires_in_seconds: shareExpiryHours * 3600,
        scope: ['emergency']
      })

      setGeneratedShare(response.data)
      setEmergencyShareMessage("Emergency share link generated successfully!")
      await loadEmergencyShares()
    } catch (error) {
      const message = getApiErrorMessages(error, "Failed to generate emergency share")[0]
      setEmergencyShareError(message)
    } finally {
      setCreatingShare(false)
    }
  }

  const handleRevokeEmergencyShare = async (shareId: string) => {
    if (!accessToken) return

    try {
      setRevokingShareId(shareId)
      await revokeEmergencyShare(accessToken, shareId)
      setEmergencyShareMessage("Emergency share revoked successfully.")
      await loadEmergencyShares()
    } catch (error) {
      const message = getApiErrorMessages(error, "Failed to revoke emergency share")[0]
      setEmergencyShareError(message)
    } finally {
      setRevokingShareId(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setEmergencyShareMessage("Link copied to clipboard!")
      setTimeout(() => setEmergencyShareMessage(null), 3000)
    })
  }

  const handleOpenShareDetails = async (share: EmergencyShare) => {
    setSelectedShare(share)
    setShareDetailsModalOpen(true)
    await loadAccessLogs(share.shareId)
  }

  const loadAccessLogs = async (shareId: string) => {
    if (!accessToken) return

    try {
      setLoadingAccessLogs(true)
      const response = await getShareAccessLogs(accessToken, shareId)
      setAccessLogs(response.data)
    } catch (error) {
      const message = getApiErrorMessages(error, "Failed to load access logs")[0]
      setEmergencyShareError(message)
      setAccessLogs(null)
    } finally {
      setLoadingAccessLogs(false)
    }
  }

  // Load emergency shares when viewing emergency section
  useEffect(() => {
    if (accessToken && activePath.startsWith("/emergency")) {
      void loadEmergencyShares()
    }
  }, [accessToken, activePath, loadEmergencyShares])

  useEffect(() => {
    if (!accessToken || !dashboard || isPublicEmergencyRoute) {
      return
    }

    let cancelled = false

    const preload = () => {
      if (cancelled) {
        return
      }

      void import("@/components/profile-page")
      void import("@/components/consent-management")
      void import("@/components/settings-tabs/security-settings-tab")
      void import("@/components/settings-tabs/privacy-settings-tab")
      void import("@/components/settings-tabs/notifications-settings-tab")
    }

    const timeoutId = window.setTimeout(preload, 1200)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [accessToken, dashboard, isPublicEmergencyRoute])

  // Prefetch modules on sidebar item hover
  const handleSidebarItemHover = (url: string) => {
    if (url === "/settings") {
      void import("@/components/profile-page")
      void import("@/components/settings-tabs/security-settings-tab")
      void import("@/components/settings-tabs/privacy-settings-tab")
      void import("@/components/settings-tabs/notifications-settings-tab")
    } else if (url === "/consent") {
      void import("@/components/consent-management")
    }
  }

  // Record every route visit so the history-based predictor can learn transitions.
  useEffect(() => {
    recordVisit(activePath)
  }, [activePath, recordVisit])

  useEffect(() => {
    if (!accessToken || !dashboard || isPublicEmergencyRoute) return

    let cancelled = false

    const prefetchRelatedModules = () => {
      if (cancelled) return

      // Merge history-learned predictions (higher confidence) with static defaults
      const section = "/" + (activePath.split("/")[1] ?? "")
      const historyPredictions = getPredictedRoutes(activePath, 3)
      const fallback = STATIC_PREDICTIONS[section] ?? []
      // Deduplicate: history-based first, then static fill-in up to 3 total
      const predicted = [...new Set([...historyPredictions, ...fallback])].slice(0, 3)

      for (const route of predicted) {
        const loader = ROUTE_MODULE_MAP[route]
        if (loader) void loader()
      }

      // Always prefetch dashboard sub-pages when on dashboard
      if (activePath.startsWith("/dashboard")) {
        void import("@/components/route-sections/dashboard-metrics")
        void import("@/components/route-sections/dashboard-activity")
      }
    }

    // Prefetch after 800ms of being on the current route
    const timeoutId = window.setTimeout(prefetchRelatedModules, 800)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [activePath, accessToken, dashboard, isPublicEmergencyRoute, getPredictedRoutes])

  const filteredDoctors = doctorOptions.filter((doctor) => {
    const query = doctorSearchTerm.trim().toLowerCase()
    if (query.length === 0) {
      return true
    }
    return (
      doctor.label.toLowerCase().includes(query) ||
      doctor.healthId.toLowerCase().includes(query) ||
      (doctor.email ?? "").toLowerCase().includes(query)
    )
  })

  const formatFieldValue = (value: unknown): string => {
    if (value == null) {
      return "Fill this"
    }

    if (typeof value === "string") {
      return value.trim().length > 0 ? value : "Fill this"
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? JSON.stringify(value) : "Fill this"
    }

    if (typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).length > 0
        ? JSON.stringify(value, null, 2)
        : "Fill this"
    }

    return String(value)
  }

  // Format camelCase to human-readable labels
  const formatFieldName = (key: string): string => {
    const specialCases: Record<string, string> = {
      patientId: "Patient ID",
      providerId: "Provider",
      encounterId: "Encounter ID",
      createdById: "Created By ID",
      createdByRole: "Created By",
      recordedAt: "Recorded At",
      createdAt: "Created At",
      updatedAt: "Updated At",
      startTime: "Start Time",
      endTime: "End Time",
      attachmentUrl: "Attachment",
      deviceMetadata: "Device Metadata",
      verificationNotes: "Verification Notes",
      verificationStatus: "Verification Status",
      verifiedAt: "Verified At",
      verifiedByDoctorId: "Verified By",
      oxygenSaturation: "Oxygen Saturation",
      bloodPressure: "Blood Pressure",
      heartRate: "Heart Rate",
    }

    if (specialCases[key]) {
      return specialCases[key]
    }

    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Format date strings
  const formatDateTime = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return dateStr
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  // Check if string is ISO date
  const isISODate = (str: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str)
  }

  const formatRecordDetailValue = (value: unknown): string => {
    if (value == null) {
      return "N/A"
    }

    if (typeof value === "string") {
      if (value.trim().length === 0) {
        return "N/A"
      }
      if (isISODate(value)) {
        return formatDateTime(value)
      }
      return value
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2)
    }

    return String(value)
  }

  const openRecordDetail = (
    type: "encounter" | "observation",
    data: Record<string, unknown>
  ) => {
    setSelectedRecord({ type, data })
  }

  const sectionMap: Record<string, { parent: string; page: string }> = {
    "/dashboard": { parent: "Dashboard", page: "Overview" },
    "/dashboard/overview": { parent: "Dashboard", page: "Overview" },
    "/dashboard/metrics": { parent: "Dashboard", page: "Health Metrics" },
    "/dashboard/activity": { parent: "Dashboard", page: "Recent Activity" },
    "/dashboard/analytics": { parent: "Dashboard", page: "Analytics" },
    "/appointments": { parent: "Appointments", page: "Schedule" },
    "/appointments/schedule": { parent: "Appointments", page: "Schedule" },
    "/appointments/upcoming": { parent: "Appointments", page: "Upcoming" },
    "/appointments/history": { parent: "Appointments", page: "History" },
    "/appointments/book": { parent: "Appointments", page: "Book New" },
    "/records": { parent: "Medical Records", page: "Overview" },
    "/records/encounters": { parent: "Medical Records", page: "Encounters" },
    "/records/observations": { parent: "Medical Records", page: "Observations" },
    "/emergency": { parent: "Emergency", page: "Card" },
    "/emergency/card": { parent: "Emergency", page: "Card" },
    "/consent": { parent: "Consent Management", page: "Overview" },
    "/settings": { parent: "Account Settings", page: "Overview" },
    "/settings/profile": { parent: "Account Settings", page: "Overview" },
  }

  // Public emergency route: bypass authenticated dashboard flow entirely
  if (emergencyTokenMatch) {
    const emergencyToken = emergencyTokenMatch[1]
    return (
      <Suspense fallback={renderSkeletonDashboard()}>
        <EmergencyAccessPage token={emergencyToken} />
      </Suspense>
    )
  }

  const breadcrumb = sectionMap[activePath] ?? { parent: "CuraNet", page: "Section" }

  function renderSkeletonDashboard() {
    return (
      <div className="space-y-4">
        {/* Stats cards skeleton */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
        </div>

        {/* Content section skeleton */}
        <div className="rounded-xl bg-muted/50 p-4">
          <Skeleton className="h-6 w-40" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    // Dashboard sub-routes
    if (activePath === "/dashboard/metrics") {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <DashboardMetrics dashboard={dashboard} />
        </Suspense>
      )
    }

    if (activePath === "/dashboard/activity") {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <DashboardActivity dashboard={dashboard} />
        </Suspense>
      )
    }

    if (activePath.startsWith("/appointments")) {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <AppointmentsRouteSection
            activePath={activePath}
            dashboard={dashboard}
            isPatient={isPatient}
            loading={loading}
            doctorLoading={doctorLoading}
            doctorOptions={doctorOptions}
            doctorSearchTerm={doctorSearchTerm}
            setDoctorSearchTerm={setDoctorSearchTerm}
            doctorDropdownOpen={doctorDropdownOpen}
            setDoctorDropdownOpen={setDoctorDropdownOpen}
            filteredDoctors={filteredDoctors}
            appointmentForm={appointmentForm}
            setAppointmentForm={setAppointmentForm}
            handleScheduleAppointment={handleScheduleAppointment}
            submittingAppointment={submittingAppointment}
            editingAppointmentId={editingAppointmentId}
            setEditingAppointmentId={setEditingAppointmentId}
            appointmentMessage={appointmentMessage}
            setAppointmentMessage={setAppointmentMessage}
            appointmentError={appointmentError}
            setAppointmentError={setAppointmentError}
            canEditPendingAppointment={canEditPendingAppointment}
            handleEditPendingAppointment={handleEditPendingAppointment}
            setSelectedAppointment={setSelectedAppointment}
            getTomorrowMinDateTime={getTomorrowMinDateTime}
          />
        </Suspense>
      )
    }

    if (activePath === "/records") {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <RecordsRouteSection activePath={activePath} dashboard={dashboard} openRecordDetail={openRecordDetail} />
        </Suspense>
      )
    }

    if (activePath === "/records/encounters" || activePath === "/records/observations") {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <RecordsRouteSection activePath={activePath} dashboard={dashboard} openRecordDetail={openRecordDetail} />
        </Suspense>
      )
    }

    if (activePath.startsWith("/emergency")) {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <EmergencyRouteSection
            dashboard={dashboard}
            setGenerateShareModalOpen={setGenerateShareModalOpen}
            emergencyShareMessage={emergencyShareMessage}
            emergencyShareError={emergencyShareError}
            loadEmergencyShares={loadEmergencyShares}
            loadingEmergencyShares={loadingEmergencyShares}
            emergencyShares={emergencyShares}
            handleOpenShareDetails={handleOpenShareDetails}
            handleRevokeEmergencyShare={handleRevokeEmergencyShare}
            revokingShareId={revokingShareId}
          />
        </Suspense>
      )
    }

    if (activePath.startsWith("/settings")) {
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <ProfilePage dashboard={dashboard} formatFieldValue={formatFieldValue} onLogout={clearAuthAndRedirectToLogin} accessToken={accessToken} />
        </Suspense>
      )
    }

    if (activePath.startsWith("/consent")) {
      const userRole = dashboard?.profile?.user.role ?? "patient"
      if (!accessToken) {
        return null
      }
      return (
        <Suspense fallback={renderSkeletonDashboard()}>
          <ConsentManagement token={accessToken} userRole={userRole} />
        </Suspense>
      )
    }

    return (
      <Suspense fallback={renderSkeletonDashboard()}>
        <OverviewRouteSection dashboard={dashboard} />
      </Suspense>
    )
  }

  if (!accessToken) {
    // Check URL for reset token
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("resetToken")

    if (token || resetPasswordToken) {
      return (
        <div className="flex h-svh flex-col items-center justify-center overflow-hidden bg-muted p-4 md:p-6">
          <ResetPasswordForm
            token={token || resetPasswordToken || ""}
            onSuccess={() => {
              setResetPasswordToken(null)
              setAuthMode("login")
              setAuthErrors([])
              setAuthInfo("Password reset successful! You can now log in.")
              // Remove token from URL
              window.history.replaceState({}, "", "/")
            }}
            onBackToLogin={() => {
              setResetPasswordToken(null)
              setAuthMode("login")
              // Remove token from URL
              window.history.replaceState({}, "", "/")
            }}
          />
        </div>
      )
    }

    return (
      <div className="flex h-svh flex-col items-center justify-center overflow-hidden p-4 md:p-6" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 30%, #0f2460 60%, #1a3a7a 100%)" }}>
        {emailVerificationState.status !== "idle" ? (
          <div className="mb-4 w-full max-w-sm rounded-xl border bg-card p-4 text-sm md:max-w-4xl">
            <p className="font-medium">Email verification</p>
            <p className="mt-1 text-muted-foreground">
              {emailVerificationState.message ?? "Preparing verification..."}
            </p>
          </div>
        ) : null}
        <div className="w-full max-w-sm md:max-w-4xl">
          {authMode === "login" ? (
            <LoginForm
              onFormSubmit={handleLogin}
              loading={loading}
              errors={authErrors}
              info={authInfo}
              onSwitchToSignup={() => {
                setAuthMode("signup")
                setAuthErrors([])
                setAuthInfo(null)
              }}
              onForgotPassword={() => setForgotPasswordOpen(true)}
            />
          ) : (
            <SignupForm
              onFormSubmit={handleSignup}
              loading={loading}
              errors={authErrors}
              info={authInfo}
              onSwitchToLogin={() => {
                setAuthMode("login")
                setAuthErrors([])
              }}
            />
          )}
        </div>
        <ForgotPasswordModal
          open={forgotPasswordOpen}
          onOpenChange={setForgotPasswordOpen}
        />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={sidebarUser}
        activePath={activePath}
        onNavigate={(path) => setActivePath(path)}
        onItemHover={handleSidebarItemHover}
        loading={loading && Boolean(accessToken) && !dashboard}
        pendingConsentCount={pendingConsentCount}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" onClick={(event) => event.preventDefault()}>
                    {breadcrumb.parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            {accessToken ? (
              <ProfileMenu
                userName={sidebarUser?.name ?? "User"}
                userEmail={sidebarUser?.email ?? "user@email.com"}
                onOpenProfile={() => setProfileModalOpen(true)}
                onLogout={handleLogout}
                loading={loading && Boolean(accessToken) && !dashboard}
              />
            ) : null}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {dashboardError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              {dashboardError}
            </div>
          ) : null}

          {(dashboard?.fetchErrors.length ?? 0) > 0 ? (
            <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">Some sections returned warnings</p>
              <ul className="mt-2 list-disc pl-5">
                {dashboard?.fetchErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {loading && accessToken && !dashboard && !activePath.startsWith("/consent") ? (
            renderSkeletonDashboard()
          ) : (
            <>
              {!activePath.startsWith("/emergency") && !activePath.startsWith("/consent") && !activePath.startsWith("/settings") ? (
                <div className={`grid auto-rows-min gap-4 ${activePath.startsWith("/appointments") ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {dashboard?.appointments.length ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Total appointment records</p>
                  </div>
                  {activePath.startsWith("/appointments") ? (
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="mt-2 text-2xl font-semibold">{pendingAppointments}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Waiting for doctor action</p>
                    </div>
                  ) : null}
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {upcomingAppointments}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Pending and confirmed</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      {activePath.startsWith("/appointments") ? "Closed" : "Medical Records"}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {activePath.startsWith("/appointments") ? closedAppointments : totalRecords}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {activePath.startsWith("/appointments")
                        ? "Completed, cancelled, rejected"
                        : "Encounters + observations"}
                    </p>
                  </div>
                </div>
              ) : null}

              {renderSection()}
            </>
          )}
        </div>
      </SidebarInset>
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        dashboard={dashboard}
        onSave={async (updates) => {
          if (!accessToken) return
          const response = await fetch(`${API_BASE_URL}/api/profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify(updates),
          })
          if (!response.ok) {
            throw new Error("Failed to update profile")
          }
          // Refresh dashboard data after update
          const data = await getDashboardData(accessToken)
          setDashboard(data)
          setProfileModalOpen(false)
        }}
      />
      <Dialog
        open={Boolean(selectedRecord)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRecord(null)
          }
        }}
      >
        <DialogContent className="w-[96vw] sm:max-w-195 max-h-[85vh] overflow-y-auto">
          <DialogTitle>
            {selectedRecord?.type === "encounter" ? "Encounter Details" : "Observation Details"}
          </DialogTitle>
          {selectedRecord ? (
            <Suspense fallback={<div className="space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>}>
              <RecordDetailDialogContent
                selectedRecord={selectedRecord}
                formatDateTime={formatDateTime}
                formatFieldName={formatFieldName}
                formatRecordDetailValue={formatRecordDetailValue}
              />
            </Suspense>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Share Details Modal */}
      <Dialog open={shareDetailsModalOpen} onOpenChange={setShareDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Emergency Share Details</DialogTitle>

          {selectedShare && (
            <Suspense fallback={<div className="space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-56 w-full" /><Skeleton className="h-16 w-full" /></div>}>
              <EmergencyShareDetailsDialogContent
                selectedShare={selectedShare}
                accessLogs={accessLogs}
                loadingAccessLogs={loadingAccessLogs}
                copyToClipboard={copyToClipboard}
                close={() => setShareDetailsModalOpen(false)}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedAppointment)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedAppointment(null)
          }
        }}
      >
        <DialogContent className="w-[96vw] sm:max-w-195 max-h-[85vh] overflow-y-auto">
          <DialogTitle>Appointment Details</DialogTitle>
          {selectedAppointment ? (
            <Suspense fallback={<div className="space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>}>
              <AppointmentDetailDialogContent
                appointment={selectedAppointment}
                cancellingAppointmentId={cancellingAppointmentId}
                onCancel={handleCancelAppointment}
                onEdit={handleEditPendingAppointment}
                onClose={() => setSelectedAppointment(null)}
                canEditPendingAppointment={canEditPendingAppointment}
                formatFieldName={formatFieldName}
                formatDateTime={formatDateTime}
              />
            </Suspense>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Generate Emergency Share Modal */}
      <Dialog open={generateShareModalOpen} onOpenChange={setGenerateShareModalOpen}>
        <DialogContent className="w-[96vw] sm:max-w-125">
          <DialogTitle>Generate Emergency Link</DialogTitle>
          <Suspense fallback={<div className="space-y-2"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>}>
            <EmergencyLinkGenerationModalContent
              generatedShare={generatedShare}
              shareExpiryHours={shareExpiryHours}
              onShareExpiryChange={setShareExpiryHours}
              emergencyShareError={emergencyShareError}
              creatingShare={creatingShare}
              onGenerateShare={handleGenerateEmergencyShare}
              onClose={() => setGenerateShareModalOpen(false)}
              onResetShare={() => setGeneratedShare(null)}
              copyToClipboard={copyToClipboard}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

export default App
