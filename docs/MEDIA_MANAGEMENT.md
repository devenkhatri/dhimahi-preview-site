# Media Management Guide

This guide covers the enhanced media management system for Decap CMS integration, including image optimization, organization, and accessibility features.

## Overview

The media management system provides:
- Organized folder structure for different content types
- Automatic image optimization and responsive variants
- Alt text generation and validation
- Media browser with search and filtering
- Upload validation and error handling
- Accessibility compliance checking

## Folder Structure

Media files are organized in the following structure:

```
public/uploads/
├── case-studies/     # Project screenshots and case study images
├── services/         # Service page images and illustrations  
├── insights/         # Blog article featured images and content images
├── team/            # Team member profile photos
├── testimonials/    # Client photos and testimonial images
└── general/         # General website images and assets
```

### Folder Guidelines

| Folder | Purpose | Recommended Dimensions | File Types |
|--------|---------|----------------------|------------|
| `case-studies/` | Project screenshots, before/after images | 1200×800 (3:2 ratio) | JPG, PNG, WebP |
| `services/` | Service illustrations, feature images | 800×600 (4:3 ratio) | JPG, PNG, WebP, SVG |
| `insights/` | Article featured images, content images | 1200×630 (1.91:1 ratio) | JPG, PNG, WebP |
| `team/` | Profile photos | 400×400 (1:1 ratio) | JPG, PNG, WebP |
| `testimonials/` | Client photos | 300×300 (1:1 ratio) | JPG, PNG, WebP |
| `general/` | General website assets | 1200×800 (3:2 ratio) | JPG, PNG, WebP, SVG |

## Image Optimization

### Automatic Optimization

The system automatically optimizes images during the build process:

1. **Responsive Variants**: Generates multiple sizes for different breakpoints
2. **Format Conversion**: Creates WebP and AVIF versions for better compression
3. **Quality Optimization**: Applies appropriate compression levels
4. **Progressive Loading**: Enables progressive JPEG loading

### Optimization Script

Run media optimization manually:

```bash
# Optimize all media files
npm run optimize:media

# Validate media files only
npm run media:validate

# Generate media manifest only
npm run media:manifest
```

### Responsive Breakpoints

The system generates optimized variants for these breakpoints:
- 640px (mobile)
- 768px (tablet)
- 1024px (small desktop)
- 1280px (desktop)
- 1536px (large desktop)
- 1920px (full HD)

## Upload Guidelines

### File Requirements

- **Maximum file size**: 10MB
- **Supported formats**: JPEG, PNG, WebP, GIF
- **Filename requirements**: 
  - Maximum 100 characters
  - Use only letters, numbers, dots, hyphens, and underscores
  - Use descriptive names (e.g., `healthcare-website-homepage.jpg`)

### Best Practices

1. **Optimize before upload**: Compress images to reasonable file sizes
2. **Use descriptive filenames**: Help with SEO and organization
3. **Choose appropriate formats**:
   - JPEG for photos and complex images
   - PNG for graphics with transparency
   - WebP for modern browsers (auto-generated)
   - SVG for simple graphics and icons

## Alt Text and Accessibility

### Automatic Alt Text Generation

The system can automatically generate alt text based on:
- Filename analysis
- Content category context
- Field name context

### Alt Text Guidelines

1. **Be descriptive**: Describe what the image shows, not what it is
2. **Keep it concise**: 10-150 characters is ideal
3. **Include context**: Mention relevant details for understanding
4. **Avoid redundancy**: Don't start with "Image of" or "Picture of"

### Examples

**Good Alt Text:**
- `Healthcare clinic website homepage showing appointment booking interface`
- `Restaurant analytics dashboard displaying 150% increase in online orders`
- `Team member Sarah Johnson, Lead Developer, smiling in office setting`

**Poor Alt Text:**
- `Image`
- `Photo`
- `Screenshot`
- `IMG_1234.jpg`

## CMS Integration

### Enhanced Image Widget

The custom image widget provides:
- Visual preview of selected images
- Alt text input with auto-generation
- Caption field for additional context
- Validation warnings for accessibility
- File size and dimension display

### Media Browser Features

- **Search**: Find images by filename, alt text, or caption
- **Category filtering**: Filter by content type
- **Batch selection**: Select multiple images at once
- **Upload progress**: Visual feedback during uploads
- **Validation**: Real-time file validation

