'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsProps {
  debug?: boolean;
}

export default function WebVitals({ debug = false }: WebVitalsProps) {
  useEffect(() => {
    const sendToAnalytics = (metric: any) => {
      // Send to Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          custom_map: {
            metric_id: 'dimension1',
            metric_value: 'metric1',
            metric_delta: 'metric2',
          },
        });
      }

      // Send to console in debug mode
      if (debug) {
        console.log('Web Vital:', {
          name: metric.name,
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      }

      // Send to custom analytics endpoint (optional)
      // Commented out for static export compatibility
      /*
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            rating: metric.rating,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }),
        }).catch((error) => {
          if (debug) {
            console.error('Failed to send web vitals:', error);
          }
        });
      }
      */
    };

    // Measure Core Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaced FID in web-vitals v3
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, [debug]);

  return null;
}

// Hook for programmatic access to web vitals
export function useWebVitals(callback?: (metric: any) => void) {
  useEffect(() => {
    const handleMetric = (metric: any) => {
      callback?.(metric);
    };

    onCLS(handleMetric);
    onINP(handleMetric); // INP replaced FID in web-vitals v3
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }, [callback]);
}