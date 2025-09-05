#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const insightsDir = 'content/insights';
const files = fs.readdirSync(insightsDir);

// Category mapping based on content
const categoryMapping = {
  'ai-': 'AI & Automation',
  'chatbot': 'AI & Automation',
  'automation': 'AI & Automation',
  'seo': 'Digital Marketing',
  'marketing': 'Digital Marketing',
  'social-media': 'Digital Marketing',
  'email-marketing': 'Digital Marketing',
  'content-marketing': 'Digital Marketing',
  'google-my-business': 'Digital Marketing',
  'linkedin-marketing': 'Digital Marketing',
  'video-marketing': 'Digital Marketing',
  'voice-search': 'Digital Marketing',
  'website': 'Web Development',
  'e-commerce': 'Web Development',
  'mobile-app': 'Web Development',
  'api-integration': 'Web Development',
  'cloud': 'IT Strategy',
  'cybersecurity': 'IT Strategy',
  'data-backup': 'IT Strategy',
  'digital-transformation': 'IT Strategy',
  'project-management': 'Business Strategy',
  'hr-management': 'Business Strategy',
  'financial-management': 'Business Strategy',
  'inventory-management': 'Business Strategy',
  'customer': 'Business Strategy',
  'remote-work': 'Business Strategy',
  'gst-compliance': 'Business Strategy',
  'digital-payment': 'Business Strategy'
};

function getCategory(filename) {
  for (const [key, category] of Object.entries(categoryMapping)) {
    if (filename.includes(key)) {
      return category;
    }
  }
  return 'Business Strategy'; // default category
}

function generateSlug(filename) {
  return filename.replace('.md', '');
}

function generateMetaTitle(title) {
  if (title.length <= 60) return title;
  return title.substring(0, 57) + '...';
}

function generateMetaDescription(excerpt) {
  if (excerpt.length <= 160) return excerpt;
  return excerpt.substring(0, 157) + '...';
}

function generateKeywords(title, tags) {
  const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
  const tagWords = tags.map(tag => tag.toLowerCase());
  return [...new Set([...titleWords.slice(0, 3), ...tagWords.slice(0, 3)])].join(', ');
}

files.forEach(filename => {
  if (!filename.endsWith('.md')) return;
  
  const filePath = path.join(insightsDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already migrated (has slug field)
  if (content.includes('slug:')) {
    console.log(`Skipping ${filename} - already migrated`);
    return;
  }
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${filename} - no frontmatter found`);
    return;
  }
  
  const frontmatter = frontmatterMatch[1];
  const bodyContent = content.replace(/^---\n[\s\S]*?\n---/, '');
  
  // Extract current fields
  const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
  const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/);
  const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/);
  const authorMatch = frontmatter.match(/author:\s*"([^"]+)"/);
  const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
  
  if (!titleMatch || !excerptMatch || !dateMatch) {
    console.log(`Skipping ${filename} - missing required fields`);
    return;
  }
  
  const title = titleMatch[1];
  const excerpt = excerptMatch[1];
  const date = dateMatch[1];
  const author = authorMatch ? authorMatch[1] : 'Dhimahi Technolabs';
  const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/"/g, '')) : [];
  
  const slug = generateSlug(filename);
  const category = getCategory(filename);
  const metaTitle = generateMetaTitle(title);
  const metaDescription = generateMetaDescription(excerpt);
  const keywords = generateKeywords(title, tags);
  
  // Create new frontmatter
  const newFrontmatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "${excerpt}"
publishDate: "${date}"
author: "${author}"
category: "${category}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
featuredImage: ""
seo:
  metaTitle: "${metaTitle}"
  metaDescription: "${metaDescription}"
  keywords: "${keywords}"
---`;
  
  const newContent = newFrontmatter + bodyContent;
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Migrated ${filename} to category: ${category}`);
});

console.log('Migration complete!');