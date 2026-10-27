// Datos del negocio: una sola fuente de verdad para la UI, metadata, JSON-LD y llms.txt.

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Travel Club",
  legalName: "Travel Club Agencia de Viajes",
  url: resolveSiteUrl(),
  locale: "es_CO",
  description:
    "Agencia de viajes en Florencia, Caquetá. Planes grupales nacionales e internacionales por tierra y aire: Cartagena todo incluido, Santa Marta, parapente en La Mano del Gigante y más. RNT 302421.",
  rnt: "302421",
  foundingDate: "2026-09-21",
  email: "hola.travelclub@gmail.com",
  phone: "+573213756299",
  phoneDisplay: "321 375 6299",
  whatsapp: "573213756299",
  address: {
    street: "Carrera 12 # 16-45, Centro",
    city: "Florencia",
    region: "Caquetá",
    country: "CO",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carrera+12+%2316-45+Centro+Florencia+Caqueta",
  hours: [
    { label: "Lunes a viernes", value: "9:00 am – 6:00 pm", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { label: "Sábados", value: "9:00 am – 1:00 pm", days: ["Saturday"], opens: "09:00", closes: "13:00" },
    { label: "Domingos y festivos", value: "Cerrado" },
  ],
  manager: {
    name: "Talia Valentina Villarruel López",
    role: "Gerente General",
    quote: "Cada viaje que organizamos lo pensamos como si fuera el nuestro.",
    image: "/images/equipo/talia-villarruel.jpg",
  },
  // Añade aquí tus perfiles reales: ayudan a Google y a la IA a confirmar la identidad de la agencia.
  sameAs: [] as string[],
} as const;

export function waLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const policies = [
  "El plan debe estar 100% pago antes del viaje.",
  "Si no puedes viajar, puedes ceder tu cupo a otra persona. No hay devolución de dinero.",
  "El cupo se garantiza solo con una reserva pagada.",
  "La silla del bus se asigna por orden de reserva.",
  "La acomodación en hotel es múltiple. La habitación de pareja tiene un costo adicional.",
];

export const faqs = [
  {
    q: "¿Dónde queda Travel Club?",
    a: "Estamos en la Carrera 12 # 16-45, Centro, Florencia, Caquetá. Atendemos de lunes a viernes de 9:00 am a 6:00 pm y los sábados de 9:00 am a 1:00 pm.",
  },
  {
    q: "¿Travel Club es una agencia de viajes legal?",
    a: "Sí. Travel Club está inscrita en el Registro Nacional de Turismo de Colombia con el RNT 302421.",
  },
  {
    q: "¿Cómo reservo un plan?",
    a: "Escríbenos por WhatsApp al 321 375 6299 con el plan y la fecha, envía nombre completo, documento y celular de cada viajero, y paga por transferencia o en efectivo. Al enviar el comprobante recibes tu factura.",
  },
  {
    q: "¿Puedo cancelar y pedir la devolución del dinero?",
    a: "No hay devolución de dinero, pero si no puedes viajar puedes ceder tu cupo a otra persona.",
  },
  {
    q: "¿Qué tipo de viajes organizan?",
    a: "Planes grupales desde Florencia, Caquetá, por tierra y por aire, nacionales e internacionales: sol y playa en el Caribe, hoteles todo incluido, aventura como parapente en La Mano del Gigante, y planes de cultura y ciudad.",
  },
];
