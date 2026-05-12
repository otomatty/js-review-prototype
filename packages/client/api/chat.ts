/**
 * Vercel Edge Function: POST /api/chat
 *
 * Anthropic Claude にメッセージ列を投げ、SSE で逐次イベントを返す。
 * イベント形式は `ChatStreamEvent` (text / done / error) を JSON 直列化したもの。
 */

import { buildSystemPrompt } from "@jsreview/shared/ai/prompt";
import type { ChatStreamEvent } from "@jsreview/shared/ai/types";

import { MissingApiKeyError, streamChat } from "./_lib/anthropic-client";
import { validateChatRequest } from "./_lib/validate-chat-request";

export const runtime = "edge";

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

  const validated = validateChatRequest(raw);
  if (!validated.ok) {
    return Response.json({ error: validated.message }, {
      status: validated.status,
    });
  }
  const body = validated.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: new MissingApiKeyError().message },
      { status: 500 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const upstreamAbort = new AbortController();
      const onClientAbort = () => upstreamAbort.abort();
      request.signal.addEventListener("abort", onClientAbort);

      const send = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const iter = streamChat({
          system: buildSystemPrompt(),
          messages: body.messages,
          signal: upstreamAbort.signal,
        });
        for await (const event of iter) {
          send(event);
          if (event.type === "done") {break;}
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        send({ type: "error", message });
      } finally {
        request.signal.removeEventListener("abort", onClientAbort);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
