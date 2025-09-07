'use client';

import { remark } from 'remark';
import html from 'remark-html';
import { useEffect, useState } from 'react';
import { PersonaErrorBoundary } from './PersonaErrorBoundary';

export type SectionType = 'struggle' | 'matters' | 'helps' | 'journey' | 'cta';

interface PersonaStorySectionProps {
  title: string;
  content: string;
  sectionType: SectionType;
  className?: string;
}

// Section-specific styling configurations
const sectionStyles: Record<SectionType, {
  containerClass: string;
  titleClass: string;
  contentClass: string;
  icon: string;
  bgGradient: string;
}> = {
  struggle: {
    containerClass: 'border-l-4 border-red-400 bg-red-50',
    titleClass: 'text-red-800',
    contentClass: 'text-red-700',
    icon: '😰',
    bgGradient: 'from-red-50 to-white'
  },
  matters: {
    containerClass: 'border-l-4 border-orange-400 bg-orange-50',
    titleClass: 'text-orange-800',
    contentClass: 'text-orange-700',
    icon: '⚠️',
    bgGradient: 'from-orange-50 to-white'
  },
  helps: {
    containerClass: 'border-l-4 border-[#215b6f] bg-[#e8f5f3]',
    titleClass: 'text-[#1a4a5a]',
    contentClass: 'text-[#215b6f]',
    icon: '🚀',
    bgGradient: 'from-[#e8f5f3] to-white'
  },
  journey: {
    containerClass: 'border-l-4 border-[#7cc0ba] bg-gradient-to-r from-[#e8f5f3] to-white',
    titleClass: 'text-[#1a4a5a]',
    contentClass: 'text-gray-700',
    icon: '🗺️',
    bgGradient: 'from-[#e8f5f3] to-white'
  },
  cta: {
    containerClass: 'border-l-4 border-[#215b6f] bg-gradient-to-r from-[#215b6f] to-[#1a4a5a] text-white',
    titleClass: 'text-white',
    contentClass: 'text-gray-100',
    icon: '💡',
    bgGradient: 'from-[#215b6f] to-[#1a4a5a]'
  }
};

function PersonaStorySectionContent({ 
  title, 
  content, 
  sectionType, 
  className = '' 
}: PersonaStorySectionProps) {
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const processMarkdown = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Validate content exists
        if (!content || typeof content !== 'string') {
          throw new Error('Invalid content provided');
        }

        const processedContent = await remark()
          .use(html)
          .process(content);
        setProcessedContent(processedContent.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHasError(true);
        // Fallback to raw content if markdown processing fails
        setProcessedContent(content || 'Content temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    processMarkdown();
  }, [content]);

  const styles = sectionStyles[sectionType];

  // Validate required props
  if (!title || !sectionType) {
    return (
      <div className={`rounded-xl p-6 bg-yellow-50 border border-yellow-200 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-yellow-800 font-medium">Section configuration error</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`
        rounded-xl p-6 md:p-8 mb-8 animate-pulse
        border-l-4 ${styles.containerClass.includes('border-l-4') ? styles.containerClass.split(' ').find(c => c.startsWith('border-')) : 'border-gray-300'}
        ${styles.containerClass.includes('bg-') ? styles.containerClass.split(' ').find(c => c.startsWith('bg-')) : 'bg-gray-100'}
        ${className}
      `}>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  // Show error state if markdown processing failed
  if (hasError && !processedContent) {
    return (
      <div className={`rounded-xl p-6 bg-red-50 border border-red-200 ${className}`}>
        <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-800 font-medium">{title}</h3>
        </div>
        <p className="text-red-700">
          This section content is temporarily unavailable. Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <section 
      className={`
        rounded-xl p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-lg
        ${styles.containerClass} 
        ${className}
      `}
      role="region"
      aria-labelledby={`section-${sectionType}-title`}
    >
      {/* Section Header */}
      <div className="flex items-center mb-6">
        <span 
          className="text-2xl mr-3 flex-shrink-0" 
          role="img" 
          aria-label={`${sectionType} section icon`}
        >
          {styles.icon}
        </span>
        <h2 
          id={`section-${sectionType}-title`}
          className={`
            text-2xl md:text-3xl font-bold leading-tight
            ${styles.titleClass}
          `}
        >
          {title}
        </h2>
      </div>

      {/* Section Content */}
      <div 
        className={`
          prose prose-lg max-w-none leading-relaxed
          ${styles.contentClass}
          prose-headings:text-[#1a4a5a]
          prose-strong:text-[#1a4a5a]
          prose-a:text-[#215b6f] hover:prose-a:text-[#1a4a5a]
          prose-ul:${styles.contentClass}
          prose-ol:${styles.contentClass}
          prose-li:${styles.contentClass}
          prose-p:${styles.contentClass}
          prose-blockquote:${styles.contentClass}
          prose-blockquote:border-l-[#215b6f]
        `}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Visual Enhancement for CTA Section */}
      {sectionType === 'cta' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#215b6f]/10 to-[#1a4a5a]/10 rounded-xl pointer-events-none opacity-50"></div>
      )}

      {/* Error indicator for processed content with errors */}
      {hasError && processedContent && (
        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
          <span className="font-medium">Note:</span> Content may not display as intended due to formatting issues.
        </div>
      )}
    </section>
  );
}

export function PersonaStorySection(props: PersonaStorySectionProps) {
  return (
    <PersonaErrorBoundary fallbackType="section">
      <PersonaStorySectionContent {...props} />
    </PersonaErrorBoundary>
  );
}