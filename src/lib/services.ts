import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const servicesDirectory = path.join(process.cwd(), 'content/services');

export interface ServiceData {
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  order: number;
  features: string[];
  content: string;
}

export interface ServiceMeta {
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  order: number;
  features: string[];
}

export function getAllServices(): ServiceMeta[] {
  const fileNames = fs.readdirSync(servicesDirectory);
  const allServicesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(servicesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        icon: matterResult.data.icon,
        excerpt: matterResult.data.excerpt,
        order: matterResult.data.order || 999,
        features: matterResult.data.features || [],
      };
    });

  return allServicesData.sort((a, b) => a.order - b.order);
}

export async function getServiceData(slug: string): Promise<ServiceData> {
  const fullPath = path.join(servicesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title,
    icon: matterResult.data.icon,
    excerpt: matterResult.data.excerpt,
    order: matterResult.data.order || 999,
    features: matterResult.data.features || [],
    content: contentHtml,
  };
}

export function getAllServiceSlugs() {
  const fileNames = fs.readdirSync(servicesDirectory);
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