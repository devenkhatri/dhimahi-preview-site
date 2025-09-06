'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  prevResetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(props: Props, state: State): State | null {
    const { resetKeys, resetOnPropsChange } = props;
    const { prevResetKeys } = state;

    // Reset error boundary when resetKeys change
    if (resetKeys && prevResetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevResetKeys[index]);
      if (hasResetKeyChanged) {
        return {
          hasError: false,
          error: undefined,
          errorInfo: undefined,
          prevResetKeys: resetKeys
        };
      }
    }

    // Reset error boundary when props change (if enabled)
    if (resetOnPropsChange && state.hasError) {
      return {
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        prevResetKeys: resetKeys
      };
    }

    return { ...state, prevResetKeys: resetKeys };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback bg-red-50 border border-red-200 rounded-lg p-6 my-4">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
            </div>
          </div>
          <div className="text-sm text-red-700">
            <p>We're sorry, but something unexpected happened. The page content could not be loaded properly.</p>
            <p className="mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4">
              <summary className="text-sm font-medium text-red-800 cursor-pointer">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized error boundaries for different content types
export function ContentErrorBoundary({ 
  children, 
  contentType = 'content',
  onError 
}: { 
  children: ReactNode; 
  contentType?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${contentType}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you could send to error tracking service like Sentry
      // logErrorToService(error, { contentType, componentStack: errorInfo.componentStack });
    }
    
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const fallback = (
    <div className="content-error-fallback bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Content Temporarily Unavailable
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>The {contentType} content is temporarily unavailable. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

// Error boundary specifically for CMS content sections
export function CMSContentErrorBoundary({ 
  children, 
  sectionName,
  showFallback = true 
}: { 
  children: ReactNode; 
  sectionName: string;
  showFallback?: boolean;
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`CMS Content Error in ${sectionName}:`, error);
    
    // In production, you might want to track these errors
    if (process.env.NODE_ENV === 'production') {
      // Track CMS content errors for monitoring
      console.warn(`CMS section "${sectionName}" failed to render, using fallback`);
    }
  };

  const fallback = showFallback ? (
    <div className="cms-error-fallback bg-gray-50 border border-gray-200 rounded-lg p-4 my-2">
      <div className="text-center text-gray-600">
        <p className="text-sm">Content loading...</p>
        <p className="text-xs mt-1">If this persists, please refresh the page.</p>
      </div>
    </div>
  ) : null;

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}