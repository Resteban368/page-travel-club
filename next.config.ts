import type { NextConfig } from "next";

// Hosts de las imágenes que devuelve la API (next/image solo optimiza hosts permitidos).
// Puedes añadir más con IMAGES_HOST (separados por coma).
const imageHosts = ["api.travelclubagencia.com", "api-travel-tours.vercel.app", ...(process.env.IMAGES_HOST?.split(",").filter(Boolean) ?? [])];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // El catálogo vive solo en catalogo.travelclubagencia.com; los enlaces viejos lo siguen encontrando.
  async redirects() {
    return [
      { source: "/catalogo", destination: "https://catalogo.travelclubagencia.com/", permanent: true },
      { source: "/catalogo/:path*", destination: "https://catalogo.travelclubagencia.com/:path*", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname: hostname.trim() })),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
