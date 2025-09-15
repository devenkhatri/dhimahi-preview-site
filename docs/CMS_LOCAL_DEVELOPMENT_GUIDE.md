# CMS Local Development Guide

## Quick Fix for Admin Access Issues

If you're getting a "Error loading the CMS configuration" or 404 error when accessing `/admin/`, follow these steps:

### 1. 🚀 Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. 🔧 Clear Cache and Restart

```bash
# Clean development environment
npm run clean:dev
npm run dev
```

### 3. 🌐 Try Different URLs

Visit these URLs in order:
- `http://localhost:3000/admin/`
- `http://localhost:3000/admin`
- `http://localhost:3000/admin/index.html`

### 4. 🔍 Check Browser Console

1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for any JavaScript errors
4. Go to Network tab and refresh the page
5. Check if any files are failing to load (red entries)

## Common Issues and Solutions

### Issue: "Error loading the CMS configuration (404)"

**Cause**: YAML syntax error in `public/admin/config.yml`

**Solution**:
```bash
# Validate the configuration
node scripts/validate-cms-config.js

# If validation fails, check for:
# - Unclosed quotes
# - Incorrect indentation (use spaces, not tabs)
# - Missing colons after field names
# - Trailing commas
```

### Issue: "Failed to load config.yml"

**Cause**: File not found or server not serving static files properly

**Solution**:
```bash
# Check if files exist
ls -la public/admin/

# Should show:
# - config.yml
# - index.html
# - media-widget.js
# - preview-templates/

# If files are missing, they may have been accidentally deleted
```

### Issue: Blank page or infinite loading

**Cause**: JavaScript errors or missing dependencies

**Solution**:
```bash
# Check JavaScript files
node scripts/test-admin-access.js

# Look for syntax errors in browser console
# Common issues:
# - Missing semicolons
# - Unclosed functions
# - Undefined variables
```

### Issue: Authentication errors in local development

**Cause**: Netlify Identity not configured for localhost

**Solution**: The configuration now includes `local_backend: true` which bypasses authentication for local development.

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access CMS Interface
Visit: `http://localhost:3000/admin/`

### 3. Edit Content
- Use the CMS interface for structured editing
- Or edit files directly in `./content/` directory
- Changes are reflected immediately

### 4. Test Changes
- Preview changes in the CMS
- Visit your site at `http://localhost:3000`
- Check that content updates appear correctly

## File Structure

```
public/admin/
├── index.html              # Main CMS interface
├── config.yml              # CMS configuration
├── config.local.yml        # Local development config
├── index.local.html        # Local development page
├── media-widget.js         # Custom media widget
└── preview-templates/      # Preview templates
    ├── homepage-preview.js
    ├── service-preview.js
    ├── case-study-preview.js
    ├── insight-preview.js
    ├── pages-preview.js
    └── settings-preview.js
```

## Configuration Details

### Local Backend
The CMS is configured with `local_backend: true` which:
- Bypasses Netlify Identity authentication
- Allows direct file editing
- Works without internet connection
- Perfect for local development

### Media Management
- **Local folder**: `public/uploads/`
- **Public URL**: `/uploads/`
- **Organized subfolders**: testimonials, services, case-studies, etc.

### Content Structure
- **Settings**: `content/settings/general.yml`
- **Homepage**: `content/pages/homepage.yml`
- **Services**: `content/services/*.md`
- **Case Studies**: `content/case-studies/*.md`
- **Insights**: `content/insights/*.md`

## Validation Features

### Brand Field Validation
All brand-related fields include:
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ URL format validation for social media
- ✅ Character length limits
- ✅ Required field validation
- ✅ Helpful hints and examples

### Content Validation
- Automatic accessibility checks
- Image alt text requirements
- SEO field validation
- Content structure validation

## Troubleshooting Commands

### Diagnostic Tools
```bash
# Test admin access
node scripts/test-admin-access.js

# Validate CMS configuration
node scripts/validate-cms-config.js

# Test brand field validation
node scripts/test-cms-validation.js

# Verify CMS interface
node scripts/test-cms-interface.js

# Complete integration test
node scripts/verify-cms-brand-integration.js
```

### Fix Common Issues
```bash
# Fix local CMS setup
node scripts/fix-local-cms.js

# Clean and restart
npm run clean:dev && npm run dev

# Validate content files
npm run validate:content
```

## Production vs Development

### Development Mode
- Uses `local_backend: true`
- No authentication required
- Direct file editing
- Immediate preview
- Full debugging information

### Production Mode
- Uses Netlify Identity authentication
- Git-based workflow
- Editorial workflow support
- User role management
- Secure content management

## Getting Help

### Check These First
1. **Server Running**: Is `npm run dev` active?
2. **Port Available**: Is localhost:3000 accessible?
3. **Files Present**: Do admin files exist in `public/admin/`?
4. **Console Errors**: Any JavaScript errors in browser console?
5. **Network Issues**: Any failed requests in Network tab?

### Debug Information
When reporting issues, include:
- Browser and version
- Node.js version (`node --version`)
- Error messages from console
- Network tab screenshot
- Steps to reproduce

### Common Solutions
- **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
- **Restart server**: Stop and start `npm run dev`
- **Check file permissions**: Ensure files are readable
- **Update dependencies**: `npm install`
- **Reset configuration**: Run fix scripts

## Advanced Configuration

### Custom Preview Templates
Preview templates in `public/admin/preview-templates/` provide:
- Real-time content preview
- Styled preview matching your site
- Interactive preview components
- Accessibility validation

### Media Widget Enhancements
The custom media widget provides:
- Automatic alt text suggestions
- Image optimization hints
- Accessibility warnings
- Upload progress tracking

### Validation Patterns
All validation patterns are tested and include:
- Email: RFC-compliant email validation
- Phone: International phone number support
- URLs: Platform-specific social media validation
- Text: Character limits with helpful guidance

This guide should help you resolve most CMS access issues in local development. The configuration is now optimized for both local development and production deployment.