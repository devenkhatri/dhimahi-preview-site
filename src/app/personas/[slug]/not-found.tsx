import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Persona Not Found | Dhimahi Technolabs',
  description: 'The requested persona could not be found. Browse our available personas or return to the homepage.',
  robots: 'noindex, nofollow',
};

export default function PersonaNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="mb-8">
          {/* 404 Icon */}
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17H9v-2.5A6.5 6.5 0 0115.5 8H21l-3-3-3 3v9z" />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Persona Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The persona you're looking for doesn't exist or may have been moved. 
            This could be due to a broken link or an outdated URL.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/personas"
            className="inline-block w-full sm:w-auto bg-[#215b6f] text-white px-8 py-3 rounded-lg hover:bg-[#1a4a5a] transition-colors font-semibold"
          >
            Browse All Personas
          </Link>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="text-[#215b6f] hover:text-[#1a4a5a] transition-colors font-medium"
            >
              Return to Homepage
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link
              href="/contact"
              className="text-[#215b6f] hover:text-[#1a4a5a] transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Helpful suggestions */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#215b6f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Check the URL for any typos or errors
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#215b6f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Browse our available personas to find what you're looking for
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#215b6f] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Contact us if you believe this is an error
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}