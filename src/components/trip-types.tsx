"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { waLink } from "@/lib/site";
import type { Category, Plan } from "@/lib/types";
import { Flyer } from "./flyer";
import { WhatsAppIcon } from "./icons";

const ring = { green: "var(--color-green)", yellow: "var(--color-yellow)", sky: "var(--color-sky)", navy: "var(--color-navy)" } as const;

export function TripTypes({ categories, plans }: { categories: Category[]; plans: Plan[] }) {
  const [active, setActive] = useState<Category | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const toggle = (c: Category) => {
    const next = active?.slug === c.slug ? null : c;
    setActive(next);
    if (next) {
      requestAnimationFrame(() =>
        panel.current?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest",
        }),
      );
    }
  };

  const shown = active ? plans.filter((p) => p.categories.includes(active.slug)) : [];
  const kind = active?.title.replace("Planes de ", "");

  return (
    <>
      <div className="grid grid-cols-2 gap-[22px] lg:grid-cols-4" role="tablist" aria-label="Tipos de viaje">
        {categories.map((c) => {
          const selected = active?.slug === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="panel-tipos"
              onClick={() => toggle(c)}
              className="group text-center"
              style={{ "--o": ring[c.color] } as React.CSSProperties}
            >
              <div
                className={`relative mx-auto aspect-square w-[min(220px,100%)] rounded-full shadow-[0_22px_40px_-22px_rgb(10_42_92/0.7)] outline-6 -outline-offset-1 outline-(--o) transition-transform duration-250 group-hover:scale-[1.04] ${selected ? "scale-[1.06] shadow-[0_0_0_8px_rgb(246_187_38/0.25),0_22px_40px_-22px_rgb(10_42_92/0.7)]" : ""}`}
              >
                <Image src={c.image} alt="" fill sizes="(max-width: 1024px) 45vw, 220px" className="rounded-full object-cover" />
                <span className="absolute right-[8%] bottom-[8%] grid size-[52px] place-items-center rounded-full bg-white text-2xl shadow-[0_8px_18px_-6px_rgb(10_42_92/0.5)] outline-3 outline-(--o)" aria-hidden>
                  {c.icon}
                </span>
              </div>
              <b className={`mt-4 block text-[19px] ${selected ? "text-blue" : "text-navy"}`}>{c.name}</b>
              <span className="text-sm text-muted">{c.tagline}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={panel}
        id="panel-tipos"
        role="tabpanel"
        hidden={!active}
        className="mt-[30px] animate-[pop_.35s_ease] rounded-[26px] border-t-6 bg-white p-6 shadow-lift"
        style={{ borderTopColor: active ? ring[active.color] : undefined }}
      >
        {active && (
          <>
            <div className="mb-[18px] flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-navy">{active.title}</h3>
              <button type="button" onClick={() => setActive(null)} aria-label="Cerrar" className="size-10 shrink-0 rounded-full bg-bg text-[22px] font-extrabold text-navy">
                ×
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
              {shown.map((p) => (
                <div key={p.slug} className="flex flex-col overflow-hidden rounded-[18px] bg-bg">
                  <Flyer src={p.image} alt={`Flyer ${p.title}`} sizes="(max-width: 600px) 100vw, 260px" />
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3">
                    <Link href={`/planes/${p.slug}`} className="text-[15px] leading-tight font-bold text-navy hover:underline">
                      {p.title}
                    </Link>
                    <a className="btn btn-wa px-3.5 py-2 text-[13px]" href={waLink(p.whatsappText)} target="_blank" rel="noopener">
                      <WhatsAppIcon className="size-4" />
                      Reservar
                    </a>
                  </div>
                </div>
              ))}
              <div className="bg-navy-grad flex flex-col items-center justify-center gap-3 rounded-[18px] p-6 text-center">
                <b className="text-lg text-white">¿Buscas otro destino?</b>
                <span className="text-sm text-mist">Te armamos un plan de {kind} a tu medida.</span>
                <a className="btn btn-yellow" href={waLink(`Hola, quiero cotizar un plan de ${kind}`)} target="_blank" rel="noopener">
                  Cotizar
                </a>
                <Link href={`/viajes/${active.slug}`} className="text-sm font-semibold text-yellow underline-offset-4 hover:underline">
                  Ver todos los planes de {kind} →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
