/**
 * `POST /api/chat` の入力バリデータ。
 *
 * `validate-run-tests-request.ts` の規約に倣い、`ok` 判別 union を返す。
 */

import type { ChatRequest } from "@jsreview/shared/ai/types";

type ValidateResult =
  | { ok: true; body: ChatRequest }
  | { ok: false; status: 400 | 500; message: string };

const MAX_MESSAGES = 50;
const MAX_CONTENT_CHARS = 32_000;

export function validateChatRequest(raw: unknown): ValidateResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, status: 400, message: "Invalid body" };
  }
  const body = raw as Partial<ChatRequest>;

  if (typeof body.assignmentId !== "string" || body.assignmentId.length === 0) {
    return { ok: false, status: 400, message: "assignmentId is required" };
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false, status: 400, message: "messages must be a non-empty array" };
  }
  if (body.messages.length > MAX_MESSAGES) {
    return {
      ok: false,
      status: 400,
      message: `messages must be ${MAX_MESSAGES} or fewer`,
    };
  }

  for (const m of body.messages) {
    if (!m || typeof m !== "object") {
      return { ok: false, status: 400, message: "Invalid message entry" };
    }
    if (m.role !== "user" && m.role !== "assistant") {
      return { ok: false, status: 400, message: "Invalid message role" };
    }
    if (typeof m.content !== "string" || m.content.length === 0) {
      return { ok: false, status: 400, message: "Invalid message content" };
    }
    if (m.content.length > MAX_CONTENT_CHARS) {
      return { ok: false, status: 400, message: "Message content too long" };
    }
  }

  // 末尾が user メッセージである必要がある (assistant 応答を期待するため)
  const last = body.messages[body.messages.length - 1];
  if (last.role !== "user") {
    return {
      ok: false,
      status: 400,
      message: "Last message must be from user",
    };
  }

  return {
    ok: true,
    body: {
      assignmentId: body.assignmentId,
      messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
    },
  };
}
