import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flyer } from "@/components/flyer";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PlanCard } from "@/components/plan-card";
import { getCategory, getPlan, getPlans } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import { breadcrumbJsonLd, planJsonLd } from "@/lib/jsonld";
import { policies, waLink } from "@/lib/site";

export async function generateStaticParams() {
  return (await getPlans()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planes/[slug]">): Promise<Metadata> {
  const plan = await getPlan((await params).slug);
  if (!plan) return {};
  const price = plan.prices[0];
  return {
    title: `${plan.title} desde ${formatCOP(price.price)}`,
    description: `${plan.summary} ${plan.durationLabel}. Reserva por WhatsApp con Travel Club, agencia de viajes en Florencia, Caquetá.`,
    alternates: { canonical: `/planes/${plan.slug}` },
    openGraph: {
      type: "website",
      url: `/planes/${plan.slug}`,
      title: plan.title,
      description: plan.summary,
      images: [{ url: plan.image, alt: plan.title }],
    },
  };
}

export default async function PlanPage({ params }: PageProps<"/planes/[slug]">) {
  const { slug } = await params;
  const plan = await getPlan(slug);
  if (!plan) notFound();

  const related = (await getPlans()).filter((p) => p.slug !== plan.slug && p.categories.some((c) => plan.categories.includes(c))).slice(0, 3);

  return (
    <main className="wrap pt-8 pb-2">
      <JsonLd data={planJsonLd(plan)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Planes", path: "/#promociones" },
          { name: plan.title, path: `/planes/${plan.slug}` },
        ])}
      />

      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/" className="hover:text-navy">Inicio</Link> /</li>
          <li><Link href="/#promociones" className="hover:text-navy">Planes</Link> /</li>
          <li aria-current="page" className="font-semibold text-navy">{plan.title}</li>
        </ol>
      </nav>

      <article className="grid items-start gap-8 md:grid-cols-[minmax(0,420px)_1fr]">
        <div className="relative overflow-hidden rounded-[22px] bg-white shadow-lift md:sticky md:top-24">
          <Flyer src={plan.image} alt={`Flyer ${plan.title}`} sizes="(max-width: 768px) 100vw, 420px" priority />
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.24em] text-sky uppercase">
            {plan.region ? `${plan.destination}, ${plan.region}` : plan.destination} · {plan.durationLabel}
          </p>
          <h1 className="mt-2 text-[clamp(32px,5vw,52px)] leading-[1.05] font-extrabold text-navy">{plan.title}</h1>
          <p className="mt-4 text-lg text-muted">{plan.summary}</p>
          {plan.seats != null && plan.seats > 0 && (
            <p className="mt-3 inline-flex rounded-full bg-yellow/20 px-3 py-1 text-sm font-bold text-navy">Quedan {plan.seats} cupos</p>
          )}

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <dt className="text-xs font-bold tracking-wider text-muted uppercase">Fechas</dt>
              <dd className="font-bold text-navy">{plan.datesLabel}</dd>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <dt className="text-xs font-bold tracking-wider text-muted uppercase">Duración</dt>
              <dd className="font-bold text-navy">{plan.durationLabel}</dd>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-card">
              <dt className="text-xs font-bold tracking-wider text-muted uppercase">Salida</dt>
              <dd className="font-bold text-navy">
                {plan.departureCity}
                {plan.departureTime && <span className="block text-sm font-medium text-muted">{plan.departureTime}</span>}
              </dd>
            </div>
          </dl>

          {plan.includes.length > 0 && (
            <>
              <h2 className="mt-8 text-2xl font-bold text-navy">Qué incluye</h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckIcon className="mt-0.5 size-5 flex-none text-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {plan.excludes && plan.excludes.length > 0 && (
            <>
              <h2 className="mt-8 text-2xl font-bold text-navy">No incluye</h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {plan.excludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-muted">
                    <span className="grid size-5 flex-none place-items-center rounded-full bg-line text-xs font-bold text-muted" aria-hidden>×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {plan.itinerary && plan.itinerary.length > 0 && (
            <>
              <h2 className="mt-8 text-2xl font-bold text-navy">Itinerario</h2>
              <ol className="mt-3 grid gap-3">
                {plan.itinerary.map((d) => (
                  <li key={`${d.day}-${d.title}`} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card">
                    <span className="grid size-11 flex-none place-items-center rounded-full bg-sky text-sm font-extrabold text-white">D{d.day}</span>
                    <div>
                      <h3 className="font-bold text-navy">{d.title}</h3>
                      <p className="text-muted">{d.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          <h2 className="mt-8 text-2xl font-bold text-navy">Precio</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {plan.prices.map((p) => (
              <div key={p.label} className={`relative rounded-2xl p-5 ${p.recommended ? "bg-navy-grad text-white" : "bg-white shadow-card"}`}>
                {p.recommended && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-yellow px-2.5 py-0.5 text-[11px] font-extrabold text-navy">RECOMENDADO</span>
                )}
                <div className={`text-xs font-bold tracking-[0.14em] uppercase ${p.recommended ? "text-yellow" : "text-muted"}`}>{p.label}</div>
                <div className={`text-3xl font-extrabold ${p.recommended ? "" : "text-navy"}`}>{formatCOP(p.price)}</div>
                <div className={`text-sm ${p.recommended ? "text-mist" : "text-muted"}`}>por {p.unit}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn btn-wa" href={waLink(plan.whatsappText)} target="_blank" rel="noopener">
              <WhatsAppIcon className="size-[19px]" />
              Reservar por WhatsApp
            </a>
            {plan.pdfUrl && (
              <a className="btn btn-navy" href={plan.pdfUrl} target="_blank" rel="noopener">
                Ver programa (PDF)
              </a>
            )}
            {plan.categories.map((c) => {
              const cat = getCategory(c);
              return cat ? (
                <Link key={c} href={`/viajes/${c}`} className="btn bg-white text-navy shadow-card">
                  {cat.icon} {cat.name}
                </Link>
              ) : null;
            })}
          </div>

          <h2 className="mt-10 text-xl font-bold text-navy">Políticas de reserva</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-muted">
            {policies.map((p) => <li key={p}>{p}</li>)}
          </ol>
          <Link href="/politicas" className="mt-3 inline-block text-sm font-semibold text-blue hover:underline">
            Ver condiciones completas →
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pt-16">
          <h2 className="mb-6 text-center text-[clamp(24px,3vw,34px)] font-extrabold text-navy">
            También te puede <span className="text-yellow">interesar</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <PlanCard key={p.slug} plan={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
