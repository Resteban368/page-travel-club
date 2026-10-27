import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { TravelerGallery } from "@/components/traveler-gallery";
import { getTravelerPhotos } from "@/lib/api";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nuestros viajeros: fotos de los grupos que han viajado con nosotros",
  description:
    "Galería de fotos de los viajeros de Travel Club, agencia de viajes en Florencia, Caquetá: grupos en Cartagena, Santa Marta, La Mano del Gigante y más destinos.",
  alternates: { canonical: "/viajeros" },
};

export default async function TravelersPage() {
  const photos = await getTravelerPhotos();

  return (
    <main className="wrap pt-8 pb-2">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Viajeros", path: "/viajeros" }])} />
      {photos.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Viajeros de Travel Club",
            url: `${site.url}/viajeros`,
            author: { "@id": `${site.url}/#agencia` },
            image: photos.slice(0, 50).map((p) => ({ "@type": "ImageObject", contentUrl: p.url, ...(p.trip ? { caption: p.trip } : {}) })),
          }}
        />
      )}

      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-navy">Inicio</Link> / <span className="font-semibold text-navy">Viajeros</span>
      </nav>

      <header className="mb-8 text-center">
        <p className="text-xs font-bold tracking-[0.24em] text-sky">NUESTROS VIAJEROS</p>
        <h1 className="mt-2 text-[clamp(30px,4.5vw,46px)] leading-[1.1] font-extrabold text-navy">
          Ellos ya viajaron <span className="text-yellow">con nosotros</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[56ch] text-muted">
          Cada foto es un grupo que salió desde el Caquetá a vivir una nueva aventura. Toca una foto para verla completa.
        </p>
      </header>

      {photos.length ? (
        <TravelerGallery photos={photos} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 270px" />
      ) : (
        <p className="rounded-[22px] bg-white p-8 text-center text-muted">Muy pronto compartiremos aquí las fotos de nuestros viajeros.</p>
      )}

      <div className="bg-navy-grad mt-10 flex flex-col items-center gap-3 rounded-[22px] p-8 text-center text-white">
        <b className="text-xl">¿Quieres ser el próximo en la galería?</b>
        <span className="text-mist">Escríbenos y te ayudamos a elegir tu próximo viaje.</span>
        <a className="btn btn-wa" href={waLink("Hola, quiero viajar con Travel Club")} target="_blank" rel="noopener">
          <WhatsAppIcon className="size-[19px]" />
          Quiero viajar
        </a>
      </div>
    </main>
  );
}
