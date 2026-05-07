/**
 * Hono エントリポイント。
 *
 * エンドポイント:
 *   POST /run-tests   テストを isolated-vm で実行
 *   GET  /healthz     ヘルスチェック
 *
 * CORS は http://localhost:5173 のみ許可。
 */

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import type { RunTestsRequest, RunTestsResponse } from "./types.js";
import { IsolatePool } from "./isolate-pool.js";
import { TestRunner } from "./runner.js";

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
    origin: ["http://localhost:5173"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/healthz", (c) =>
  c.json({ ok: true, poolSize: POOL_SIZE, memoryLimitMb: MEMORY_LIMIT_MB }),
);

app.post("/run-tests", async (c) => {
  let body: RunTestsRequest;
  try {
    body = (await c.req.json()) as RunTestsRequest;
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  // 最低限のバリデーション
  if (typeof body.code !== "string") {
    return c.json({ error: "Missing 'code' (string)" }, 400);
  }
  if (!Array.isArray(body.tests)) {
    return c.json({ error: "Missing 'tests' (array)" }, 400);
  }
  if (!Array.isArray(body.entryPoints)) {
    return c.json({ error: "Missing 'entryPoints' (array)" }, 400);
  }

  const start = Date.now();
  const results = await runner.runAll(body.code, body.tests, body.entryPoints);
  const durationMs = Date.now() - start;

  const response: RunTestsResponse = { durationMs, results };
  return c.json(response);
});

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
  // eslint-disable-next-line no-console
  console.log(
    `[server] Test runner listening on http://localhost:${info.port}`,
  );
  // eslint-disable-next-line no-console
  console.log(
    `[server] isolate pool: size=${POOL_SIZE}, memoryLimit=${MEMORY_LIMIT_MB}MB`,
  );
});

const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`[server] received ${signal}, shutting down...`);
  pool.shutdown();
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
