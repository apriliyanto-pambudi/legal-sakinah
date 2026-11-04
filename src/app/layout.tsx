import type { Metadata } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA4_MEASUREMENT_ID, isGa4Enabled } from "@/lib/analytics";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Legal Sakinah",
  description: "Firma hukum keluarga yang menyediakan konsultasi dan pendampingan hukum: perceraian, hak asuh anak, nafkah, waris, isbat nikah, dan perlindungan KDRT.",
  url: siteUrl,
  logo: `${siteUrl}/images/logo-lockup.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta Selatan",
    addressRegion: "DKI Jakarta",
    addressCountry: "ID",
  },
  areaServed: "ID",
  inLanguage: "id",
};

const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Legal Sakinah — Amanah Menuntaskan",
    template: "%s | Legal Sakinah",
  },
  description:
    "Legal Sakinah — Amanah Menuntaskan. Pendampingan hukum keluarga yang tenang, jujur, dan dapat dipercaya.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  icons: {
    icon: "/images/logo-mark.png",
    apple: "/images/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${ebGaramond.variable} ${lato.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        {children}
        {/* Nonaktif selama NEXT_PUBLIC_GA4_MEASUREMENT_ID belum diisi */}
        {isGa4Enabled && <GoogleAnalytics gaId={GA4_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
