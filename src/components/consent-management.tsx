import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getConsentRequests,
  listConsents,
  getConsentDetails,
  grantConsent,
  revokeConsent,
  rejectConsentRequest,
  requestConsent,
} from "@/lib/api/curanet"
import { getApiErrorMessages } from "@/lib/api/client"
import type { ConsentRequest, Consent, ConsentScope, AuditLogEntry } from "@/lib/api/types"
import { ShieldCheckIcon, AlertTriangleIcon, CheckCircle2Icon, XCircleIcon, ClockIcon, UserIcon, CalendarIcon, PlusCircleIcon, SendIcon, BarChart3Icon, FilterIcon, TrendingUpIcon, ActivityIcon } from "lucide-react"

interface ConsentManagementProps {
  token: string
  userRole: "patient" | "doctor" | "pharmacy" | "admin"
}

const SCOPE_LABELS: Record<ConsentScope, { label: string; description: string }> = {
  READ_BASIC: {
    label: "Basic Information",
    description: "Demographics, contact info, health ID",
  },
  READ_MEDICAL: {
    label: "Medical Information",
    description: "Diagnoses, medications, allergies, lab results",
  },
  READ_FULL: {
    label: "Full Medical History",
    description: "Complete medical records, encounters, observations",
  },
  WRITE: {
    label: "Write Access",
    description: "Ability to add records and observations",
  },
}

