# Analytics and Conversion Tracking Implementation

This document describes the comprehensive analytics and conversion tracking system implemented for the Dhīmahi Technolabs website.

## Overview

The analytics system includes:
- Google Analytics 4 with enhanced ecommerce
- Google Tag Manager integration
- Facebook Pixel tracking
- Custom event tracking for lead generation
- Conversion funnel analysis
- A/B testing framework
- Performance monitoring and error tracking
- User behavior analytics

## Features Implemented

### 1. Enhanced Google Analytics 4
- **Enhanced Ecommerce**: Service inquiries tracked as ecommerce events
- **Custom Dimensions**: Lead source, user type, engagement score
- **Cross-domain Tracking**: Configured for multiple domains
- **Custom Events**: Comprehensive event taxonomy for business goals

### 2. Lead Generation Tracking
- **Form Lifecycle**: Start, progress, completion, abandonment
- **Lead Events**: Consultation requests, quote requests, newsletter signups
- **Attribution**: UTM parameters and referrer tracking
- **Progressive Profiling**: Enhanced user data collection

### 3. Conversion Funnel Analysis
- **Six-Stage Funnel**: Awareness → Interest → Consideration → Intent → Evaluation → Purchase
- **Stage Progression**: Automatic tracking based on user behavior
- **Conversion Goals**: Mapped to business objectives with values
- **Funnel Visualization**: Real-time progress tracking

### 4. A/B Testing Framework
- **Variant Assignment**: Weight-based distribution
- **Persistent Variants**: localStorage-based consistency
- **Conversion Tracking**: A/B test specific conversion events
- **Easy Integration**: React hooks for component-level testing

### 5. Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB tracking
- **Error Tracking**: JavaScript errors and unhandled rejections
- **Resource Monitoring**: Failed resource loads
- **Network Quality**: Connection type and speed tracking

### 6. User Behavior Analytics
- **Engagement Scoring**: Multi-factor engagement calculation
- **Scroll Depth**: Milestone-based scroll tracking
- **Time on Page**: Interval-based time tracking
- **Interaction Tracking**: Click, touch, and keyboard interactions

## File Structure

```
src/
├── lib/
│   ├── analytics.ts              # Core analytics functions
│   ├── conversion-tracking.ts    # Conversion funnel and form tracking
│   └── analytics-validation.ts   # Development validation tools
├── components/
│   ├── Analytics.tsx             # Main analytics component
│   ├── PerformanceMonitor.tsx    # Performance and error monitoring
│   └── CTAButton.tsx             # CTA tracking component
├── hooks/
│   ├── useABTest.ts              # A/B testing hooks
│   └── useConversionTracking.ts  # Conversion tracking hooks
└── __tests__/
    └── analytics.test.ts         # Analytics test suite
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional but recommended
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_HOTJAR_ID=1234567
```

### Google Analytics 4 Setup

1. Create a GA4 property
2. Enable Enhanced Ecommerce
3. Set up custom dimensions:
   - `custom_parameter_1`: Lead Source
   - `custom_parameter_2`: User Type
   - `custom_parameter_3`: Engagement Score

### Google Tag Manager Setup

1. Create a GTM container
2. Configure GA4 tag
3. Set up conversion tracking
4. Add custom event triggers

## Usage Examples

### Basic Event Tracking

```typescript
import { trackEvent } from '@/lib/analytics';

// Track a custom event
trackEvent('button_click', 'Navigation', 'Header CTA', 1);
```

### Lead Generation Tracking

```typescript
import { useLeadTracking } from '@/hooks/useConversionTracking';

function ContactForm() {
  const { trackLead } = useLeadTracking();
  
  const handleSubmit = () => {
    trackLead(LeadEvent.FORM_COMPLETE, {
      form_type: 'contact',
      lead_source: 'website'
    });
  };
}
```

### Form Tracking

```typescript
import { useFormTracking } from '@/hooks/useConversionTracking';

function MyForm() {
  const { startTracking, trackFieldInteraction, trackCompletion } = useFormTracking(
    'contact-form',
    'contact'
  );
  
  useEffect(() => {
    startTracking();
  }, []);
  
  const handleFieldChange = (fieldName: string, value: any) => {
    trackFieldInteraction(fieldName, value);
  };
  
  const handleSubmit = () => {
    trackCompletion('consultation_request');
  };
}
```

### A/B Testing

```typescript
import { useABTest } from '@/hooks/useABTest';

function HeroSection() {
  const variant = useABTest('hero-test');
  
  return (
    <div className={variant?.config.className}>
      {variant?.config.title || 'Default Title'}
    </div>
  );
}
```

### CTA Tracking

```typescript
import CTAButton from '@/components/CTAButton';

function ServicePage() {
  return (
    <CTAButton
      ctaText="Get Free Consultation"
      ctaLocation="service-page-hero"
      serviceName="Web Development"
      serviceCategory="Development"
      estimatedValue={50000}
      href="/consultation"
    >
      Get Started
    </CTAButton>
  );
}
```

## Conversion Goals

The system tracks the following conversion goals:

| Goal ID | Name | Value (₹) | Category | Funnel Stage |
|---------|------|-----------|----------|--------------|
| `consultation_request` | Consultation Request | 500 | Lead | Intent |
| `quote_request` | Quote Request | 1,000 | Lead | Evaluation |
| `newsletter_signup` | Newsletter Signup | 50 | Lead | Interest |
| `resource_download` | Resource Download | 100 | Lead | Consideration |
| `phone_call` | Phone Call Click | 200 | Lead | Intent |
| `service_purchase` | Service Purchase | 50,000 | Sale | Purchase |

## Funnel Stages

1. **Awareness**: Homepage visits, organic search
2. **Interest**: Service page views, blog reading
3. **Consideration**: Portfolio views, case study reading
4. **Intent**: Contact form starts, consultation requests
5. **Evaluation**: Quote requests, detailed discussions
6. **Purchase**: Service contracts signed

## Performance Metrics

The system tracks Core Web Vitals and custom performance metrics:

- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **FCP (First Contentful Paint)**: Target < 1.8s
- **TTFB (Time to First Byte)**: Target < 600ms

## Development Tools

### Validation

The system includes comprehensive validation:
- Environment variable checks
- Service initialization verification
- Event tracking validation
- Performance monitoring

### Testing

Run analytics tests with:
```bash
npm test -- analytics.test.ts
```

## Privacy and Compliance

- **GDPR Compliance**: Cookie consent integration
- **Data Retention**: Configurable retention policies
- **Opt-out Support**: User preference management
- **Secure Transmission**: HTTPS-only data transmission

## Troubleshooting

### Common Issues

1. **Events not tracking**: Check GA_TRACKING_ID configuration
2. **Console errors**: Verify all environment variables are set
3. **Missing conversions**: Check conversion goal mapping
4. **A/B tests not working**: Verify localStorage availability

### Debug Mode

Enable debug logging in development:
```javascript
localStorage.setItem('analytics_debug', 'true');
```

### Validation

Check analytics setup:
```javascript
import { logAnalyticsStatus } from '@/lib/analytics-validation';
logAnalyticsStatus();
```

## Future Enhancements

- Server-side analytics for better accuracy
- Advanced attribution modeling
- Machine learning-based user segmentation
- Real-time personalization
- Advanced cohort analysis

## Support

For issues or questions about the analytics implementation, refer to:
- Google Analytics 4 documentation
- Google Tag Manager guides
- Facebook Pixel documentation
- Next.js analytics best practices