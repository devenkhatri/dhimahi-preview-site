import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.dhimahitechnolabs.com";
  return [
    { url: base, lastModified: new Date() },
    { url: base + "/insights", lastModified: new Date() },
    { url: base + "/insights/sme-ai-time-savings", lastModified: new Date() }, { url: base + "/insights/local-seo-ahmedabad-checklist", lastModified: new Date() }, { url: base + "/insights/choose-right-tools-sme", lastModified: new Date() }
  ];
}