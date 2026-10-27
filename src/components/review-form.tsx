"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewState } from "@/app/actions";

const field = "w-full min-w-0 rounded-xl bg-white/10 px-3 py-2.5 text-[15px] text-white placeholder:text-[#8FA3C6] focus:bg-white/15 focus:outline-2 focus:outline-yellow";

export function ReviewForm() {
  const [stars, setStars] = useState(5);
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, null);

  return (
    <form action={action} className="bg-navy-grad grid gap-2 rounded-[22px] p-6 text-white">
      <h3 className="mb-1 text-xl font-bold">Deja tu opinión</h3>
      <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === stars}
            aria-label={`${n} estrellas`}
            onClick={() => setStars(n)}
            className={`px-0.5 text-3xl leading-none ${n <= stars ? "text-yellow" : "text-white/30"}`}
          >
            ★
          </button>
        ))}
      </div>
      <input type="hidden" name="stars" value={stars} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label htmlFor="rv-name" className="mt-1 text-[13px] font-semibold text-mist">Tu nombre</label>
      <input id="rv-name" name="name" maxLength={40} required placeholder="Ej: Laura M." className={field} />
      <label htmlFor="rv-plan" className="mt-1 text-[13px] font-semibold text-mist">¿Qué plan hiciste?</label>
      <input id="rv-plan" name="plan" maxLength={50} placeholder="Ej: Santa Marta" className={field} />
      <label htmlFor="rv-text" className="mt-1 text-[13px] font-semibold text-mist">Tu opinión</label>
      <textarea id="rv-text" name="text" maxLength={400} minLength={10} rows={4} required placeholder="Cuéntanos tu experiencia" className={`${field} resize-y`} />
      <button className="btn btn-yellow mt-2.5" type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Publicar opinión"}
      </button>
      <p className="mt-1 min-h-5 text-[13px] text-[#FFE2A0]" aria-live="polite">{state?.message}</p>
    </form>
  );
}
