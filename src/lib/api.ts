import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { categories, company as seedCompany, plans as seedPlans } from "./seed";
import { faqs as seedFaqs } from "./site";
import type { Category, CategorySlug, Company, Faq, NewReview, Plan, PriceOption, Review, TravelerPhoto } from "./types";

// Cliente de la API de NestJS (proyecto api-travel-tours). Todo corre en el servidor:
// el HTML llega completo a Google y a los bots de IA.
//
//   GET  /v1/integracion/tours        -> ApiTour[]
//   GET  /v1/integracion/tours/:id    -> ApiTour
//   GET  /v1/integracion/faqs         -> ApiFaq[]
//   GET  /v1/integracion/servicios    -> (aún vacío, sin usar)
//   GET  /v1/info-empresa/publica     -> ApiCompany[]
//   GET/POST /v1/integracion/opiniones
//   GET  /v1/storage/nc-folder-images?path=Photos/viajeros&recursive=true -> ApiFolderImage[]
//
// Si la API falla se usa el contenido de respaldo de seed.ts para que la web nunca quede vacía.

export const TAGS = { plans: "planes", company: "empresa", faqs: "faqs", reviews: "opiniones", travelers: "viajeros" } as const;

const API_URL = (process.env.API_URL ?? "https://api.travelclubagencia.com").replace(/\/$/, "");

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(process.env.API_KEY ? { "x-api-key": process.env.API_KEY } : {}),
      ...init?.headers,
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`API ${path} respondió ${res.status}`);
  return res.json() as Promise<T>;
}

// ---------- Tours ----------

type ApiTour = {
  id: number;
  id_tour: number;
  nombre_tour: string;
  tipo_tour: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  precio: string;
  precio_por_pareja: boolean;
  modo_precio: string;
  punto_partida: string | null;
  hora_partida: string | null;
  llegada: string | null;
  url_imagen: string | null;
  imagenes: string[] | null;
  link_pdf: string | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  itinerary: { titulo: string; dia_numero: number; descripcion: string }[] | null;
  cupos: number | null;
  es_promocion: boolean;
};

// tipo_tour de la API -> tipos de viaje de la web. Añade aquí los valores que uses en el panel.
const tourTypes: Record<string, { label: string; categories: CategorySlug[]; color: Plan["badge"]["color"] }> = {
  pasadia: { label: "PASADÍA", categories: ["aventura"], color: "green" },
  aventura: { label: "AVENTURA", categories: ["aventura"], color: "green" },
  descanso: { label: "DESCANSO", categories: ["descanso"], color: "yellow" },
  todo_incluido: { label: "TODO INCLUIDO", categories: ["descanso", "sol-y-playa"], color: "yellow" },
  playa: { label: "SOL Y PLAYA", categories: ["sol-y-playa"], color: "sky" },
  aereo: { label: "CON VUELOS", categories: ["sol-y-playa"], color: "sky" },
  nacional: { label: "NACIONAL", categories: ["cultura-y-ciudad"], color: "navy" },
  cultura: { label: "CULTURA", categories: ["cultura-y-ciudad"], color: "navy" },
  ciudad: { label: "CIUDAD", categories: ["cultura-y-ciudad"], color: "navy" },
};

const minorWords = new Set(["de", "del", "la", "las", "el", "los", "y", "a", "en", "con", "al"]);

