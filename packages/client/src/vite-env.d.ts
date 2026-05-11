/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** テスト API のオリジン (末尾スラッシュなし)。未設定時は同一オリジン `/api/run-tests`（Vite では proxy でローカルサーバへ）。 */
  readonly VITE_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
