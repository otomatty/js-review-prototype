/**
 * サーバの POST /run-tests を叩く HTTP クライアント。
 */
import type {
  RunTestsRequest,
  RunTestsResponse,
  TestResult,
} from "@jsreview/shared/types";

/** 空なら同一オリジン (Vercel の `/api/run-tests`)。ローカルでは Vite proxy または `http://localhost:3001` を指定。 */
const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "";

export async function runTests(
  body: RunTestsRequest,
): Promise<RunTestsResponse> {
  const res = await fetch(`${SERVER_URL}/api/run-tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `サーバエラー (${res.status}): ${text || res.statusText}`,
    );
  }

  return (await res.json()) as RunTestsResponse;
}

/**
 * 採点せずにコードを実行し、stdout (とエラー) のみを取得する。
 * 学習者が「実行」ボタンで自由に動作確認するための薄いラッパ。
 */
export async function runFreeRun(code: string): Promise<TestResult> {
  const response = await runTests({
    code,
    testKind: "stdout",
    tests: [],
    mode: "freerun",
  });
  // freerun モードのサーバは必ず 1 件だけ返す。
  return response.results[0];
}
