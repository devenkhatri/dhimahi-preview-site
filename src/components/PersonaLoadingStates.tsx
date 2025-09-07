'use client';

import React from 'react';

// Loading skeleton for PersonaCard
export function PersonaCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden animate-pulse ${className}`}>
      {/* Icon Section Skeleton */}
      <div className="h-32 bg-gray-200 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-14"></div>
        </div>

        {/* CTA Skeleton */}
        <div className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="w-4 h-4 bg-gray-200 rounded ml-2"></div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for PersonaStorySection
export function PersonaStorySectionSkeleton({ 
  className = '',
  sectionType = 'default'
}: { 
  className?: string;
  sectionType?: 'struggle' | 'matters' | 'helps' | 'journey' | 'cta' | 'default';
}) {
  const getBorderColor = () => {
    switch (sectionType) {
      case 'struggle': return 'border-red-400';
      case 'matters': return 'border-orange-400';
      case 'helps': return 'border-[#215b6f]';
      case 'journey': return 'border-[#7cc0ba]';
      case 'cta': return 'border-[#215b6f]';
      default: return 'border-gray-300';
    }
  };

  const getBgColor = () => {
    switch (sectionType) {
      case 'struggle': return 'bg-red-50';
      case 'matters': return 'bg-orange-50';
      case 'helps': return 'bg-[#e8f5f3]';
      case 'journey': return 'bg-gradient-to-r from-[#e8f5f3] to-white';
      case 'cta': return 'bg-gradient-to-r from-[#215b6f] to-[#1a4a5a]';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`
      rounded-xl p-6 md:p-8 mb-8 animate-pulse
      border-l-4 ${getBorderColor()} ${getBgColor()}
      ${className}
    `}>
      {/* Header Skeleton */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-11/12"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      </div>
    </div>
  );
}

// Loading skeleton for persona page hero
export function PersonaHeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb Skeleton */}
          <nav className="mb-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 bg-white/20 rounded w-12"></div>
              <div className="text-white/60">/</div>
              <div className="h-4 bg-white/20 rounded w-16"></div>
              <div className="text-white/60">/</div>
              <div className="h-4 bg-white/20 rounded w-20"></div>
            </div>
          </nav>

          {/* Icon Skeleton */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Title Skeleton */}
          <div className="h-12 bg-white/20 rounded mb-6 w-2/3 mx-auto animate-pulse"></div>

          {/* Excerpt Skeleton */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="h-6 bg-white/20 rounded w-full animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-5/6 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton for personas grid
export function PersonasGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }, (_, index) => (
        <PersonaCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Loading skeleton for related personas section
export function RelatedPersonasSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title Skeleton */}
          <div className="h-8 bg-gray-300 rounded mb-12 w-1/3 mx-auto animate-pulse"></div>
          
          {/* Cards Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <PersonaCardSkeleton key={index} />
            ))}
          </div>
          
          {/* View All Button Skeleton */}
          <div className="text-center mt-12">
            <div className="h-12 bg-gray-300 rounded-lg w-40 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading state for full persona page
export function PersonaPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <PersonaHeroSkeleton />

      {/* Content Skeleton */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-16">
              {/* Story Sections Skeleton */}
              <PersonaStorySectionSkeleton sectionType="struggle" />
              <PersonaStorySectionSkeleton sectionType="matters" />
              <PersonaStorySectionSkeleton sectionType="helps" />
              <PersonaStorySectionSkeleton sectionType="journey" />
              
              {/* CTA Section Skeleton */}
              <div className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white rounded-2xl p-8 md:p-12 text-center animate-pulse">
                <div className="h-10 bg-white/20 rounded mb-6 w-2/3 mx-auto"></div>
                <div className="h-6 bg-white/20 rounded mb-8 w-3/4 mx-auto"></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="h-12 bg-white/20 rounded-lg w-48"></div>
                  <div className="h-12 bg-white/20 rounded-lg w-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Related Personas Skeleton */}
      <RelatedPersonasSkeleton />
    </div>
  );
}

// Loading state for personas landing page
export function PersonasLandingPageSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs Skeleton */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
          <div className="text-gray-400">/</div>
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
        </nav>

        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-300 rounded mb-6 w-1/2 mx-auto animate-pulse"></div>
          <div className="space-y-3 max-w-4xl mx-auto mb-8">
            <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-5/6 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-4/6 mx-auto animate-pulse"></div>
          </div>

          {/* Trust indicators skeleton */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Personas Section Skeleton */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/3 mx-auto animate-pulse"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          
          <PersonasGridSkeleton count={3} />
        </section>

        {/* All Personas Section Skeleton */}
        <section>
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-300 rounded mb-4 w-1/4 mx-auto animate-pulse"></div>
            <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>

          <PersonasGridSkeleton count={8} />
        </section>
      </div>
    </main>
  );
}