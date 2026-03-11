export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_CREDENTIALS =
  import.meta.env.VITE_API_CREDENTIALS as RequestCredentials

export const API_CONNECTION_ERROR_TEMPLATE =
  import.meta.env.VITE_API_CONNECTION_ERROR_TEMPLATE

export const STORAGE_KEYS = {
  accessToken: import.meta.env.VITE_ACCESS_TOKEN_STORAGE_KEY,
  refreshToken: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY,
  routeHistory: import.meta.env.VITE_ROUTE_HISTORY_STORAGE_KEY,
} as const

export function formatApiConnectionError(baseUrl: string): string {
  return API_CONNECTION_ERROR_TEMPLATE.replace("{baseUrl}", baseUrl)
}
