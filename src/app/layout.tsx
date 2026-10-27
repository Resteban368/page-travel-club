import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCompany } from "@/lib/api";
import { agencyJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Travel Club | Agencia de viajes en Florencia, Caquetá",
    template: "%s | Travel Club Agencia de Viajes",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "agencia de viajes Florencia",
    "agencia de viajes Caquetá",
    "planes turísticos desde Florencia",
    "Cartagena todo incluido",
    "viaje a Santa Marta",
    "parapente Mano del Gigante",
    "viajes grupales Colombia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
    images: [{ url: "/images/hero/cartagena.jpg", width: 1600, height: 2000, alt: "Cartagena con Travel Club" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A2A5C",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const company = await getCompany();
  return (
    <html lang="es-CO" className={poppins.variable}>
      <body className="min-h-dvh">
        <JsonLd data={agencyJsonLd(company)} />
        <JsonLd data={websiteJsonLd()} />
        <SiteHeader rnt={company.rnt} />
        {children}
        <SiteFooter company={company} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
