#!/usr/bin/env node
/**
 * generate-search-index.js
 * Run at build time to create /public/search-index.json.
 * The search page fetches this static file client-side.
 *
 * Usage:  node scripts/generate-search-index.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const servicesDir = path.join(contentDir, 'services');
const caseStudiesDir = path.join(contentDir, 'case-studies');
const insightsDir = path.join(contentDir, 'insights');
const personasDir = path.join(contentDir, 'personas');
const resourcesDir = path.join(contentDir, 'resources');
const outputPath = path.join(root, 'public', 'search-index.json');

/** Read all .md files in a directory, return parsed frontmatter */
function readMdDir(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md') && !f.startsWith('.'))
        .map(f => {
            try {
                const raw = fs.readFileSync(path.join(dir, f), 'utf8');
                const { data } = matter(raw);
                return { slug: path.basename(f, '.md'), ...data };
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

const index = [];

// ── Services ─────────────────────────────────────────────────────────────────
readMdDir(servicesDir).forEach(s => {
    index.push({
        type: 'service',
        title: s.title || s.slug,
        excerpt: s.excerpt || '',
        href: `/services/${s.slug}`,
        icon: s.icon || '🛠️',
        tags: [
            s.title ? s.title.toLowerCase() : '',
            ...(Array.isArray(s.features) ? s.features.slice(0, 5).map(f => String(f).toLowerCase()) : []),
            'service',
            'business solution',
        ].filter(Boolean),
        category: undefined,
    });
});

// ── Case Studies ──────────────────────────────────────────────────────────────
readMdDir(caseStudiesDir).forEach(c => {
    index.push({
        type: 'case-study',
        title: c.title || c.slug,
        excerpt: c.excerpt || '',
        href: `/portfolio/${c.slug}`,
        icon: '🏆',
        tags: [
            c.category || '',
            c.projectType || '',
            c.client?.industry || '',
            ...(Array.isArray(c.services) ? c.services : []),
            'case study',
            'portfolio',
            'project',
        ].filter(Boolean),
        category: c.category,
    });
});

// ── Insights ──────────────────────────────────────────────────────────────────
readMdDir(insightsDir).forEach(i => {
    index.push({
        type: 'insight',
        title: i.title || i.slug,
        excerpt: i.excerpt || '',
        href: `/insights/${i.slug}`,
        icon: '💡',
        tags: Array.isArray(i.tags) ? i.tags : [],
        category: i.category,
    });
});

// ── Personas ──────────────────────────────────────────────────────────────────
readMdDir(personasDir).forEach(p => {
    index.push({
        type: 'persona',
        title: p.title || p.slug,
        excerpt: p.excerpt || `Discover how ${p.title || p.slug} can benefit from our solutions.`,
        href: `/personas/${p.slug}`,
        icon: p.icon || '👥',
        tags: [
            ...(Array.isArray(p.tags) ? p.tags : []),
            'persona',
            'business type',
            'customer story',
        ].filter(Boolean),
    });
});

// ── Resources ─────────────────────────────────────────────────────────────────
readMdDir(resourcesDir).forEach(r => {
    index.push({
        type: 'resource',
        title: r.title || r.slug,
        excerpt: r.description || '',
        href: `/resources`,
        icon: '📚',
        tags: [
            r.type || '',
            ...(Array.isArray(r.tags) ? r.tags : []),
            'resource',
            'download',
            'guide',
            'checklist',
            'template',
        ].filter(Boolean),
        category: r.type,
    });
});

// ── About Us (static) ─────────────────────────────────────────────────────────
index.push({
    type: 'about',
    title: 'About Dhīmahi Technolabs',
    excerpt: 'Learn about our 25+ years of experience helping SMEs in Gujarat with IT, AI, and digital marketing solutions. Meet our team and discover our mission.',
    href: '/about',
    icon: 'ℹ️',
    tags: [
        'about', 'company', 'team', 'mission', 'vision', 'values', 'history',
        'founder', 'experience', 'gujarat', 'ahmedabad', 'gandhinagar', 'sme', 'it consultancy',
    ],
});

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
console.log(`✅ Search index generated: ${outputPath} (${index.length} entries)`);
