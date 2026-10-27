import { policies, site } from "./site";
import type { Category, Company, Plan } from "./types";

// Contenido de respaldo: se usa mientras API_URL no esté configurada o si la API falla,
// para que la web nunca se publique vacía.

export const categories: Category[] = [
  {
    slug: "aventura",
    name: "Aventura",
    tagline: "Adrenalina y naturaleza",
    title: "Planes de aventura",
    description:
      "Viajes de aventura desde Florencia, Caquetá: parapente, deslizadores, parques de cuerdas y naturaleza para quienes buscan adrenalina.",
    image: "/images/tipos/aventura.jpg",
    icon: "⛰️",
    color: "green",
  },
  {
    slug: "descanso",
    name: "Descanso",
    tagline: "Hoteles todo incluido",
    title: "Planes de descanso",
    description:
      "Planes de descanso en hoteles todo incluido con vuelos, traslados, alimentación y bar abierto. Solo llega y relájate.",
    image: "/images/tipos/descanso.jpg",
    icon: "🌴",
    color: "yellow",
  },
  {
    slug: "sol-y-playa",
    name: "Sol y playa",
    tagline: "Mar Caribe y paraísos",
    title: "Planes de sol y playa",
    description:
      "Viajes de sol y playa al Caribe colombiano: Santa Marta, Parque Tayrona, Cartagena y Playa Blanca, con vuelos y hospedaje.",
    image: "/images/tipos/sol-y-playa.jpg",
    icon: "🏖️",
    color: "sky",
  },
  {
    slug: "cultura-y-ciudad",
    name: "Cultura y ciudad",
    tagline: "Historia, sabor y paseos",
    title: "Planes de cultura y ciudad",
    description:
      "Planes de cultura y ciudad para conocer la historia, la gastronomía y los paseos de los destinos más bonitos de Colombia.",
    image: "/images/tipos/cultura-y-ciudad.jpg",
    icon: "🏛️",
    color: "navy",
  },
];

export const plans: Plan[] = [
  {
    slug: "cartagena-todo-incluido",
    title: "Cartagena Todo Incluido",
    subtitle: "19 al 22 de enero · $2.664.000 pareja",
    summary:
      "4 días y 3 noches en el Hotel Dorado Plaza de Cartagena con vuelos desde Bogotá, traslados, alimentación buffet y bar abierto 24 horas.",
    destination: "Cartagena",
    region: "Bolívar",
    departureCity: "Bogotá",
    categories: ["descanso", "sol-y-playa", "cultura-y-ciudad"],
    badge: { label: "TODO INCLUIDO", color: "yellow" },
    image: "/images/planes/cartagena-todo-incluido.jpg",
    startDate: "2027-01-19",
    endDate: "2027-01-22",
    datesLabel: "19 al 22 de enero de 2027",
    durationLabel: "4 días · 3 noches",
    prices: [
      { label: "Por pareja", price: 2664000, unit: "pareja" },
      { label: "Por persona", price: 1332000, unit: "persona" },
    ],
    includes: [
      "Vuelos Bogotá – Cartagena",
      "Traslados aeropuerto – hotel",
      "Hotel Dorado Plaza todo incluido",
      "Desayuno, almuerzo y cena buffet",
      "Bar abierto 24 horas",
      "Snacks entre comidas",
      "Piscina con vista al mar",
      "Shows nocturnos en vivo",
    ],
    whatsappText: "Hola, quiero la promo Cartagena Todo Incluido",
  },
  {
    slug: "escapate-a-santa-marta",
    title: "Escápate a Santa Marta",
    subtitle: "8 al 11 de noviembre · $1.576.000 pareja",
    summary:
      "4 días y 3 noches en Santa Marta con vuelos ida y regreso desde Bogotá, hospedaje, traslados, tour a Playa Blanca con almuerzo y chiva rumbera.",
    destination: "Santa Marta",
    region: "Magdalena",
    departureCity: "Bogotá",
    categories: ["sol-y-playa", "cultura-y-ciudad"],
    badge: { label: "CON VUELOS", color: "sky" },
    image: "/images/planes/escapate-a-santa-marta.jpg",
    startDate: "2026-11-08",
    endDate: "2026-11-11",
    datesLabel: "8 al 11 de noviembre de 2026",
    durationLabel: "4 días · 3 noches",
    prices: [{ label: "Por pareja", price: 1576000, unit: "pareja" }],
    includes: [
      "Vuelos ida y regreso desde Bogotá",
      "Hospedaje en Villa Roca o Taybo Kay",
      "Traslados aeropuerto – hotel – aeropuerto",
      "Chiva rumbera",
      "Equipaje personal tipo morral de hasta 10 kg",
      "Alimentación según el hotel",
      "Tour a Playa Blanca con almuerzo",
      "Asistencia médica",
    ],
    whatsappText: "Hola, quiero la promo Santa Marta",
  },
  {
    slug: "parapente-mano-del-gigante",
    title: "Parapente en La Mano del Gigante",
    subtitle: "Pasadía desde Florencia · desde $165.000",
    summary:
      "Pasadía desde Florencia, Caquetá, a La Mano del Gigante en Gigante, Huila: deslizador arcoíris, parque de cuerdas, almuerzo y vuelo opcional en parapente.",
    destination: "Gigante",
    region: "Huila",
    departureCity: "Florencia",
    categories: ["aventura"],
    badge: { label: "AVENTURA", color: "green" },
    image: "/images/planes/parapente-mano-del-gigante.jpg",
    datesLabel: "Fecha a consultar",
    durationLabel: "Pasadía",
    prices: [
      { label: "Sin parapente", price: 165000, unit: "persona" },
      { label: "Con parapente", price: 370000, unit: "persona", recommended: true },
    ],
    includes: [
      "Transporte desde Florencia, Caquetá",
      "Camperos de la base hasta La Mano",
      "Ingreso a La Mano del Gigante",
      "Deslizador arcoíris y parque de cuerdas",
      "Almuerzo",
      "Asistencia médica",
      "Coordinador acompañante",
    ],
    whatsappText: "Hola, quiero el plan de Parapente",
  },
];

export const company: Company = {
  name: site.name,
  legalName: site.legalName,
  rnt: site.rnt,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  whatsapp: site.whatsapp,
  email: site.email,
  street: site.address.street,
  city: site.address.city,
  region: site.address.region,
  mission:
    "Brindar experiencias de viaje grupales excepcionales, terrestres y aéreas, con un servicio cercano, seguro y de alta calidad, inspirando el espíritu aventurero de nuestros viajeros desde nuestra identidad caqueteña.",
  vision:
    "Para 2030, ser la agencia de viajes líder y referente en el Caquetá, reconocida por la excelencia en planes grupales y por llevar a nuestra comunidad de viajeros a descubrir el mundo.",
  about:
    "En el corazón de la Amazonía colombiana nace Travel Club, una agencia 100% caqueteña creada el 21 de septiembre de 2026. Somos un equipo apasionado por conectar a las personas con nuevos horizontes. Organizamos planes grupales dentro y fuera del Caquetá, por tierra y por aire, nacionales e internacionales. En Travel Club no solo vendemos viajes: convertimos cada destino en el inicio de una gran historia compartida.",
  managerName: site.manager.name,
  socials: [],
  policies: policies.map((p, i) => ({ title: `Política ${i + 1}`, content: p })),
};
