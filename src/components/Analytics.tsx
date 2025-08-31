'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackPageView, trackUserJourney } from '@/lib/analytics';
import { initializeConversionTracking, ConversionFunnel } from '@/lib/conversion-tracking';
import { logAnalyticsStatus } from '@/lib/analytics-validation';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics();
    initializeConversionTracking();
    
    // Validate setup in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        logAnalyticsStatus();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      const url = `${window.location.origin}${pathname}`;
      const title = document.title;
      
      trackPageView(url, title);
      
      // Track user journey
      trackUserJourney('page_view', pathname, {
        search_params: URLSearchParams?.toString(),
        referrer: document.referrer,
        timestamp: Date.now()
      });

      // Update funnel stage based on page
      const funnel = ConversionFunnel.getInstance();
      updateFunnelStageFromPage(pathname, funnel);
    }
  }, [pathname, URLSearchParams]);

  return null;
}

// Helper function to update funnel stage based on page
function updateFunnelStageFromPage(pathname: string, funnel: ConversionFunnel) {
  const { FunnelStage } = require('@/lib/analytics');
  
  if (pathname === '/') {
    funnel.trackStage(FunnelStage.AWARENESS);
  } else if (pathname.startsWith('/services')) {
    funnel.trackStage(FunnelStage.INTEREST);
  } else if (pathname.startsWith('/portfolio') || pathname.startsWith('/insights')) {
    funnel.trackStage(FunnelStage.CONSIDERATION);
  } else if (pathname === '/consultation' || pathname === '/quote') {
    funnel.trackStage(FunnelStage.INTENT);
  }
}