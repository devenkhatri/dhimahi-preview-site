import { getAllPosts } from '@/lib/markdown';
import { Suspense } from 'react';
import InsightsSearchClient from './InsightsSearchClient';

function SearchContent() {
  const allPosts = getAllPosts();
  return <InsightsSearchClient allPosts={allPosts} />;
}

export default function InsightsSearchPage() {
  return (
    <Suspense fallback={
      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading search...</p>
          </div>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}

