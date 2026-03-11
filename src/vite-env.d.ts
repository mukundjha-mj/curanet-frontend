/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_CREDENTIALS: RequestCredentials
  readonly VITE_API_CONNECTION_ERROR_TEMPLATE: string
  readonly VITE_ACCESS_TOKEN_STORAGE_KEY: string
  readonly VITE_REFRESH_TOKEN_STORAGE_KEY: string
  readonly VITE_ROUTE_HISTORY_STORAGE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:pwa-register" {
  export function registerSW(options?: { immediate?: boolean }): (reloadPage?: boolean) => Promise<void>
}
