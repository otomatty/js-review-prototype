/**
 * サーバの POST /run-tests を叩く HTTP クライアント。
 */
import type {
  RunTestsRequest,
  RunTestsResponse,
} from "@jsreview/shared/types";

const SERVER_URL =
  (import.meta.env.VITE_SERVER_URL as string | undefined) ??
  "http://localhost:3001";

export async function runTests(
  body: RunTestsRequest,
): Promise<RunTestsResponse> {
  const res = await fetch(`${SERVER_URL}/run-tests`, {
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