// "TRAVEL CLUB AGENCIA DE VIAJES" -> "Travel Club Agencia de Viajes"
const titleCase = (s: string) =>
  s
    .toLocaleLowerCase("es-CO")
    .split(" ")
    .map((w, i) => (i > 0 && minorWords.has(w) ? w : w.replace(/(^|[(/-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase("es-CO"))))
    .join(" ");

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const isoDay = (d: string | null) => (d ? d.slice(0, 10) : undefined);

const dayMonth = (iso: string, withYear = false) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });

function datesLabel(start?: string, end?: string) {
  if (!start) return "Fecha a consultar";
  if (!end || end === start) return dayMonth(start, true);
  const ed = dayMonth(end, true);
  // "19 al 22 de enero de 2027" · "30 de noviembre al 2 de diciembre de 2026" · años distintos con ambos años
  if (start.slice(0, 7) === end.slice(0, 7)) return `${Number(start.slice(8, 10))} al ${ed}`;
  return `${dayMonth(start, start.slice(0, 4) !== end.slice(0, 4))} al ${ed}`;
}

function durationLabel(start?: string, end?: string, type?: string) {
  if (!start || !end || start === end) return type === "pasadia" ? "Pasadía" : "1 día";
  const days = Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
  return `${days} días · ${days - 1} ${days - 1 === 1 ? "noche" : "noches"}`;
}

const cop = (n: number) => `$${n.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

function toPlan(t: ApiTour): Plan {
  const title = titleCase(t.nombre_tour.trim());
  const type = tourTypes[t.tipo_tour] ?? { label: t.tipo_tour.toUpperCase(), categories: [], color: "navy" as const };
  const start = isoDay(t.fecha_inicio);
  const end = isoDay(t.fecha_fin);
  const unit: PriceOption["unit"] = t.precio_por_pareja || t.modo_precio === "pareja" ? "pareja" : "persona";
  const price = Math.round(Number(t.precio));
  const destination = titleCase((t.llegada ?? title).trim());
  const departure = t.punto_partida ? titleCase(t.punto_partida.trim()) : "Florencia, Caquetá";
  const dates = datesLabel(start, end);
  const duration = durationLabel(start, end, t.tipo_tour);
  const image = t.imagenes?.find(Boolean) ?? t.url_imagen ?? categories.find((c) => c.slug === type.categories[0])?.image ?? "/images/hero/cartagena.jpg";

  return {
    slug: `${slugify(t.nombre_tour)}-${t.id}`,
    apiId: t.id,
    title,
    subtitle: `${dates} · ${cop(price)} ${unit}`,
    summary: `${duration === "Pasadía" ? "Pasadía" : `Plan de ${duration}`} a ${destination} con Travel Club, saliendo desde ${departure}${start ? ` el ${dates}` : ""}.`,
    destination,
    region: "",
    departureCity: departure,
    departureTime: t.hora_partida?.replace(/O/g, "0") ?? undefined,
    categories: type.categories,
    badge: t.es_promocion ? { label: "PROMOCIÓN", color: "yellow" } : { label: type.label, color: type.color },
    image,
    startDate: start,
    endDate: end,
    datesLabel: dates,
    durationLabel: duration,
    prices: [{ label: unit === "pareja" ? "Por pareja" : "Por persona", price, unit }],
    includes: t.inclusions?.filter(Boolean) ?? [],
    excludes: t.exclusions?.filter(Boolean) ?? [],
    itinerary: (t.itinerary ?? []).map((d) => ({ day: d.dia_numero, title: titleCase(d.titulo), description: d.descripcion })),
    seats: t.cupos ?? undefined,
    pdfUrl: t.link_pdf ?? undefined,
    whatsappText: `Hola, quiero información del plan ${title}`,
  };
}

export async function getPlans(): Promise<Plan[]> {
  "use cache";
  cacheTag(TAGS.plans);
  try {
    const tours = await api<ApiTour[]>("/v1/integracion/tours");
    cacheLife("hours");
    return tours.map(toPlan).sort((a, b) => (a.startDate ?? "9").localeCompare(b.startDate ?? "9"));
  } catch (err) {
    console.error("[api] getPlans falló, usando contenido de respaldo:", err);
    cacheLife("minutes");
    return seedPlans;
  }
}

export async function getPlan(slug: string) {
  return (await getPlans()).find((p) => p.slug === slug);
}

export async function getPlansByCategory(slug: CategorySlug) {
  return (await getPlans()).filter((p) => p.categories.includes(slug));
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// ---------- Empresa ----------

type ApiCompany = {
  nombre: string;
  direccion_sede_principal: string | null;
  mision: string | null;
  vision: string | null;
  detalles_empresa: string | null;
  horario_virtual: string | null;
  redes_sociales: { red: string; url: string }[] | null;
  nombre_gerente: string | null;
  telefono: string | null;
  correo: string | null;
  rnt: string | null;
  politicas: { titulo: string; contenido: string }[] | null;
};

const cleanUrl = (u: string) => {
  try {
    const url = new URL(u);
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return u;
  }
};

export async function getCompany(): Promise<Company> {
  "use cache";
  cacheTag(TAGS.company);
  try {
    const [c] = await api<ApiCompany[]>("/v1/info-empresa/publica");
    if (!c) throw new Error("info-empresa vacía");
    cacheLife("days");
    const [street, cityRegion] = (c.direccion_sede_principal ?? "").split(" · ");
    const [city, region] = (cityRegion ?? "").split(",").map((s) => s.trim());
    const digits = (c.telefono ?? "").replace(/\D/g, "");
    return {
      ...seedCompany,
      legalName: titleCase(c.nombre),
      rnt: c.rnt ?? seedCompany.rnt,
      phone: c.telefono ?? seedCompany.phone,
      phoneDisplay: digits ? digits.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") : seedCompany.phoneDisplay,
      whatsapp: digits || seedCompany.whatsapp,
      email: c.correo ?? seedCompany.email,
      street: street || seedCompany.street,
      city: city || seedCompany.city,
      region: region || seedCompany.region,
      mission: c.mision ?? seedCompany.mission,
      vision: c.vision ?? seedCompany.vision,
      about: c.detalles_empresa ?? seedCompany.about,
      managerName: c.nombre_gerente ?? seedCompany.managerName,
      virtualHours: c.horario_virtual ?? undefined,
      socials: (c.redes_sociales ?? []).map((s) => ({ name: s.red, url: cleanUrl(s.url) })),
      policies: (c.politicas ?? []).map((p) => ({ title: p.titulo, content: p.contenido })),
    };
  } catch (err) {
    console.error("[api] getCompany falló, usando datos de respaldo:", err);
    cacheLife("minutes");
    return seedCompany;
  }
}

// ---------- FAQs ----------

type ApiFaq = Record<string, unknown>;
const pick = (o: ApiFaq, keys: string[]) => keys.map((k) => o[k]).find((v): v is string => typeof v === "string" && v.trim() !== "");

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  try {
    const rows = await api<ApiFaq[]>("/v1/integracion/faqs");
    cacheLife("days");
    const faqs = rows
      .map((r) => ({ q: pick(r, ["pregunta", "question", "titulo"]), a: pick(r, ["respuesta", "answer", "contenido"]) }))
      .filter((f): f is Faq => !!f.q && !!f.a);
    return faqs.length ? faqs : seedFaqs;
  } catch (err) {
    console.error("[api] getFaqs falló:", err);
    cacheLife("minutes");
    return seedFaqs;
  }
}

// ---------- Opiniones (endpoint en desarrollo en la API) ----------
//
//   POST /v1/integracion/opiniones  <- { nombre, plan?, opinion, calificacion }
//   GET  /v1/integracion/opiniones  -> [{ id, nombre, plan, opinion, calificacion, fecha_creacion }]
//                                      (solo aprobadas, más recientes primero)

const REVIEWS_PATH = "/v1/integracion/opiniones";

type ApiReview = {
  id: number | string;
  nombre: string;
  plan?: string | null;
  opinion: string;
  calificacion: number | string;
  fecha_creacion: string;
};

function toReview(r: ApiReview): Review | null {
  const text = r.opinion?.trim();
  const name = r.nombre?.trim();
  if (!text || !name) return null;
  return {
    id: String(r.id),
    name,
    plan: r.plan?.trim() || undefined,
    text,
    stars: Math.min(5, Math.max(1, Math.round(Number(r.calificacion)) || 5)),
    createdAt: r.fecha_creacion,
  };
}

export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheTag(TAGS.reviews);
  try {
    const rows = await api<ApiReview[]>(REVIEWS_PATH);
    cacheLife("hours");
    return rows
      .map(toReview)
      .filter((r): r is Review => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    console.error("[api] getReviews falló:", err);
    cacheLife("minutes");
    return [];
  }
}

export async function createReview(review: NewReview) {
  const body: Omit<ApiReview, "id" | "fecha_creacion"> = {
    nombre: review.name,
    ...(review.plan ? { plan: review.plan } : {}),
    opinion: review.text,
    calificacion: review.stars,
  };
  await api<unknown>(REVIEWS_PATH, { method: "POST", body: JSON.stringify(body) });
}

// ---------- Galería de viajeros ----------
//
// Fotos de la carpeta Photos/viajeros del almacenamiento. Las subcarpetas (una por viaje,
// ej. "Photos/viajeros/Santa Marta noviembre 2026") se usan como pie de foto.

const TRAVELERS_FOLDER = process.env.TRAVELERS_FOLDER ?? "Photos/viajeros";

type ApiFolderImage = { filename: string; ncPath: string; url: string };

function toTravelerPhoto(img: ApiFolderImage): TravelerPhoto | null {
  if (!img.url) return null;
  const rel = img.ncPath.slice(TRAVELERS_FOLDER.length + 1).split("/");
  const trip = rel.length > 1 ? rel.slice(0, -1).join(" · ").replace(/[_-]+/g, " ").trim() : undefined;
  return {
    id: img.ncPath,
    url: img.url.replace(/^http:\/\//, "https://"),
    trip: trip || undefined,
  };
}

export async function getTravelerPhotos(): Promise<TravelerPhoto[]> {
  "use cache";
  cacheTag(TAGS.travelers);
  try {
    const images = await api<ApiFolderImage[]>(
      `/v1/storage/nc-folder-images?path=${encodeURIComponent(TRAVELERS_FOLDER)}&recursive=true`,
    );
    cacheLife("hours");
    return images.map(toTravelerPhoto).filter((p): p is TravelerPhoto => p !== null);
  } catch (err) {
    console.error("[api] getTravelerPhotos falló:", err);
    cacheLife("minutes");
    return [];
  }
}
