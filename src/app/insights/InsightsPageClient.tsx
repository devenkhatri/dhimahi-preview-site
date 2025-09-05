'use client';

import { useState } from 'react';
import InsightsSearch from '@/components/InsightsSearch';

// Define PostMeta interface for compatibility with existing components
interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  readTime: number;
  relatedPosts: any[];
}

interface InsightsPageClientProps {
  allPosts: PostMeta[];
  categories: string[];
  tagsWithCounts: Array<{ tag: string; count: number }>;
}

export default function InsightsPageClient({ 
  allPosts, 
  categories, 
  tagsWithCounts 
}: InsightsPageClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(allPosts);

  return (
    <main className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Insights</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Practical guides and insights for SMEs in Gujarat to grow with technology.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <a 
              href="/insights/tags" 
              className="inline-flex items-center text-primary hover:underline"
            >
              Browse all topics →
            </a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">
              {allPosts.length} articles available
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <InsightsSearch
          posts={allPosts}
          onFilteredPosts={setFilteredPosts}
          categories={categories}
          tags={tagsWithCounts}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Showing {filteredPosts.length} of {allPosts.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-gray-200 p-6 hover:shadow-soft transition-shadow">
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <a 
                    key={tag} 
                    href={`/insights/tag/${encodeURIComponent(tag)}`}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors z-10 relative"
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

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v2.306" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <a 
              href="/insights" 
              className="inline-flex items-center text-primary hover:underline"
            >
              View all articles →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}