import type { MetadataRoute } from "next";
import { getCategories, getPlans } from "@/lib/api";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const plans = await getPlans();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1, images: [`${site.url}/images/hero/cartagena.jpg`] },
    ...plans.map((p) => ({
      url: `${site.url}/planes/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [p.image.startsWith("http") ? p.image : `${site.url}${p.image}`],
    })),
    { url: `${site.url}/viajeros`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${site.url}/politicas`, changeFrequency: "monthly" as const, priority: 0.3 },
    ...getCategories().map((c) => ({
      url: `${site.url}/viajes/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
