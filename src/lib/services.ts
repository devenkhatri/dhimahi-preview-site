import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const servicesDirectory = path.join(process.cwd(), 'content/services');

export interface PricingTier {
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface TechnologyStack {
  category: string;
  technologies: {
    name: string;
    icon?: string;
    description: string;
  }[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  order: number;
  features: string[];
  content: string;
  pricingTiers?: PricingTier[];
  processSteps?: ProcessStep[];
  technologyStack?: TechnologyStack[];
  faqs?: FAQ[];
  timeline?: string;
  startingPrice?: string;
}

export interface ServiceMeta {
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  order: number;
  features: string[];
  startingPrice?: string;
  timeline?: string;
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
        startingPrice: matterResult.data.startingPrice,
        timeline: matterResult.data.timeline,
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
    pricingTiers: matterResult.data.pricingTiers,
    processSteps: matterResult.data.processSteps,
    technologyStack: matterResult.data.technologyStack,
    faqs: matterResult.data.faqs,
    timeline: matterResult.data.timeline,
    startingPrice: matterResult.data.startingPrice,
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