export function ConsentManagement({ token, userRole }: ConsentManagementProps) {
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<ConsentRequest[]>([])
  const [consents, setConsents] = useState<Consent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Grant consent modal state
  const [grantModalOpen, setGrantModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ConsentRequest | null>(null)
  const [grantingConsent, setGrantingConsent] = useState(false)
  const [selectedScope, setSelectedScope] = useState<ConsentScope[]>([])
  const [expiryOption, setExpiryOption] = useState<string>("no-expiry")
  const [customExpiryDate, setCustomExpiryDate] = useState<string>("")

  // Revoke consent modal state
  const [revokeModalOpen, setRevokeModalOpen] = useState(false)
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null)
  const [revokeReason, setRevokeReason] = useState("")
  const [revokingConsent, setRevokingConsent] = useState(false)

  // Reject request modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectingRequest, setRejectingRequest] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // View consent details modal state
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false)
  const [viewingConsent, setViewingConsent] = useState<Consent | null>(null)
  const [auditTrail, setAuditTrail] = useState<AuditLogEntry[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Provider request consent modal state
  const [requestConsentModalOpen, setRequestConsentModalOpen] = useState(false)
  const [requestingConsent, setRequestingConsent] = useState(false)
  const [patientHealthId, setPatientHealthId] = useState("")
  const [requestPurpose, setRequestPurpose] = useState("")
  const [requestMessage, setRequestMessage] = useState("")
  const [requestScope, setRequestScope] = useState<ConsentScope[]>([])
  const [requestExpiry, setRequestExpiry] = useState<string>("no-expiry")
  const [customRequestExpiry, setCustomRequestExpiry] = useState<string>("")

  // Phase 3: Filtering and analytics state
  const [historyFilter, setHistoryFilter] = useState<"all" | "revoked" | "expired">("all")
  const [historyDateRange, setHistoryDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const [historyProviderFilter, setHistoryProviderFilter] = useState<string>("")
  const [showHistoryFilters, setShowHistoryFilters] = useState(false)

  const isProvider = userRole === "doctor" || userRole === "pharmacy"

  // Scope presets for quick selection
  const SCOPE_PRESETS: Record<string, { label: string; scopes: ConsentScope[]; description: string }> = {
    basic: {
      label: "Basic Info Only",
      scopes: ["READ_BASIC"],
      description: "Demographics and contact information only"
    },
    standard: {
      label: "Standard Care",
      scopes: ["READ_BASIC", "READ_MEDICAL"],
      description: "Basic info + medical records for routine care"
    },
    full: {
      label: "Comprehensive Care",
      scopes: ["READ_BASIC", "READ_MEDICAL", "READ_FULL"],
      description: "Complete medical history for advanced care"
    },
    fullAccess: {
      label: "Full Access with Write",
      scopes: ["READ_BASIC", "READ_MEDICAL", "READ_FULL", "WRITE"],
      description: "Complete access including ability to add records"
    }
  }

  const formatDateTime = useCallback((dateString: string) => {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }, [])

  const formatRelativeTime = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (diff < 0) return "Expired"
    if (hours < 1) return "Less than 1 hour"
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""}`
    return `${days} day${days > 1 ? "s" : ""}`
  }, [])

  const loadConsentData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [requestsData, consentsData] = await Promise.all([
        getConsentRequests(token),
        listConsents(token),
      ])

      setRequests(requestsData.requests)
      setConsents(consentsData.consents)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to load consent data")[0]
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadConsentData()
  }, [loadConsentData])

  const handleOpenGrantModal = (request: ConsentRequest) => {
    setSelectedRequest(request)
    setSelectedScope(request.scope)
    setExpiryOption(request.requestedExpiry ? "custom" : "no-expiry")
    setCustomExpiryDate(
      request.requestedExpiry
        ? new Date(request.requestedExpiry).toISOString().slice(0, 16)
        : ""
    )
    setGrantModalOpen(true)
  }

  const handleGrantConsent = async () => {
    if (!selectedRequest) return

    try {
      setGrantingConsent(true)
      setError(null)

      let endTime: string | undefined
      if (expiryOption !== "no-expiry") {
        const date = new Date()
        switch (expiryOption) {
          case "1-week":
            date.setDate(date.getDate() + 7)
            break
          case "1-month":
            date.setMonth(date.getMonth() + 1)
            break
          case "3-months":
            date.setMonth(date.getMonth() + 3)
            break
          case "6-months":
            date.setMonth(date.getMonth() + 6)
            break
          case "1-year":
            date.setFullYear(date.getFullYear() + 1)
            break
          case "custom":
            if (customExpiryDate) {
              date.setTime(new Date(customExpiryDate).getTime())
            }
            break
        }
        endTime = date.toISOString()
      }

      await grantConsent(token, {
        requestId: selectedRequest.id,
        scope: selectedScope,
        endTime,
      })

      setSuccessMessage("Consent granted successfully")
      setGrantModalOpen(false)
      await loadConsentData()

      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to grant consent")[0]
      setError(message)
    } finally {
      setGrantingConsent(false)
    }
  }

  const handleOpenRevokeModal = (consent: Consent) => {
    setSelectedConsent(consent)
    setRevokeReason("")
    setRevokeModalOpen(true)
  }

  const handleRevokeConsent = async () => {
    if (!selectedConsent) return

    try {
      setRevokingConsent(true)
      setError(null)

      await revokeConsent(token, {
        consentId: selectedConsent.id,
        reason: revokeReason || undefined,
      })

      setSuccessMessage("Consent revoked successfully")
      setRevokeModalOpen(false)
      await loadConsentData()

      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to revoke consent")[0]
      setError(message)
    } finally {
      setRevokingConsent(false)
    }
  }

  const handleOpenRejectModal = (request: ConsentRequest) => {
    setSelectedRequest(request)
    setRejectReason("")
    setRejectModalOpen(true)
  }

  const handleRejectRequest = async () => {
    if (!selectedRequest) return

    try {
      setRejectingRequest(true)
      setError(null)

      await rejectConsentRequest(token, {
        requestId: selectedRequest.id,
        reason: rejectReason || undefined,
      })

      setSuccessMessage("Consent request rejected")
      setRejectModalOpen(false)
      await loadConsentData()

      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to reject request")[0]
      setError(message)
    } finally {
      setRejectingRequest(false)
    }
  }

  const handleViewConsentDetails = async (consent: Consent) => {
    try {
      setViewingConsent(consent)
      setViewDetailsModalOpen(true)
      setLoadingDetails(true)
      setError(null)

      const details = await getConsentDetails(token, consent.id)
      setAuditTrail(details.auditTrail)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to load consent details")[0]
      setError(message)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleOpenRequestConsentModal = () => {
    setPatientHealthId("")
    setRequestPurpose("")
    setRequestMessage("")
    setRequestScope([])
    setRequestExpiry("no-expiry")
    setCustomRequestExpiry("")
    setRequestConsentModalOpen(true)
  }

  const handleRequestConsent = async () => {
    if (!patientHealthId || !requestPurpose || requestScope.length === 0) {
      setError("Patient Health ID, purpose, and at least one permission are required")
      return
    }

    try {
      setRequestingConsent(true)
      setError(null)

      let requestedExpiry: string | undefined
      if (requestExpiry !== "no-expiry") {
        if (requestExpiry === "custom") {
          if (!customRequestExpiry) {
            setError("Custom expiry date is required")
            return
          }
          requestedExpiry = new Date(customRequestExpiry).toISOString()
        } else {
          const expiryDate = new Date()
          switch (requestExpiry) {
            case "1-week":
              expiryDate.setDate(expiryDate.getDate() + 7)
              break
            case "1-month":
              expiryDate.setMonth(expiryDate.getMonth() + 1)
              break
            case "3-months":
              expiryDate.setMonth(expiryDate.getMonth() + 3)
              break
            case "6-months":
              expiryDate.setMonth(expiryDate.getMonth() + 6)
              break
            case "1-year":
              expiryDate.setFullYear(expiryDate.getFullYear() + 1)
              break
          }
          requestedExpiry = expiryDate.toISOString()
        }
      }

      await requestConsent(token, {
        patientHealthId,
        scope: requestScope,
        purpose: requestPurpose,
        requestedExpiry,
        message: requestMessage || undefined,
      })

      setSuccessMessage("Consent request sent successfully")
      setRequestConsentModalOpen(false)
      await loadConsentData()

      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      const message = getApiErrorMessages(err, "Failed to send consent request")[0]
      setError(message)
    } finally {
      setRequestingConsent(false)
    }
  }

  const toggleRequestScope = (scope: ConsentScope) => {
    setRequestScope((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    )
  }

  const toggleScope = (scope: ConsentScope) => {
    setSelectedScope((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    )
  }

  const pendingRequests = isProvider 
    ? requests.filter((r) => r.status === "PENDING") 
    : requests.filter((r) => r.status === "PENDING")
  const sentRequests = isProvider ? requests : []
  const activeConsents = consents.filter((c) => c.status === "ACTIVE")
  const expiredConsents = consents.filter((c) => c.status === "EXPIRED" || c.status === "REVOKED")

  // Phase 3: Filtered history with date range and provider filters
  const filteredHistory = expiredConsents.filter((consent) => {
    // Status filter
    if (historyFilter === "revoked" && consent.status !== "REVOKED") return false
    if (historyFilter === "expired" && consent.status !== "EXPIRED") return false

    // Date range filter
    if (historyDateRange.start && new Date(consent.createdAt) < new Date(historyDateRange.start)) return false
    if (historyDateRange.end && new Date(consent.createdAt) > new Date(historyDateRange.end)) return false

    // Provider filter (for patients)
    if (!isProvider && historyProviderFilter) {
      const providerName = `${consent.provider.healthProfile?.firstName} ${consent.provider.healthProfile?.lastName}`.toLowerCase()
      if (!providerName.includes(historyProviderFilter.toLowerCase())) return false
    }

    // Patient filter (for providers)
    if (isProvider && historyProviderFilter) {
      const patientName = `${consent.patient.healthProfile?.firstName} ${consent.patient.healthProfile?.lastName}`.toLowerCase()
      if (!patientName.includes(historyProviderFilter.toLowerCase())) return false
    }

    return true
  })

  // Phase 3: Analytics calculations
  const analytics = {
    totalActiveConsents: activeConsents.length,
    totalPendingRequests: pendingRequests.length,
    totalRevokedConsents: consents.filter((c) => c.status === "REVOKED").length,
    totalExpiredConsents: consents.filter((c) => c.status === "EXPIRED").length,
    totalAccessCount: activeConsents.reduce((sum, c) => sum + c.accessCount, 0),
    averageAccessCount: activeConsents.length > 0 
      ? Math.round(activeConsents.reduce((sum, c) => sum + c.accessCount, 0) / activeConsents.length)
      : 0,
    recentlyAccessedCount: activeConsents.filter((c) => {
      if (!c.lastAccessed) return false
      const hoursSinceAccess = (new Date().getTime() - new Date(c.lastAccessed).getTime()) / (1000 * 60 * 60)
      return hoursSinceAccess < 24
    }).length,
    expiringCount: activeConsents.filter((c) => {
      if (!c.endTime) return false
      const hoursUntilExpiry = (new Date(c.endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)
      return hoursUntilExpiry > 0 && hoursUntilExpiry < 168 // Expiring within 7 days
    }).length
  }

  const applyPreset = (presetKey: string, isGrantModal: boolean = false) => {
    const preset = SCOPE_PRESETS[presetKey]
    if (isGrantModal) {
      setSelectedScope(preset.scopes)
    } else {
      setRequestScope(preset.scopes)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Consent Management</h1>
          <p className="text-sm text-muted-foreground">Loading consent data...</p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Consent Management</h1>
          <p className="text-sm text-muted-foreground">
            {isProvider 
              ? "Request and manage patient consent for data access" 
              : "Manage your health data access permissions"}
          </p>
        </div>
        {isProvider && (
          <Button onClick={handleOpenRequestConsentModal}>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Request Consent
          </Button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-5 w-5" />
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5" />
            {error}
          </div>
        </div>
      )}

      {/* Phase 3: Analytics Dashboard */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3Icon className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Overview</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Consents</p>
                <p className="mt-1 text-2xl font-bold">{analytics.totalActiveConsents}</p>
              </div>
              <ShieldCheckIcon className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isProvider ? "Sent Requests" : "Pending Requests"}
                </p>
                <p className="mt-1 text-2xl font-bold">{analytics.totalPendingRequests}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accesses</p>
                <p className="mt-1 text-2xl font-bold">{analytics.totalAccessCount}</p>
                <p className="text-xs text-muted-foreground">Avg: {analytics.averageAccessCount}/consent</p>
              </div>
              <ActivityIcon className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
                <p className="mt-1 text-2xl font-bold">{analytics.recentlyAccessedCount}</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-indigo-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-lg font-semibold">{analytics.expiringCount}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Within 7 days</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Revoked</p>
              <p className="text-lg font-semibold">{analytics.totalRevokedConsents}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">By patient/provider</p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-lg font-semibold">{analytics.totalExpiredConsents}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Time-based expiry</p>
          </Card>
        </div>
      </section>

      {/* Pending/Sent Requests Section */}
      {!isProvider ? (
        /* Patient view: Incoming consent requests */
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">
              Pending Requests ({pendingRequests.length})
            </h2>
          </div>

          {pendingRequests.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No pending consent requests
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {request.provider.healthProfile?.firstName}{" "}
                          {request.provider.healthProfile?.lastName}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {request.provider.role}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> {request.purpose}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {request.scope.filter(scope => scope in SCOPE_LABELS).map((scope) => (
                          <span
                            key={scope}
                            className="rounded bg-muted px-2 py-1 text-xs font-medium"
                          >
                            {SCOPE_LABELS[scope as ConsentScope].label}
                          </span>
                        ))}
                      </div>

                      {request.message && (
                        <p className="text-sm italic text-muted-foreground">
                          "{request.message}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Requested: {formatDateTime(request.createdAt)}</span>
                        <span>
                          Expires in: {formatRelativeTime(request.expiresAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleOpenGrantModal(request)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenRejectModal(request)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Provider view: Sent consent requests */
        <section>
          <div className="mb-4 flex items-center gap-2">
            <SendIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">
              Sent Requests ({sentRequests.length})
            </h2>
          </div>

          {sentRequests.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No consent requests sent yet
            </Card>
          ) : (
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {request.patient.healthProfile?.firstName}{" "}
                          {request.patient.healthProfile?.lastName}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          request.status === "PENDING"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                            : request.status === "APPROVED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {request.status}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>Purpose:</strong> {request.purpose}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {request.scope.filter(scope => scope in SCOPE_LABELS).map((scope) => (
                          <span
                            key={scope}
                            className="rounded bg-muted px-2 py-1 text-xs font-medium"
                          >
                            {SCOPE_LABELS[scope as ConsentScope].label}
                          </span>
                        ))}
                      </div>

                      {request.message && (
                        <p className="text-sm italic text-muted-foreground">
                          "{request.message}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Sent: {formatDateTime(request.createdAt)}</span>
                        {request.status === "PENDING" && (
                          <span>
                            Expires in: {formatRelativeTime(request.expiresAt)}
                          </span>
                        )}
                        {request.updatedAt && request.status !== "PENDING" && (
                          <span>Updated: {formatDateTime(request.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Granted Consents Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold">
            Granted Consents ({activeConsents.length})
          </h2>
        </div>

        {activeConsents.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No granted consents
          </Card>
        ) : (
          <div className="space-y-3">
            {activeConsents.map((consent) => (
              <Card 
                key={consent.id} 
                className="p-4 cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleViewConsentDetails(consent)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {consent.provider.healthProfile?.firstName}{" "}
                        {consent.provider.healthProfile?.lastName}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {consent.provider.role}
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                        ACTIVE
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      <strong>Purpose:</strong> {consent.purpose}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {consent.scope.filter(scope => scope in SCOPE_LABELS).map((scope) => (
                        <span
                          key={scope}
                          className="rounded bg-muted px-2 py-1 text-xs font-medium"
                        >
                          {SCOPE_LABELS[scope as ConsentScope].label}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Granted: {formatDateTime(consent.createdAt)}</span>
                      </div>
                      {consent.endTime && (
                        <span>Expires: {formatDateTime(consent.endTime)}</span>
                      )}
                      {!consent.endTime && (
                        <span className="text-orange-600 dark:text-orange-400">
                          No expiry set
                        </span>
                      )}
                      <span>Accessed {consent.accessCount} times</span>
                      {consent.lastAccessed && (
                        <span>
                          Last: {formatDateTime(consent.lastAccessed)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenRevokeModal(consent)
                    }}
                  >
                    Revoke
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* History Section */}
      {expiredConsents.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircleIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                History ({filteredHistory.length} of {expiredConsents.length})
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoryFilters(!showHistoryFilters)}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              {showHistoryFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Phase 3: History Filters */}
          {showHistoryFilters && (
            <Card className="mb-4 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Status</Label>
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value as "all" | "revoked" | "expired")}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="revoked">Revoked Only</option>
                    <option value="expired">Expired Only</option>
                  </select>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={historyDateRange.start}
                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, start: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={historyDateRange.end}
                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, end: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label>{isProvider ? "Patient Name" : "Provider Name"}</Label>
                  <Input
                    placeholder="Search by name..."
                    value={historyProviderFilter}
                    onChange={(e) => setHistoryProviderFilter(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {(historyFilter !== "all" || historyDateRange.start || historyDateRange.end || historyProviderFilter) && (
                  <div className="md:col-span-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHistoryFilter("all")
                        setHistoryDateRange({ start: "", end: "" })
                        setHistoryProviderFilter("")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {filteredHistory.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No consents match the selected filters
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((consent) => (
                <Card key={consent.id} className="p-4 opacity-60">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {isProvider 
                            ? `${consent.patient.healthProfile?.firstName} ${consent.patient.healthProfile?.lastName}`
                            : `${consent.provider.healthProfile?.firstName} ${consent.provider.healthProfile?.lastName}`
                          }
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            consent.status === "REVOKED"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {consent.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {consent.purpose}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Granted: {formatDateTime(consent.createdAt)}</span>
                        <span>
                          {consent.status === "REVOKED" && consent.revokedAt
                            ? `Revoked: ${formatDateTime(consent.revokedAt)}`
                            : `Expired: ${consent.endTime ? formatDateTime(consent.endTime) : "N/A"}`}
                        </span>
                        <span>Accessed {consent.accessCount} times</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Grant Consent Modal */}
      <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grant Consent</DialogTitle>
            <DialogDescription>
              Review and approve this consent request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label>Provider</Label>
                <p className="text-sm">
                  {selectedRequest.provider.healthProfile?.firstName}{" "}
                  {selectedRequest.provider.healthProfile?.lastName} (
                  {selectedRequest.provider.role})
                </p>
              </div>

              <div>
                <Label>Purpose</Label>
                <p className="text-sm">{selectedRequest.purpose}</p>
              </div>

              {selectedRequest.message && (
                <div>
                  <Label>Message</Label>
                  <p className="text-sm italic">"{selectedRequest.message}"</p>
                </div>
              )}

              <div>
                <Label>Access Permissions</Label>
                
                {/* Phase 3: Scope Presets */}
                <div className="mt-2 mb-3 flex flex-wrap gap-2">
                  <p className="w-full text-xs text-muted-foreground mb-1">Quick presets:</p>
                  {Object.entries(SCOPE_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(key, true)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-2 space-y-2">
                  {(Object.keys(SCOPE_LABELS) as ConsentScope[]).map((scope) => (
                    <label
                      key={scope}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedScope.includes(scope)}
                        onChange={() => toggleScope(scope)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {SCOPE_LABELS[scope].label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {SCOPE_LABELS[scope].description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Expiry</Label>
                <div className="mt-2 space-y-2">
                  <select
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="no-expiry">No expiry (manual revoke only)</option>
                    <option value="1-week">1 week</option>
                    <option value="1-month">1 month</option>
                    <option value="3-months">3 months</option>
                    <option value="6-months">6 months</option>
                    <option value="1-year">1 year</option>
                    <option value="custom">Custom date</option>
                  </select>

                  {expiryOption === "custom" && (
                    <Input
                      type="datetime-local"
                      value={customExpiryDate}
                      onChange={(e) => setCustomExpiryDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGrantModalOpen(false)}
                  disabled={grantingConsent}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGrantConsent}
                  disabled={grantingConsent || selectedScope.length === 0}
                >
                  {grantingConsent ? "Granting..." : "Grant Consent"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Revoke Consent Modal */}
      <Dialog open={revokeModalOpen} onOpenChange={setRevokeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Consent</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this consent? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {selectedConsent && (
            <div className="space-y-4">
              <div>
                <p className="text-sm">
                  <strong>Provider:</strong>{" "}
                  {selectedConsent.provider.healthProfile?.firstName}{" "}
                  {selectedConsent.provider.healthProfile?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedConsent.purpose}
                </p>
              </div>

              <div>
                <Label htmlFor="revoke-reason">Reason (optional)</Label>
                <Input
                  id="revoke-reason"
                  placeholder="Why are you revoking this consent?"
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRevokeModalOpen(false)}
                  disabled={revokingConsent}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRevokeConsent}
                  disabled={revokingConsent}
                >
                  {revokingConsent ? "Revoking..." : "Revoke Consent"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Request Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Consent Request</DialogTitle>
            <DialogDescription>
              Decline this consent request from the provider
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-sm">
                  <strong>Provider:</strong>{" "}
                  {selectedRequest.provider.healthProfile?.firstName}{" "}
                  {selectedRequest.provider.healthProfile?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.purpose}
                </p>
              </div>

              <div>
                <Label htmlFor="reject-reason">Reason (optional)</Label>
                <Input
                  id="reject-reason"
                  placeholder="Why are you rejecting this request?"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectModalOpen(false)}
                  disabled={rejectingRequest}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectRequest}
                  disabled={rejectingRequest}
                >
                  {rejectingRequest ? "Rejecting..." : "Reject Request"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Consent Details Modal */}
      <Dialog open={viewDetailsModalOpen} onOpenChange={setViewDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consent Details</DialogTitle>
            <DialogDescription>
              View complete consent information and access history
            </DialogDescription>
          </DialogHeader>

          {viewingConsent && (
            <div className="space-y-6">
              {/* Provider Information */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Provider Information</h3>
                <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {viewingConsent.provider.healthProfile?.firstName}{" "}
                      {viewingConsent.provider.healthProfile?.lastName}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {viewingConsent.provider.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Health ID: {viewingConsent.provider.healthId}
                  </p>
                  {viewingConsent.provider.email && (
                    <p className="text-sm text-muted-foreground">
                      Email: {viewingConsent.provider.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Consent Status */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Status</h3>
                <div className="rounded-lg bg-muted/50 p-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                    viewingConsent.status === "ACTIVE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : viewingConsent.status === "REVOKED"
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {viewingConsent.status}
                  </span>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Purpose</h3>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">{viewingConsent.purpose}</p>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Granted Permissions</h3>
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  {viewingConsent.scope.filter(scope => scope in SCOPE_LABELS).map((scope) => (
                    <div key={scope} className="flex gap-2">
                      <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">
                          {SCOPE_LABELS[scope as ConsentScope].label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {SCOPE_LABELS[scope as ConsentScope].description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Timeline</h3>
                <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Granted:</span>
                    <span className="font-medium">{formatDateTime(viewingConsent.createdAt)}</span>
                  </div>
                  {viewingConsent.endTime ? (
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium">{formatDateTime(viewingConsent.endTime)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-orange-500" />
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        No expiry date set
                      </span>
                    </div>
                  )}
                  {viewingConsent.revokedAt && (
                    <div className="flex items-center gap-2">
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">Revoked:</span>
                      <span className="font-medium">{formatDateTime(viewingConsent.revokedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Access Statistics */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Access Statistics</h3>
                <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Accesses:</span>
                    <span className="font-semibold text-lg">{viewingConsent.accessCount}</span>
                  </div>
                  {viewingConsent.lastAccessed && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Accessed:</span>
                      <span className="font-medium">{formatDateTime(viewingConsent.lastAccessed)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Activity History</h3>
                {loadingDetails ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : auditTrail.length > 0 ? (
                  <div className="rounded-lg bg-muted/50 p-3 space-y-3 max-h-64 overflow-y-auto">
                    {auditTrail.map((entry) => (
                      <div key={entry.id} className="text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium">{entry.action}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(entry.timestamp)}
                            </div>
                            {entry.ipAddress && (
                              <div className="text-xs text-muted-foreground">
                                IP: {entry.ipAddress}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {entry.accessedBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/50 p-6 text-center text-sm text-muted-foreground">
                    No activity history available
                  </div>
                )}
              </div>

              {/* Actions */}
              {viewingConsent.status === "ACTIVE" && (
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewDetailsModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewDetailsModalOpen(false)
                      handleOpenRevokeModal(viewingConsent)
                    }}
                  >
                    Revoke Consent
                  </Button>
                </div>
              )}
              {viewingConsent.status !== "ACTIVE" && (
                <div className="flex justify-end pt-2 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewDetailsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Consent Modal (Provider Only) */}
      {isProvider && (
        <Dialog open={requestConsentModalOpen} onOpenChange={setRequestConsentModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Patient Consent</DialogTitle>
              <DialogDescription>
                Request permission to access a patient's health data
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="patient-health-id">Patient Health ID *</Label>
                <Input
                  id="patient-health-id"
                  placeholder="Enter patient's health ID"
                  value={patientHealthId}
                  onChange={(e) => setPatientHealthId(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="request-purpose">Purpose *</Label>
                <Input
                  id="request-purpose"
                  placeholder="Why do you need access to this patient's data?"
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Requested Permissions *</Label>
                
                {/* Phase 3: Scope Presets */}
                <div className="mt-2 mb-3 flex flex-wrap gap-2">
                  <p className="w-full text-xs text-muted-foreground mb-1">Quick presets:</p>
                  {Object.entries(SCOPE_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(key, false)}
                      className="text-xs"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-2 space-y-2">
                  {(Object.keys(SCOPE_LABELS) as ConsentScope[]).map((scope) => (
                    <label
                      key={scope}
                      className="flex items-start gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={requestScope.includes(scope)}
                        onChange={() => toggleRequestScope(scope)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {SCOPE_LABELS[scope].label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {SCOPE_LABELS[scope].description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Requested Consent Duration</Label>
                <div className="mt-2 space-y-2">
                  <select
                    value={requestExpiry}
                    onChange={(e) => setRequestExpiry(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="no-expiry">No expiry (until revoked)</option>
                    <option value="1-week">1 Week</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                    <option value="1-year">1 Year</option>
                    <option value="custom">Custom date</option>
                  </select>

                  {requestExpiry === "custom" && (
                    <Input
                      type="datetime-local"
                      value={customRequestExpiry}
                      onChange={(e) => setCustomRequestExpiry(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="request-message">Message (Optional)</Label>
                <Input
                  id="request-message"
                  placeholder="Additional message for the patient"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRequestConsentModalOpen(false)}
                  disabled={requestingConsent}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestConsent}
                  disabled={requestingConsent || !patientHealthId || !requestPurpose || requestScope.length === 0}
                >
                  {requestingConsent ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
