'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { SearchResult } from '@/lib/search';

// ─── Type Badge ──────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: SearchResult['type'] }) {
  const config: Record<SearchResult['type'], { label: string; className: string }> = {
    service: { label: 'Service', className: 'bg-blue-100 text-blue-700' },
    insight: { label: 'Insight', className: 'bg-green-100 text-green-700' },
    persona: { label: 'Persona', className: 'bg-purple-100 text-purple-700' },
    'case-study': { label: 'Case Study', className: 'bg-amber-100 text-amber-700' },
    resource: { label: 'Resource', className: 'bg-rose-100 text-rose-700' },
    about: { label: 'About', className: 'bg-teal-100 text-teal-700' },
  };
  const { label, className } = config[type] ?? { label: type, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ item }: { item: SearchResult }) {
  return (
    <Link
      href={item.href}
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-[#215b6f] group"
    >
      <div className="flex items-start gap-4">
        {item.icon && (
          <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#215b6f] transition-colors">
              {item.title}
            </h3>
            <TypeBadge type={item.type} />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.excerpt}</p>
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#e8f5f3] text-[#215b6f] text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-[#215b6f] flex-shrink-0 mt-1 transition-colors"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Results Section ─────────────────────────────────────────────────────────

function ResultsSection({
  title, icon, results,
}: {
  title: string;
  icon: string;
  results: SearchResult[];
}) {
  if (results.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
        <span className="text-sm font-normal text-gray-500">({results.length})</span>
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((item, idx) => (
          <ResultCard key={`${item.href}-${idx}`} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Search Results ───────────────────────────────────────────────────────────

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) throw new Error('Could not load search index');
      const allContent: SearchResult[] = await res.json();

      if (!q.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const searchTerm = q.toLowerCase();

      const filtered = allContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.excerpt.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        item.category?.toLowerCase().includes(searchTerm)
      );

      // Sort: title match (3pts) > excerpt match (2pts) > tag match (1pt)
      const scored = filtered.sort((a, b) => {
        const score = (item: SearchResult) =>
          (item.title.toLowerCase().includes(searchTerm) ? 3 : 0) +
          (item.excerpt.toLowerCase().includes(searchTerm) ? 2 : 0) +
          (item.tags.some(t => t.toLowerCase().includes(searchTerm)) ? 1 : 0);
        return score(b) - score(a);
      });

      setResults(scored);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong while searching. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  // Empty state
  if (!query.trim()) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Search Our Content</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Enter a search term to find relevant services, case studies, insights, personas, resources, and more.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['AI automation', 'web development', 'digital marketing', 'SME guide', 'case study'].map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#215b6f] hover:text-[#215b6f] transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215b6f] mx-auto mb-4" />
        <p className="text-gray-600">Searching across all content…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Search Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href="/" className="text-[#215b6f] underline">Return to home</Link>
      </div>
    );
  }

  // No results
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Results Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or browse our content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          {[
            { href: '/services', label: 'Services', color: 'bg-[#215b6f] text-white hover:bg-[#1a4a5a]' },
            { href: '/portfolio', label: 'Portfolio', color: 'border border-[#215b6f] text-[#215b6f] hover:bg-[#215b6f] hover:text-white' },
            { href: '/insights', label: 'Insights', color: 'border border-[#7cc0ba] text-[#7cc0ba] hover:bg-[#7cc0ba] hover:text-white' },
            { href: '/resources', label: 'Resources', color: 'border border-gray-400 text-gray-600 hover:bg-gray-100' },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href} className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 ${color}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Group by type
  const byType = (type: SearchResult['type']) => results.filter((r) => r.type === type);

  const sections: Array<{ type: SearchResult['type']; title: string; icon: string }> = [
    { type: 'service', title: 'Services', icon: '🛠️' },
    { type: 'case-study', title: 'Case Studies', icon: '🏆' },
    { type: 'persona', title: 'Personas', icon: '👥' },
    { type: 'insight', title: 'Insights', icon: '💡' },
    { type: 'resource', title: 'Resources', icon: '📚' },
    { type: 'about', title: 'About Us', icon: 'ℹ️' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-500 text-sm">
          Found <span className="font-semibold text-gray-700">{results.length}</span> result{results.length !== 1 ? 's' : ''} across all content
        </p>
      </div>

      <div className="space-y-10">
        {sections.map(({ type, title, icon }) => (
          <ResultsSection key={type} title={title} icon={icon} results={byType(type)} />
        ))}
      </div>
    </div>
  );
}

// ─── Search Page ──────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    setQuery(q);
    setInputValue(q);
    setIsInitializing(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', trimmed);
      window.history.pushState({}, '', url.toString());
      setQuery(trimmed);
    }
  };

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215b6f] mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search services, case studies, insights, resources…"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#215b6f] focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#215b6f] text-white rounded-xl hover:bg-[#1a4a5a] transition-colors duration-200 font-semibold shadow-sm"
          >
            Search
          </button>
        </form>

        <SearchResults query={query} />
      </div>
    </main>
  );
}
