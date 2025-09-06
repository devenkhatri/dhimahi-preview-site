# Social Media Sharing Setup

This document explains how social media sharing cards are configured for the Dhīmahi Technolabs website.

## Overview

The website is configured with proper Open Graph and Twitter Card meta tags to ensure that when pages are shared on social media platforms (WhatsApp, Facebook, Twitter, LinkedIn, etc.), they display with:

- ✅ Proper title and description
- ✅ Company logo/image
- ✅ Consistent branding
- ✅ Optimized for all platforms

## Implementation

### Meta Tags Helper (`src/lib/meta.ts`)

We use a centralized helper function `generateMetadata()` that creates consistent meta tags for all pages:

```typescript
import { generateMetadata, defaultMeta } from "@/lib/meta";

export const metadata = generateMetadata(defaultMeta.about);
```

### Key Features

1. **Consistent Branding**: All pages use the same base image and company information
2. **Platform Optimization**: Specific tags for Facebook, Twitter, WhatsApp, LinkedIn
3. **SEO Friendly**: Proper canonical URLs and structured data
4. **Mobile Optimized**: Responsive meta tags for mobile sharing

### Open Graph Image

- **Location**: `/public/og-image.png`
- **Dimensions**: 1200x630px (optimal for all platforms)
- **Size**: 69KB (optimized for fast loading)
- **Content**: Company logo, name, and tagline

## Testing Your Sharing Cards

Before going live, test your sharing cards on these platforms:

### Facebook
- URL: https://developers.facebook.com/tools/debug/
- Paste your page URL to see how it appears on Facebook

### Twitter
- URL: https://cards-dev.twitter.com/validator
- Validate Twitter Card appearance

### LinkedIn
- URL: https://www.linkedin.com/post-inspector/
- Check LinkedIn sharing preview

### WhatsApp
- Simply share the link in WhatsApp to see the preview
- WhatsApp uses Open Graph tags

## Page-Specific Configuration

### Homepage
- Uses comprehensive meta tags with all services and keywords
- Primary landing page optimization

### About Page
- Focuses on company story and team
- Includes company history keywords

### Services Page
- Highlights service offerings
- Includes service-specific keywords

### Individual Service Pages
- Dynamic meta tags based on service content
- Service-specific descriptions and keywords

### Consultation Page
- Optimized for conversion
- Includes consultation-specific keywords

## Validation

Run this command to validate your Open Graph image:

```bash
npm run validate:og-image
```

## Troubleshooting

### Sharing Card Not Updating

1. **Clear Platform Cache**:
   - Facebook: Use the Facebook Debugger to scrape new info
   - Twitter: Cards update automatically but may take time
   - LinkedIn: Use Post Inspector to refresh

2. **Check Meta Tags**:
   - View page source to ensure meta tags are present
   - Verify image URLs are absolute (not relative)

3. **Image Issues**:
   - Ensure og-image.png exists in `/public/` directory
   - Check image dimensions (1200x630px recommended)
   - Verify image file size (<1MB)

### Common Issues

- **Missing Image**: Check that `/public/og-image.png` exists
- **Wrong Dimensions**: Ensure image is 1200x630px
- **Cached Old Data**: Use platform debugging tools to refresh
- **Relative URLs**: All URLs should be absolute (https://...)

## Best Practices

1. **Image Content**: Include company logo, name, and key message
2. **Text Length**: Keep titles under 60 characters, descriptions under 160
3. **Keywords**: Include relevant keywords for SEO
4. **Testing**: Always test on multiple platforms before publishing
5. **Updates**: When changing og-image.png, clear platform caches

## Platform-Specific Notes

### WhatsApp
- Uses Open Graph tags
- Shows image, title, and description
- Respects og:image dimensions

### Facebook
- Requires og:image, og:title, og:description
- Minimum image size: 200x200px
- Recommended: 1200x630px

### Twitter
- Uses Twitter Card tags
- Falls back to Open Graph if Twitter tags missing
- summary_large_image card type for best appearance

### LinkedIn
- Uses Open Graph tags
- Professional appearance important
- Company branding should be clear

## Monitoring

Regularly check sharing appearance on:
- [ ] WhatsApp
- [ ] Facebook
- [ ] Twitter
- [ ] LinkedIn
- [ ] Telegram
- [ ] Slack

## Updates

When updating meta tags or images:

1. Update the relevant page's metadata
2. Test with platform debugging tools
3. Clear platform caches if needed
4. Verify across multiple platforms