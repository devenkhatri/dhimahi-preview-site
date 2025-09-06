import { getAllCMSInsights, getCMSInsightsByTag } from "@/lib/cms-content";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const insights = getAllCMSInsights();
  const allTags = new Set<string>();
  
  insights.forEach(insight => {
    insight.tags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const tagInsights = getCMSInsightsByTag(decodedTag);
  
  return {
    title: `${decodedTag} Articles | Dhimahi Technolabs`,
    description: `${tagInsights.length} insights and articles about ${decodedTag} for SMEs in Gujarat. Practical guides to help your business grow.`,
    openGraph: {
      title: `${decodedTag} Articles`,
      description: `${tagInsights.length} insights about ${decodedTag} for SMEs in Gujarat`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const tagInsights = getCMSInsightsByTag(decodedTag);
  
  // Convert insights to posts format for compatibility
  const tagPosts = tagInsights.map(insight => ({
    slug: insight.slug,
    title: insight.title,
    excerpt: insight.excerpt,
    date: insight.publishDate.toISOString(),
    author: insight.author,
    tags: insight.tags,
    category: insight.category,
    readTime: Math.ceil(insight.excerpt.split(' ').length / 200),
    relatedPosts: []
  }));
  
  // Get all insights to calculate tag counts
  const allInsights = getAllCMSInsights();
  const tagCounts = new Map<string, number>();
  allInsights.forEach(insight => {
    insight.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const relatedTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .filter(({ tag }) => tag.toLowerCase() !== decodedTag.toLowerCase())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (tagPosts.length === 0) {
    notFound();
  }

  return (
    <main className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <a href="/insights" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to All Insights
          </a>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-lg bg-primary text-white px-4 py-2 rounded-full font-medium">
                #{decodedTag}
              </span>
              <span className="text-gray-600">
                {tagPosts.length} article{tagPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="sm:ml-auto">
              <a 
                href="/insights/tags" 
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Browse all topics →
              </a>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {decodedTag} Articles
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Comprehensive insights and practical guides about {decodedTag.toLowerCase()} to help SMEs in Gujarat leverage technology for business growth.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {tagPosts.map((post) => (
            <article 
              key={post.slug} 
              className="rounded-2xl border border-gray-200 p-6 hover:shadow-soft transition-shadow"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <a
                    key={tag}
                    href={`/insights/tag/${encodeURIComponent(tag)}`}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      tag.toLowerCase() === decodedTag.toLowerCase() 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </a>
                ))}
                {post.category && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                    {post.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <a href={`/insights/${post.slug}`} className="block">
                <h3 className="font-semibold text-base hover:text-primary transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <span className="text-primary font-medium">Read →</span>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map(({ tag, count }) => (
                <a
                  key={tag}
                  href={`/insights/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-primary hover:text-white transition-colors text-sm"
                >
                  {tag}
                  <span className="text-xs opacity-75">({count})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/insights" 
              className="inline-flex items-center text-primary hover:underline"
            >
              ← View all insights
            </a>
            <span className="hidden sm:block text-gray-400">•</span>
            <a 
              href="/insights/tags" 
              className="inline-flex items-center text-primary hover:underline"
            >
              Browse all topics →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}