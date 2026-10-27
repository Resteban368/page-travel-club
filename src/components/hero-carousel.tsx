"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PinIcon } from "./icons";

const slides = [
  { src: "/images/hero/cartagena.jpg", caption: "Cartagena", pos: "center 30%" },
  { src: "/images/hero/tayrona-santa-marta.jpg", caption: "Parque Tayrona · Santa Marta", pos: "center 40%" },
  { src: "/images/hero/parapente-mano-del-gigante.jpg", caption: "Parapente · Mano del Gigante", pos: "center 35%" },
  { src: "/images/hero/malecon-santa-marta.jpg", caption: "Malecón de Santa Marta", pos: "center 50%" },
  { src: "/images/hero/cabo-san-juan-tayrona.jpg", caption: "Cabo San Juan · Tayrona", pos: "center 45%" },
  { src: "/images/hero/hoteles-todo-incluido.jpg", caption: "Hoteles todo incluido", pos: "center 50%" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const touchX = useRef<number | null>(null);

  const restart = useCallback(() => {
    clearInterval(timer.current);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer.current = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    }
  }, []);

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
  }, [restart]);

  const go = (n: number) => {
    setI((n + slides.length) % slides.length);
    restart();
  };

  return (
    <>
      <div
        className="absolute inset-0"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        {slides.map((s, k) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1200ms] ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
            <Image
              src={s.src}
              alt={s.caption}
              fill
              sizes="100vw"
              priority={k === 0}
              loading={k === 0 ? undefined : "lazy"}
              className={`object-cover transition-transform duration-[7000ms] ease-out ${k === i ? "scale-100" : "scale-[1.08]"}`}
              style={{ objectPosition: s.pos }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-4 bottom-[84px] z-[4] flex items-center justify-between gap-3.5 md:right-[max(16px,calc(50%-554px))] md:left-auto md:bottom-24 md:justify-end">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md" aria-live="polite">
          <PinIcon className="size-4 text-yellow" />
          {slides[i].caption}
        </span>
        <div className="flex gap-[7px]">
          {slides.map((s, k) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Foto ${k + 1}: ${s.caption}`}
              aria-current={k === i}
              onClick={() => go(k)}
              className={`h-2.5 rounded-full transition-all duration-300 ${k === i ? "w-[30px] bg-yellow" : "w-2.5 bg-white/55"}`}
            />
          ))}
        </div>
        <button type="button" aria-label="Anterior" onClick={() => go(i - 1)} className="hidden size-[42px] place-items-center rounded-full bg-white/20 text-[22px] font-bold text-white backdrop-blur-md hover:bg-white/30 md:grid">‹</button>
        <button type="button" aria-label="Siguiente" onClick={() => go(i + 1)} className="hidden size-[42px] place-items-center rounded-full bg-white/20 text-[22px] font-bold text-white backdrop-blur-md hover:bg-white/30 md:grid">›</button>
      </div>
    </>
  );
}
