# js-review-prototype

JS自動コードレビューロジックのデモプロトタイプ。
**「クライアント側でLint/AST解析、サーバ側でテスト実行」** という役割分担を実物で説明するためのアプリ。

- **本番 (Vercel)**: `packages/client/api` の Edge Function で **quickjs-emscripten** (QuickJS WASM) によりテスト実行。
- **ローカル**: `packages/server` の **Node.js + Hono + isolated-vm**（ネイティブ VM に近い挙動・検証用）。

> 本番運用は想定していません。永続化・認証・課題管理などの機能は持ちません。

## 構成

```
js-review-prototype/
├── packages/
│   ├── shared/   # 共有型・課題定義・AST解析・スコア集計 (クライアントから利用)
│   ├── client/   # Vite + React + Edge API (quickjs) / 静的ビルド
│   └── server/   # Node.js + Hono + isolated-vm（ローカル開発用テストランナー）
└── tsconfig.base.json
```

## 必要な環境

- Node.js 22以上 (Node 24 でも動作確認可)
- Bun 1.x
- `isolated-vm@6.x` のネイティブビルドのため:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `build-essential`, `python3`
  - **Windows**: Visual Studio Build Tools (C++20 対応版) + Python

## セットアップ

```bash
bun install
```

`packages/server` の `isolated-vm` がネイティブビルドされます。失敗する場合は上記の必要環境を確認してください。

## 起動方法

### A. Vite + ローカルサーバ（推奨・従来どおり）

ターミナルを2つ開きます。

**ターミナル1 — クライアント (Vite)**

```bash
cd packages/client
bun run dev
```

→ http://localhost:5173 （`/api/*` は Vite の proxy で http://localhost:3001 に転送）

**ターミナル2 — サーバ (Hono + isolated-vm)**

```bash
cd packages/server
bun run dev
```

→ http://localhost:3001 · エンドポイントは **`POST /api/run-tests`** · **`GET /api/healthz`**

サーバは `node --no-node-snapshot --import tsx` で起動します（Bun ではなく）。isolated-vm が Node 依存のため。Node.js 20 以降では `--no-node-snapshot` が必須です。

フロントは既定で同一オリジン `/api/run-tests` を叩くため、`VITE_SERVER_URL` は未設定で問題ありません。

### B. Vercel CLI（本番に近い Edge + QuickJS）

```bash
cd packages/client
npx vercel dev
```

同一プロセスで静的アプリと `api/run-tests` が動きます。

## Vercel デプロイ

- **Root Directory**: `packages/client`（`vercel.json` あり）
- **Framework**: Vite
- **Install**: リポジトリルートで `bun install`（`vercel.json` の `installCommand` 参照）
- **環境変数 (任意)**: `ISOLATE_MEMORY_LIMIT` — QuickJS ランタイムのメモリ上限 (MB、既定 32)
- **レート制限**: アプリ内の in-memory 制限は Edge では効かないため、必要なら Vercel Firewall のレート制限ルールをダッシュボードで設定する。

## デモシナリオ

ブラウザで http://localhost:5173 を開き、課題を選択して以下を試してください:

| シナリオ | 説明 |
|---|---|
| A | `reduce` を使った正解コード → 100点 |
| B | `for` ループ正解コード → AST減点で70点台 |
| C | `var` / `==` を使う → エディタ上に赤線 (リアルタイム) |
| D | `while(true){}` → サーバ側でタイムアウト、プロセスは生存 |

## 役割分担

| 層 | 配置 | 理由 |
|---|---|---|
| ESLint | クライアント | コードを実行しない静的解析、リアルタイムフィードバック |
| AST解析 | クライアント | 同上 |
| テスト実行 | Vercel Edge (QuickJS WASM) / ローカルは isolated-vm | 信頼できないコードを隔離して動かす |
| スコア集計 | クライアント | 上記3つを合算するだけ |

ローカルサーバが `packages/shared` から import するのは主に `types.ts` とバリデーション用ユーティリティ。Edge API も同じリクエスト検証を共有する。

## スタイリング方針

クライアントは **Tailwind CSS v4 + shadcn/ui** をベースに構築している。

- デザイントークンは `packages/client/src/styles.css` の `:root` (CSS 変数) と `@theme inline` ブロックで定義。色やラディウスを変えるときはここを編集する。
- 共通 UI コンポーネントは `packages/client/src/components/ui/` 配下にある。これは shadcn/ui の **「コピペで取り込み、自分で編集する」** 方針に沿った置き場で、プロジェクト固有の調整は元コンポーネントに直接手を入れて構わない。
- 画面側の小さなレイアウト調整は Tailwind ユーティリティクラスで JSX 内に書き、`styles.css` への追記は原則として行わない。
- Tailwind v4 は CSS-first 設定のため `tailwind.config.{js,ts}` は存在しない。設定はすべて `styles.css` の `@theme` / `@custom-variant` に集約している。
