import "./globals.css";

import { generateMetadata, getDefaultMeta } from "@/lib/meta";
import { getAllPersonas } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormProvider from "@/components/forms/FormProvider";
import WebVitals from "@/components/WebVitals";
import Analytics from "@/components/Analytics";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ClientOnly from "@/components/ClientOnly";
import { getGeneralSettings } from "@/lib/settings";

export const metadata = {
  metadataBase: new URL("https://www.dhimahitechnolabs.com"),
  ...generateMetadata(getDefaultMeta().home),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load personas for navigation
  const personas = getAllPersonas();
  const settings = getGeneralSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#215b6f" />

        {/* Additional meta tags for better social sharing */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={(() => {
          const twitterUrl = settings.socialMedia?.twitter;
          if (twitterUrl) {
            const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
            return match ? `@${match[1]}` : `@${settings.brand.companyName.toLowerCase().replace(/\s+/g, '')}`;
          }
          return `@${settings.brand.companyName.toLowerCase().replace(/\s+/g, '')}`;
        })()} />
        <meta name="twitter:creator" content={(() => {
          const twitterUrl = settings.socialMedia?.twitter;
          if (twitterUrl) {
            const match = twitterUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)/);
            return match ? `@${match[1]}` : `@${settings.brand.companyName.toLowerCase().replace(/\s+/g, '')}`;
          }
          return `@${settings.brand.companyName.toLowerCase().replace(/\s+/g, '')}`;
        })()} />

        {/* WhatsApp and Telegram specific */}
        <meta property="og:site_name" content={settings.brand.companyName} />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:publisher" content={settings.socialMedia?.facebook || ""} />

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
              "name": settings.brand.companyName,
              "alternateName": settings.brand.companyName,
              "url": settings.business?.website || "https://www.dhimahitechnolabs.com",
              "logo": `${settings.business?.website || "https://www.dhimahitechnolabs.com"}/favicon.ico`,
              "image": `${settings.business?.website || "https://www.dhimahitechnolabs.com"}/og-image.png`,
              "description": settings.brand.description,
              "foundingDate": settings.business?.foundedYear?.toString() || "1999",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": settings.location.fullAddress,
                "addressLocality": settings.location.serviceAreas?.[0] || "Ahmedabad",
                "addressRegion": settings.location.serviceAreas?.find(area => area.toLowerCase().includes('gujarat')) || "Gujarat",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": settings.contact.phone || settings.phone,
                "email": settings.contact.primaryEmail || settings.contactEmail,
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English"],
                ...(settings.contact.businessHours && { "hoursAvailable": settings.contact.businessHours })
              },
              "areaServed": settings.location.serviceAreas?.map(area => ({
                "@type": area.toLowerCase().includes('gujarat') ? "State" : "City",
                "name": area
              })) || [
                  { "@type": "City", "name": "Ahmedabad" },
                  { "@type": "City", "name": "Gandhinagar" },
                  { "@type": "State", "name": "Gujarat" }
                ],
              "serviceArea": {
                "@type": "State",
                "name": settings.location.serviceAreas?.find(area => area.toLowerCase().includes('gujarat')) || "Gujarat"
              },
              "knowsAbout": settings.seo?.keywords || [
                "AI Solutions",
                "Digital Marketing",
                "Web Development",
                "Business Automation",
                "CRM Implementation",
                "IT Consulting"
              ],
              "sameAs": [
                settings.socialMedia.linkedin,
                settings.socialMedia.twitter,
                settings.socialMedia.facebook,
                settings.socialMedia.instagram,
                settings.socialMedia.youtube
              ].filter(Boolean),
              ...(settings.business?.employeeCount && { "numberOfEmployees": settings.business.employeeCount }),
              ...(settings.business?.type && { "industry": settings.business.type }),
              ...(settings.brand.yearsOfExperience && { "foundingDate": (new Date().getFullYear() - settings.brand.yearsOfExperience).toString() })
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
              "name": settings.brand.companyName,
              "alternateName": settings.brand.tagline,
              "url": settings.business?.website || "https://www.dhimahitechnolabs.com",
              "description": settings.siteDescription,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${settings.business?.website || "https://www.dhimahitechnolabs.com"}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": settings.brand.companyName,
                "url": settings.business?.website || "https://www.dhimahitechnolabs.com"
              },
              "inLanguage": "en-IN",
              "copyrightYear": new Date().getFullYear(),
              "copyrightHolder": {
                "@type": "Organization",
                "name": settings.brand.companyName
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
          <Header personas={personas} settings={settings} />
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
