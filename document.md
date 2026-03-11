# CuraNet Product Document

## 1. Purpose
CuraNet is a patient-centered healthcare frontend designed to make essential health information accessible, actionable, and safe to share. The application focuses on day-to-day care coordination (appointments, records, profile updates) and high-urgency scenarios (emergency card sharing via secure links).

The product balances usability and data control by combining clear workflows with consent-based access.

## 2. Product Goals
- Give patients a single place to manage core medical interactions.
- Reduce friction in booking, tracking, and updating appointments.
- Make emergency information available quickly with controlled public links.
- Keep privacy and consent controls visible and understandable.
- Support trusted session and account security operations.

## 3. User Types
- Patient: primary owner of records, profile, consent, and emergency sharing.
- Provider roles (doctor/pharmacy): request and receive scoped consent access.
- Public emergency viewer: accesses time-limited, scope-limited emergency data through a shared link.

## 4. Core Experience
### 4.1 Authentication and Session Lifecycle
- Sign in, sign up, and password reset flows are available.
- Session handling includes token refresh behavior and persistent sign-in state.
- Email verification and session continuity messaging are built into the experience.

### 4.2 Dashboard and Health Snapshot
- The main dashboard presents an operational overview of the user's data.
- Users can quickly navigate to profile, records, appointments, settings, and emergency areas.
- Loading and error states are handled with user-friendly fallback messaging.

### 4.3 Medical Records
- Encounters and observations are available in separate views and combined summaries.
- Records can be opened for additional details through focused interactions.
- Empty-state copy supports first-time or low-data users.

### 4.4 Appointment Management
- Patients can schedule consultations and select provider targets.
- Upcoming, pending, and historical appointment states are available.
- Pending appointments can be edited when they meet timing rules.
- Appointment details are accessible through dedicated detail views.

### 4.5 Profile and Account Settings
- Users can maintain core account/profile information.
- Security settings include password updates and active session controls.
- Session management supports revoking individual or all other sessions.
- Recovery options (backup email/phone) are supported.

### 4.6 Notification and Privacy Controls
- Notification channels include email, SMS, and push toggles.
- Users can set delivery frequency, quiet hours, and timezone.
- Privacy controls include emergency sharing preferences, profile visibility, analytics opt-out, and participation options.

### 4.7 Consent Management
- Consent requests can be reviewed, granted, or rejected.
- Granted consent can be revoked with reason support.
- Scope-based permissions include basic info, medical info, full history, and write access.
- Consent expirations can be configured with preset durations or custom dates.
- Consent history and filtering support longitudinal review.

### 4.8 Emergency Access and Link Sharing
- Users can generate emergency links from emergency card data.
- Links are tracked with lifecycle details: active, used, expired, revoked.
- Share details include access count and last access timestamps where available.
- Public emergency access shows warning context, access audit context, and scope-bound patient data.
- Emergency views are optimized for rapid reading and printable output.

## 5. Data Access Model
- Access is scope-based and explicit.
- Emergency data access is link-bound, time-sensitive, and auditable.
- User-facing workflows emphasize what is shared and for how long.

## 6. Trust, Safety, and Compliance Posture
- Sensitive operations (password changes, session revocation, consent changes) are user-initiated and feedback-driven.
- Error and warning language avoids exposing internal implementation details.
- The product favors explicit controls over implicit sharing.

## 7. Performance and UX Reliability
- Route-level chunking and prefetch behavior reduce perceived navigation latency.
- Skeleton loading states maintain continuity during network operations.
- Progressive web app behavior supports resilient repeat usage patterns.

## 8. Operational Notes
- Frontend behavior is environment-driven for API endpoint, credentials behavior, error-template messaging, and storage-key names.
- This allows deployment-specific configuration without code changes.

## 9. Non-Goals (Current Scope)
- This frontend document does not define backend schema ownership.
- This frontend does not independently enforce clinical authorization policy beyond provided API contracts.
- This frontend does not replace emergency response systems; it provides controlled information access.

## 10. Success Indicators
- Faster patient completion of scheduling and profile tasks.
- Increased consent transparency and reduced sharing ambiguity.
- Reliable emergency data retrieval with clear audit context.
- Reduced support overhead from clearer UX and standardized status/error messaging.

## 11. Future Opportunities
- Stronger role-aware dashboards per user type.
- More granular consent analytics and lifecycle timelines.
- Expanded emergency workflows with institution-level verification paths.
- Enhanced offline-first behavior for selected read-only experiences.
