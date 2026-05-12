/**
 * Anthropic SDK のラッパー (Node ランタイム用)。
 *
 * - `streamChat` … messages を渡してストリームを開始し、 SSE で流すための
 *   `ChatStreamEvent` の AsyncIterable を返す。
 * - `ANTHROPIC_API_KEY` 未設定なら `MissingApiKeyError` を throw。
 *
 * Edge ランタイム版は `packages/client/api/_lib/anthropic-client.ts` に複製している
 * (Anthropic SDK は Web Fetch ベースで両環境で動くが、デプロイ単位が別なため)。
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ChatRole, ChatStreamEvent } from "@jsreview/shared/ai/types";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1024;

export class MissingApiKeyError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY が設定されていません");
    this.name = "MissingApiKeyError";
  }
}

interface StreamChatArgs {
  system: string;
  messages: { role: ChatRole; content: string }[];
  signal?: AbortSignal;
}

export async function* streamChat(
  args: StreamChatArgs,
): AsyncGenerator<ChatStreamEvent, void, unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  const stream = await client.messages.create(
    {
      model,
      max_tokens: MAX_TOKENS,
      system: args.system,
      messages: args.messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    },
    { signal: args.signal },
  );

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield { type: "text", delta: event.delta.text };
    } else if (event.type === "message_stop") {
      yield { type: "done" };
      return;
    }
  }
  // ストリームが message_stop を出さずに終わった場合の保険
  yield { type: "done" };
}
