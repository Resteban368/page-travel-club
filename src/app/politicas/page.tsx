import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { getCompany } from "@/lib/api";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Políticas, condiciones y restricciones",
  description:
    "Condiciones de reserva, medios de pago, equipaje, cancelación y no reembolso, acomodación y transporte de los planes de Travel Club, agencia de viajes con RNT 302421.",
  alternates: { canonical: "/politicas" },
};

const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function PoliciesPage() {
  const company = await getCompany();

  return (
    <main className="wrap max-w-3xl pt-8 pb-2">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Políticas", path: "/politicas" }])} />

      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-navy">Inicio</Link> / <span className="font-semibold text-navy">Políticas</span>
      </nav>

      <p className="text-xs font-bold tracking-[0.24em] text-sky">CONDICIONES DEL SERVICIO</p>
      <h1 className="mt-2 text-[clamp(30px,4.5vw,46px)] leading-[1.1] font-extrabold text-navy">
        Políticas y <span className="text-yellow">condiciones</span>
      </h1>
      <p className="mt-3 text-muted">
        {company.legalName} · RNT {company.rnt}. Al reservar cualquiera de nuestros planes aceptas estas condiciones.
      </p>

      <nav aria-label="Contenido" className="mt-6 rounded-[18px] bg-white p-5 shadow-card">
        <ol className="grid list-decimal gap-1 pl-5 text-[15px] sm:grid-cols-2">
          {company.policies.map((p) => (
            <li key={p.title}><a href={`#${slug(p.title)}`} className="text-blue hover:underline">{p.title}</a></li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 grid gap-5">
        {company.policies.map((p, i) => (
          <section key={p.title} id={slug(p.title)} className="scroll-mt-24 rounded-[22px] bg-white p-7 shadow-card">
            <h2 className="flex gap-3 text-xl font-bold text-navy">
              <span className="grid size-8 flex-none place-items-center rounded-full bg-navy text-sm text-white">{i + 1}</span>
              {p.title}
            </h2>
            <p className="mt-3 whitespace-pre-line text-muted">{p.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
