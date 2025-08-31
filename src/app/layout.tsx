import "./globals.css";
import { COMPANY_NAME } from "@/lib/constants";
import Header from "@/components/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FormProvider from "@/components/forms/FormProvider";

export const metadata = {
  metadataBase: new URL("https://www.dhimahitechnolabs.com"),
  title: `${COMPANY_NAME} – Future-Ready IT Consulting for SMEs | AI Solutions & Digital Growth`,
  description:
    "Transform your SME with AI solutions, digital marketing, and smart IT strategy. 25+ years experience helping Gujarat businesses grow. Free consultation available.",
  keywords: [
    "IT consulting SME",
    "AI solutions Gujarat",
    "digital marketing Ahmedabad",
    "business automation",
    "CRM implementation",
    "website development",
    "SEO services",
    "fractional CTO",
    "small business IT",
    "Gandhinagar IT services"
  ],
  authors: [{ name: COMPANY_NAME }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  openGraph: {
    title: `${COMPANY_NAME} – Future-Ready IT Consulting for SMEs`,
    description: "Transform your SME with AI solutions, digital marketing, and smart IT strategy. 25+ years experience helping Gujarat businesses grow without enterprise complexity.",
    url: "https://www.dhimahitechnolabs.com",
    siteName: COMPANY_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - IT Consulting for SMEs in Gujarat`,
        type: "image/png",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_NAME} – Future-Ready IT Consulting for SMEs`,
    description: "Transform your SME with AI solutions, digital marketing, and smart IT strategy. 25+ years experience helping Gujarat businesses grow.",
    images: ["/og-image.png"],
    creator: "@dhimahitechnolabs",
    site: "@dhimahitechnolabs",
  },
  alternates: {
    canonical: "https://www.dhimahitechnolabs.com",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#215b6f" />
      </head>
      <body className="antialiased text-gray-800">
        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": COMPANY_NAME,
              "image": "/favicon.ico",
              "url": "https://www.dhimahitechnolabs.com",
              "telephone": " +91 99999 99999 ",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ahmedabad",
                "addressRegion": "Gujarat",
                "addressCountry": "IN"
              },
              "areaServed": ["Ahmedabad", "Gandhinagar", "Gujarat"],
              "sameAs": []
            })
          }}
        />

        <LanguageProvider>
          <FormProvider>
            <Header />
            {children}
          </FormProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
