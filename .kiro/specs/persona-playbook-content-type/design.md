# Design Document

## Overview

The Persona Playbook feature introduces a new content type that showcases different customer personas through structured storytelling. This feature will integrate seamlessly with the existing Next.js application architecture, utilizing the current CMS (Decap CMS) for content management and following established patterns for routing, styling, and component structure.

The feature consists of three main components:
1. **CMS Integration**: New collection configuration for persona management
2. **Frontend Pages**: Landing page and individual persona pages with responsive design
3. **Navigation Integration**: Menu updates with dropdown functionality

## Architecture

### Content Management System (CMS)
- **Platform**: Decap CMS (existing)
- **Collection**: New "personas" collection in `public/admin/config.yml`
- **Content Storage**: Markdown files in `content/personas/` directory
- **Media Management**: Icons stored in `public/uploads/personas/` directory

### Frontend Architecture
- **Framework**: Next.js 14 with App Router (existing)
- **Styling**: Tailwind CSS with existing brand color variables
- **Components**: Reusable React components following established patterns
- **Content Processing**: Integration with existing `src/lib/content.ts` utilities

### Routing Structure
```
/personas                    # Landing page showing all personas
/personas/[slug]            # Individual persona pages
```

## Components and Interfaces

### Data Models

#### Persona Interface
```typescript
interface Persona {
  id: string;
  title: string;
  slug: string;
  icon: string;
  excerpt: string;
  publishDate: string;
  featured: boolean;
  order: number;
  storytelling: {
    everydayStruggle: string;
    whyThisMatters: string;
    howDhimahiHelps: string;
    theJourney: string;
    callToAction: {
      title: string;
      description: string;
      primaryButton: {
        text: string;
        url: string;
      };
      secondaryButton?: {
        text: string;
        url: string;
      };
    };
  };
  tags?: string[];
}
```

### CMS Collection Configuration
```yaml
- name: "personas"
  label: "Persona Playbooks"
  folder: "content/personas"
  create: true
  slug: "{{slug}}"
  summary: "{{title}} - {{fields.storytelling.everydayStruggle | truncate(50)}}"
  sortable_fields: ["order", "title", "publishDate", "featured"]
  fields:
    - label: "Title"
      name: "title"
      widget: "string"
      required: true
    - label: "Icon"
      name: "icon"
      widget: "image"
      media_folder: "/uploads/personas"
    - label: "Excerpt"
      name: "excerpt"
      widget: "text"
    - label: "Order"
      name: "order"
      widget: "number"
    - label: "Featured"
      name: "featured"
      widget: "boolean"
    - label: "Storytelling Script"
      name: "storytelling"
      widget: "object"
      fields:
        - label: "Everyday Struggle"
          name: "everydayStruggle"
          widget: "markdown"
        - label: "Why This Matters"
          name: "whyThisMatters"
          widget: "markdown"
        - label: "How Dhimahi Helps"
          name: "howDhimahiHelps"
          widget: "markdown"
        - label: "The Journey"
          name: "theJourney"
          widget: "markdown"
        - label: "Call to Action"
          name: "callToAction"
          widget: "object"
          fields:
            - label: "Title"
              name: "title"
              widget: "string"
            - label: "Description"
              name: "description"
              widget: "text"
            - label: "Primary Button"
              name: "primaryButton"
              widget: "object"
              fields:
                - label: "Text"
                  name: "text"
                  widget: "string"
                - label: "URL"
                  name: "url"
                  widget: "string"
            - label: "Secondary Button"
              name: "secondaryButton"
              widget: "object"
              required: false
              fields:
                - label: "Text"
                  name: "text"
                  widget: "string"
                - label: "URL"
                  name: "url"
                  widget: "string"
```

### Frontend Components

#### PersonaCard Component
```typescript
interface PersonaCardProps {
  persona: Persona;
  className?: string;
}
```
- Displays persona title, icon, and excerpt
- Hover effects with brand colors
- Responsive design for mobile/desktop
- Click navigation to individual persona page

#### PersonaStorySection Component
```typescript
interface PersonaStorySectionProps {
  title: string;
  content: string;
  sectionType: 'struggle' | 'matters' | 'helps' | 'journey' | 'cta';
  className?: string;
}
```
- Renders individual storytelling sections
- Different styling based on section type
- Markdown content support
- Brand color integration

