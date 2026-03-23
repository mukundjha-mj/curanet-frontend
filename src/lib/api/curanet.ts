import { apiRequest } from "@/lib/api/client"
import type {
  ChangePasswordPayload,
  ConsentDetailsResponse,
  ConsentRequestsResponse,
  ConsentsResponse,
  CreateEmergencySharePayload,
  CreateEmergencyShareResponse,
  DashboardData,
  DoctorSearchResponse,
  EmergencyCardResponse,
  EmergencySharesResponse,
  EncountersResponse,
  GrantConsentPayload,
  GrantConsentResponse,
  LoginResponse,
  ObservationsResponse,
  PatientAppointmentsResponse,
  NotificationSettingsResponse,
  ProfileResponse,
  PublicEmergencyAccessResponse,
  RegisterRequest,
  RegisterResponse,
  RecoveryOptionsResponse,
  RejectConsentRequestPayload,
  RejectConsentRequestResponse,
  RequestConsentPayload,
  RequestConsentResponse,
  RequestAppointmentPayload,
  RequestAppointmentResponse,
  SecurityActionResponse,
  SecuritySessionsResponse,
  RevokeConsentPayload,
  RevokeConsentResponse,
  ShareAccessLogsResponse,
  UpdateAppointmentPayload,
  UpdateAppointmentResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UpdateRecoveryOptionsPayload,
  UpdateRecoveryOptionsResponse,
  UpdateUserConsentSettingsPayload,
  UserConsentSettingsResponse,
  UpdateNotificationSettingsPayload,
  ContactRequestPayload,
  ContactRequestResponse,
} from "@/lib/api/types"

export async function loginWithEmail(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: {
      email,
      password,
      platform: "web",
    },
  })
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: payload,
  })
}

export async function refreshAccessToken(refreshToken?: string | null): Promise<string> {
  const response = await apiRequest<{ accessToken: string; refreshToken?: string }>("/api/auth/refresh", {
    method: "POST",
    body: refreshToken ? { refreshToken, platform: "web" } : { platform: "web" },
  })

  return response.accessToken
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>("/api/profile", { token })
}

