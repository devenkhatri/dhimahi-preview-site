'use client';

import { useState, useEffect } from 'react';
import { PostMeta } from '@/lib/markdown';

interface InsightsSearchProps {
  posts: PostMeta[];
  onFilteredPosts: (posts: PostMeta[]) => void;
  categories: string[];
  tags: Array<{ tag: string; count: number }>;
}

export default function InsightsSearch({ 
  posts, 
  onFilteredPosts, 
  categories, 
  tags 
}: InsightsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readTime'>('date');

  useEffect(() => {
    let filteredPosts = [...posts];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.category?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(post =>
        post.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        selectedTags.some(selectedTag =>
          post.tags.some(postTag => 
            postTag.toLowerCase() === selectedTag.toLowerCase()
          )
        )
      );
    }

    // Apply sorting
    filteredPosts.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readTime':
          return a.readTime - b.readTime;
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    onFilteredPosts(filteredPosts);
  }, [searchQuery, selectedCategory, selectedTags, sortBy, posts, onFilteredPosts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setSortBy('date');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Articles
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content, or tags..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-48">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="lg:w-48">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'readTime')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="date">Latest First</option>
            <option value="title">Title A-Z</option>
            <option value="readTime">Reading Time</option>
          </select>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Popular Tags</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 12).map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
              <span className={`text-xs ${
                selectedTags.includes(tag) ? 'text-white/80' : 'text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                Search: "{searchQuery}"
              </span>
            )}
            {selectedCategory && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                Category: {selectedCategory}
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded">
                Tag: {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}