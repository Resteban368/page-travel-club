// Aeropuertos para el buscador de vuelos. Ordenados por relevancia para clientes desde el Caquetá.
export type Airport = { code: string; city: string; name: string; country: string };

export const airports: Airport[] = [
  // Colombia
  { code: "FLA", city: "Florencia", name: "Gustavo Artunduaga Paredes", country: "Colombia" },
  { code: "BOG", city: "Bogotá", name: "El Dorado", country: "Colombia" },
  { code: "MDE", city: "Medellín", name: "José María Córdova (Rionegro)", country: "Colombia" },
  { code: "CLO", city: "Cali", name: "Alfonso Bonilla Aragón", country: "Colombia" },
  { code: "CTG", city: "Cartagena", name: "Rafael Núñez", country: "Colombia" },
  { code: "SMR", city: "Santa Marta", name: "Simón Bolívar", country: "Colombia" },
  { code: "BAQ", city: "Barranquilla", name: "Ernesto Cortissoz", country: "Colombia" },
  { code: "ADZ", city: "San Andrés", name: "Gustavo Rojas Pinilla", country: "Colombia" },
  { code: "NVA", city: "Neiva", name: "Benito Salas", country: "Colombia" },
  { code: "PEI", city: "Pereira", name: "Matecaña", country: "Colombia" },
  { code: "AXM", city: "Armenia", name: "El Edén", country: "Colombia" },
  { code: "BGA", city: "Bucaramanga", name: "Palonegro", country: "Colombia" },
  { code: "CUC", city: "Cúcuta", name: "Camilo Daza", country: "Colombia" },
  { code: "LET", city: "Leticia", name: "Alfredo Vásquez Cobo", country: "Colombia" },
  { code: "PSO", city: "Pasto", name: "Antonio Nariño", country: "Colombia" },
  { code: "MTR", city: "Montería", name: "Los Garzones", country: "Colombia" },
  { code: "RCH", city: "Riohacha", name: "Almirante Padilla", country: "Colombia" },
  { code: "VVC", city: "Villavicencio", name: "La Vanguardia", country: "Colombia" },
  { code: "EYP", city: "Yopal", name: "El Alcaraván", country: "Colombia" },
  { code: "PPN", city: "Popayán", name: "Guillermo León Valencia", country: "Colombia" },
  { code: "IBE", city: "Ibagué", name: "Perales", country: "Colombia" },
  { code: "MZL", city: "Manizales", name: "La Nubia", country: "Colombia" },
  { code: "PVA", city: "Providencia", name: "El Embrujo", country: "Colombia" },
  { code: "PUU", city: "Puerto Asís", name: "Tres de Mayo", country: "Colombia" },
  // Internacional
  { code: "PTY", city: "Ciudad de Panamá", name: "Tocumen", country: "Panamá" },
  { code: "MIA", city: "Miami", name: "Internacional de Miami", country: "Estados Unidos" },
  { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood", country: "Estados Unidos" },
  { code: "MCO", city: "Orlando", name: "Internacional de Orlando", country: "Estados Unidos" },
  { code: "JFK", city: "Nueva York", name: "John F. Kennedy", country: "Estados Unidos" },
  { code: "CUN", city: "Cancún", name: "Internacional de Cancún", country: "México" },
  { code: "MEX", city: "Ciudad de México", name: "Benito Juárez", country: "México" },
  { code: "PUJ", city: "Punta Cana", name: "Internacional de Punta Cana", country: "República Dominicana" },
  { code: "SDQ", city: "Santo Domingo", name: "Las Américas", country: "República Dominicana" },
  { code: "AUA", city: "Aruba", name: "Reina Beatrix", country: "Aruba" },
  { code: "CUR", city: "Curazao", name: "Hato", country: "Curazao" },
  { code: "SJO", city: "San José", name: "Juan Santamaría", country: "Costa Rica" },
  { code: "HAV", city: "La Habana", name: "José Martí", country: "Cuba" },
  { code: "UIO", city: "Quito", name: "Mariscal Sucre", country: "Ecuador" },
  { code: "GYE", city: "Guayaquil", name: "José Joaquín de Olmedo", country: "Ecuador" },
  { code: "LIM", city: "Lima", name: "Jorge Chávez", country: "Perú" },
  { code: "CUZ", city: "Cusco", name: "Alejandro Velasco Astete", country: "Perú" },
  { code: "SCL", city: "Santiago de Chile", name: "Arturo Merino Benítez", country: "Chile" },
  { code: "EZE", city: "Buenos Aires", name: "Ezeiza", country: "Argentina" },
  { code: "GRU", city: "São Paulo", name: "Guarulhos", country: "Brasil" },
  { code: "GIG", city: "Río de Janeiro", name: "Galeão", country: "Brasil" },
  { code: "CCS", city: "Caracas", name: "Simón Bolívar (Maiquetía)", country: "Venezuela" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid-Barajas", country: "España" },
  { code: "BCN", city: "Barcelona", name: "El Prat", country: "España" },
  { code: "CDG", city: "París", name: "Charles de Gaulle", country: "Francia" },
  { code: "FCO", city: "Roma", name: "Fiumicino", country: "Italia" },
  { code: "LHR", city: "Londres", name: "Heathrow", country: "Reino Unido" },
  { code: "AMS", city: "Ámsterdam", name: "Schiphol", country: "Países Bajos" },
  { code: "IST", city: "Estambul", name: "Aeropuerto de Estambul", country: "Turquía" },
];

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function searchAirports(query: string, exclude?: string): Airport[] {
  const q = fold(query.trim());
  const list = airports.filter((a) => a.code !== exclude);
  if (!q) return list.slice(0, 8);
  return list
    .map((a) => {
      const code = a.code.toLowerCase();
      const city = fold(a.city);
      let score = -1;
      if (code === q) score = 0;
      else if (city.startsWith(q)) score = 1;
      else if (city.includes(q)) score = 2;
      else if (fold(a.name).includes(q) || fold(a.country).startsWith(q) || code.startsWith(q)) score = 3;
      return { a, score };
    })
    .filter((r) => r.score >= 0)
    .sort((x, y) => x.score - y.score)
    .slice(0, 8)
    .map((r) => r.a);
}

export const airportLabel = (a: Airport) => `${a.city} (${a.code})`;
