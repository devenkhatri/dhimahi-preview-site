import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/markdown";
import { getAllServices } from "@/lib/services";
import { getAllCaseStudies } from "@/lib/case-studies";

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
  const services = getAllServices();
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Case study pages
  const caseStudies = getAllCaseStudies();
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${base}/portfolio/${caseStudy.slug}`,
    lastModified: caseStudy.publishDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog/Insights pages
  const posts = getAllPosts();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/insights/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Tag pages
  const tags = getAllTags();
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
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