### Custom Editor Components

#### Image Gallery
```markdown
<ImageGallery images={[
  {
    "src": "/uploads/case-studies/project-gallery-1.jpg",
    "alt": "Project homepage design showing modern layout",
    "caption": "Homepage design with hero section"
  },
  {
    "src": "/uploads/case-studies/project-gallery-2.jpg", 
    "alt": "Project dashboard interface with analytics",
    "caption": "Analytics dashboard view"
  }
]} />
```

#### Before/After Images
```markdown
<BeforeAfter 
  before="/uploads/case-studies/website-before.jpg"
  beforeAlt="Old website with outdated design and poor navigation"
  after="/uploads/case-studies/website-after.jpg" 
  afterAlt="New website with modern design and improved user experience"
  caption="Website redesign showing dramatic improvement in user experience" />
```

## Validation and Quality Control

### Pre-Save Validation

The system validates content before saving:
- **Missing alt text**: Prevents saving without alt text
- **Short alt text**: Warns about alt text under 10 characters
- **Large files**: Warns about files over 2MB
- **Invalid filenames**: Checks for proper naming conventions

### Build-Time Optimization

During the build process:
1. **Media manifest generation**: Creates inventory of all media files
2. **Responsive variant creation**: Generates optimized sizes
3. **Format conversion**: Creates WebP and AVIF versions
4. **Validation reporting**: Reports any issues found

## Performance Considerations

### Loading Optimization

- **Lazy loading**: Images load only when needed
- **Progressive enhancement**: Better formats served to supporting browsers
- **Blur placeholders**: Smooth loading experience
- **Responsive images**: Appropriate sizes for different devices

### CDN Integration

For production deployments:
1. **Netlify**: Automatic image optimization and CDN delivery
2. **Custom CDN**: Configure external CDN for media delivery
3. **Edge caching**: Leverage edge locations for faster delivery

## Troubleshooting

### Common Issues

**Upload fails with "File too large"**
- Compress image before uploading
- Use online tools like TinyPNG or Squoosh
- Maximum file size is 10MB

**Alt text validation error**
- Ensure all images have descriptive alt text
- Alt text should be at least 10 characters
- Describe what the image shows, not what it is

**Images not displaying**
- Check file path is correct
- Ensure file exists in uploads folder
- Verify file extension is supported

**Slow loading images**
- Run media optimization script
- Check if responsive variants are generated
- Consider using WebP format

### Debug Commands

```bash
# Check media manifest
cat public/uploads/media-manifest.json

# Validate all media files
npm run media:validate

# Re-optimize all media
npm run optimize:media

# Check build logs for media issues
npm run build 2>&1 | grep -i media
```

## Migration from Existing Media

When migrating existing media files:

1. **Organize files** into appropriate folders
2. **Rename files** to follow naming conventions
3. **Add alt text** to all images in CMS
4. **Run optimization** to generate variants
5. **Update content** to use new file paths

### Migration Script Example

```bash
# Create folder structure
mkdir -p public/uploads/{case-studies,services,insights,team,testimonials,general}

# Move existing files to appropriate folders
mv public/images/projects/* public/uploads/case-studies/
mv public/images/services/* public/uploads/services/
mv public/images/blog/* public/uploads/insights/

# Run optimization
npm run optimize:media
```

## Security Considerations

### File Upload Security

- **File type validation**: Only allow approved image formats
- **File size limits**: Prevent large file uploads
- **Filename sanitization**: Remove potentially harmful characters
- **Content scanning**: Basic validation of file headers

### Access Control

- **CMS authentication**: Only authenticated users can upload
- **Role-based permissions**: Control who can manage media
- **Git-based workflow**: All changes tracked in version control

## Monitoring and Analytics

### Media Usage Tracking

The media manifest provides insights into:
- Total number of files by category
- Storage usage by category
- File size distribution
- Upload frequency

### Performance Monitoring

Monitor these metrics:
- Image loading times
- Core Web Vitals scores
- CDN cache hit rates
- Mobile vs desktop performance

## Future Enhancements

Planned improvements:
- **AI-powered alt text**: Automatic image description generation
- **Smart cropping**: Automatic focal point detection
- **Advanced compression**: Better optimization algorithms
- **Real-time optimization**: On-the-fly image processing
- **Usage analytics**: Track which images are most viewed