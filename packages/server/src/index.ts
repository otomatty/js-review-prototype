/**
 * Hono エントリポイント（ローカル開発用・isolated-vm）。
 *
 * エンドポイント:
 *   POST /api/run-tests   テストを isolated-vm で実行（本番は Vercel Edge + QuickJS）
 *   POST /api/chat        Anthropic Claude にチャット (SSE ストリーミング)
 *   GET  /api/healthz
 *
 * CORS: localhost の Vite (5173 付近) のみ。
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamSSE } from "hono/streaming";

import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";
import { buildSystemPrompt } from "@jsreview/shared/ai/prompt";
import { validateChatRequest } from "@jsreview/shared/ai/validate-chat-request";
import type { RunTestsResponse } from "./types.js";
import { IsolatePool } from "./isolate-pool.js";
import { TestRunner } from "./grading/runner.js";
import { MissingApiKeyError, streamChat } from "./ai/anthropic-client.js";

const PORT = Number(process.env.PORT ?? 3001);
const POOL_SIZE = Number(process.env.ISOLATE_POOL_SIZE ?? 4);
const MEMORY_LIMIT_MB = Number(process.env.ISOLATE_MEMORY_LIMIT ?? 32);

const pool = new IsolatePool({ size: POOL_SIZE, memoryLimit: MEMORY_LIMIT_MB });
const runner = new TestRunner(pool);

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    // dev では Vite が空いている次のポートに自動採番するため、localhost の Vite ポート範囲を許可する。
    origin: (origin) =>
      /^http:\/\/localhost:51\d{2}$/.test(origin) ? origin : null,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/api/healthz", (c) =>
  c.json({
    ok: true,
    runner: "isolated-vm",
    poolSize: POOL_SIZE,
    memoryLimitMb: MEMORY_LIMIT_MB,
  }),
);

app.post("/api/run-tests", async (c) => {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const validated = validateRunTestsBody(raw);
  if (!validated.ok) {
    return c.json(
      { error: validated.message },
      { status: validated.status as 400 | 500 },
    );
  }
  const body = validated.body;
  const isFreeRun = body.mode === "freerun";

  const start = Date.now();
  const results = isFreeRun
    ? [await runner.runFreeRun(body.code)]
    : await runner.runAll(body.code, body.tests, {
        testKind: body.testKind,
        entryPoints: body.entryPoints,
      });
  const durationMs = Date.now() - start;

  const response: RunTestsResponse = { durationMs, results };
  return c.json(response);
});

app.post("/api/chat", async (c) => {
  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const validated = validateChatRequest(raw);
  if (!validated.ok) {
    return c.json({ error: validated.message }, { status: validated.status });
  }
  const body = validated.body;

  // ストリーム開始前に API キーをチェックして 500 を返す (SSE の途中で
  // エラーを流すよりクライアントの取り扱いがシンプル)。
  if (!process.env.ANTHROPIC_API_KEY) {
    return c.json({ error: new MissingApiKeyError().message }, 500);
  }

  return streamSSE(c, async (stream) => {
    const controller = new AbortController();
    // 上流がハングしてもサーバ側で切るための保険。anthropic-client にも
    // タイムアウトはあるが、Hono のストリームをここで明示的に閉じることで
    // 配下のソケットを確実に解放する。
    const SERVER_TIMEOUT_MS = 75_000;
    const timeoutId = setTimeout(() => controller.abort(), SERVER_TIMEOUT_MS);
    // クライアントが切断したら Anthropic 呼び出しも abort
    stream.onAbort(() => controller.abort());
    try {
      const iter = streamChat({
        system: buildSystemPrompt(),
        messages: body.messages,
        signal: controller.signal,
      });
      for await (const event of iter) {
        await stream.writeSSE({ data: JSON.stringify(event) });
        if (event.type === "done") {return;}
      }
    } catch (e) {
      const message = controller.signal.aborted
        ? "AI 応答がタイムアウトしました"
        : e instanceof Error
          ? e.message
          : "Unknown error from Anthropic";
      await stream.writeSSE({
        data: JSON.stringify({ type: "error", message }),
      });
    } finally {
      clearTimeout(timeoutId);
    }
  });
});

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
   
  console.log(
    `[server] Test runner listening on http://localhost:${info.port}`,
  );
   
  console.log(
    `[server] isolate pool: size=${POOL_SIZE}, memoryLimit=${MEMORY_LIMIT_MB}MB`,
  );
});

const shutdown = (signal: string) => {
   
  console.log(`[server] received ${signal}, shutting down...`);
  pool.shutdown();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
