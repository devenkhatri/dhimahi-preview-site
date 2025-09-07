# Implementation Plan

- [x] 1. Set up CMS configuration for Persona Playbooks
  - Add new "personas" collection to public/admin/config.yml with all required fields
  - Configure media folder for persona icons and images
  - Set up validation rules and field constraints for content quality
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2. Create content processing utilities for personas
  - Extend src/lib/content.ts with persona-specific functions (getAllPersonas, getPersonaBySlug, getFeaturedPersonas)
  - Implement TypeScript interfaces for Persona data structure
  - Add content validation and error handling for persona data
  - Create sorting and filtering utilities for persona management
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 3. Implement PersonaCard component
  - Create reusable PersonaCard component with hover effects and brand colors
  - Implement responsive design for mobile and desktop layouts
  - Add click navigation functionality to individual persona pages
  - Include proper accessibility attributes and semantic HTML
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Build PersonaStorySection component
  - Create component for rendering individual storytelling sections with markdown support
  - Implement different styling based on section type (struggle, matters, helps, journey, cta)
  - Add brand color integration and consistent typography
  - Ensure proper content hierarchy and visual flow
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 5. Create personas landing page
  - Implement /personas page with grid layout of persona cards
  - Add hero section with introduction and navigation breadcrumbs
  - Implement responsive design with mobile-first approach
  - Add SEO metadata and structured data for search engines
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 6. Build individual persona pages
  - Create dynamic /personas/[slug] pages with structured storytelling layout
  - Implement progressive content disclosure following the storytelling format
  - Add call-to-action sections with primary and secondary buttons
  - Include related personas suggestions and navigation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Update navigation menu with personas integration
  - Modify Header component to include "Personas" as main navigation item
  - Implement dropdown submenu showing all available personas
  - Add mobile-responsive navigation for persona menu items
  - Ensure proper active states and hover effects with brand colors
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8. Create sample persona content
  - Write complete storytelling scripts for 9 sample personas (Small Business Owner, IT Colleagues, Doctors, Retail Entrepreneur, Builders, Physiotherapists, Digital Media House, Chartered Accountants, Friends and Family Members)
  - Create or source appropriate flat, minimal icons in brand colors for each persona
  - Ensure each persona follows the complete storytelling structure with compelling calls to action
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2_

- [x] 9. Implement error handling and loading states
  - Add error boundaries for persona components and pages
  - Implement loading states for async persona data fetching
  - Create 404 handling for invalid persona slugs
  - Add graceful fallbacks for missing persona data or images
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 10. Add SEO optimization and metadata
  - Implement dynamic metadata generation for persona pages
  - Add structured data markup for persona content
  - Create social sharing meta tags with persona-specific content
  - Optimize page titles and descriptions for search engines
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 11. Add new personas
  - Write complete storytelling scripts for 2 new personas (you can choose the most common ones in Gujarat market)
  - Ensure each persona follows the complete storytelling structure with compelling calls to action

- [x] 12. Integrate personas with existing site features
  - Add persona links to relevant service pages and insights articles
  - Update sitemap generation to include persona pages
  - Integrate persona content with existing search functionality
  - Ensure consistent styling and branding across all persona-related pages
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 13. Fine tune persona contents of whole journey
  - Change the "Small Business Owner" persona content to show "digital marketing" solution
  - Change the "Docters" persona content to show "clear services & timings, google reviews, easy online booking, and reminders"
  - Change the "Builders" persona content to show "3D plans, galleries, amenity matrix, location highlights, RERA/downloads, FAQs. Geo-targeted Google/Meta ads, lead magnets"
  - [x] 14. Add persona-specific insights articles
  - Add persona-specific insights articles to the persona pages
  - Ensure persona-specific insights articles are properly linked and indexed
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_
