'use client';

import { Testimonial } from '@/lib/cms-content';

interface ClientTestimonialProps {
  testimonial: Testimonial;
}

export default function ClientTestimonial({ testimonial }: ClientTestimonialProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-[#215b6f] to-[#7cc0ba] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Quote Icon */}
        <div className="mb-8">
          <svg className="w-16 h-16 mx-auto text-[#7cc0ba] opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote */}
        <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
          "{testimonial.quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center justify-center">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-16 h-16 rounded-full mr-4 border-4 border-white/20"
            />
          )}
          <div className="text-left">
            <div className="font-bold text-xl text-[#7cc0ba]">
              {testimonial.author}
            </div>
            <div className="text-blue-100">
              {testimonial.position}
            </div>
            <div className="text-blue-200 text-sm">
              {testimonial.company}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-6 h-6 text-[#7cc0ba]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}