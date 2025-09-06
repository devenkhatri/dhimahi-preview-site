// Analytics integration for SEO and performance tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    gtm?: any;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

// Enhanced ecommerce item interface
export interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2?: string;
  item_brand?: string;
  price: number;
  quantity: number;
  currency?: string;
}

// Conversion funnel stages
export enum FunnelStage {
  AWARENESS = 'awareness',
  INTEREST = 'interest',
  CONSIDERATION = 'consideration',
  INTENT = 'intent',
  EVALUATION = 'evaluation',
  PURCHASE = 'purchase'
}

// Lead generation events
export enum LeadEvent {
  FORM_START = 'form_start',
  FORM_PROGRESS = 'form_progress',
  FORM_COMPLETE = 'form_complete',
  CONSULTATION_REQUEST = 'consultation_request',
  QUOTE_REQUEST = 'quote_request',
  RESOURCE_DOWNLOAD = 'resource_download',
  PHONE_CLICK = 'phone_click',
  EMAIL_CLICK = 'email_click'
}

// User behavior tracking events
export enum BehaviorEvent {
  SCROLL_DEPTH = 'scroll_depth',
  TIME_ON_PAGE = 'time_on_page',
  VIDEO_PLAY = 'video_play',
  VIDEO_COMPLETE = 'video_complete',
  SEARCH_PERFORMED = 'search_performed',
  EXTERNAL_LINK_CLICK = 'external_link_click',
  FILE_DOWNLOAD = 'file_download',
  CTA_CLICK = 'cta_click',
  NAVIGATION_CLICK = 'navigation_click'
}

// Initialize Google Analytics 4 with enhanced ecommerce
export function initGA() {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    // Enhanced ecommerce settings
    custom_map: {
      custom_parameter_1: 'lead_source',
      custom_parameter_2: 'user_type',
      custom_parameter_3: 'engagement_score'
    },
    // Conversion linker for cross-domain tracking
    linker: {
      domains: ['dhimahitechnolabs.com', 'www.dhimahitechnolabs.com']
    }
  });

  // Set default custom dimensions
  window.gtag('config', GA_TRACKING_ID, {
    custom_map: {
      custom_parameter_1: 'lead_source',
      custom_parameter_2: 'user_type',
      custom_parameter_3: 'engagement_score'
    }
  });
}

// Initialize Google Tag Manager
export function initGTM() {
  if (!GTM_ID || typeof window === 'undefined') return;

  // GTM script
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  // GTM noscript fallback
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;
  document.body.appendChild(noscript);
}

// Initialize Facebook Pixel
export function initFacebookPixel() {
  if (!FB_PIXEL_ID || typeof window === 'undefined') return;

  window.fbq = window.fbq || function() {
    (window.fbq as any).callMethod ? 
    (window.fbq as any).callMethod.apply(window.fbq, arguments) : 
    (window.fbq as any).queue.push(arguments);
  };
  
  if (!(window as any)._fbq) (window as any)._fbq = window.fbq;
  (window.fbq as any).push = window.fbq;
  (window.fbq as any).loaded = true;
  (window.fbq as any).version = '2.0';
  (window.fbq as any).queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
}

// Track page views
export function trackPageView(url: string, title?: string) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_title: title || document.title,
    page_location: url,
    send_page_view: true,
  });
}

// Track events
export function trackEvent(
  action: string,
  category: string = 'General',
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParameters,
  });
}

// Track conversions
export function trackConversion(
  conversionId: string,
  conversionLabel?: string,
  value?: number,
  currency: string = 'INR'
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: `${conversionId}/${conversionLabel}`,
    value: value,
    currency: currency,
  });
}

// Track form submissions
export function trackFormSubmission(
  formName: string,
  formType: 'contact' | 'consultation' | 'quote' | 'download',
  additionalData?: Record<string, any>
) {
  trackEvent('form_submit', 'Lead Generation', formName, undefined, {
    form_type: formType,
    ...additionalData,
  });
}

