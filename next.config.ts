import type { NextConfig } from "next";

// Hosts de las imágenes que devuelve la API (next/image solo optimiza hosts permitidos).
// Puedes añadir más con IMAGES_HOST (separados por coma).
const imageHosts = ["api-travel-tours.vercel.app", "cotizaciones.travelclubagencia.com", ...(process.env.IMAGES_HOST?.split(",").filter(Boolean) ?? [])];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
