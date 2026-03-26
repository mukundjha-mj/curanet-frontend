# CuraNet Frontend

CuraNet Frontend is a React + TypeScript web application for patient-focused healthcare workflows.
It provides authentication, records visibility, appointment scheduling, consent management, privacy and notification settings, and emergency information sharing through controlled links.

## What This App Covers

- Authentication flows: sign in, sign up, password reset, and session continuity behavior.
- Dashboard and profile management for everyday patient access.
- Records views for encounters and observations.
- Appointment lifecycle for pending, upcoming, and historical consultations.
- Consent workflows: request, grant, reject, revoke, and scope/expiry control.
- Settings workflows: security, privacy, and notifications.
- Emergency workflows: emergency card display, link generation, link lifecycle tracking, and public emergency access view.
- Progressive web app behavior and frontend performance optimizations.

## Technology Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- shadcn/ui + Radix primitives
- Vite PWA plugin + Workbox runtime caching

## Prerequisites

- Node.js 20+ (recommended)
- pnpm 9+ (or compatible)
- A running CuraNet backend API

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Start development server:

```bash
pnpm dev
```

4. Open the local URL printed by Vite (commonly `http://localhost:5173`).

## Environment Variables

Configure all runtime values in `.env`.

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend API base URL used by frontend requests | `http://localhost:3001` |
| `VITE_API_CREDENTIALS` | Yes | Fetch credentials mode (`include`, `same-origin`, `omit`) | `include` |
| `VITE_API_CONNECTION_ERROR_TEMPLATE` | Yes | Connection error template with `{baseUrl}` placeholder | `Unable to connect to backend at {baseUrl}. ...` |
| `VITE_ACCESS_TOKEN_STORAGE_KEY` | Yes | Browser storage key for access token | `curanet.accessToken` |
| `VITE_REFRESH_TOKEN_STORAGE_KEY` | Yes | Browser storage key for refresh token | `curanet.refreshToken` |
| `VITE_ROUTE_HISTORY_STORAGE_KEY` | Yes | Browser storage key for route history/prefetch context | `curanet.routeHistory` |

Notes:
- Keep `.env` local and untracked.
- Commit only `.env.example`.

## Scripts

- `pnpm dev`: Run Vite dev server.
- `pnpm build`: Run TypeScript project build and production bundle.
- `pnpm preview`: Serve production build locally.
- `pnpm lint`: Run ESLint.
- `pnpm typecheck`: Run TypeScript no-emit type check.
- `pnpm format`: Format TS/TSX files with Prettier.

## Quality Gates

Run these before opening a PR or pushing release-ready changes:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## User Workflow Overview

### Auth and Session
- Users authenticate through sign in/sign up flows.
- Sessions are managed with refresh-aware behavior and protected routing.

### Records
- Users can review encounter and observation summaries.
- Details are opened in focused views for faster scanning.

### Appointments
- Patients can schedule appointments with providers.
- Pending appointments can be edited based on timing rules.
- Upcoming/history filtering supports operational follow-up.

### Consent
- Consent requests can be granted or rejected.
- Active consent can be revoked and inspected with history context.
- Scopes and expiry windows are configurable.

### Settings
- Security: password changes, session revocation, recovery options.
- Privacy: emergency/data-sharing toggles, profile visibility, analytics preferences.
- Notifications: channel controls, frequency, quiet hours, timezone.

### Emergency
- Emergency card information is available in-app.
- Patients can generate secure emergency links.
- Link lifecycle and access details are visible.
- Public emergency view supports urgent readable/printable access.

## Build and Deployment Notes

- This app is environment-configured at build/runtime through `VITE_` variables.
- Ensure backend CORS allows your frontend origin when using credentialed requests.
- Verify production values for API endpoint and storage keys before deployment.

## Troubleshooting

- Cannot connect to backend:
	- Confirm `VITE_API_BASE_URL` points to a reachable API.
	- Confirm backend is running and CORS origin includes the frontend URL.
- Authentication appears unstable:
	- Confirm browser cookies/credentials policy aligns with backend auth settings.
	- Clear local storage keys and re-authenticate.
- Empty records/appointments:
	- Confirm authenticated user has seeded/test data in backend.

## Documentation

- Product-oriented reference: `product-documentation.md`
- Naming rules for files and exports: `NAMING-CONVENTIONS.md`

## Security and Privacy

- Never commit `.env`.
- Use least-privilege backend roles and enforce consent server-side.
- Treat emergency links as sensitive access artifacts.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Follow naming rules in `NAMING-CONVENTIONS.md`.
4. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
5. Open a pull request with testing notes and screenshots for UI changes.
