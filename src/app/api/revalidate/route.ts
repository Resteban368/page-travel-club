import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { TAGS } from "@/lib/api";

// Webhook para NestJS: llámalo después de crear/editar/borrar planes o aprobar opiniones.
//   POST /api/revalidate
//   Authorization: Bearer <REVALIDATE_SECRET>
//   { "tags": ["planes"] }   // valores: planes, empresa, faqs, opiniones, viajeros (sin body = todos)
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!secret || token.length !== secret.length || !timingSafeEqual(Buffer.from(token), Buffer.from(secret))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const allowed = Object.values(TAGS) as string[];
  const tags = (body.tags ?? allowed).filter((t) => allowed.includes(t));
  tags.forEach((t) => revalidateTag(t, "max"));

  return Response.json({ ok: true, revalidated: tags });
}
