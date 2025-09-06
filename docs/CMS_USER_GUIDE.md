# Decap CMS User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Accessing the CMS](#accessing-the-cms)
3. [Understanding the Interface](#understanding-the-interface)
4. [Managing Content](#managing-content)
5. [Content Types Overview](#content-types-overview)
6. [Media Management](#media-management)
7. [Preview and Publishing](#preview-and-publishing)
8. [Best Practices](#best-practices)

## Getting Started

Welcome to the Decap CMS user guide! This documentation will help you manage your website content efficiently through the CMS interface.

### What is Decap CMS?

Decap CMS is a content management system that allows you to edit your website content through a user-friendly interface. All changes are automatically saved to your website's code repository and trigger automatic updates to the live site.

### Key Benefits

- **No Technical Knowledge Required**: Edit content through an intuitive interface
- **Real-time Preview**: See how your changes will look before publishing
- **Automatic Backups**: All changes are version-controlled in Git
- **Collaborative Editing**: Multiple team members can manage content
- **Mobile Friendly**: Access and edit content from any device

## Accessing the CMS

### Login Process

1. Navigate to `https://yourwebsite.com/admin` in your web browser
2. Click "Login with Netlify Identity" 
3. Enter your email and password
4. You'll be redirected to the CMS dashboard

![CMS Login Screen](screenshots/cms-login.png)

### First Time Setup

If this is your first time logging in:

1. Check your email for an invitation from Netlify Identity
2. Click the confirmation link in the email
3. Set your password when prompted
4. Return to the admin URL and log in

### Troubleshooting Login Issues

**Problem**: "User not found" error
- **Solution**: Contact your administrator to ensure you've been added to the CMS

**Problem**: Can't access /admin page
- **Solution**: Ensure you're using the correct website URL and that the CMS is properly configured

## Understanding the Interface

### Dashboard Overview

When you first log in, you'll see the main dashboard with:

- **Navigation Menu**: Left sidebar with all content types
- **Content List**: Main area showing existing content
- **Search Bar**: Find specific content quickly
- **New Entry Button**: Create new content

![CMS Dashboard](screenshots/cms-dashboard.png)

### Navigation Menu

The left sidebar contains all content types you can manage:

- **Homepage**: Main page content and hero section
- **Pages**: About, Contact, and other static pages  
- **Services**: Individual service offerings
- **Case Studies**: Portfolio and project showcases
- **Insights**: Blog articles and thought leadership
- **Site Settings**: Global website configuration

### Content List View

Each content type shows:
- **Title/Name**: Content identifier
- **Status**: Draft, Published, or In Review
- **Last Modified**: When content was last updated
- **Author**: Who made the last changes

## Managing Content

### Creating New Content

1. Select the content type from the navigation menu
2. Click the "New [Content Type]" button
3. Fill in all required fields (marked with *)
4. Add optional content as needed
5. Save as draft or publish immediately

![Creating New Content](screenshots/create-content.png)

### Editing Existing Content

1. Navigate to the content type
2. Click on the content you want to edit
3. Make your changes in the form fields
4. Use the preview feature to see changes
5. Save your changes

### Content Fields Explained

**Text Fields**: Single line text input for titles, names, etc.
**Textarea**: Multi-line text for descriptions and excerpts
**Rich Text/Markdown**: Formatted content with styling options
**Number**: Numeric values for prices, statistics, etc.
**Date/Time**: Publication dates and timestamps
**Boolean**: True/false toggles for featured content, etc.
**Select**: Dropdown menus for categories and options
**List**: Repeatable fields for multiple items
**Object**: Grouped fields for complex data structures
**Image**: File upload for photos and graphics

### Using the Rich Text Editor

The rich text editor provides formatting options:

- **Bold/Italic**: Text styling
- **Headers**: H1, H2, H3 for content hierarchy
- **Lists**: Bulleted and numbered lists
- **Links**: Internal and external links
- **Images**: Inline image insertion
- **Code**: Code blocks and inline code

![Rich Text Editor](screenshots/rich-text-editor.png)

## Content Types Overview

### Homepage Content

Manage your website's main page including:

**Hero Section**:
- Main headline and subheadline
- Call-to-action buttons
- Background images or videos
- Trust badges and statistics

**Services Overview**:
- Service cards with icons
- Brief descriptions
- Links to detailed service pages

**Testimonials**:
- Client quotes and ratings
- Company information
- Profile images

### Pages Content

Static pages like About and Contact:

**About Page**:
- Company story and mission
- Team member profiles
- Company values and timeline
- Contact information

**Contact Page**:
- Contact form configuration
- Office locations and hours
- Map integration settings

### Services Content

Individual service offerings:

**Basic Information**:
- Service title and description
- Icon selection
- Pricing information
- Timeline estimates

**Detailed Content**:
- Feature lists
- Process steps
- Technology stack
- FAQ sections

### Case Studies Content

Portfolio and project showcases:

**Project Details**:
- Client information
- Project challenge and solution
- Results and metrics
- Technology used

**Media**:
- Project screenshots
- Before/after comparisons
- Process documentation

### Insights Content

Blog articles and thought leadership:

**Article Content**:
- Title and slug
- Article body (markdown)
- Excerpt for listings
- Featured image

**Metadata**:
- Publication date
- Author information
- Tags and categories
- SEO settings

### Site Settings

Global website configuration:

**General Settings**:
- Site title and description
- Contact information
- Social media links
- Analytics tracking

**Navigation**:
- Menu structure
- Footer links
- Call-to-action buttons

## Media Management

### Uploading Images

1. Click on any image field
2. Select "Choose an image"
3. Either upload a new file or select from existing media
4. Add alt text for accessibility
5. Crop or resize if needed

![Media Upload](screenshots/media-upload.png)

### Media Library

Access your media library to:
- View all uploaded files
- Organize files by folders
- Search for specific images
- Delete unused media

### Image Best Practices

**File Formats**: Use JPG for photos, PNG for graphics with transparency
**File Size**: Keep images under 1MB for faster loading
**Dimensions**: Use appropriate sizes (1200px wide for hero images)
**Alt Text**: Always add descriptive alt text for accessibility
**File Names**: Use descriptive, SEO-friendly file names

### Organizing Media

Media is automatically organized into folders:
- `/services/` - Service-related images
- `/case-studies/` - Project screenshots and media
- `/insights/` - Blog article images
- `/team/` - Staff photos
- `/general/` - General website images

## Preview and Publishing

### Using Preview Mode

Before publishing changes:

1. Click the "Preview" button while editing
2. Review how your content will appear on the live site
3. Check formatting, images, and links
4. Make adjustments as needed

![Preview Mode](screenshots/preview-mode.png)

### Publishing Content

**Save as Draft**: Saves changes without making them live
**Publish**: Makes content immediately available on the website
**Schedule**: Set a future publication date (if enabled)

### Editorial Workflow

If editorial workflow is enabled:

1. **Draft**: Content is being created/edited
2. **In Review**: Content is ready for approval
3. **Ready**: Content is approved and ready to publish
4. **Published**: Content is live on the website

### Understanding Build Process

When you publish content:

1. Changes are saved to the Git repository
2. Netlify automatically starts building the website
3. Build process typically takes 2-5 minutes
4. Changes appear on the live site after build completes

You can check build status in your Netlify dashboard.

## Best Practices

### Content Creation

**Write Clear Headlines**: Use descriptive, engaging titles
**Optimize for SEO**: Include relevant keywords naturally
**Use Consistent Formatting**: Maintain style across all content
**Add Alt Text**: Describe all images for accessibility
**Proofread**: Check spelling and grammar before publishing

### Image Management

**Optimize Before Upload**: Compress images to reduce file size
**Use Descriptive Names**: Name files clearly (e.g., "web-development-hero.jpg")
**Maintain Aspect Ratios**: Keep consistent image proportions
**Test on Mobile**: Ensure images look good on all devices

### Content Organization

**Use Categories**: Properly categorize case studies and insights
**Tag Consistently**: Use consistent tagging for better organization
**Regular Updates**: Keep content fresh and current
**Archive Old Content**: Remove or update outdated information

### Collaboration

**Communicate Changes**: Let team members know about major updates
**Use Draft Mode**: Don't publish incomplete content
**Review Before Publishing**: Have someone else review important changes
**Document Decisions**: Keep notes about content strategy decisions

### Performance Tips

**Batch Updates**: Make multiple changes before publishing
**Optimize Images**: Use appropriate file sizes and formats
**Test Changes**: Always preview before publishing
**Monitor Site Speed**: Keep an eye on website performance

---

*For technical support or questions not covered in this guide, contact your website administrator or development team.*