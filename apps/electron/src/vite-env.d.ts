/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APTABASE_CODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
