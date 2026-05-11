/**
 * Vercel Edge Function: GET /api/healthz
 */

export const runtime = "edge";

export default function handler(_request: Request): Response {
  return Response.json({
    ok: true,
    runner: "quickjs-emscripten",
    memoryLimitMb: Number(process.env.ISOLATE_MEMORY_LIMIT ?? 32),
  });
}
