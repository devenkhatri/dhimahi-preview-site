import type { MetadataRoute } from "next";
import { getAllCMSInsights, getAllCMSServices, getAllCMSCaseStudies } from "@/lib/cms-content";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.dhimahitechnolabs.com";
  const currentDate = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/insights`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/insights/tags`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${base}/consultation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/quote`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Service pages
  const services = getAllCMSServices();
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Case study pages
  const caseStudies = getAllCMSCaseStudies();
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${base}/portfolio/${caseStudy.slug}`,
    lastModified: caseStudy.publishDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog/Insights pages
  const insights = getAllCMSInsights();
  const postPages: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${base}/insights/${insight.slug}`,
    lastModified: insight.publishDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Tag pages - extract tags from insights
  const allTags = new Set<string>();
  insights.forEach(insight => {
    insight.tags.forEach(tag => allTags.add(tag));
  });
  const tagPages: MetadataRoute.Sitemap = Array.from(allTags).map((tag) => ({
    url: `${base}/insights/tag/${encodeURIComponent(tag)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...caseStudyPages,
    ...postPages,
    ...tagPages,
  ];
}