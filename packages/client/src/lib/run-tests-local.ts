/**
 * Web Worker に QuickJS テスト実行を委譲する `runTests` 等価ラッパ。
 * メインスレッドをブロックしないために実体はワーカ側 (`quickjs-worker.ts`) で動かす。
 */

import type {
  RunTestsRequest,
  RunTestsResponse,
} from "@jsreview/shared/types";
import { validateRunTestsBody } from "@jsreview/shared/util/validate-run-tests-request";

import type {
  WorkerRequest,
  WorkerResponse,
} from "./quickjs-worker.js";

let workerInstance: Worker | null = null;
let nextRequestId = 1;

function getWorker(): Worker {
  if (workerInstance === null) {
    workerInstance = new Worker(
      new URL("./quickjs-worker.ts", import.meta.url),
      { type: "module" },
    );
  }
  return workerInstance;
}

export async function runTestsLocally(
  body: RunTestsRequest,
): Promise<RunTestsResponse> {
  const validated = validateRunTestsBody(body);
  if (!validated.ok) {
    throw new Error(validated.message);
  }

  const worker = getWorker();
  const requestId = nextRequestId++;

  return new Promise<RunTestsResponse>((resolve, reject) => {
    const onMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.id !== requestId) {
        return;
      }
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      if (event.data.ok) {
        resolve(event.data.response);
      } else {
        reject(new Error(event.data.error));
      }
    };
    const onError = (event: ErrorEvent) => {
      worker.removeEventListener("message", onMessage);
      worker.removeEventListener("error", onError);
      // ワーカ自体が落ちた可能性があるため、次回呼び出しで作り直す。
      workerInstance = null;
      reject(new Error(event.message || "QuickJS worker error"));
    };
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);

    const request: WorkerRequest = { id: requestId, body: validated.body };
    worker.postMessage(request);
  });
}
