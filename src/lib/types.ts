// Modelo interno de la web. src/lib/api.ts traduce las respuestas de la API de NestJS a estos tipos.

export type CategorySlug = "aventura" | "descanso" | "sol-y-playa" | "cultura-y-ciudad";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  color: "green" | "yellow" | "sky" | "navy";
};

export type PriceOption = {
  label: string;
  /** Precio en COP, sin decimales. */
  price: number;
  unit: "persona" | "pareja";
  recommended?: boolean;
};

export type ItineraryDay = { day: number; title: string; description: string };

export type Plan = {
  slug: string;
  /** id de la API, para GET /v1/integracion/tours/:id */
  apiId?: number;
  title: string;
  /** Texto corto para la tarjeta: fechas + precio. */
  subtitle: string;
  summary: string;
  destination: string;
  region: string;
  departureCity: string;
  departureTime?: string;
  categories: CategorySlug[];
  badge: { label: string; color: "green" | "yellow" | "sky" | "navy" };
  image: string;
  /** Fechas ISO (YYYY-MM-DD). Opcionales para pasadías con fecha abierta. */
  startDate?: string;
  endDate?: string;
  /** Fechas legibles, ej: "19 al 22 de enero de 2027". */
  datesLabel: string;
  durationLabel: string;
  prices: PriceOption[];
  includes: string[];
  excludes?: string[];
  itinerary?: ItineraryDay[];
  seats?: number;
  pdfUrl?: string;
  whatsappText: string;
};

export type Review = {
  id: string;
  name: string;
  plan?: string;
  text: string;
  stars: number;
  /** ISO date */
  createdAt: string;
};

export type NewReview = Omit<Review, "id" | "createdAt">;

export type Faq = { q: string; a: string };

export type Policy = { title: string; content: string };

export type TravelerPhoto = {
  id: string;
  url: string;
  /** Nombre del viaje, tomado de la subcarpeta dentro de Photos/viajeros. */
  trip?: string;
};

export type Company = {
  name: string;
  legalName: string;
  rnt: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  street: string;
  city: string;
  region: string;
  mission: string;
  vision: string;
  about: string;
  managerName: string;
  virtualHours?: string;
  socials: { name: string; url: string }[];
  policies: Policy[];
};
