import "./globals.css";
import { COMPANY_NAME } from "@/lib/constants";

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
        <meta name="theme-color" content="#3B82F6" />
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

        {/* Site Launch Notice Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-2 px-2 sm:px-4 text-center relative overflow-hidden z-50">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold animate-pulse">
            <span className="text-yellow-300 hidden sm:inline">⚡</span>
            <span className="text-center">PREVIEW SITE • Full website launching soon!</span>
            <span className="text-yellow-300 hidden sm:inline">⚡</span>
          </div>
          {/* Animated sparkles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1 left-[10%] w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-1 right-[15%] w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-300"></div>
            <div className="absolute top-1 left-[60%] w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-700"></div>
          </div>
        </div>

        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold flex items-center gap-2">
              <span className="text-sm sm:text-base">{COMPANY_NAME}</span>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">PREVIEW</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/#services" className="hover:text-primary">Services</a>
              <a href="/#case-studies" className="hover:text-primary">Case Studies</a>
              <a href="/insights" className="hover:text-primary">Insights</a>
              <a href="/#contact-form" className="rounded-xl bg-primary px-4 py-2 text-white font-medium hover:bg-primary-dark">Book Free Consultation</a>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" id="mobile-menu-button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur hidden" id="mobile-menu">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a href="/#services" className="block py-2 hover:text-primary">Services</a>
              <a href="/#case-studies" className="block py-2 hover:text-primary">Case Studies</a>
              <a href="/insights" className="block py-2 hover:text-primary">Insights</a>
              <a href="/#contact-form" className="block rounded-xl bg-primary px-4 py-3 text-white font-medium text-center">Book Free Consultation</a>
            </div>
          </div>
        </header>

        {/* Mobile Menu Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const button = document.getElementById('mobile-menu-button');
              const menu = document.getElementById('mobile-menu');
              if (button && menu) {
                button.addEventListener('click', function() {
                  menu.classList.toggle('hidden');
                });
              }
            });
          `
        }} />

        {children}
      </body>
    </html>
  );
}
