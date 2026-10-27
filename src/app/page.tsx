import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { GiftIcon, PinIcon, PlaneIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PlanCard } from "@/components/plan-card";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/reviews";
import { SectionHead } from "@/components/section-head";
import { TravelerGallery } from "@/components/traveler-gallery";
import { TripTypes } from "@/components/trip-types";
import { getCategories, getCompany, getFaqs, getPlans, getTravelerPhotos } from "@/lib/api";
import { faqJsonLd } from "@/lib/jsonld";
import { policies, site, waLink } from "@/lib/site";

const steps = [
  { n: 1, title: "Elige tu plan", text: "Escríbenos por WhatsApp con el plan y la fecha que te interesa.", color: "border-sky", dot: "bg-sky text-white" },
  { n: 2, title: "Envía tus datos", text: "Nombre completo, número de documento y celular de cada viajero.", color: "border-green", dot: "bg-green text-white" },
  { n: 3, title: "Paga y listo", text: "Transferencia o efectivo. Envía el comprobante y recibe tu factura.", color: "border-yellow", dot: "bg-yellow text-navy" },
];

export default async function Home() {
  const [plans, company, faqs, travelers] = await Promise.all([getPlans(), getCompany(), getFaqs(), getTravelerPhotos()]);
  const [aboutLead, ...aboutRest] = company.about.split(/(?<=\d{4}\.)\s+/);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="relative flex min-h-[600px] items-center overflow-hidden text-white" id="inicio">
        <HeroCarousel />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgb(6_22_51/0.9)_0%,rgb(6_22_51/0.6)_45%,rgb(6_22_51/0.1)_80%)]" />
        <div className="wrap relative z-[2] pt-[70px] pb-[150px] md:pb-[110px]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky px-4 py-1.5 text-[13px] font-bold">
            <PinIcon className="size-4" />
            Agencia de viajes en Florencia, Caquetá
          </p>
          <h1 className="max-w-[13ch] text-[clamp(40px,6vw,74px)] leading-none font-extrabold tracking-[-0.02em]">
            Viaja, vive y crea <span className="text-yellow">recuerdos inolvidables</span>
          </h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="btn btn-yellow" href="#promociones">Ver promociones</a>
            <a className="btn btn-ghost" href={waLink("Hola, quiero cotizar un viaje")} target="_blank" rel="noopener">
              Cotiza tu viaje
            </a>
          </div>
        </div>
        <svg className="absolute inset-x-0 -bottom-px z-[3] block h-[70px] w-full" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden>
          <path d="M0 40 C480 4 960 4 1440 30 L1440 70 L0 70Z" fill="#F6BB26" />
          <path d="M0 50 C480 16 960 16 1440 40 L1440 70 L0 70Z" fill="#1BA6E3" />
          <path d="M0 58 C480 28 960 28 1440 50 L1440 70 L0 70Z" fill="#62B946" />
          <path d="M0 64 C480 38 960 38 1440 60 L1440 70 L0 70Z" fill="#F4F7FC" />
        </svg>
      </section>

      <main>
        <section className="wrap pt-16 pb-2" id="tipos-de-viaje">
          <SectionHead eyebrow="TIPOS DE VIAJE" title="¿Qué tipo de viaje" accent="buscas?" intro="Elige tu estilo y te mostramos los planes disponibles." />
          <TripTypes categories={getCategories()} plans={plans} />
        </section>

        <section className="wrap pt-16 pb-2" id="promociones">
          <SectionHead eyebrow="PROMOCIONES" title="Promos" accent="del momento" intro="Cupos limitados. Toca el flyer para verlo completo." />
          {plans.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((p) => (
                <PlanCard key={p.slug} plan={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-[22px] bg-white p-8 text-center text-muted">
              Estamos preparando nuevas salidas.{" "}
              <a href={waLink("Hola, quiero conocer los próximos planes")} className="font-semibold text-blue hover:underline">Escríbenos por WhatsApp</a> y te contamos las próximas fechas.
            </p>
          )}
        </section>

        <section className="wrap pt-16 pb-2" id="nosotros">
          <SectionHead eyebrow="QUIÉNES SOMOS" title="Sobre" accent="nosotros" />
          <div className="grid items-stretch gap-6 md:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[22px] border-l-6 border-sky bg-white p-[30px] shadow-card">
              <p className="mb-3.5 text-[19px] font-medium text-navy">{aboutLead}</p>
              {aboutRest.length > 0 && <p className="text-muted">{aboutRest.join(" ")}</p>}
            </div>
            <aside className="bg-navy-grad flex flex-col items-center justify-center gap-1 rounded-[22px] p-[30px] text-center text-white">
              <Image
                src={site.manager.image}
                alt={company.managerName}
                width={150}
                height={150}
                className="mb-4 size-[150px] rounded-full object-cover object-[center_20%] outline-6 outline-offset-4 outline-yellow"
              />
              <b className="text-[22px] leading-tight">
                {company.managerName}
              </b>
              <span className="text-[13px] font-bold tracking-[0.16em] text-yellow uppercase">{site.manager.role}</span>
              <q className="mt-3.5 max-w-[26ch] text-[15px] text-mist italic">{site.manager.quote}</q>
            </aside>
          </div>
          <div className="mt-[22px] grid gap-5 md:grid-cols-2">
            <div className="rounded-[22px] border-t-6 border-sky bg-white p-7 shadow-card">
              <i className="grid size-[52px] place-items-center rounded-2xl bg-sky"><PlaneIcon className="size-[26px] text-white" /></i>
              <h3 className="mt-3.5 mb-1.5 text-[22px] font-bold text-navy">Misión</h3>
              <p className="text-muted">{company.mission}</p>
            </div>
            <div className="rounded-[22px] border-t-6 border-yellow bg-white p-7 shadow-card">
              <i className="grid size-[52px] place-items-center rounded-2xl bg-yellow"><GiftIcon className="size-[26px] text-navy" /></i>
              <h3 className="mt-3.5 mb-1.5 text-[22px] font-bold text-navy">Visión</h3>
              <p className="text-muted">{company.vision}</p>
            </div>
          </div>
        </section>

        <section className="wrap pt-16 pb-2" id="como-reservar">
          <SectionHead eyebrow="CÓMO RESERVAR" title="Reserva en" accent="3 pasos" />
          <ol className="grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className={`rounded-[22px] border-t-6 bg-white p-[26px] shadow-card ${s.color}`}>
                <span className={`grid size-[50px] place-items-center rounded-full text-[21px] font-extrabold ${s.dot}`}>{s.n}</span>
                <h3 className="mt-3.5 mb-1 font-bold text-navy">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {travelers.length > 0 && (
          <section className="wrap pt-16 pb-2" id="viajeros">
            <SectionHead eyebrow="NUESTROS VIAJEROS" title="Ellos ya viajaron" accent="con nosotros" intro="Grupos que salieron desde el Caquetá a vivir una nueva aventura." />
            <TravelerGallery photos={travelers.slice(0, 8)} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 270px" />
            {travelers.length > 8 && (
              <div className="mt-6 text-center">
                <Link href="/viajeros" className="btn btn-navy">Ver las {travelers.length} fotos</Link>
              </div>
            )}
          </section>
        )}

        <section className="wrap pt-16 pb-2" id="opiniones">
          <SectionHead eyebrow="OPINIONES" title="Lo que dicen" accent="nuestros viajeros" intro="¿Ya viajaste con nosotros? Cuéntanos cómo te fue." />
          <div className="grid items-start gap-[22px] md:grid-cols-[340px_1fr]">
            <ReviewForm />
            <div className="grid gap-[18px] sm:grid-cols-2">
              <Suspense fallback={null}>
                <ReviewList />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="wrap pt-16 pb-2" id="preguntas">
          <SectionHead eyebrow="PREGUNTAS FRECUENTES" title="¿Tienes" accent="dudas?" />
          <div className="mx-auto grid max-w-3xl gap-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-[18px] bg-white px-6 py-4 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
                  <h3>{f.q}</h3>
                  <span className="text-2xl text-sky transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-2 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="wrap grid gap-5 pt-16 pb-2 md:grid-cols-2" id="contacto">
          <div className="rounded-[22px] bg-white p-7 shadow-card">
            <h2 className="mb-3.5 text-[21px] font-bold text-navy">Políticas de reserva</h2>
            <ol className="grid list-none gap-3">
              {policies.map((p, i) => (
                <li key={p} className="flex gap-3 text-[15px]">
                  <span className="grid size-7 flex-none place-items-center rounded-full bg-navy text-[13px] font-bold text-white">{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
            <Link href="/politicas" className="mt-5 inline-block text-sm font-semibold text-blue hover:underline">
              Ver todas las políticas y condiciones →
            </Link>
          </div>
          <div className="bg-navy-grad rounded-[22px] p-7 text-white">
            <h2 className="mb-3.5 text-[21px] font-bold">Dónde estamos</h2>
            <address className="not-italic">
              <div className="text-[19px] font-bold">{company.street}</div>
              <div className="text-mist">
                {company.city}, {company.region} · <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
              </div>
            </address>
            <dl className="my-[18px] grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-[14px] bg-white/8 px-4 py-3.5">
              {site.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-mist">{h.label}</dt>
                  <dd className="font-bold text-yellow">{h.value}</dd>
                </div>
              ))}
              {company.virtualHours && (
                <div className="contents">
                  <dt className="text-mist">Atención virtual</dt>
                  <dd className="font-bold text-yellow">{company.virtualHours}</dd>
                </div>
              )}
            </dl>
            <div className="flex flex-wrap gap-2.5">
              <a className="btn btn-yellow" href={site.mapsUrl} target="_blank" rel="noopener">
                <PinIcon className="size-[19px]" />
                Google Maps
              </a>
              <a className="btn btn-wa" href={waLink()} target="_blank" rel="noopener">
                <WhatsAppIcon className="size-[19px]" />
                {company.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
