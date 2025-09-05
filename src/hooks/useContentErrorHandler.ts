'use client';

import { useCallback, useEffect, useState } from 'react';

export interface ContentError {
  type: 'content' | 'validation' | 'network' | 'unknown';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  recovered?: boolean;
}

export interface ContentErrorState {
  errors: ContentError[];
  hasErrors: boolean;
  lastError?: ContentError;
}

export function useContentErrorHandler() {
  const [errorState, setErrorState] = useState<ContentErrorState>({
    errors: [],
    hasErrors: false
  });

  const logError = useCallback((error: Omit<ContentError, 'timestamp'>) => {
    const contentError: ContentError = {
      ...error,
      timestamp: new Date()
    };

    setErrorState(prev => ({
      errors: [...prev.errors, contentError],
      hasErrors: true,
      lastError: contentError
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Content Error:', contentError);
    }

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // sendErrorToService(contentError);
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrorState({
      errors: [],
      hasErrors: false
    });
  }, []);

  const markErrorAsRecovered = useCallback((errorIndex: number) => {
    setErrorState(prev => ({
      ...prev,
      errors: prev.errors.map((error, index) => 
        index === errorIndex ? { ...error, recovered: true } : error
      )
    }));
  }, []);

  // Auto-clear old errors (older than 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setErrorState(prev => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentErrors = prev.errors.filter(error => error.timestamp > fiveMinutesAgo);
        
        return {
          errors: recentErrors,
          hasErrors: recentErrors.length > 0,
          lastError: recentErrors[recentErrors.length - 1]
        };
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    ...errorState,
    logError,
    clearErrors,
    markErrorAsRecovered
  };
}

// Hook for handling specific content loading with error recovery
export function useContentWithErrorHandling<T>(
  loadContent: () => Promise<T>,
  fallbackContent: T,
  contentType: string = 'content'
) {
  const [content, setContent] = useState<T>(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ContentError | null>(null);
  const { logError } = useContentErrorHandler();

  const loadWithErrorHandling = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const loadedContent = await loadContent();
      setContent(loadedContent);
    } catch (err) {
      const contentError: ContentError = {
        type: 'content',
        message: `Failed to load ${contentType}: ${err instanceof Error ? err.message : 'Unknown error'}`,
        context: { contentType },
        timestamp: new Date()
      };

      setError(contentError);
      logError(contentError);
      
      // Use fallback content
      setContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  }, [loadContent, fallbackContent, contentType, logError]);

  useEffect(() => {
    loadWithErrorHandling();
  }, [loadWithErrorHandling]);

  const retry = useCallback(() => {
    loadWithErrorHandling();
  }, [loadWithErrorHandling]);

  return {
    content,
    loading,
    error,
    retry,
    hasError: error !== null
  };
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default browser behavior
      event.preventDefault();
      
      // You could log this to an error tracking service
      if (process.env.NODE_ENV === 'production') {
        // logErrorToService({
        //   type: 'unhandled-rejection',
        //   message: event.reason?.message || 'Unhandled promise rejection',
        //   stack: event.reason?.stack
        // });
      }
    });

    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // You could log this to an error tracking service
      if (process.env.NODE_ENV === 'production') {
        // logErrorToService({
        //   type: 'global-error',
        //   message: event.error?.message || 'Global error',
        //   stack: event.error?.stack,
        //   filename: event.filename,
        //   lineno: event.lineno,
        //   colno: event.colno
        // });
      }
    });
  }
}