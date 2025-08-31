"use client";
import { useState, useEffect } from "react";
import { XMarkIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface ScrollBasedRevealProps {
  title?: string;
  description?: string;
  ctaText?: string;
  triggerPercentage?: number; // Percentage of page scrolled before showing
  onSubmit?: (data: { email: string; interest?: string }) => Promise<void>;
  onClose?: () => void;
  className?: string;
}

const INTERESTS = [
  { value: "ai-automation", label: "AI & Automation" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "web-development", label: "Web Development" },
  { value: "fractional-cto", label: "Fractional CTO Services" },
  { value: "general", label: "General IT Consultation" }
];

export default function ScrollBasedReveal({
  title = "Interested in Growing Your Business?",
  description = "Get personalized insights and a free consultation tailored to your industry and business size.",
  ctaText = "Get Free Consultation",
  triggerPercentage = 60,
  onSubmit,
  onClose,
  className = ""
}: ScrollBasedRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const scrollRevealShown = sessionStorage.getItem('scrollRevealShown');
    if (scrollRevealShown) {
      setHasShown(true);
      return;
    }

    const handleScroll = () => {
      if (hasShown) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      if (scrollPercentage >= triggerPercentage) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('scrollRevealShown', 'true');
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Add scroll listener after a delay to avoid immediate triggers
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerPercentage, hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const submissionData = { email, interest };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default submission to Netlify forms
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'scroll-based-reveal',
            email,
            interest,
            formType: 'scroll-based-reveal',
            submittedAt: new Date().toISOString()
          }).toString()
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      setIsSubmitted(true);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        handleClose();
      }, 5000);
    } catch (error) {
      console.error('Scroll-based reveal submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Hidden form for Netlify */}
      <form name="scroll-based-reveal" data-netlify="true" hidden>
        <input name="email" />
        <input name="interest" />
        <input name="formType" />
        <input name="submittedAt" />
      </form>

      {/* Slide-up panel */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className={`bg-white border-t border-gray-200 shadow-2xl ${className}`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="container mx-auto px-4 py-6">
            {!isSubmitted ? (
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-2">
                      <ArrowDownIcon className="w-5 h-5 text-primary mr-2 animate-bounce" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {description}
                    </p>
                  </div>

                  {/* Form */}
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                        <select
                          value={interest}
                          onChange={(e) => setInterest(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value="">Select interest</option>
                          {INTERESTS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="bg-primary text-white font-medium py-2 px-6 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                      >
                        {isSubmitting ? 'Submitting...' : ctaText}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-4 text-center md:text-left">
                  <p className="text-xs text-gray-500">
                    ✓ Free consultation • ✓ No spam • ✓ 25+ years experience
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto text-center py-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thank You!
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We'll be in touch within 24 hours with personalized insights for your business. 
                  Check your email for immediate resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}