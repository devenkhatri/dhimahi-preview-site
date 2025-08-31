import { getTagsWithCounts, getAllCategories } from "@/lib/markdown";

export const metadata = {
  title: "All Tags | Dhimahi Technolabs Insights",
  description: "Browse all topics and tags in our insights library for SMEs in Gujarat.",
};

export default function TagsPage() {
  const tagsWithCounts = getTagsWithCounts();
  const categories = getAllCategories();

  return (
    <main className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <a href="/insights" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to All Insights
          </a>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">All Topics</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Browse insights by topic to find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`/insights?category=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-accent/20 bg-accent/5 hover:border-accent hover:shadow-soft transition-all group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-accent transition-colors">
                    {category}
                  </span>
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Tags ({tagsWithCounts.length})
          </h2>
          
          {/* Popular Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Most Popular</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tagsWithCounts.slice(0, 8).map(({ tag, count }) => (
                <a 
                  key={tag}
                  href={`/insights/tag/${encodeURIComponent(tag)}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-soft transition-all group"
                >
                  <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {tag}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                    {count}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* All Tags */}
          {tagsWithCounts.length > 8 && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">All Tags</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tagsWithCounts.slice(8).map(({ tag, count }) => (
                  <a 
                    key={tag}
                    href={`/insights/tag/${encodeURIComponent(tag)}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all group text-sm"
                  >
                    <span className="text-gray-900 group-hover:text-primary transition-colors">
                      {tag}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-primary group-hover:text-white transition-colors">
                      {count}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="/insights" 
            className="inline-flex items-center text-primary hover:underline"
          >
            ← View all insights
          </a>
        </div>
      </div>
    </main>
  );
}