// Track scroll depth
export function trackScrollDepth() {
  if (typeof window === 'undefined') return;

  let maxScroll = 0;
  const milestones = [25, 50, 75, 90, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          trackEvent('scroll_depth', 'Engagement', `${milestone}%`, milestone);
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// Track time on page
export function trackTimeOnPage() {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();
  const intervals = [30, 60, 120, 300, 600]; // seconds
  const tracked = new Set<number>();

  const checkTimeSpent = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    intervals.forEach(interval => {
      if (timeSpent >= interval && !tracked.has(interval)) {
        tracked.add(interval);
        trackEvent('time_on_page', 'Engagement', `${interval}s`, interval);
      }
    });
  };

  const intervalId = setInterval(checkTimeSpent, 10000); // Check every 10 seconds

  // Track on page unload
  const handleBeforeUnload = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    trackEvent('session_duration', 'Engagement', 'page_exit', totalTime);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Cleanup function
  return () => {
    clearInterval(intervalId);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

// Track external link clicks
export function trackExternalLinks() {
  if (typeof document === 'undefined') return;

  const handleLinkClick = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href) {
      const url = new URL(target.href);
      const currentDomain = window.location.hostname;

      if (url.hostname !== currentDomain) {
        trackEvent('external_link_click', 'Navigation', url.hostname);
      }
    }
  };

  document.addEventListener('click', handleLinkClick);

  // Cleanup function
  return () => {
    document.removeEventListener('click', handleLinkClick);
  };
}

// Track search queries
export function trackSearch(query: string, category?: string, resultsCount?: number) {
  trackEvent('search', 'Site Search', query, resultsCount, {
    search_term: query,
    search_category: category,
    results_count: resultsCount,
  });
}

// Track video interactions
export function trackVideoInteraction(
  action: 'play' | 'pause' | 'complete' | 'progress',
  videoTitle: string,
  progress?: number
) {
  trackEvent(`video_${action}`, 'Video', videoTitle, progress);
}

// Track file downloads
export function trackDownload(fileName: string, fileType: string) {
  trackEvent('file_download', 'Downloads', fileName, undefined, {
    file_type: fileType,
  });
}

// Enhanced ecommerce tracking for service inquiries
export function trackServiceInquiry(
  serviceName: string,
  serviceCategory: string,
  estimatedValue?: number
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  const item: EcommerceItem = {
    item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
    item_name: serviceName,
    item_category: serviceCategory,
    item_brand: 'Dhimahi Technolabs',
    price: estimatedValue || 0,
    quantity: 1,
    currency: 'INR'
  };

  window.gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: estimatedValue || 0,
    items: [item],
  });

  // Also track as lead generation event
  trackLeadEvent(LeadEvent.CONSULTATION_REQUEST, {
    service_name: serviceName,
    service_category: serviceCategory,
    estimated_value: estimatedValue
  });
}

// Enhanced ecommerce - Add to cart (service interest)
export function trackServiceInterest(
  serviceName: string,
  serviceCategory: string,
  estimatedValue?: number
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  const item: EcommerceItem = {
    item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
    item_name: serviceName,
    item_category: serviceCategory,
    item_brand: 'Dhimahi Technolabs',
    price: estimatedValue || 0,
    quantity: 1,
    currency: 'INR'
  };

  window.gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: estimatedValue || 0,
    items: [item],
  });
}

// Enhanced ecommerce - Purchase (service contract signed)
export function trackServicePurchase(
  serviceName: string,
  serviceCategory: string,
  actualValue: number,
  transactionId: string
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  const item: EcommerceItem = {
    item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
    item_name: serviceName,
    item_category: serviceCategory,
    item_brand: 'Dhimahi Technolabs',
    price: actualValue,
    quantity: 1,
    currency: 'INR'
  };

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value: actualValue,
    items: [item],
  });

  // Track Facebook conversion
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: actualValue,
      currency: 'INR',
      content_name: serviceName,
      content_category: serviceCategory
    });
  }
}

// Lead generation event tracking
export function trackLeadEvent(
  event: LeadEvent,
  additionalData?: Record<string, any>
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', event, {
    event_category: 'Lead Generation',
    ...additionalData,
  });

  // Track in Facebook Pixel
  if (window.fbq) {
    const fbEventMap: Record<LeadEvent, string> = {
      [LeadEvent.FORM_START]: 'InitiateCheckout',
      [LeadEvent.FORM_COMPLETE]: 'Lead',
      [LeadEvent.CONSULTATION_REQUEST]: 'Lead',
      [LeadEvent.QUOTE_REQUEST]: 'Lead',
      [LeadEvent.RESOURCE_DOWNLOAD]: 'Lead',
      [LeadEvent.PHONE_CLICK]: 'Contact',
      [LeadEvent.EMAIL_CLICK]: 'Contact',
      [LeadEvent.FORM_PROGRESS]: 'InitiateCheckout'
    };

    const fbEvent = fbEventMap[event];
    if (fbEvent) {
      window.fbq('track', fbEvent, additionalData);
    }
  }
}

// Conversion funnel tracking
export function trackFunnelStage(
  stage: FunnelStage,
  serviceName?: string,
  additionalData?: Record<string, any>
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'funnel_stage', {
    event_category: 'Conversion Funnel',
    event_label: stage,
    funnel_stage: stage,
    service_name: serviceName,
    ...additionalData,
  });
}

// User behavior event tracking
export function trackBehaviorEvent(
  event: BehaviorEvent,
  additionalData?: Record<string, any>
) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', event, {
    event_category: 'User Behavior',
    ...additionalData,
  });
}

