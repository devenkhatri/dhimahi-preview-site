import { getAllCMSInsights } from "@/lib/cms-content";
import { getLinkedInPosts } from "@/lib/google-sheets";
import InsightsPageClient from './InsightsPageClient';

export default async function InsightsPage() {
  // ── Fetch both content sources in parallel ──────────────────────────────
  const [allInsights, linkedInPosts] = await Promise.all([
    Promise.resolve(getAllCMSInsights()),
    getLinkedInPosts(),
  ]);

  // ── Convert CMS insights to PostMeta shape ──────────────────────────────
  const cmsPosts = allInsights.map(insight => ({
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    date: insight.publishDate.toISOString(),
    author: insight.author,
    tags: insight.tags,
    category: insight.category,
    readTime: Math.ceil(insight.excerpt.split(' ').length / 200),
    relatedPosts: [] as never[],
    externalUrl: undefined as string | undefined,
    isLinkedIn: false as const,
  }));

  // ── Convert LinkedIn posts to PostMeta shape ────────────────────────────
  const linkedInPostsMapped = linkedInPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    author: post.author,
    tags: post.tags,
    category: post.category,
    readTime: post.readTime,
    relatedPosts: [] as never[],
    externalUrl: post.externalUrl,
    isLinkedIn: true as const,
    likes: post.likes,
    comments: post.comments,
    reposts: post.reposts,
  }));

  // ── Merge and sort by date descending ───────────────────────────────────
  const allPosts = [...cmsPosts, ...linkedInPostsMapped].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // ── Derive categories and tag counts from merged set ────────────────────
  const categories = Array.from(
    new Set(allPosts.map(p => p.category).filter(Boolean))
  ).sort();

  const tagCounts = new Map<string, number>();
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const tagsWithCounts = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <InsightsPageClient
      allPosts={allPosts}
      categories={categories}
      tagsWithCounts={tagsWithCounts}
    />
  );
}