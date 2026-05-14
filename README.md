# js-review-prototype

JS自動コードレビューロジックのデモプロトタイプ。
**「クライアント側でLint/AST解析、サーバ側でテスト実行」** という役割分担を実物で説明するためのアプリ。

テスト実行は Vercel Edge Function 上の **quickjs-emscripten** (QuickJS WASM) で行う。

> 本番運用は想定していません。永続化・認証・課題管理などの機能は持ちません。

## 構成

```
js-review-prototype/
├── packages/
│   ├── shared/   # 共有型・課題定義・AST解析・スコア集計
│   └── client/   # Vite + React + Edge API (quickjs) / 静的ビルド
└── tsconfig.base.json
```

`packages/client/api/` 配下が Vercel Edge Function。`api/run-tests.ts` がテスト実行、`api/chat.ts` が Claude へのチャットプロキシ、`api/healthz.ts` がヘルスチェック。

## 必要な環境

- Node.js 22以上 (Node 24 でも動作確認可)
- Bun 1.x

## セットアップ

```bash
bun install
```

## 起動方法

### A. Vite 単体（フロントのみ）

```bash
cd packages/client
bun run dev
```

→ http://localhost:5173

`/api/*` のリクエストは Vite 単体では解決されないので、テスト実行や AI チャットを動かしたい場合は B の Vercel CLI を使うか、本番デプロイ済みの URL を `VITE_SERVER_URL` で差し向ける。

### B. Vercel CLI（本番に近い Edge + QuickJS）

```bash
cd packages/client
npx vercel dev
```

同一プロセスで静的アプリと `api/run-tests` / `api/chat` / `api/healthz` が動く。実運用に最も近い構成。

### AI 質問機能を使うとき

不正解時にチャット画面で AI が解説する機能は Anthropic Claude API を使う。利用するには API キーを環境変数で渡す。

```bash
# ローカル (vercel dev): プロジェクトルートまたは packages/client に .env を置く
ANTHROPIC_API_KEY=sk-ant-...
```

- 既定モデルは `claude-sonnet-4-6`。変更したい場合は `ANTHROPIC_MODEL` を指定。
- 本番 (Vercel) では Edge Function (`/api/chat`) が同じ環境変数を参照するので、 Vercel ダッシュボードの Environment Variables に `ANTHROPIC_API_KEY` を登録する。
- API キーはサーバ側でのみ参照し、クライアントには露出しない。
- 未設定の場合、チャット画面で「ANTHROPIC_API_KEY が設定されていません」というエラーバナーが表示される。

## Vercel デプロイ

- **Root Directory**: `packages/client`（`vercel.json` あり）
- **Framework**: Vite
- **Install**: リポジトリルートで `bun install`（`vercel.json` の `installCommand` 参照）
- **環境変数 (任意)**: `ISOLATE_MEMORY_LIMIT` — QuickJS ランタイムのメモリ上限 (MB、既定 32)
- **レート制限**: アプリ内の in-memory 制限は Edge では効かないため、必要なら Vercel Firewall のレート制限ルールをダッシュボードで設定する。

## デモシナリオ

ブラウザでアプリを開き、課題を選択して以下を試す:

| シナリオ | 説明 |
|---|---|
| A | `reduce` を使った正解コード → 100点 |
| B | `for` ループ正解コード → AST減点で70点台 |
| C | `var` / `==` を使う → エディタ上に赤線 (リアルタイム) |
| D | `while(true){}` → QuickJS ランタイムでタイムアウト |

## 役割分担

| 層 | 配置 | 理由 |
|---|---|---|
| ESLint | クライアント | コードを実行しない静的解析、リアルタイムフィードバック |
| AST解析 | クライアント | 同上 |
| テスト実行 | Vercel Edge (QuickJS WASM) | 信頼できないコードを隔離して動かす |
| スコア集計 | クライアント | 上記3つを合算するだけ |

Edge API は `packages/shared` から `types.ts` とバリデーション用ユーティリティを共有する。

## SQL 課題のランナ構成 (#100 / #109)

SQL 課題は **sql.js (SQLite)** をブラウザで動かして採点する。 サーバ側で SQL を評価しないため、 既存の JS 採点パス (Edge Function) には触らずに済む。

| 用途 | DB のライフサイクル | 用途内訳 |
|---|---|---|
| **採点 DB** | テストごとに新規 `Database` を生成して破棄 | `sqlSeed` を流す → 学習者 SQL を実行 → アサーション query (省略時は学習者 SQL の最終結果) を比較 |
| **ターミナル DB** | `(assignmentId, sqlSeed)` でメモ化、 課題切替で dispose | 下部パネル「ターミナル」 タブで `xterm.js` 経由の対話実行。 学習者が `DROP TABLE` 等を打っても採点 DB には影響しない |

`sql-wasm.wasm` はビルド時に Vite プラグイン (`vite-plugins/copy-sqljs-wasm.ts`) が `node_modules/sql.js/dist/` から `packages/client/public/sqljs/` に同期する。 ランタイムは `locateFile: f => "/sqljs/" + f` で参照する。

## スタイリング方針

クライアントは **Tailwind CSS v4 + shadcn/ui** をベースに構築している。

- デザイントークンは `packages/client/src/styles.css` の `:root` (CSS 変数) と `@theme inline` ブロックで定義。色やラディウスを変えるときはここを編集する。
- 共通 UI コンポーネントは `packages/client/src/components/ui/` 配下にある。これは shadcn/ui の **「コピペで取り込み、自分で編集する」** 方針に沿った置き場で、プロジェクト固有の調整は元コンポーネントに直接手を入れて構わない。
- 画面側の小さなレイアウト調整は Tailwind ユーティリティクラスで JSX 内に書き、`styles.css` への追記は原則として行わない。
- Tailwind v4 は CSS-first 設定のため `tailwind.config.{js,ts}` は存在しない。設定はすべて `styles.css` の `@theme` / `@custom-variant` に集約している。
