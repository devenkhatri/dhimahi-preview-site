import { Metadata } from "next";
import { COMPANY_NAME } from "./constants";

interface MetaConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  path = "",
  image = "/og-image.png",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
}: MetaConfig): Metadata {
  const baseUrl = "https://www.dhimahitechnolabs.com";
  const fullUrl = `${baseUrl}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  // Default keywords that apply to all pages
  const defaultKeywords = [
    "Dhimahi Technolabs",
    "IT consulting Gujarat",
    "AI solutions Ahmedabad",
    "digital marketing Gandhinagar",
    "SME technology solutions",
    "business automation",
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: COMPANY_NAME }],
    creator: COMPANY_NAME,
    publisher: COMPANY_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: COMPANY_NAME,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${COMPANY_NAME}`,
          type: "image/png",
        },
      ],
      locale: "en_IN",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@dhimahitechnolabs",
      site: "@dhimahitechnolabs",
    },
    alternates: {
      canonical: fullUrl,
    },
    other: {
      // WhatsApp specific meta tags
      "og:image:width": "1200",
      "og:image:height": "630",
      // Additional social media optimization
      "fb:app_id": "", // Add Facebook App ID if you have one
      "article:publisher": "https://www.facebook.com/dhimahi.technolabs",
    },
  };
}

// Pre-configured meta for common pages
export const defaultMeta = {
  home: {
    title: `${COMPANY_NAME} – Future-Ready IT Consulting for SMEs | AI Solutions & Digital Growth`,
    description: "Transform your SME with AI solutions, digital marketing, and smart IT strategy. 25+ years experience helping Gujarat businesses grow. Free consultation available.",
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
  },
  about: {
    title: `About ${COMPANY_NAME} – 25+ Years of IT Excellence in Gujarat`,
    description: "Learn about Dhimahi Technolabs' journey, mission, and team. 25+ years of helping SMEs in Gujarat with AI solutions, digital marketing, and IT consulting.",
    path: "/about",
    keywords: [
      "about Dhimahi Technolabs",
      "IT consulting company Gujarat",
      "AI solutions provider Ahmedabad", 
      "digital marketing agency Gandhinagar",
      "business automation experts",
      "SME IT consultancy"
    ],
  },
  services: {
    title: `Services - ${COMPANY_NAME} | AI, Digital Marketing & Web Development`,
    description: "Professional IT services for SMEs: AI automation, digital marketing, web development, and business consulting. Serving Ahmedabad, Gandhinagar, and Gujarat.",
    path: "/services",
    keywords: [
      "IT services Gujarat",
      "AI automation services",
      "digital marketing services",
      "web development Ahmedabad",
      "business consulting",
      "CRM implementation"
    ],
  },
  consultation: {
    title: `Free IT Consultation - ${COMPANY_NAME} | Book Your Strategy Session`,
    description: "Get a free IT consultation for your SME. Discuss AI solutions, digital marketing strategy, and technology roadmap with our experts. Book your session today.",
    path: "/consultation",
    keywords: [
      "free IT consultation",
      "business technology consultation",
      "AI strategy session",
      "digital transformation consultation",
      "SME IT advice"
    ],
  },
};