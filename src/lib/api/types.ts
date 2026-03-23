export type UserRole = "patient" | "doctor" | "pharmacy" | "admin"

export type LoginResponse = {
  message: string
  accessToken: string
  refreshToken?: string
  user: {
    healthId: string
    email: string | null
    phone: string | null
    role: UserRole
    status: string
    createdAt: string
    updatedAt: string
  }
}

export type RegisterRequest = {
  name: string
  email?: string
  phone?: string
  password: string
  role: UserRole
}

export type RegisterResponse = {
  message: string
  user: {
    healthId: string
    email: string | null
    phone: string | null
    role: UserRole
    status: string
    createdAt: string
  }
  devVerificationToken?: string
}

export type ProfileResponse = {
  success: true
  data: {
    user: {
      healthId: string
      email: string | null
      phone: string | null
      role: UserRole
      status: string
      isVerified: boolean
      createdAt: string
      updatedAt: string
    }
    profile: {
      id: string
      userId: string
      displayName: string | null
      dateOfBirth: string | null
      gender: string | null
      bloodGroup: string | null
      allergies: unknown
      medications: unknown
      emergencyContact: string | null
      emergencyPhone: string | null
      address: unknown
      isActive: boolean
      verifiedAt: string | null
      createdAt: string
      updatedAt: string
      firstName: string
      lastName: string
    } | null
  }
}

export type UpdateProfilePayload = {
  firstName?: string
  lastName?: string
  displayName?: string
  email?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  bloodGroup?: string
  allergies?: string
  medications?: string
}

