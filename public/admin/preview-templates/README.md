# Decap CMS Preview Templates

This directory contains custom preview templates for Decap CMS that provide live previews of content as users edit it in the admin interface.

## Overview

The preview templates use React-like syntax (via Decap CMS's built-in `createClass` and `h` functions) to render content previews that match the actual website styling using Tailwind CSS.

## Available Templates

### 1. Homepage Preview (`homepage-preview.js`)
- **Collection**: `homepage`
- **Features**:
  - Hero section with headline, subheadline, and statistics
  - Services overview with featured services
  - Testimonials grid
  - Contact CTA section
  - Trust badges and floating elements

### 2. Service Preview (`service-preview.js`)
- **Collection**: `services`
- **Features**:
  - Service header with icon, title, and pricing info
  - Key features grid
  - Process steps timeline
  - Technology stack showcase
  - FAQ section
  - Call-to-action sections

### 3. Case Study Preview (`case-study-preview.js`)
- **Collection**: `caseStudies`
- **Features**:
  - Project header with client information
  - Image gallery with before/after/process images
  - Challenge, solution, and results sections
  - Technology stack tags
  - Client testimonial
  - Results metrics with visual indicators

### 4. Insight Preview (`insight-preview.js`)
- **Collection**: `insights`
- **Features**:
  - Article header with metadata (author, date, tags)
  - Featured image display
  - Full article content with proper typography
  - SEO preview section
  - Author bio section
  - Related articles grid

### 5. Pages Preview (`pages-preview.js`)
- **Collection**: `pages`
- **Features**:
  - Flexible page layout for About, Contact, etc.
  - Mission and vision sections
  - Company values grid
  - Timeline/journey section
  - Team member profiles
  - Contact information display

### 6. Settings Preview (`settings-preview.js`)
- **Collection**: `settings`
- **Features**:
  - Site information display
  - Contact details preview
  - Social media links
  - SEO preview simulation
  - Usage information guide

## Technical Implementation

### Structure
Each preview template follows this pattern:
```javascript
const TemplateNamePreview = createClass({
  render() {
    const entry = this.props.entry;
    // Extract data using entry.getIn(['data', 'fieldName'])
    
    return h('div', { className: 'cms-preview' },
      // Render preview content using h() function
    );
  }
});

CMS.registerPreviewTemplate('collectionName', TemplateNamePreview);
```

### Data Access
- Use `entry.getIn(['data', 'fieldName'])` to access field values
- For nested objects: `entry.getIn(['data', 'object', 'field'])`
- For arrays: `entry.getIn(['data', 'arrayField'])` returns an Immutable List

### Styling
- Uses Tailwind CSS classes for consistent styling
- Matches the actual website design patterns
- Responsive design with mobile-first approach
- Custom CSS classes defined in `admin/index.html`

### Content Rendering
- HTML content rendered using `dangerouslySetInnerHTML`
- Markdown content should be pre-processed to HTML
- Images use proper alt text and responsive classes
- Lists and arrays mapped using `.map().toArray()`

## Configuration

The preview templates are loaded in `public/admin/index.html`:
```html
<script src="/admin/preview-templates/homepage-preview.js"></script>
<script src="/admin/preview-templates/service-preview.js"></script>
<!-- ... other templates -->
```

Preview settings in `public/admin/config.yml`:
```yaml
show_preview_links: true
preview_path: "{{slug}}"
editor:
  preview: true
```

## Usage

1. **Content Editors**: Click the "Preview" button in the CMS editor to see live previews
2. **Developers**: Modify templates to match design changes or add new preview features
3. **Testing**: Preview templates help validate content before publishing

## Customization

To customize or extend preview templates:

1. **Modify Existing Templates**: Edit the relevant `.js` file
2. **Add New Collections**: Create new preview template and register it
3. **Update Styling**: Modify Tailwind classes or add custom CSS
4. **Add Features**: Extend templates with new sections or functionality

## Best Practices

1. **Performance**: Keep preview templates lightweight
2. **Accuracy**: Ensure previews match actual website rendering
3. **Responsiveness**: Test previews on different screen sizes
4. **Error Handling**: Provide fallbacks for missing content
5. **Accessibility**: Include proper alt text and semantic HTML

## Troubleshooting

### Common Issues

1. **Preview Not Loading**: Check browser console for JavaScript errors
2. **Styling Issues**: Verify Tailwind CSS is loaded correctly
3. **Data Not Displaying**: Check field names match CMS configuration
4. **Template Not Registered**: Ensure script is loaded and registered properly

### Debugging

1. Use browser developer tools to inspect preview content
2. Check CMS configuration matches template expectations
3. Verify field names and data structure
4. Test with sample content to isolate issues

## Future Enhancements

Potential improvements for preview templates:

1. **Interactive Elements**: Add hover states and animations
2. **Real-time Updates**: Improve preview refresh performance
3. **Mobile Preview**: Add device-specific preview modes
4. **Content Validation**: Show warnings for missing required content
5. **SEO Preview**: Enhanced search result preview simulation