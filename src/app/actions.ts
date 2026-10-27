"use server";

import { revalidateTag } from "next/cache";
import { createReview, TAGS } from "@/lib/api";

export type ReviewState = { ok: boolean; message: string } | null;

export async function submitReview(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  // Honeypot: los bots rellenan este campo oculto; las personas no.
  if (form.get("website")) return { ok: true, message: "¡Gracias! Tu opinión fue enviada." };

  const name = String(form.get("name") ?? "").trim().slice(0, 40);
  const plan = String(form.get("plan") ?? "").trim().slice(0, 50);
  const text = String(form.get("text") ?? "").trim().slice(0, 400);
  const stars = Math.min(5, Math.max(1, Number(form.get("stars")) || 5));

  if (!name || text.length < 10) {
    return { ok: false, message: "Escribe tu nombre y una opinión de al menos 10 caracteres." };
  }

  try {
    await createReview({ name, plan: plan || undefined, text, stars });
  } catch (err) {
    console.error("[submitReview]", err);
    return { ok: false, message: "No se pudo publicar. Intenta de nuevo o envíanos tu opinión por WhatsApp." };
  }

  revalidateTag(TAGS.reviews, "max");
  return { ok: true, message: "¡Gracias! Tu opinión fue enviada y se publicará pronto." };
}