export type UpdateProfileResponse = {
  success: true
  data: {
    profile: ProfileResponse["data"]["profile"]
    message: string
  }
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type SecurityActionResponse = {
  success: true
  message: string
}

export type SecuritySession = {
  id: string
  deviceInfo: string | null
  deviceId: string | null
  ipAddress: string | null
  userAgent: string | null
  location: string | null
  browser: string | null
  os: string | null
  isTrusted: boolean
  lastActivity: string
  expiresAt: string
  createdAt: string
  isCurrent: boolean
}

export type SecurityRefreshTokenSession = {
  id: string
  device: string | null
  lastUsed: string
  expiresAt: string
  createdAt: string
}

export type SecuritySessionsResponse = {
  success: true
  data: {
    sessions: SecuritySession[]
    refreshTokens: SecurityRefreshTokenSession[]
  }
}

export type RecoveryOptionsResponse = {
  success: true
  data: {
    primaryEmail: string | null
    primaryPhone: string | null
    emergencyContact: string | null
    emergencyPhone: string | null
  }
}

export type UpdateRecoveryOptionsPayload = {
  backupEmail?: string
  backupPhone?: string
}

export type UpdateRecoveryOptionsResponse = {
  success: true
  message: string
  data: {
    backupEmail?: string
    backupPhone?: string
  }
}

export type PrivacyConsentSettings = {
  dataSharing: boolean
  researchParticipation: boolean
  marketingCommunications: boolean
  thirdPartyIntegrations: boolean
  emergencyAccess: boolean
  analyticsOptOut: boolean
}

export type PrivacySettingsShape = {
  profileVisibility: "private" | "providers-only" | "network"
  recordAccess: "authorized-providers"
  communicationPreferences: "secure-portal"
  auditTrail: boolean
}

export type UserConsentSettingsResponse = {
  consentSettings: PrivacyConsentSettings
  privacySettings: PrivacySettingsShape
}

export type UpdateUserConsentSettingsPayload = {
  consentSettings: Partial<PrivacyConsentSettings>
  privacySettings: Partial<PrivacySettingsShape>
}

export type NotificationSettingsResponse = {
  id: string
  userId: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  appointmentReminders: boolean
  recordUpdates: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  billingNotifications: boolean
  labResults: boolean
  prescriptionUpdates: boolean
  frequency: "IMMEDIATE" | "HOURLY" | "DAILY" | "WEEKLY" | "NEVER"
  quietHoursStart: string | null
  quietHoursEnd: string | null
  timezone: string
  createdAt: string
  updatedAt: string
}

export type UpdateNotificationSettingsPayload = Partial<
  Pick<
    NotificationSettingsResponse,
    | "emailNotifications"
    | "smsNotifications"
    | "pushNotifications"
    | "appointmentReminders"
    | "recordUpdates"
    | "securityAlerts"
    | "marketingEmails"
    | "billingNotifications"
    | "labResults"
    | "prescriptionUpdates"
    | "frequency"
    | "quietHoursStart"
    | "quietHoursEnd"
    | "timezone"
  >
>

export type ContactRequestPayload = {
  fullName: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
}

export type ContactRequestResponse = {
  success: boolean
  message: string
}

export type Appointment = {
  id: string
  patientId: string
  doctorId: string
  requestedTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED"
  reasonForVisit: string | null
  appointmentType?: string
  duration?: number
  createdAt?: string
  updatedAt?: string
  confirmedAt?: string | null
  rejectedAt?: string | null
  cancelledAt?: string | null
  doctor?: unknown
  patientNotes?: string | null
  doctorNotes?: string | null
}

export type PatientAppointmentsResponse = {
  success: true
  data: {
    appointments: Appointment[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export type DoctorSearchResponse = {
  success: true
  data: {
    doctors: Array<{
      healthId: string
      email: string | null
      healthProfile: {
        firstName: string
        lastName: string
        displayName: string | null
      }
    }>
  }
}

export type RequestAppointmentPayload = {
  doctorId: string
  requestedTime: string
  reasonForVisit?: string
  patientNotes?: string
  appointmentType?: string
  duration?: number
}

export type RequestAppointmentResponse = {
  success: true
  data: {
    appointment: Appointment
  }
}

export type UpdateAppointmentPayload = {
  requestedTime?: string
  reasonForVisit?: string
}

export type UpdateAppointmentResponse = {
  success: true
  data: {
    appointment: Appointment
    message: string
  }
}

export type EncountersResponse = {
  encounters: Array<{
    id: string
    patientId: string
    providerId: string
    type: string
    reason: string | null
    startTime: string
  }>
}

export type ObservationsResponse = {
  observations: Array<{
    id: string
    patientId: string
    code: string
    recordedAt: string
  }>
}

export type EmergencyCardResponse = {
  success: true
  data: {
    health_id: string
    name: string
    blood_group: string
    allergies: string
    chronic_conditions: string
    emergency_contact: string
    current_medications: string
    phone: string
    created_at: string
  }
}

export type EmergencyShare = {
  id: string
  shareId: string
  shortUrl: string | null
  scope: string[]
  expiresAt: string
  createdAt: string
  used: boolean
  usedAt: string | null
  accessedBy: string | null
  accessCount: number
  lastAccessedAt: string | null
}

export type EmergencySharesResponse = {
  success: true
  data: {
    active_shares: EmergencyShare[]
    used_shares: EmergencyShare[]
    total: number
  }
}

export type CreateEmergencySharePayload = {
  expires_in_seconds?: number
  scope?: string[]
}

export type CreateEmergencyShareResponse = {
  success: true
  data: {
    share_id: string
    token: string
    short_url: string
    expires_at: string
    expires_in_seconds: number
    scope: string[]
    qr_data: string
  }
}

export type PublicEmergencyAccessResponse = {
  success: true
  emergency_access: true
  accessed_at: string
  data: {
    emergency_access_notice: string
    health_id: string
    basic_info?: {
      name: string
      health_id: string
      phone: string
    }
    blood_group?: string
    allergies?: string
    chronic_conditions?: string
    emergency_contact?: string
    current_medications?: string
    medical_conditions?: string
  }
  warning: string
  scope: string[]
  accessCount?: number
  lastAccessedAt?: string
}

export type EmergencyAccessLog = {
  id: string
  accessedAt: string
  ipAddress: string | null
  userAgent: string | null
  scope: string[]
}

export type ShareAccessLogsResponse = {
  success: true
  data: {
    shareId: string
    shortUrl: string | null
    scope: string[]
    expiresAt: string
    createdAt: string
    accessCount: number
    lastAccessedAt: string | null
    accessLogs: EmergencyAccessLog[]
  }
}

// Consent Management Types
export type ConsentScope = 
  | 'READ_BASIC' 
  | 'READ_MEDICAL' 
  | 'READ_FULL' 
  | 'WRITE'

export type ConsentStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'DENIED'

export type ConsentRequest = {
  id: string
  patientId: string
  providerId: string
  scope: ConsentScope[]
  purpose: string
  requestedExpiry: string | null
  message: string | null
  expiresAt: string
  createdAt: string
  updatedAt?: string | null
  reviewedAt: string | null
  status: RequestStatus
  provider: {
    healthId: string
    email: string | null
    role: string
    healthProfile: {
      firstName: string
      lastName: string
    } | null
  }
  patient: {
    healthId: string
    email: string | null
    healthProfile: {
      firstName: string
      lastName: string
    } | null
  }
}

export type Consent = {
  id: string
  patientId: string
  providerId: string
  status: ConsentStatus
  scope: ConsentScope[]
  purpose: string
  createdAt: string
  revokedAt: string | null
  endTime: string | null
  accessCount: number
  lastAccessed: string | null
  provider: {
    healthId: string
    email: string | null
    role: string
    healthProfile: {
      firstName: string
      lastName: string
    } | null
  }
  patient: {
    healthId: string
    email: string | null
    healthProfile: {
      firstName: string
      lastName: string
    } | null
  }
}

export type AuditLogEntry = {
  id: string
  healthId: string
  action: string
  details: Record<string, unknown>
  ipAddress: string | null
  userAgent: string | null
  timestamp: string
  accessedBy: string
}

export type ConsentRequestsResponse = {
  requests: ConsentRequest[]
}

export type ConsentsResponse = {
  consents: Consent[]
}

export type ConsentDetailsResponse = {
  consent: Consent
  auditTrail: AuditLogEntry[]
}

export type GrantConsentPayload = {
  requestId?: string
  providerId?: string
  scope?: ConsentScope[]
  purpose?: string
  endTime?: string
}

export type GrantConsentResponse = {
  message: string
  consent: Consent
}

export type RevokeConsentPayload = {
  consentId: string
  reason?: string
}

export type RevokeConsentResponse = {
  message: string
  consent: Consent
}

export type RejectConsentRequestPayload = {
  requestId: string
  reason?: string
}

export type RejectConsentRequestResponse = {
  message: string
  request: ConsentRequest
}

export type RequestConsentPayload = {
  patientHealthId: string
  scope: ConsentScope[]
  purpose: string
  requestedExpiry?: string
  message?: string
}

export type RequestConsentResponse = {
  message: string
  request: ConsentRequest
}

export type DashboardData = {
  profile: ProfileResponse["data"] | null
  appointments: Appointment[]
  encounters: EncountersResponse["encounters"]
  observations: ObservationsResponse["observations"]
  encountersCount: number
  observationsCount: number
  emergencyCard: EmergencyCardResponse["data"] | null
  fetchErrors: string[]
}
