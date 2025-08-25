import { getPostData, getAllPosts } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  try {
    const post = await getPostData(params.slug);
    return {
      title: `${post.title} | Dhimahi Technolabs`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function PostPage({ params }: Props) {
  let post;
  
  try {
    post = await getPostData(params.slug);
  } catch {
    notFound();
  }

  return (
    <main className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/insights" className="inline-flex items-center text-primary hover:underline mb-6">
          ← Back to Insights
        </Link>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          <div className="mt-3 text-gray-600">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.author && <span> • By {post.author}</span>}
          </div>
        </div>

        <article 
          className="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/insights" className="inline-flex items-center text-primary hover:underline">
            ← Back to all insights
          </Link>
        </div>
      </div>
    </main>
  );
}