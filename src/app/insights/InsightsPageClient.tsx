'use client';

import { useState } from 'react';
import InsightsSearch from '@/components/InsightsSearch';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  /** If set, the card links externally (e.g. to LinkedIn) instead of /insights/[slug] */
  externalUrl?: string;
  /** True for posts sourced from LinkedIn */
  isLinkedIn?: boolean;
  /** LinkedIn engagement metrics */
  likes?: number;
  comments?: number;
  reposts?: number;
}

interface InsightsPageClientProps {
  allPosts: PostMeta[];
  categories: string[];
  tagsWithCounts: Array<{ tag: string; count: number }>;
}

// ─── LinkedIn Badge ───────────────────────────────────────────────────────────

function LinkedInBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#0A66C2] text-white px-2 py-0.5 rounded-full">
      <svg
        className="w-3 h-3 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      LinkedIn Post
    </span>
  );
}

// ─── Engagement Stats ─────────────────────────────────────────────────────────

function EngagementStats({ likes, comments, reposts }: {
  likes?: number;
  comments?: number;
  reposts?: number;
}) {
  if (!likes && !comments && !reposts) return null;
  return (
    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
      {!!likes && (
        <span className="flex items-center gap-1" title="Reactions">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20.25 4.105 20.25H4.5c.971 0 1.75-.78 1.75-1.75v-5.5c0-.971-.779-1.75-1.75-1.75h-.174c-.494 0-.997.324-1.002.828-.004.147-.012.293-.012.44 0 .19.008.378.02.566Z" />
          </svg>
          {likes}
        </span>
      )}
      {!!comments && (
        <span className="flex items-center gap-1" title="Comments">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
          </svg>
          {comments}
        </span>
      )}
      {!!reposts && (
        <span className="flex items-center gap-1" title="Reposts">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          {reposts}
        </span>
      )}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function InsightsPageClient({
  allPosts,
  categories,
  tagsWithCounts,
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
          {filteredPosts.map((post) => {
            const href  = post.externalUrl ?? `/insights/${post.slug}`;
            const isExt = !!post.externalUrl;

            return (
              <article
                key={post.slug}
                className="rounded-2xl border border-gray-200 p-6 hover:shadow-soft transition-shadow flex flex-col"
              >
                {/* Badge row */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.isLinkedIn ? (
                    <LinkedInBadge />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>

                {/* Content link */}
                <a
                  href={href}
                  target={isExt ? '_blank' : undefined}
                  rel={isExt ? 'noopener noreferrer' : undefined}
                  className="block flex-1"
                >
                  <h3 className="font-semibold text-base hover:text-primary transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      {!post.isLinkedIn && (
                        <>
                          <span>•</span>
                          <span>{post.readTime} min read</span>
                        </>
                      )}
                    </div>
                    <span className="text-primary font-medium">
                      {isExt ? 'View on LinkedIn ↗' : 'Read →'}
                    </span>
                  </div>
                </a>

                {/* LinkedIn engagement stats */}
                {post.isLinkedIn && (
                  <EngagementStats
                    likes={post.likes}
                    comments={post.comments}
                    reposts={post.reposts}
                  />
                )}
              </article>
            );
          })}
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
