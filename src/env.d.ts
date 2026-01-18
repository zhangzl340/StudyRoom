/// <reference types="vite/client" />

// Vite环境变量类型声明
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_BASE_URL: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_REQUEST_TIMEOUT: string
  readonly VITE_WS_RECONNECT_INTERVAL: string
  readonly VITE_PAGE_SIZE: string
  readonly VITE_MAX_RESERVATION_HOURS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}