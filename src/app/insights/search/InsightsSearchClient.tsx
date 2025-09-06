'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

interface InsightsSearchClientProps {
  allPosts: PostMeta[];
}

export default function InsightsSearchClient({ allPosts }: InsightsSearchClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate search delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Client-side search implementation
    const searchTerm = searchQuery.toLowerCase();
    const searchResults = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.category?.toLowerCase().includes(searchTerm)
    );

    setResults(searchResults);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (query.trim()) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <main className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/insights" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to Insights
          </Link>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Search Insights
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Find articles, guides, and insights to help your business grow.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles, topics, or keywords..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent pr-16"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isLoading ? 'Searching...' : `Search Results`}
              </h2>
              {!isLoading && (
                <p className="text-gray-600">
                  {results.length === 0 
                    ? `No results found for "${query}"`
                    : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                  }
                </p>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl p-6">
                      <div className="flex gap-2 mb-3">
                        <div className="h-5 bg-gray-300 rounded w-16"></div>
                        <div className="h-5 bg-gray-300 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => (
                  <article key={post.slug} className="rounded-2xl border border-gray-200 p-6 hover:shadow-soft transition-shadow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Link
                          key={tag}
                          href={`/insights/tag/${encodeURIComponent(tag)}`}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"
                        >
                          {highlightText(tag, query)}
                        </Link>
                      ))}
                      {post.category && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {highlightText(post.category, query)}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <Link href={`/insights/${post.slug}`} className="block">
                      <h3 className="font-semibold text-base hover:text-primary transition-colors mb-2 line-clamp-2">
                        {highlightText(post.title, query)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {highlightText(post.excerpt, query)}
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
                    </Link>
                  </article>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && hasSearched && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any articles matching "{query}". Try different keywords or browse our topics.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/insights" 
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    ← Browse all articles
                  </Link>
                  <span className="hidden sm:block text-gray-400">•</span>
                  <Link 
                    href="/insights/tags" 
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    View all topics →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Topics (when no search performed) */}
        {!hasSearched && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Popular Topics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {['AI', 'Digital Marketing', 'Automation', 'SEO', 'E-commerce', 'Cloud Migration'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setQuery(topic);
                    performSearch(topic);
                  }}
                  className="p-4 text-left border border-gray-200 rounded-xl hover:border-primary hover:shadow-soft transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {topic}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}