import { getAllPosts } from "@/lib/markdown";

export default function InsightsPage() {
  const posts = getAllPosts();

  return (
    <main className="py-12 sm:py-16">
{/* Launch Notice removed */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Insights</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">Short, practical reads for SMEs in Gujarat.</p>
          <div className="mt-4">
            <a 
              href="/insights/tags" 
              className="inline-flex items-center text-primary hover:underline text-sm"
            >
              Browse by topic →
            </a>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-soft transition-shadow">
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
              </div>
              <a href={`/insights/${post.slug}`} className="block">
                <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors">{post.title}</h3>
                <p className="mt-2 text-gray-600 text-xs sm:text-sm">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                  <span className="text-primary font-medium text-xs sm:text-sm">Read →</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}