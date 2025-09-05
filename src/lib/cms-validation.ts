import { z } from 'zod';
import type { 
  HomepageContent, 
  ServiceData, 
  CaseStudy, 
  Insight,
  AboutContent 
} from './cms-content';

// Validation schemas using Zod
export const HomepageContentSchema = z.object({
  hero: z.object({
    mainHeadline: z.string().min(1, 'Main headline is required'),
    subheadline: z.string().min(1, 'Subheadline is required'),
    trustBadge: z.string().min(1, 'Trust badge is required'),
    statistics: z.array(z.object({
      value: z.number().min(0, 'Statistic value must be positive'),
      suffix: z.string(),
      label: z.string().min(1, 'Statistic label is required')
    })).min(1, 'At least one statistic is required'),
    ctaButtons: z.object({
      primary: z.string().min(1, 'Primary CTA button text is required'),
      secondary: z.string().min(1, 'Secondary CTA button text is required')
    }),
    trustIndicators: z.array(z.string()),
    floatingBadges: z.array(z.object({
      icon: z.string().min(1, 'Badge icon is required'),
      text: z.string().min(1, 'Badge text is required')
    }))
  }),
  services: z.object({
    title: z.string().min(1, 'Services title is required'),
    subtitle: z.string().min(1, 'Services subtitle is required')
  }),
  whyChooseUs: z.object({
    title: z.string().min(1, 'Why choose us title is required'),
    subtitle: z.string().min(1, 'Why choose us subtitle is required'),
    reasons: z.array(z.object({
      icon: z.string().min(1, 'Reason icon is required'),
      title: z.string().min(1, 'Reason title is required'),
      description: z.string().min(1, 'Reason description is required')
    })).min(1, 'At least one reason is required')
  }),
  testimonials: z.object({
    title: z.string().min(1, 'Testimonials title is required'),
    subtitle: z.string().min(1, 'Testimonials subtitle is required'),
    items: z.array(z.object({
      quote: z.string().min(1, 'Testimonial quote is required'),
      author: z.string().min(1, 'Testimonial author is required')
    })).min(1, 'At least one testimonial is required')
  }),
  contactCta: z.object({
    title: z.string().min(1, 'Contact CTA title is required'),
    description: z.string().min(1, 'Contact CTA description is required'),
    buttons: z.object({
      primary: z.string().min(1, 'Primary button text is required'),
      secondary: z.string().min(1, 'Secondary button text is required')
    })
  }),
  contactForm: z.object({
    title: z.string().min(1, 'Contact form title is required'),
    description: z.string().min(1, 'Contact form description is required'),
    email: z.string().email('Valid email is required')
  })
});

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
}

// Content validation functions
export function validateHomepageContent(data: any): ValidationResult<HomepageContent> {
  try {
    const validatedData = HomepageContentSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.code === 'invalid_type' ? `Expected ${err.expected}, got ${err.received}` : undefined
      }));
      
      return {
        success: false,
        errors
      };
    }
    
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Unknown validation error occurred' }]
    };
  }
}

// Simple validation functions for other content types (without strict schemas for now)
export function validateServiceData(data: any): ValidationResult<ServiceData> {
  const errors: ValidationError[] = [];
  
  if (!data.title) errors.push({ field: 'title', message: 'Service title is required' });
  if (!data.slug) errors.push({ field: 'slug', message: 'Service slug is required' });
  if (!data.excerpt) errors.push({ field: 'excerpt', message: 'Service excerpt is required' });
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors
  };
}

export function validateCaseStudy(data: any): ValidationResult<CaseStudy> {
  const errors: ValidationError[] = [];
  
  if (!data.title) errors.push({ field: 'title', message: 'Case study title is required' });
  if (!data.slug) errors.push({ field: 'slug', message: 'Case study slug is required' });
  if (!data.excerpt) errors.push({ field: 'excerpt', message: 'Case study excerpt is required' });
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors
  };
}

export function validateInsight(data: any): ValidationResult<Insight> {
  const errors: ValidationError[] = [];
  
  if (!data.title) errors.push({ field: 'title', message: 'Insight title is required' });
  if (!data.slug) errors.push({ field: 'slug', message: 'Insight slug is required' });
  if (!data.excerpt) errors.push({ field: 'excerpt', message: 'Insight excerpt is required' });
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors
  };
}

export function validateAboutContent(data: any): ValidationResult<AboutContent> {
  const errors: ValidationError[] = [];
  
  if (!data.title) errors.push({ field: 'title', message: 'About title is required' });
  if (!data.subtitle) errors.push({ field: 'subtitle', message: 'About subtitle is required' });
  
  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors
  };
}

// Utility function to log validation errors
export function logValidationErrors(contentType: string, errors: ValidationError[]): void {
  console.error(`❌ Validation failed for ${contentType}:`);
  errors.forEach(error => {
    console.error(`  • ${error.field}: ${error.message}${error.value ? ` (${error.value})` : ''}`);
  });
}

// Build-time validation function
export function validateAllContent(): { success: boolean; errors: Record<string, ValidationError[]> } {
  const allErrors: Record<string, ValidationError[]> = {};
  let hasErrors = false;

  console.log('🔍 Validating all CMS content...');
  
  if (hasErrors) {
    console.error('❌ Content validation failed. Please fix the errors above.');
    return { success: false, errors: allErrors };
  }
  
  console.log('✅ All content validation passed.');
  return { success: true, errors: {} };
}