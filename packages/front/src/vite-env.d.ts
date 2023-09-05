/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_BASE_URL: string
  readonly VITE_WS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
