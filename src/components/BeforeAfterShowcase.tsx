'use client';

import { useState } from 'react';
import { ImageAsset } from '@/lib/case-studies';

interface BeforeAfterShowcaseProps {
  images: ImageAsset[];
}

export default function BeforeAfterShowcase({ images }: BeforeAfterShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  
  const beforeImages = images.filter(img => img.type === 'before');
  const afterImages = images.filter(img => img.type === 'after');

  if (beforeImages.length === 0 && afterImages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Before & After Transformation
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the dramatic improvements achieved through our strategic approach and technical expertise.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'before'
                  ? 'bg-[#215b6f] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'after'
                  ? 'bg-[#215b6f] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              After
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative">
          {activeTab === 'before' && beforeImages.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {beforeImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    {image.caption && (
                      <div className="p-4">
                        <p className="text-gray-600 text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Before
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'after' && afterImages.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {afterImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    {image.caption && (
                      <div className="p-4">
                        <p className="text-gray-600 text-sm">{image.caption}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      After
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Slider (if both before and after exist) */}
        {beforeImages.length > 0 && afterImages.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Use the tabs above to compare the transformation, or view side-by-side below:
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="relative">
                <img
                  src={beforeImages[0].src}
                  alt={beforeImages[0].alt}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Before
                  </span>
                </div>
              </div>
              <div className="relative">
                <img
                  src={afterImages[0].src}
                  alt={afterImages[0].alt}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    After
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}