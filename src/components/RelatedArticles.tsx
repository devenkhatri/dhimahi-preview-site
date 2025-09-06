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

interface RelatedArticlesProps {
  articles: PostMeta[];
  title?: string;
  className?: string;
}

export default function RelatedArticles({ 
  articles, 
  title = "Related Articles",
  className = "" 
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/insights/${article.slug}`}
            className="group block"
          >
            <article className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-soft transition-shadow">
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {article.title}
              </h4>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.readTime} min read</span>
                </div>
                <span className="text-primary font-medium group-hover:underline">
                  Read →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}