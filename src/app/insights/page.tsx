import { getAllCMSInsights } from "@/lib/cms-content";
import InsightsPageClient from './InsightsPageClient';

export default function InsightsPage() {
  const allInsights = getAllCMSInsights();
  
  // Extract categories and tags from insights
  const categories = Array.from(new Set(allInsights.map(insight => insight.category).filter(Boolean))).sort();
  const tagCounts = new Map<string, number>();
  allInsights.forEach(insight => {
    insight.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const tagsWithCounts = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  // Convert insights to posts format for compatibility
  const allPosts = allInsights.map(insight => ({
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    date: insight.publishDate.toISOString(),
    author: insight.author,
    tags: insight.tags,
    category: insight.category,
    readTime: Math.ceil(insight.excerpt.split(' ').length / 200), // Estimate reading time
    relatedPosts: []
  }));

  return (
    <InsightsPageClient 
      allPosts={allPosts}
      categories={categories}
      tagsWithCounts={tagsWithCounts}
    />
  );
}