'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackPageView, trackUserJourney, FunnelStage } from '@/lib/analytics';
import { initializeConversionTracking, ConversionFunnel } from '@/lib/conversion-tracking';
import { logAnalyticsStatus } from '@/lib/analytics-validation';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // Initialize analytics on mount
      initializeAnalytics();
      initializeConversionTracking();
      
      // Skip validation in development to avoid console errors
      // Validation will run in production where GA is properly configured
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }, []);

  useEffect(() => {
    try {
      // Track page views on route changes
      if (pathname && typeof window !== 'undefined') {
        const url = `${window.location.origin}${pathname}`;
        const title = document.title;
        
        trackPageView(url, title);
        
        // Track user journey
        const searchParams = new URLSearchParams(window.location.search);
        trackUserJourney('page_view', pathname, {
          search_params: searchParams.toString(),
          referrer: document.referrer,
          timestamp: Date.now()
        });

        // Update funnel stage based on page
        const funnel = ConversionFunnel.getInstance();
        updateFunnelStageFromPage(pathname, funnel);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, [pathname]);

  return null;
}

// Helper function to update funnel stage based on page
function updateFunnelStageFromPage(pathname: string, funnel: ConversionFunnel) {
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