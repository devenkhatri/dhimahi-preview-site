/**
 * Media optimization utilities for Decap CMS integration
 * Handles image processing, optimization, and management
 */

export interface MediaAsset {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  type?: 'image' | 'video' | 'document';
  category?: string;
  optimized?: boolean;
}

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function generateResponsiveSizes(
  baseWidth: number,
  breakpoints: number[] = [640, 768, 1024, 1280, 1536, 1920]
): string {
  const sizes = breakpoints.map(bp => `(max-width: ${bp}px) ${Math.min(bp, baseWidth)}px`);
  sizes.push(`${baseWidth}px`);
  return sizes.join(', ');
}

/**
 * Generate optimized image URLs for different formats and sizes
 */
export function generateOptimizedImageUrls(
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): { webp: string; avif: string; fallback: string } {
  const { quality = 85, width, height } = options;
  
  // For static export, we'll use the original URLs
  // In a production environment, this would integrate with a CDN or image service
  const baseUrl = originalUrl.replace(/\.[^/.]+$/, '');
  const extension = originalUrl.split('.').pop()?.toLowerCase() || 'jpg';
  
  return {
    webp: `${baseUrl}.webp`,
    avif: `${baseUrl}.avif`,
    fallback: originalUrl
  };
}

/**
 * Extract image metadata from file path
 */
export function extractImageMetadata(filePath: string): {
  category: string;
  filename: string;
  extension: string;
} {
  const pathParts = filePath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Determine category based on folder structure
  let category = 'general';
  if (filePath.includes('/case-studies/')) category = 'case-studies';
  else if (filePath.includes('/services/')) category = 'services';
  else if (filePath.includes('/insights/')) category = 'insights';
  else if (filePath.includes('/team/')) category = 'team';
  else if (filePath.includes('/testimonials/')) category = 'testimonials';
  
  return { category, filename, extension };
}

/**
 * Generate automatic alt text suggestions based on filename and context
 */
export function generateAltTextSuggestion(
  filename: string,
  category: string,
  context?: string
): string {
  // Remove file extension and clean filename
  const cleanName = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  const categoryPrefixes: Record<string, string> = {
    'case-studies': 'Case study image showing',
    'services': 'Service illustration for',
    'insights': 'Article image for',
    'team': 'Team member photo of',
    'testimonials': 'Client testimonial from',
    'general': 'Image of'
  };
  
  const prefix = categoryPrefixes[category] || categoryPrefixes.general;
  
  if (context) {
    return `${prefix} ${cleanName} - ${context}`;
  }
  
  return `${prefix} ${cleanName}`;
}

/**
 * Validate image file for CMS upload
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  // File size validation (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 10MB limit`);
    suggestions.push('Compress the image before uploading');
  }
  
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not supported`);
    suggestions.push('Use JPEG, PNG, WebP, or GIF format');
  }
  
  // Filename validation
  const filename = file.name;
  if (filename.length > 100) {
    errors.push('Filename is too long (max 100 characters)');
    suggestions.push('Use a shorter, descriptive filename');
  }
  
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    errors.push('Filename contains invalid characters');
    suggestions.push('Use only letters, numbers, dots, hyphens, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions
  };
}

/**
 * Generate blur placeholder for image loading
 */
export function generateBlurPlaceholder(width: number, height: number): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f9fafb;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`
  ).toString('base64')}`;
}

/**
 * Media folder organization helper
 */
export const MEDIA_FOLDERS = {
  'case-studies': {
    path: '/uploads/case-studies',
    description: 'Project screenshots and case study images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  'services': {
    path: '/uploads/services',
    description: 'Service page images and illustrations',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  },
  'insights': {
    path: '/uploads/insights',
    description: 'Blog article featured images and content images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  'team': {
    path: '/uploads/team',
    description: 'Team member profile photos',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  'testimonials': {
    path: '/uploads/testimonials',
    description: 'Client photos and testimonial images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  'general': {
    path: '/uploads/general',
    description: 'General website images and assets',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  }
} as const;

/**
 * Get recommended image dimensions for different content types
 */
export function getRecommendedDimensions(category: string): {
  width: number;
  height: number;
  aspectRatio: string;
} {
  const dimensions = {
    'case-studies': { width: 1200, height: 800, aspectRatio: '3:2' },
    'services': { width: 800, height: 600, aspectRatio: '4:3' },
    'insights': { width: 1200, height: 630, aspectRatio: '1.91:1' }, // Social media optimized
    'team': { width: 400, height: 400, aspectRatio: '1:1' },
    'testimonials': { width: 300, height: 300, aspectRatio: '1:1' },
    'general': { width: 1200, height: 800, aspectRatio: '3:2' }
  };
  
  return dimensions[category as keyof typeof dimensions] || dimensions.general;
}