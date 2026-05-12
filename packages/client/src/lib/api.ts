/**
 * Vercel Edge API (`/api/run-tests` と `/api/chat`) を叩く HTTP クライアント。
 */
import type {
  RunTestsRequest,
  RunTestsResponse,
  TestResult,
} from "@jsreview/shared/types";
import type {
  ChatRequest,
  ChatStreamEvent,
} from "@jsreview/shared/ai/types";

/** 空なら同一オリジン (Vercel の `/api/run-tests`)。デプロイ済み URL を別ホストから叩きたい場合に指定する。 */
const SERVER_URL = (import.meta.env.VITE_SERVER_URL ?? "").replace(/\/+$/, "");

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

/**
 * サーバの POST /api/chat に messages を投げ、SSE で流れてくる
 * `ChatStreamEvent` (text / done / error) を AsyncIterable で返す。
 *
 * - 非 200 はテキスト本文ごと throw する。
 * - チャンク境界をまたぐ `data:` 行を正しく組み立てる (バッファ式)。
 * - 呼び出し側が abort したい場合は `signal` を渡す (fetch にそのまま伝播)。
 */
export async function* streamChat(
  body: ChatRequest,
  options: { signal?: AbortSignal } = {},
): AsyncGenerator<ChatStreamEvent, void, unknown> {
  const res = await fetch(`${SERVER_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: options.signal,
  });

  if (!res.ok) {
    // 一度ボディを text として読み切ってから JSON.parse を試す。
    // res.json() を先に呼ぶとボディストリームが消費され、 後続の res.text()
    // が必ず失敗してサーバのエラー本文をユーザーに見せられなくなるため。
    let message = `サーバエラー (${res.status})`;
    const text = await res.text().catch(() => "");
    if (text) {
      try {
        const data = JSON.parse(text) as { error?: string };
        if (data.error) {
          message = data.error;
        } else {
          message = `${message}: ${text}`;
        }
      } catch {
        message = `${message}: ${text}`;
      }
    }
    throw new Error(message);
  }

  if (!res.body) {
    throw new Error("ストリームを受信できませんでした");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {break;}
      buffer += decoder.decode(value, { stream: true });

      // SSE は `\n\n` でイベント区切り
      let sepIdx: number;
      while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
        const chunk = buffer.slice(0, sepIdx);
        buffer = buffer.slice(sepIdx + 2);
        const event = parseSseChunk(chunk);
        if (event) {yield event;}
      }
    }
    // ストリーム終端に残った最後のイベント
    if (buffer.trim().length > 0) {
      const event = parseSseChunk(buffer);
      if (event) {yield event;}
    }
  } finally {
    reader.releaseLock();
  }
}

function parseSseChunk(chunk: string): ChatStreamEvent | null {
  // `data:` 行のみを連結する (id/event/retry/comment は無視)。
  const lines = chunk.split("\n");
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).replace(/^ /, ""));
    }
  }
  if (dataLines.length === 0) {return null;}
  const payload = dataLines.join("\n");
  try {
    const parsed = JSON.parse(payload) as ChatStreamEvent;
    return parsed;
  } catch {
    return null;
  }
}
