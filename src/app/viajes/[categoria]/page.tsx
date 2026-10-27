import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PlanCard } from "@/components/plan-card";
import { getCategories, getCategory, getPlansByCategory } from "@/lib/api";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site, waLink } from "@/lib/site";

export function generateStaticParams() {
  return getCategories().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/viajes/[categoria]">): Promise<Metadata> {
  const cat = getCategory((await params).categoria);
  if (!cat) return {};
  return {
    title: `${cat.title} desde Florencia, Caquetá`,
    description: cat.description,
    alternates: { canonical: `/viajes/${cat.slug}` },
    openGraph: { url: `/viajes/${cat.slug}`, title: cat.title, description: cat.description, images: [cat.image] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/viajes/[categoria]">) {
  const cat = getCategory((await params).categoria);
  if (!cat) notFound();
  const plans = await getPlansByCategory(cat.slug);
  const kind = cat.title.replace("Planes de ", "");

  return (
    <main className="wrap pt-8 pb-2">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Tipos de viaje", path: "/#tipos-de-viaje" },
          { name: cat.name, path: `/viajes/${cat.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: cat.title,
          itemListElement: plans.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/planes/${p.slug}`, name: p.title })),
        }}
      />

      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/" className="hover:text-navy">Inicio</Link> /</li>
          <li><Link href="/#tipos-de-viaje" className="hover:text-navy">Tipos de viaje</Link> /</li>
          <li aria-current="page" className="font-semibold text-navy">{cat.name}</li>
        </ol>
      </nav>

      <header className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <Image src={cat.image} alt="" width={160} height={160} className="size-40 rounded-full object-cover outline-6 -outline-offset-1 outline-yellow" priority />
        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-sky">TIPOS DE VIAJE</p>
          <h1 className="mt-2 text-[clamp(30px,4.5vw,48px)] leading-[1.1] font-extrabold text-navy">
            {cat.title} <span className="text-yellow">desde Florencia</span>
          </h1>
          <p className="mt-3 max-w-[60ch] text-muted">{cat.description}</p>
        </div>
      </header>

      {plans.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p, i) => <PlanCard key={p.slug} plan={p} priority={i === 0} />)}
        </div>
      ) : (
        <p className="rounded-[22px] bg-white p-8 text-center text-muted">Pronto publicaremos nuevos planes de {kind}.</p>
      )}

      <div className="bg-navy-grad mt-10 flex flex-col items-center gap-3 rounded-[22px] p-8 text-center text-white">
        <b className="text-xl">¿Buscas otro destino?</b>
        <span className="text-mist">Te armamos un plan de {kind} a tu medida.</span>
        <a className="btn btn-yellow" href={waLink(`Hola, quiero cotizar un plan de ${kind}`)} target="_blank" rel="noopener">Cotizar por WhatsApp</a>
      </div>
    </main>
  );
}
