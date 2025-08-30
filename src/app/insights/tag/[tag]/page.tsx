import { getAllPosts } from "@/lib/markdown";
import { notFound } from "next/navigation";

interface Props {
  params: {
    tag: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const allTags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `${decodedTag} Articles | Dhimahi Technolabs`,
    description: `All insights and articles about ${decodedTag} for SMEs in Gujarat.`,
  };
}

export default function TagPage({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag);
  const allPosts = getAllPosts();
  const tagPosts = allPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase() === decodedTag.toLowerCase())
  );

  if (tagPosts.length === 0) {
    notFound();
  }

  return (
    <main className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <a href="/insights" className="inline-flex items-center text-primary hover:underline mb-4">
            ← Back to All Insights
          </a>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg bg-primary text-white px-4 py-2 rounded-full font-medium">
              {decodedTag}
            </span>
            <span className="text-gray-600">
              {tagPosts.length} article{tagPosts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {decodedTag} Articles
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Insights and guides about {decodedTag.toLowerCase()} for SMEs in Gujarat.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tagPosts.map((post) => (
            <a 
              href={`/insights/${post.slug}`} 
              key={post.slug} 
              className="rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-soft transition-shadow"
            >
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag} 
                    className={`text-xs px-2 py-1 rounded ${
                      tag.toLowerCase() === decodedTag.toLowerCase() 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{post.title}</h3>
              <p className="mt-2 text-gray-600 text-xs sm:text-sm">{post.excerpt}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="text-primary font-medium text-xs sm:text-sm">Read →</span>
              </div>
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