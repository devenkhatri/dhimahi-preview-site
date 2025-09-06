'use client';

import { useEffect } from 'react';
import { trackError, trackBehaviorEvent, BehaviorEvent } from '@/lib/analytics';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor performance and errors
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error('Unhandled Promise Rejection'), {
        reason: event.reason,
        type: 'unhandledrejection'
      });
    };

    // Monitor resource loading errors
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target) {
        trackError(new Error('Resource Load Error'), {
          resource_type: target.tagName,
          resource_src: (target as any).src || (target as any).href,
          type: 'resource_error'
        });
      }
    };

    // Monitor network errors
    const handleNetworkError = () => {
      trackError(new Error('Network Error'), {
        type: 'network_error',
        online: navigator.onLine
      });
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    document.addEventListener('error', handleResourceError, true);
    window.addEventListener('offline', handleNetworkError);

    // Monitor page visibility changes
    const handleVisibilityChange = () => {
      trackBehaviorEvent(BehaviorEvent.NAVIGATION_CLICK, {
        visibility_state: document.visibilityState,
        hidden: document.hidden
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      trackBehaviorEvent(BehaviorEvent.NAVIGATION_CLICK, {
        connection_type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        save_data: connection.saveData
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('error', handleResourceError, true);
      window.removeEventListener('offline', handleNetworkError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}