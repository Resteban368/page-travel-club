"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TravelerPhoto } from "@/lib/types";

const altFor = (p: TravelerPhoto, i: number) =>
  p.trip ? `Viajeros de Travel Club en ${p.trip}` : `Grupo de viajeros de Travel Club, foto ${i + 1}`;

/** Cuadrícula de fotos de viajeros con visor a pantalla completa (flechas, teclado y deslizar). */
export function TravelerGallery({ photos, sizes }: { photos: TravelerPhoto[]; sizes: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const go = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[18px] bg-line shadow-card"
              aria-label={`Ver foto: ${altFor(p, i)}`}
            >
              <Image src={p.url} alt={altFor(p, i)} fill sizes={sizes} className="object-cover transition-transform duration-500 group-hover:scale-105" />
              {p.trip && (
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy-d/85 to-transparent px-3 pt-8 pb-2.5 text-left text-[13px] font-semibold text-white">
                  {p.trip}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 backdrop:bg-[rgb(5_12_30/0.94)]"
        aria-label="Galería de viajeros"
      >
        {current && open !== null && (
          <div className="pointer-events-none relative h-full w-full">
            <figure className="pointer-events-auto absolute inset-x-4 top-16 bottom-20 m-0">
              <Image key={current.id} src={current.url} alt={altFor(current, open)} fill sizes="100vw" className="object-contain" priority />
            </figure>
            <p className="pointer-events-auto absolute inset-x-0 bottom-6 text-center text-sm text-mist" aria-live="polite">
              {current.trip && <b className="mr-2 text-white">{current.trip}</b>}
              {open + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Cerrar"
              className="pointer-events-auto absolute top-3.5 right-3.5 size-11 rounded-full bg-white text-[22px] font-extrabold text-navy"
            >
              ×
            </button>
            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="pointer-events-auto absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-md hover:bg-white/30">‹</button>
                <button type="button" onClick={() => go(1)} aria-label="Foto siguiente" className="pointer-events-auto absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-md hover:bg-white/30">›</button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
