import "./globals.css";
import { COMPANY_NAME } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormProvider from "@/components/forms/FormProvider";
import WebVitals from "@/components/WebVitals";
import Analytics from "@/components/Analytics";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ClientOnly from "@/components/ClientOnly";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#215b6f" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Poppins Font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" 
          rel="stylesheet" 
        />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </head>
      <body className="font-sans antialiased text-gray-800" suppressHydrationWarning>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": COMPANY_NAME,
              "alternateName": "Dhimahi Technolabs",
              "url": "https://www.dhimahitechnolabs.com",
              "logo": "https://www.dhimahitechnolabs.com/favicon.ico",
              "image": "https://www.dhimahitechnolabs.com/og-image.png",
              "description": "Transform your SME with AI solutions, digital marketing, and smart IT strategy. 25+ years experience helping Gujarat businesses grow.",
              "foundingDate": "1999",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ahmedabad",
                "addressRegion": "Gujarat",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 99999 99999",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English"]
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Ahmedabad"
                },
                {
                  "@type": "City",
                  "name": "Gandhinagar"
                },
                {
                  "@type": "State",
                  "name": "Gujarat"
                }
              ],
              "serviceArea": {
                "@type": "State",
                "name": "Gujarat"
              },
              "knowsAbout": [
                "AI Solutions",
                "Digital Marketing",
                "Web Development",
                "Business Automation",
                "CRM Implementation",
                "IT Consulting"
              ],
              "sameAs": []
            })
          }}
        />

        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": COMPANY_NAME,
              "url": "https://www.dhimahitechnolabs.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.dhimahitechnolabs.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": COMPANY_NAME
              }
            })
          }}
        />

        {/* Hidden forms for Netlify detection */}
        <div style={{ display: 'none' }}>
          {/* Contact form */}
          <form name="contact" data-netlify="true">
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <input name="company" />
            <textarea name="message" />
          </form>
          
          {/* Consultation booking form */}
          <form name="consultation-booking" data-netlify="true">
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <input name="company" />
            <input name="businessType" />
            <input name="companySize" />
            <input name="location" />
            <input name="website" />
            <input name="consultationType" />
            <textarea name="challenges" />
            <input name="urgency" />
            <input name="budget" />
            <input name="preferredDate" />
            <input name="preferredTime" />
            <input name="alternativeDate" />
            <input name="alternativeTime" />
            <input name="meetingPreference" />
            <textarea name="additionalNotes" />
            <input name="formType" />
            <input name="submittedAt" />
          </form>
          
          {/* Project quote form */}
          <form name="project-quote" data-netlify="true">
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <input name="company" />
            <input name="projectType" />
            <input name="budget" />
            <input name="timeline" />
            <textarea name="description" />
            <input name="features" />
            <input name="formType" />
            <input name="submittedAt" />
          </form>
          
          {/* Resource download form */}
          <form name="resource-download" data-netlify="true">
            <input name="name" />
            <input name="email" />
            <input name="company" />
            <input name="role" />
            <input name="resourceId" />
            <input name="resourceTitle" />
            <input name="formType" />
            <input name="submittedAt" />
          </form>
          
          {/* Contact form (alternative) */}
          <form name="contact-form" data-netlify="true">
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <input name="company" />
            <textarea name="message" />
          </form>
        </div>

        <FormProvider>
          <Header />
          {children}
          <Footer />
          <ClientOnly>
            <ErrorBoundary fallback={<div style={{ display: 'none' }}>Analytics loading...</div>}>
              <Analytics />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div style={{ display: 'none' }}>WebVitals loading...</div>}>
              <WebVitals />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div style={{ display: 'none' }}>Performance monitor loading...</div>}>
              <PerformanceMonitor />
            </ErrorBoundary>
          </ClientOnly>
        </FormProvider>
      </body>
    </html>
  );
}
