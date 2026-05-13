/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** チャット API (`/api/chat`) のオリジン (末尾スラッシュなし)。未設定時は同一オリジン。テスト実行はブラウザ内 QuickJS で完結するため、この設定は使われない。 */
  readonly VITE_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
