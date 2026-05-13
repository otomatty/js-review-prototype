/**
 * ブラウザ内で QuickJS を起動してテスト実行する `runTests` 等価関数。
 * 旧 `/api/run-tests` Vercel Function の I/O をそのまま再現する。
 */

import type {
  RunTestsRequest,
  RunTestsResponse,
  TestResult,
} from "@jsreview/shared/types";
import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";

import {
  getQuickJSModule,
  MEMORY_LIMIT_MB,
  QuickJsRunner,
} from "./quickjs-runner.js";

export async function runTestsLocally(
  body: RunTestsRequest,
): Promise<RunTestsResponse> {
  const validated = validateRunTestsBody(body);
  if (!validated.ok) {
    throw new Error(validated.message);
  }

  const quickJS = await getQuickJSModule();
  const runner = new QuickJsRunner(quickJS, MEMORY_LIMIT_MB);

  const start = Date.now();
  const isFreeRun = validated.body.mode === "freerun";
  const results: TestResult[] = isFreeRun
    ? [runner.runFreeRun(validated.body.code)]
    : runner.runAll(validated.body.code, validated.body.tests, {
        testKind: validated.body.testKind,
        entryPoints: validated.body.entryPoints,
      });

  return {
    durationMs: Date.now() - start,
    results,
  };
}
