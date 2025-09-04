import { getPostData, getAllPosts, getRelatedPosts } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import SocialShare from "@/components/SocialShare";
import AuthorProfile from "@/components/AuthorProfile";
import RelatedArticles from "@/components/RelatedArticles";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";

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
    const canonicalUrl = `https://www.dhimahitechnolabs.com/insights/${params.slug}`;
    
    return generateSEOMetadata({
      title: post.title,
      description: post.excerpt,
      keywords: [
        ...post.tags,
        post.category || '',
        'IT consulting',
        'SME solutions',
        'business automation',
        'Gujarat business',
        'Ahmedabad IT services',
      ].filter(Boolean),
      canonicalUrl,
      ogType: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      author: post.author,
      section: post.category,
      tags: post.tags,
    });
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

  // Get related posts based on tags
  const relatedPosts = getRelatedPosts(post.slug, post.tags, 3);
  
  // Construct full URL for sharing
  const fullUrl = `https://www.dhimahitechnolabs.com/insights/${post.slug}`;

  // Generate structured data
  const articleStructuredData = generateStructuredData({
    type: 'Article',
    data: {
      title: post.title,
      description: post.excerpt,
      author: post.author,
      publishedTime: post.date,
      modifiedTime: post.date,
      image: 'https://www.dhimahitechnolabs.com/og-image.png',
      url: fullUrl,
      keywords: post.tags,
      section: post.category,
      wordCount: post.content.split(' ').length,
      readTime: post.readTime,
    },
  });

  const breadcrumbStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.dhimahitechnolabs.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: 'https://www.dhimahitechnolabs.com/insights',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: fullUrl,
      },
    ],
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleStructuredData }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }}
      />

      <main className="py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link href="/insights" className="inline-flex items-center text-primary hover:underline mb-6">
            ← Back to Insights
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {/* Tags and Category */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
              )}
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/insights/tag/${encodeURIComponent(tag)}`}
                  className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-4 text-sm">
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </div>
              
              {/* Social Share */}
              <div className="sm:ml-auto">
                <SocialShare
                  url={fullUrl}
                  title={post.title}
                  description={post.excerpt}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Author */}
            <div className="border-t border-b border-gray-200 py-6 mb-8">
              <AuthorProfile author={post.author} />
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8">
            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tagged with:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/insights/tag/${encodeURIComponent(tag)}`}
                    className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Share Again */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Share this article:</h3>
              <SocialShare
                url={fullUrl}
                title={post.title}
                description={post.excerpt}
              />
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <RelatedArticles articles={relatedPosts} />
          </div>
        )}

        {/* Back to Insights */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center">
          <Link href="/insights" className="inline-flex items-center text-primary hover:underline">
            ← Back to all insights
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}