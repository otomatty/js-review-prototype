/**
 * Hono エントリポイント（ローカル開発用・isolated-vm）。
 *
 * エンドポイント:
 *   POST /api/run-tests   テストを isolated-vm で実行（本番は Vercel Edge + QuickJS）
 *   GET  /api/healthz
 *
 * CORS: localhost の Vite (5173 付近) のみ。
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";
import type { RunTestsResponse } from "./types.js";
import { IsolatePool } from "./isolate-pool.js";
import { TestRunner } from "./grading/runner.js";

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
