'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallbackType?: 'card' | 'page' | 'section' | 'list';
  personaTitle?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PersonaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PersonaErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Log persona-specific error details
    if (this.props.personaTitle) {
      console.error(`Error in persona: ${this.props.personaTitle}`);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private renderCardFallback() {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="h-32 bg-gray-100 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Content Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            This persona content couldn't be loaded. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  private renderPageFallback() {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {this.props.personaTitle ? `Error Loading ${this.props.personaTitle}` : 'Persona Error'}
            </h1>
            <p className="text-gray-600 mb-8">
              We're sorry, but this persona page couldn't be loaded properly. This might be a temporary issue.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/personas"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse All Personas
            </Link>
            <Link
              href="/"
              className="block text-primary hover:text-primary-dark transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  private renderSectionFallback() {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-yellow-800">
            Section Temporarily Unavailable
          </h3>
        </div>
        <p className="text-yellow-700 mb-4">
          This section of the persona story couldn't be loaded. Please refresh the page to try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-yellow-800 hover:text-yellow-900 font-medium text-sm underline"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  private renderListFallback() {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Personas Temporarily Unavailable
          </h3>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the personas. Please try refreshing the page.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Refresh Page
            </button>
            <Link
              href="/contact"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      const { fallbackType = 'page' } = this.props;
      
      switch (fallbackType) {
        case 'card':
          return this.renderCardFallback();
        case 'section':
          return this.renderSectionFallback();
        case 'list':
          return this.renderListFallback();
        case 'page':
        default:
          return this.renderPageFallback();
      }
    }

    return this.props.children;
  }
}

// Higher-order component for persona components
export function withPersonaErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackType: Props['fallbackType'] = 'page'
) {
  const WrappedComponent = (props: P) => (
    <PersonaErrorBoundary fallbackType={fallbackType}>
      <Component {...props} />
    </PersonaErrorBoundary>
  );

  WrappedComponent.displayName = `withPersonaErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}