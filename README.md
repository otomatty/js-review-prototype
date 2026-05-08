# js-review-prototype

JS自動コードレビューロジックのデモプロトタイプ。
**「クライアント側でLint/AST解析、サーバ側のisolated-vmでテスト実行」** という役割分担を実物で説明するためのアプリ。

> 本番運用は想定していません。永続化・認証・課題管理などの機能は持ちません。

## 構成

```
js-review-prototype/
├── packages/
│   ├── shared/   # 共有型・課題定義・AST解析・スコア集計 (クライアントから利用)
│   ├── client/   # Bun + Vite + React + CodeMirror 6 + ESLint browserify
│   └── server/   # Node.js + Hono + isolated-vm (テストランナー)
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

ターミナルを2つ開きます。

### ターミナル1: クライアント (Vite)

```bash
cd packages/client
bun run dev
```

→ http://localhost:5173

### ターミナル2: サーバ (Hono + isolated-vm)

```bash
cd packages/server
bun run dev
```

→ http://localhost:3001

サーバは `node --no-node-snapshot --import tsx` で起動します(Bunではなく)。これは isolated-vm がNode.js依存のため。Node.js 20 以降では `isolated-vm` の制約により `--no-node-snapshot` フラグが必須です。

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
| テスト実行 | サーバ (isolated-vm) | 信頼できないコードを安全に隔離して動かす |
| スコア集計 | クライアント | 上記3つを合算するだけ |

サーバが `packages/shared` から import するのは `types.ts` のみ。これにより構造的に「サーバはテスト実行のみが責務」が保証されている。

## スタイリング方針

クライアントは **Tailwind CSS v4 + shadcn/ui** をベースに構築している。

- デザイントークンは `packages/client/src/styles.css` の `:root` (CSS 変数) と `@theme inline` ブロックで定義。色やラディウスを変えるときはここを編集する。
- 共通 UI コンポーネントは `packages/client/src/components/ui/` 配下にある。これは shadcn/ui の **「コピペで取り込み、自分で編集する」** 方針に沿った置き場で、プロジェクト固有の調整は元コンポーネントに直接手を入れて構わない。
- 画面側の小さなレイアウト調整は Tailwind ユーティリティクラスで JSX 内に書き、`styles.css` への追記は原則として行わない。
- Tailwind v4 は CSS-first 設定のため `tailwind.config.{js,ts}` は存在しない。設定はすべて `styles.css` の `@theme` / `@custom-variant` に集約している。