export async function updateProfile(
  token: string,
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>("/api/profile", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function changePassword(
  token: string,
  payload: ChangePasswordPayload
): Promise<SecurityActionResponse> {
  return apiRequest<SecurityActionResponse>("/api/security/change-password", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function listSecuritySessions(token: string): Promise<SecuritySessionsResponse> {
  return apiRequest<SecuritySessionsResponse>("/api/security/sessions", { token })
}

export async function revokeSecuritySession(
  token: string,
  sessionId: string
): Promise<SecurityActionResponse> {
  return apiRequest<SecurityActionResponse>(`/api/security/sessions/${sessionId}`, {
    method: "DELETE",
    token,
  })
}

export async function revokeAllOtherSecuritySessions(token: string): Promise<SecurityActionResponse> {
  return apiRequest<SecurityActionResponse>("/api/security/sessions/revoke-all", {
    method: "POST",
    token,
  })
}

export async function getRecoveryOptions(token: string): Promise<RecoveryOptionsResponse> {
  return apiRequest<RecoveryOptionsResponse>("/api/security/recovery-options", { token })
}

export async function updateRecoveryOptions(
  token: string,
  payload: UpdateRecoveryOptionsPayload
): Promise<UpdateRecoveryOptionsResponse> {
  return apiRequest<UpdateRecoveryOptionsResponse>("/api/security/recovery-options", {
    method: "PUT",
    token,
    body: payload,
  })
}

export async function getUserConsentSettings(token: string): Promise<UserConsentSettingsResponse> {
  return apiRequest<UserConsentSettingsResponse>("/api/user/consent-settings", { token })
}

export async function updateUserConsentSettings(
  token: string,
  payload: UpdateUserConsentSettingsPayload
): Promise<UserConsentSettingsResponse> {
  return apiRequest<UserConsentSettingsResponse>("/api/user/consent-settings", {
    method: "PUT",
    token,
    body: payload,
  })
}

export async function getNotificationSettings(token: string): Promise<NotificationSettingsResponse> {
  return apiRequest<NotificationSettingsResponse>("/api/user/settings/notifications", { token })
}

export async function updateNotificationSettings(
  token: string,
  payload: UpdateNotificationSettingsPayload
): Promise<NotificationSettingsResponse> {
  return apiRequest<NotificationSettingsResponse>("/api/user/settings/notifications", {
    method: "PUT",
    token,
    body: payload,
  })
}

export async function submitContactRequest(
  payload: ContactRequestPayload
): Promise<ContactRequestResponse> {
  return apiRequest<ContactRequestResponse>("/api/contact", {
    method: "POST",
    body: payload,
  })
}

export async function getPatientAppointments(token: string): Promise<PatientAppointmentsResponse> {
  return apiRequest<PatientAppointmentsResponse>("/api/appointments/patient?limit=20&page=1", { token })
}

export async function getDoctorAppointments(token: string): Promise<PatientAppointmentsResponse> {
  return apiRequest<PatientAppointmentsResponse>("/api/appointments/doctor?limit=20&page=1", { token })
}

export async function searchDoctors(token: string, query = ""): Promise<DoctorSearchResponse> {
  const encoded = encodeURIComponent(query.trim())
  const suffix = encoded.length > 0 ? `?search=${encoded}&limit=30` : "?limit=30"
  return apiRequest<DoctorSearchResponse>(`/api/appointments/doctors${suffix}`, { token })
}

export async function requestAppointment(
  token: string,
  payload: RequestAppointmentPayload
): Promise<RequestAppointmentResponse> {
  return apiRequest<RequestAppointmentResponse>("/api/appointments/request", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function updateAppointment(
  token: string,
  appointmentId: string,
  payload: UpdateAppointmentPayload
): Promise<UpdateAppointmentResponse> {
  return apiRequest<UpdateAppointmentResponse>(`/api/appointments/${appointmentId}`, {
    method: "PUT",
    token,
    body: payload,
  })
}

export async function cancelAppointment(
  token: string,
  appointmentId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/api/appointments/${appointmentId}/cancel`,
    {
      method: "POST",
      token,
    }
  )
}

export async function getEncounters(token: string): Promise<EncountersResponse> {
  return apiRequest<EncountersResponse>("/api/records/encounters/list", {
    method: "POST",
    token,
    body: {
      limit: "50",
      offset: "0",
    },
  })
}

export async function getObservations(token: string): Promise<ObservationsResponse> {
  return apiRequest<ObservationsResponse>("/api/records/observations/list", {
    method: "POST",
    token,
    body: {
      limit: "50",
      offset: "0",
    },
  })
}

export async function getEmergencyCard(token: string): Promise<EmergencyCardResponse> {
  return apiRequest<EmergencyCardResponse>("/api/emergency/card", { token })
}

export async function createEmergencyShare(
  token: string,
  payload: CreateEmergencySharePayload
): Promise<CreateEmergencyShareResponse> {
  return apiRequest<CreateEmergencyShareResponse>("/api/emergency/share", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function listEmergencyShares(token: string): Promise<EmergencySharesResponse> {
  return apiRequest<EmergencySharesResponse>("/api/emergency/shares", { token })
}

export async function revokeEmergencyShare(
  token: string,
  shareId: string
): Promise<{ success: true; message: string }> {
  return apiRequest<{ success: true; message: string }>(
    `/api/emergency/share/${shareId}`,
    {
      method: "DELETE",
      token,
    }
  )
}

export async function getShareAccessLogs(
  token: string,
  shareId: string
): Promise<ShareAccessLogsResponse> {
  return apiRequest<ShareAccessLogsResponse>(
    `/api/emergency/share/${shareId}/logs`,
    { token }
  )
}

export async function accessPublicEmergencyShare(token: string): Promise<PublicEmergencyAccessResponse> {
  return apiRequest<PublicEmergencyAccessResponse>(`/one/${token}`, {
    method: "GET",
  })
}

export async function getDashboardData(token: string): Promise<DashboardData> {
  const profileResult = await getProfile(token)
  const role = profileResult.data.user.role

  const fetchErrors: string[] = []

  const appointmentsResult =
    role === "patient"
      ? await getPatientAppointments(token)
      : await getDoctorAppointments(token)

  const [encountersResult, observationsResult, emergencyResult] = await Promise.allSettled([
    role === "patient" ? getEncounters(token) : Promise.resolve({ encounters: [] }),
    role === "patient" ? getObservations(token) : Promise.resolve({ observations: [] }),
    getEmergencyCard(token),
  ])

  const appointments = appointmentsResult.data.appointments

  const encountersCount =
    encountersResult.status === "fulfilled"
      ? encountersResult.value.encounters.length
      : 0

  const encounters =
    encountersResult.status === "fulfilled"
      ? encountersResult.value.encounters
      : []

  const observationsCount =
    observationsResult.status === "fulfilled"
      ? observationsResult.value.observations.length
      : 0

  const observations =
    observationsResult.status === "fulfilled"
      ? observationsResult.value.observations
      : []

  const emergencyCard =
    emergencyResult.status === "fulfilled"
      ? emergencyResult.value.data
      : null

  if (encountersResult.status === "rejected") {
    fetchErrors.push(`Encounters: ${encountersResult.reason instanceof Error ? encountersResult.reason.message : "request failed"}`)
  }
  if (observationsResult.status === "rejected") {
    fetchErrors.push(`Observations: ${observationsResult.reason instanceof Error ? observationsResult.reason.message : "request failed"}`)
  }
  if (emergencyResult.status === "rejected") {
    fetchErrors.push(`Emergency card: ${emergencyResult.reason instanceof Error ? emergencyResult.reason.message : "request failed"}`)
  }
  if (role !== "patient") {
    fetchErrors.push("Medical record lists are patient-scoped in current backend APIs; showing role-compatible data.")
  }

  return {
    profile: profileResult.data,
    appointments,
    encounters,
    observations,
    encountersCount,
    observationsCount,
    emergencyCard,
    fetchErrors,
  }
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/request-password-reset", {
    method: "POST",
    body: { email },
  })
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  })
}

export async function verifyEmailToken(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/verify-email", {
    method: "POST",
    body: { token },
  })
}

// Consent Management APIs
export async function getConsentRequests(token: string, status?: string): Promise<ConsentRequestsResponse> {
  const query = status ? `?status=${status}` : ""
  return apiRequest<ConsentRequestsResponse>(`/api/consent/requests${query}`, { token })
}

export async function listConsents(token: string, activeOnly?: boolean): Promise<ConsentsResponse> {
  const query = activeOnly ? "?activeOnly=true" : ""
  return apiRequest<ConsentsResponse>(`/api/consent${query}`, { token })
}

export async function getConsentDetails(token: string, consentId: string): Promise<ConsentDetailsResponse> {
  return apiRequest<ConsentDetailsResponse>(`/api/consent/${consentId}`, { token })
}

export async function grantConsent(token: string, payload: GrantConsentPayload): Promise<GrantConsentResponse> {
  return apiRequest<GrantConsentResponse>("/api/consent/grant", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function revokeConsent(token: string, payload: RevokeConsentPayload): Promise<RevokeConsentResponse> {
  return apiRequest<RevokeConsentResponse>("/api/consent/revoke", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function rejectConsentRequest(
  token: string,
  payload: RejectConsentRequestPayload
): Promise<RejectConsentRequestResponse> {
  return apiRequest<RejectConsentRequestResponse>("/api/consent/requests/reject", {
    method: "POST",
    token,
    body: payload,
  })
}

export async function requestConsent(
  token: string,
  payload: RequestConsentPayload
): Promise<RequestConsentResponse> {
  return apiRequest<RequestConsentResponse>("/api/consent/request", {
    method: "POST",
    token,
    body: payload,
  })
}