// Track user engagement score
export function calculateEngagementScore(): number {
  if (typeof window === 'undefined') return 0;

  let score = 0;
  
  // Time on site (max 40 points)
  const timeOnSite = (Date.now() - (window as any).pageLoadTime) / 1000;
  score += Math.min(40, timeOnSite / 30); // 1 point per 30 seconds, max 40

  // Scroll depth (max 30 points)
  const scrollPercent = Math.round(
    ((window.pageYOffset || document.documentElement.scrollTop) /
      (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  score += Math.min(30, scrollPercent * 0.3);

  // Page interactions (estimated, max 30 points)
  const interactions = (window as any).userInteractions || 0;
  score += Math.min(30, interactions * 5);

  return Math.round(score);
}

// A/B Testing Framework
export interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  active: boolean;
  targetAudience?: string[];
}

class ABTestingManager {
  private tests: Map<string, ABTest> = new Map();
  private userVariants: Map<string, string> = new Map();

  addTest(test: ABTest) {
    this.tests.set(test.id, test);
  }

  getVariant(testId: string): ABTestVariant | null {
    const test = this.tests.get(testId);
    if (!test || !test.active) return null;

    // Check if user already has a variant assigned
    const existingVariant = this.userVariants.get(testId);
    if (existingVariant) {
      return test.variants.find(v => v.id === existingVariant) || null;
    }

    // Assign new variant based on weights
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        this.userVariants.set(testId, variant.id);
        
        // Track variant assignment
        trackEvent('ab_test_assignment', 'A/B Testing', `${testId}:${variant.id}`);
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          const stored = JSON.parse(localStorage.getItem('ab_test_variants') || '{}');
          stored[testId] = variant.id;
          localStorage.setItem('ab_test_variants', JSON.stringify(stored));
        }
        
        return variant;
      }
    }

    return test.variants[0]; // Fallback to first variant
  }

  trackConversion(testId: string, conversionType: string, value?: number) {
    const variant = this.userVariants.get(testId);
    if (variant) {
      trackEvent('ab_test_conversion', 'A/B Testing', `${testId}:${variant}:${conversionType}`, value);
    }
  }

  loadStoredVariants() {
    if (typeof window === 'undefined') return;
    
    const stored = JSON.parse(localStorage.getItem('ab_test_variants') || '{}');
    Object.entries(stored).forEach(([testId, variantId]) => {
      this.userVariants.set(testId, variantId as string);
    });
  }
}

export const abTestManager = new ABTestingManager();

// Performance monitoring
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function trackPerformanceMetrics() {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  // Track Core Web Vitals
  import('web-vitals').then((webVitals) => {
    if (webVitals.onCLS) {
      webVitals.onCLS((metric) => {
        trackEvent('core_web_vital', 'Performance', 'CLS', Math.round(metric.value * 1000));
      });
    }

    if (webVitals.onINP) {
      webVitals.onINP((metric) => {
        trackEvent('core_web_vital', 'Performance', 'INP', Math.round(metric.value));
      });
    }

    if (webVitals.onFCP) {
      webVitals.onFCP((metric) => {
        trackEvent('core_web_vital', 'Performance', 'FCP', Math.round(metric.value));
      });
    }

    if (webVitals.onLCP) {
      webVitals.onLCP((metric) => {
        trackEvent('core_web_vital', 'Performance', 'LCP', Math.round(metric.value));
      });
    }

    if (webVitals.onTTFB) {
      webVitals.onTTFB((metric) => {
        trackEvent('core_web_vital', 'Performance', 'TTFB', Math.round(metric.value));
      });
    }
  }).catch(() => {
    // Fallback performance tracking
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      trackEvent('performance_metric', 'Performance', 'TTFB_fallback', Math.round(ttfb));
    }
  });
}

// Error tracking
export function trackError(error: Error, errorInfo?: any) {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: false,
    error_stack: error.stack,
    error_info: JSON.stringify(errorInfo),
  });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Tracked Error:', error, errorInfo);
  }
}

// User journey tracking
export function trackUserJourney(action: string, page: string, additionalData?: Record<string, any>) {
  trackEvent('user_journey', 'Navigation', `${page}:${action}`, undefined, {
    page_path: page,
    journey_action: action,
    ...additionalData,
  });
}

// Heat map and session recording integration
export function initHeatmapTracking() {
  // Hotjar integration
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
  if (hotjarId && typeof window !== 'undefined') {
    (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: hotjarId, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }
}

// Initialize analytics on page load
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Set page load time for engagement calculation
  (window as any).pageLoadTime = Date.now();
  (window as any).userInteractions = 0;

  // Initialize all tracking services
  initGA();
  initGTM();
  initFacebookPixel();
  initHeatmapTracking();

  // Load A/B test variants
  abTestManager.loadStoredVariants();

  // Set up performance monitoring
  trackPerformanceMetrics();

  // Set up tracking
  const cleanupFunctions = [
    trackScrollDepth(),
    trackTimeOnPage(),
    trackExternalLinks(),
  ].filter(Boolean);

  // Track user interactions
  const trackInteraction = () => {
    (window as any).userInteractions = ((window as any).userInteractions || 0) + 1;
  };

  ['click', 'keydown', 'touchstart'].forEach(eventType => {
    document.addEventListener(eventType, trackInteraction, { passive: true });
  });

  // Global error handling
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error('Unhandled Promise Rejection'), {
      reason: event.reason,
    });
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cleanupFunctions.forEach(cleanup => cleanup?.());
    
    // Track final engagement score
    const engagementScore = calculateEngagementScore();
    trackEvent('engagement_score', 'Engagement', 'final_score', engagementScore);
  });
}