/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FRONTEND_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
