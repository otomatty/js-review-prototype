/**
 * Vercel Serverless Function: POST /api/run-tests
 */

import type { RunTestsResponse } from "@jsreview/shared/types";
import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";

import { getQuickJSModule, QuickJsRunner } from "./_lib/quickjs-runner.js";

const MEMORY_LIMIT_MB = Number(process.env.ISOLATE_MEMORY_LIMIT ?? 32);

export default async function handler(request: Request): Promise<Response> {
  const t0 = Date.now();
  const stamp = (label: string): void => {
    console.log(`[run-tests] ${label} @ ${Date.now() - t0}ms`);
  };
  stamp("enter");

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  stamp("body parsed");

  const validated = validateRunTestsBody(raw);
  if (!validated.ok) {
    return Response.json({ error: validated.message }, {
      status: validated.status,
    });
  }
  stamp("validated");

  const body = validated.body;
  let quickJS: Awaited<ReturnType<typeof getQuickJSModule>>;
  try {
    quickJS = await getQuickJSModule();
  } catch (e) {
    stamp(`getQuickJSModule THREW: ${formatErr(e)}`);
    return Response.json({ error: "Internal server error" }, {
      status: 500,
    });
  }
  stamp("quickjs module ready");
  const runner = new QuickJsRunner(quickJS, MEMORY_LIMIT_MB);

  const start = Date.now();
  const isFreeRun = body.mode === "freerun";
  let results;
  try {
    results = isFreeRun
      ? [runner.runFreeRun(body.code)]
      : runner.runAll(body.code, body.tests, {
          testKind: body.testKind,
          entryPoints: body.entryPoints,
        });
  } catch (e) {
    stamp(`${isFreeRun ? "runFreeRun" : "runAll"} THREW: ${formatErr(e)}`);
    return Response.json(
      { error: formatErr(e) },
      { status: 500 },
    );
  }
  stamp("runAll done");

  const response: RunTestsResponse = {
    durationMs: Date.now() - start,
    results,
  };

  stamp("about to return");
  return Response.json(response);
}

function formatErr(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  }
  return String(e);
}
