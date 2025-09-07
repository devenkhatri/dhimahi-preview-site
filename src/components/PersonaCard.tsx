'use client';

import Link from 'next/link';
import { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import { Persona } from '../../types/cms';
import { PersonaErrorBoundary } from './PersonaErrorBoundary';

interface PersonaCardProps {
  persona: Persona;
  className?: string;
  showLoadingState?: boolean;
}

function PersonaCardContent({ persona, className = '', showLoadingState = false }: PersonaCardProps) {

  // Fallback for missing or invalid persona data
  if (!persona || !persona.slug || !persona.title) {
    return (
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 ${className}`}>
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
          <p className="text-gray-600 text-sm">
            This persona content is temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }
  return (
    <Link
      href={`/personas/${persona.slug}`}
      className={`group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      aria-label={`Read about ${persona.title} persona`}
    >
      {/* Icon Section */}
      <div className="relative h-32 bg-gradient-to-br from-accent-soft to-white flex items-center justify-center group-hover:from-accent group-hover:to-accent-soft transition-all duration-300">
        {persona.icon ? (
          <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-300">
            <OptimizedImage
              src={persona.icon}
              alt={`${persona.title} icon`}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority={persona.featured}
            />
          </div>
        ) : (
          // Fallback icon when no image is provided
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        
        {/* Featured Badge */}
        {persona.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
          {persona.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {persona.excerpt || 'Discover how this persona overcomes business challenges with our solutions.'}
        </p>

        {/* Tags */}
        {persona.tags && persona.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {persona.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium"
              >
                {tag}
              </span>
            ))}
            {persona.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                +{persona.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors duration-300">
          <span>Explore Persona</span>
          <svg 
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function PersonaCard(props: PersonaCardProps) {
  return (
    <PersonaErrorBoundary fallbackType="card" personaTitle={props.persona?.title}>
      <PersonaCardContent {...props} />
    </PersonaErrorBoundary>
  );
}