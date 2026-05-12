/**
 * Vercel Serverless Function: POST /api/run-tests
 */

import type { RunTestsResponse } from "@jsreview/shared/types";
import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";

import { getQuickJSModule, QuickJsRunner } from "./_lib/quickjs-runner";

const MEMORY_LIMIT_MB = Number(process.env.ISOLATE_MEMORY_LIMIT ?? 32);

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validated = validateRunTestsBody(raw);
  if (!validated.ok) {
    return Response.json({ error: validated.message }, {
      status: validated.status,
    });
  }

  const body = validated.body;
  const quickJS = await getQuickJSModule();
  const runner = new QuickJsRunner(quickJS, MEMORY_LIMIT_MB);

  const start = Date.now();
  let results;
  try {
    const isFreeRun = body.mode === "freerun";
    results = isFreeRun
      ? [runner.runFreeRun(body.code)]
      : runner.runAll(body.code, body.tests, {
          testKind: body.testKind,
          entryPoints: body.entryPoints,
        });
  } catch (e) {
    return Response.json(
      { error: formatErr(e) },
      { status: 500 },
    );
  }

  const response: RunTestsResponse = {
    durationMs: Date.now() - start,
    results,
  };

  return Response.json(response);
}

function formatErr(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  return String(e);
}
