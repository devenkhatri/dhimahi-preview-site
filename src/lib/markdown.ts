import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/insights');

export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  category?: string;
  readTime: number;
  content: string;
  relatedPosts?: string[];
}

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  category?: string;
  readTime: number;
  relatedPosts?: string[];
}

// Calculate reading time based on word count (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        date: matterResult.data.date,
        author: matterResult.data.author,
        tags: matterResult.data.tags || [],
        category: matterResult.data.category,
        readTime: calculateReadingTime(matterResult.content),
        relatedPosts: matterResult.data.relatedPosts || [],
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title,
    excerpt: matterResult.data.excerpt,
    date: matterResult.data.date,
    author: matterResult.data.author,
    tags: matterResult.data.tags || [],
    category: matterResult.data.category,
    readTime: calculateReadingTime(matterResult.content),
    content: contentHtml,
    relatedPosts: matterResult.data.relatedPosts || [],
  };
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const allTags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag));
  });
  
  return Array.from(allTags).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.category?.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByAuthor(author: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.author.toLowerCase() === author.toLowerCase()
  );
}

export function searchPosts(query: string): PostMeta[] {
  const posts = getAllPosts();
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.category?.toLowerCase().includes(searchTerm)
  );
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): PostMeta[] {
  const posts = getAllPosts();
  
  // Filter out current post and calculate relevance score
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      const commonTags = post.tags.filter(tag => 
        tags.some(currentTag => currentTag.toLowerCase() === tag.toLowerCase())
      );
      return {
        ...post,
        relevanceScore: commonTags.length
      };
    })
    .filter(post => post.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return relatedPosts;
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  
  return Array.from(categories).sort();
}

export function getAllAuthors(): string[] {
  const posts = getAllPosts();
  const authors = new Set<string>();
  
  posts.forEach(post => {
    authors.add(post.author);
  });
  
  return Array.from(authors).sort();
}

export function getTagsWithCounts(): Array<{ tag: string; count: number }> {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}