import { site } from "./site";
import type { Company, Faq, Plan } from "./types";

// Datos estructurados schema.org. Google los usa para resultados enriquecidos y
// los buscadores con IA para entender quién eres, dónde estás y qué vendes.

const agencyId = `${site.url}/#agencia`;

export function agencyJsonLd(c: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": agencyId,
    name: site.name,
    legalName: c.legalName,
    url: site.url,
    logo: `${site.url}/images/logo.png`,
    image: `${site.url}/images/hero/cartagena.jpg`,
    description: site.description,
    slogan: "Viaja, vive y crea recuerdos inolvidables",
    email: c.email,
    telephone: c.phone,
    foundingDate: site.foundingDate,
    priceRange: "$$",
    currenciesAccepted: "COP",
    paymentAccepted: "Transferencia bancaria, Efectivo",
    address: {
      "@type": "PostalAddress",
      streetAddress: c.street,
      addressLocality: c.city,
      addressRegion: c.region,
      addressCountry: "CO",
    },
    areaServed: [
      { "@type": "State", name: "Caquetá" },
      { "@type": "Country", name: "Colombia" },
    ],
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.hours
      .filter((h) => "days" in h)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "days" in h ? h.days : [],
        opens: "opens" in h ? h.opens : undefined,
        closes: "closes" in h ? h.closes : undefined,
      })),
    identifier: { "@type": "PropertyValue", name: "Registro Nacional de Turismo (RNT)", value: c.rnt },
    employee: { "@type": "Person", name: c.managerName, jobTitle: site.manager.role },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: c.phone,
      contactType: "reservations",
      availableLanguage: "es",
    },
    ...(c.socials.length ? { sameAs: c.socials.map((s) => s.url) } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#web`,
    url: site.url,
    name: site.name,
    inLanguage: "es-CO",
    publisher: { "@id": agencyId },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function planJsonLd(plan: Plan) {
  const url = `${site.url}/planes/${plan.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#viaje`,
    name: plan.title,
    description: plan.summary,
    url,
    image: plan.image.startsWith("http") ? plan.image : `${site.url}${plan.image}`,
    touristType: plan.categories,
    provider: { "@id": agencyId },
    itinerary: plan.itinerary?.length
      ? {
          "@type": "ItemList",
          itemListElement: plan.itinerary.map((d) => ({ "@type": "ListItem", position: d.day, name: d.title, description: d.description })),
        }
      : { "@type": "Place", name: plan.destination, address: { "@type": "PostalAddress", addressLocality: plan.destination, ...(plan.region ? { addressRegion: plan.region } : {}), addressCountry: "CO" } },
    ...(plan.startDate ? { startDate: plan.startDate } : {}),
    ...(plan.endDate ? { endDate: plan.endDate } : {}),
    offers: plan.prices.map((p) => ({
      "@type": "Offer",
      name: `${plan.title} · ${p.label}`,
      price: p.price,
      priceCurrency: "COP",
      availability: "https://schema.org/LimitedAvailability",
      url,
      seller: { "@id": agencyId },
      ...(plan.startDate ? { validThrough: plan.startDate } : {}),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}
