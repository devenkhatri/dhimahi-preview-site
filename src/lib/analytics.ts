// Analytics integration for SEO and performance tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize Google Analytics
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
  });
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
  formType: 'contact' | 'consultation' | 'quote' | 'newsletter' | 'download',
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

  window.gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: estimatedValue || 0,
    items: [
      {
        item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
        item_name: serviceName,
        item_category: serviceCategory,
        quantity: 1,
        price: estimatedValue || 0,
      },
    ],
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

// Initialize analytics on page load
export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  // Set page load time for engagement calculation
  (window as any).pageLoadTime = Date.now();
  (window as any).userInteractions = 0;

  // Initialize GA
  initGA();

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

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cleanupFunctions.forEach(cleanup => cleanup?.());
  });
}