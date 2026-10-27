"use client";

import Image from "next/image";
import { useRef } from "react";

/** Flyer clicable que se abre a pantalla completa en un <dialog> nativo. */
export function Flyer({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="block w-full cursor-zoom-in" aria-label={`Ver flyer completo: ${alt}`}>
        <Image src={src} alt={alt} width={1055} height={1491} sizes={sizes} priority={priority} className="aspect-[1055/1491] w-full object-cover object-top" />
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-[rgb(5_12_30/0.92)]"
      >
        <Image src={src} alt={alt} width={1055} height={1491} sizes="(max-width: 768px) 100vw, 60vh" className="h-auto max-h-[calc(100dvh-40px)] w-auto max-w-full rounded-[10px]" />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Cerrar"
          className="fixed top-3.5 right-3.5 size-11 rounded-full bg-white text-[22px] font-extrabold text-navy"
        >
          ×
        </button>
      </dialog>
    </>
  );
}
