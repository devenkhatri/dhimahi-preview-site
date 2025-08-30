import { getAllTags, getAllPosts } from "@/lib/markdown";

export const metadata = {
  title: "All Tags | Dhimahi Technolabs Insights",
  description: "Browse all topics and tags in our insights library for SMEs in Gujarat.",
};

export default function TagsPage() {
  const allTags = getAllTags();
  const allPosts = getAllPosts();
  
  // Count posts per tag
  const tagCounts = allTags.map(tag => ({
    tag,
    count: allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    ).length
  }));

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

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tagCounts.map(({ tag, count }) => (
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

        <div className="mt-8 text-center">
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