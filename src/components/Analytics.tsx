'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics on mount
    initializeAnalytics();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      const url = `${window.location.origin}${pathname}`;
      trackPageView(url);
    }
  }, [pathname]);

  return null;
}