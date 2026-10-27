import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api";
import { site, waLink } from "@/lib/site";
import type { Company } from "@/lib/types";
import { WhatsAppIcon } from "./icons";

export function SiteFooter({ company: c }: { company: Company }) {
  return (
    <>
      <footer className="relative mt-16 bg-navy-d pt-11 pb-24 text-sm text-[#B9C6E0]">
        <div className="stripe absolute inset-x-0 top-0 h-[5px]" />
        <div className="wrap grid gap-7 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-block rounded-2xl bg-white px-3.5 py-2.5">
              <Image src="/images/logo.png" alt={site.name} width={160} height={48} className="h-12 w-auto" />
            </span>
            <p className="mt-4">Agencia de viajes de Florencia, Caquetá. Planes nacionales e internacionales a tu medida.</p>
          </div>
          <div>
            <h2 className="mb-2.5 text-[13px] font-semibold tracking-[0.14em] text-white">EXPLORA</h2>
            <ul className="grid gap-1.5">
              <li><Link href="/#promociones" className="hover:text-white">Promociones</Link></li>
              <li><Link href="/viajeros" className="hover:text-white">Nuestros viajeros</Link></li>
              <li><Link href="/#opiniones" className="hover:text-white">Opiniones</Link></li>
              <li><Link href="/#preguntas" className="hover:text-white">Preguntas frecuentes</Link></li>
              <li><Link href="/politicas" className="hover:text-white">Políticas y condiciones</Link></li>
              {c.socials.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener me" className="hover:text-white">{s.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2.5 text-[13px] font-semibold tracking-[0.14em] text-white">TIPOS DE VIAJE</h2>
            <ul className="grid gap-1.5">
              {getCategories().map((c) => (
                <li key={c.slug}><Link href={`/viajes/${c.slug}`} className="hover:text-white">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <address className="not-italic">
            <h2 className="mb-2.5 text-[13px] font-semibold tracking-[0.14em] text-white">CONTACTO</h2>
            <ul className="grid gap-1.5">
              <li><a href={waLink()} className="hover:text-white">WhatsApp {c.phoneDisplay}</a></li>
              <li><a href={`mailto:${c.email}`} className="hover:text-white">{c.email}</a></li>
              <li>{c.street}, {c.city}, {c.region}</li>
              <li className="font-bold text-yellow">RNT {c.rnt}</li>
            </ul>
          </address>
        </div>
      </footer>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="Escribir por WhatsApp"
        className="fixed right-[18px] bottom-[calc(18px+env(safe-area-inset-bottom,0px))] z-50 grid size-[60px] place-items-center rounded-full bg-wa shadow-[0_12px_26px_-8px_rgb(34_195_94/0.7)]"
      >
        <WhatsAppIcon className="size-[31px] text-white" />
      </a>
    </>
  );
}