#### PersonaNavigation Component
```typescript
interface PersonaNavigationProps {
  personas: Persona[];
  currentPersona?: string;
}
```
- Dropdown menu integration
- Mobile-responsive navigation
- Active state management

### Page Components

#### Personas Landing Page (`/personas`)
- Grid layout of persona cards
- Filter/sort functionality
- Hero section with introduction
- SEO optimization with metadata
- Responsive design

#### Individual Persona Page (`/personas/[slug]`)
- Structured storytelling layout
- Progressive disclosure of content
- Call-to-action integration
- Related personas suggestions
- Social sharing capabilities

## Data Models

### Content Structure
```
content/
├── personas/
│   ├── small-business-owner.md
│   ├── startup-founder.md
│   ├── manufacturing-manager.md
│   └── retail-entrepreneur.md
```

### Sample Persona Content Structure
```markdown
---
title: "Small Business Owner"
slug: "small-business-owner"
icon: "/uploads/personas/small-business-icon.svg"
excerpt: "Running a growing business but struggling with outdated systems and manual processes"
publishDate: "2024-01-15"
featured: true
order: 1
tags: ["SME", "Growth", "Automation"]
storytelling:
  everydayStruggle: |
    You're juggling multiple responsibilities as a small business owner...
  whyThisMatters: |
    In today's competitive market, efficiency isn't just nice to have...
  howDhimahiHelps: |
    We understand the unique challenges of small businesses...
  theJourney: |
    Here's how we typically work with businesses like yours...
  callToAction:
    title: "Ready to Transform Your Business?"
    description: "Let's discuss how we can help streamline your operations and drive growth."
    primaryButton:
      text: "Get Free Consultation"
      url: "/consultation"
    secondaryButton:
      text: "View Our Services"
      url: "/services"
---
```

## Error Handling

### Content Loading
- Graceful fallbacks for missing persona data
- Error boundaries for component failures
- Loading states for async operations
- 404 handling for invalid persona slugs

### CMS Integration
- Validation for required fields
- Image upload error handling
- Content preview functionality
- Draft/publish state management

### Navigation
- Fallback navigation if personas fail to load
- Mobile menu error handling
- Search integration error states

## Testing Strategy

### Unit Tests
- Persona data processing functions
- Component rendering with various props
- Navigation menu functionality
- Content validation utilities

### Integration Tests
- CMS content loading and parsing
- Page routing and navigation
- Responsive design breakpoints
- SEO metadata generation

### End-to-End Tests
- Complete user journey from landing page to persona page
- CMS content creation and publication workflow
- Mobile navigation functionality
- Form submissions from persona CTAs

### Content Tests
- Markdown parsing and rendering
- Image loading and optimization
- Link validation in persona content
- SEO metadata accuracy

## Brand Integration

### Color Palette
- Primary: `#215b6f` (existing brand primary)
- Secondary: `#7cc0ba` (existing brand secondary)
- Accent colors from existing Tailwind configuration
- Consistent hover states and transitions

### Typography
- Existing font stack and sizing scale
- Consistent heading hierarchy
- Readable line heights and spacing
- Mobile typography optimization

### Visual Elements
- Flat, minimal icons in brand colors
- Consistent border radius and shadows
- Brand-consistent button styles
- Cohesive spacing and layout patterns

### Sample Personas

#### 1. Small Business Owner
- **Icon**: Simple business building icon
- **Focus**: Growth challenges, manual processes
- **Journey**: Automation and digital transformation
- **CTA**: Free business assessment

#### 2. Startup Founder
- **Icon**: Rocket or lightbulb icon
- **Focus**: Limited resources, scaling challenges
- **Journey**: MVP to growth-ready platform
- **CTA**: Startup consultation package

#### 3. Manufacturing Manager
- **Icon**: Gear or factory icon
- **Focus**: Operational efficiency, quality control
- **Journey**: Process automation and monitoring
- **CTA**: Manufacturing solutions demo

#### 4. Retail Entrepreneur
- **Icon**: Shopping bag or storefront icon
- **Focus**: Online presence, customer management
- **Journey**: E-commerce and digital marketing
- **CTA**: Retail transformation consultation