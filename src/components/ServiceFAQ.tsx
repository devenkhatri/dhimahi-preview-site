'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/services';

interface ServiceFAQProps {
  faqs: FAQ[];
  serviceName: string;
}

export default function ServiceFAQ({ faqs, serviceName }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-600 text-center mb-8">
        Common questions about our {serviceName.toLowerCase()} services
      </p>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
              <div className={`transform transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4">
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-2">Still Have Questions?</h3>
          <p className="text-gray-600 mb-4">
            Our team is here to help you understand how our {serviceName.toLowerCase()} services can benefit your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
              Schedule Free Consultation
            </button>
            <button className="border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}