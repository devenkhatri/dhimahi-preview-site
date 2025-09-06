'use client';

import { ResultMetric } from '@/lib/cms-content';

interface ResultMetricsProps {
  results: ResultMetric[];
}

export default function ResultMetrics({ results }: ResultMetricsProps) {
  if (results.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Measurable Results Achieved
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our data-driven approach delivers tangible improvements that directly impact business growth and operational efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              {/* Icon */}
              {result.icon && (
                <div className="text-4xl mb-4">
                  {result.icon}
                </div>
              )}

              {/* Value */}
              <div className="text-3xl md:text-4xl font-bold mb-2 text-[#7cc0ba]">
                {result.value}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold mb-2">
                {result.label}
              </div>

              {/* Improvement */}
              <div className="text-sm text-blue-100 mb-1">
                {result.improvement}
              </div>

              {/* Timeframe */}
              <div className="text-xs text-blue-200">
                {result.timeframe}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why These Results Matter
            </h3>
            <p className="text-gray-600 leading-relaxed">
              These metrics represent real business impact achieved through strategic planning, 
              technical expertise, and continuous optimization. Each improvement translates to 
              increased revenue, reduced costs, enhanced customer satisfaction, and sustainable 
              competitive advantage for our clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}