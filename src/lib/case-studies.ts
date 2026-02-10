import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies');

export interface ClientInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
}

export interface ResultMetric {
  label: string;
  value: string;
  improvement: string;
  timeframe: string;
  icon?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar?: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  caption?: string;
  type: 'before' | 'after' | 'process' | 'result';
}

export interface Technology {
  name: string;
  category: string;
  icon?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: ClientInfo;
  projectType: string;
  duration: string;
  teamSize: number;
  challenge: string;
  solution: string[];
  results: ResultMetric[];
  testimonial?: Testimonial;
  images: ImageAsset[];
  technologies: Technology[];
  services: string[]; // References to service slugs
  publishDate: Date;
  featured: boolean;
  content: string;
  excerpt: string;
  category: 'application-portfolio-rationalisation' | 'digital-marketing' | 'ai-automation';
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  client: ClientInfo;
  projectType: string;
  duration: string;
  excerpt: string;
  publishDate: Date;
  featured: boolean;
  category: 'application-portfolio-rationalisation' | 'digital-marketing' | 'ai-automation';
  services: string[];
  images: ImageAsset[];
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  // Create directory if it doesn't exist
  if (!fs.existsSync(caseStudiesDirectory)) {
    fs.mkdirSync(caseStudiesDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
  const allCaseStudies = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(caseStudiesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title,
        client: matterResult.data.client,
        projectType: matterResult.data.projectType,
        duration: matterResult.data.duration,
        excerpt: matterResult.data.excerpt,
        publishDate: new Date(matterResult.data.publishDate),
        featured: matterResult.data.featured || false,
        category: matterResult.data.category,
        services: matterResult.data.services || [],
        images: matterResult.data.images || [],
      };
    });

  return allCaseStudies.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}

export async function getCaseStudyData(slug: string): Promise<CaseStudy> {
  const fullPath = path.join(caseStudiesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title,
    client: matterResult.data.client,
    projectType: matterResult.data.projectType,
    duration: matterResult.data.duration,
    teamSize: matterResult.data.teamSize,
    challenge: matterResult.data.challenge,
    solution: matterResult.data.solution || [],
    results: matterResult.data.results || [],
    testimonial: matterResult.data.testimonial,
    images: matterResult.data.images || [],
    technologies: matterResult.data.technologies || [],
    services: matterResult.data.services || [],
    publishDate: new Date(matterResult.data.publishDate),
    featured: matterResult.data.featured || false,
    content: contentHtml,
    excerpt: matterResult.data.excerpt,
    category: matterResult.data.category,
  };
}

export function getFeaturedCaseStudies(limit: number = 3): CaseStudyMeta[] {
  const allCaseStudies = getAllCaseStudies();
  return allCaseStudies.filter(caseStudy => caseStudy.featured).slice(0, limit);
}

export function getCaseStudiesByCategory(category: string): CaseStudyMeta[] {
  const allCaseStudies = getAllCaseStudies();
  return allCaseStudies.filter(caseStudy => caseStudy.category === category);
}

export function getCaseStudiesByService(serviceSlug: string): CaseStudyMeta[] {
  const allCaseStudies = getAllCaseStudies();
  return allCaseStudies.filter(caseStudy =>
    caseStudy.services.includes(serviceSlug)
  );
}

export function getRelatedCaseStudies(currentSlug: string, category: string, limit: number = 3): CaseStudyMeta[] {
  const allCaseStudies = getAllCaseStudies();
  return allCaseStudies
    .filter(caseStudy =>
      caseStudy.slug !== currentSlug &&
      caseStudy.category === category
    )
    .slice(0, limit);
}

export function getAllCaseStudySlugs() {
  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
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