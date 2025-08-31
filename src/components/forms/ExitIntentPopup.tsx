"use client";
import { useState, useEffect } from "react";
import { XMarkIcon, GiftIcon } from "@heroicons/react/24/outline";

interface ExitIntentPopupProps {
  title?: string;
  description?: string;
  ctaText?: string;
  onSubmit?: (email: string) => Promise<void>;
  onClose?: () => void;
  className?: string;
}

export default function ExitIntentPopup({
  title = "Wait! Don't Leave Empty-Handed",
  description = "Get our free 'Digital Transformation Checklist for SMEs' - a comprehensive guide to modernizing your business with AI and smart IT solutions.",
  ctaText = "Get Free Checklist",
  onSubmit,
  onClose,
  className = ""
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('exitIntentShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let isExiting = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !isExiting && !hasShown) {
        isExiting = true;
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    // Add event listener after a delay to avoid immediate triggers
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default submission to Netlify forms
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'exit-intent-popup',
            email,
            formType: 'exit-intent-popup',
            submittedAt: new Date().toISOString()
          }).toString()
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      setIsSubmitted(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Exit intent popup submission error:', error);
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
      <form name="exit-intent-popup" data-netlify="true" hidden>
        <input name="email" />
        <input name="formType" />
        <input name="submittedAt" />
      </form>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Popup */}
        <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in zoom-in duration-300 ${className}`}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="p-6">
            {!isSubmitted ? (
              <>
                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GiftIcon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  {description}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full bg-primary text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : ctaText}
                  </button>
                </form>

                {/* Trust indicators */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    ✓ Free download • ✓ No spam • ✓ Unsubscribe anytime
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 text-sm">
                  Check your email for the Digital Transformation Checklist. 
                  We'll also send you valuable tips for growing your business with technology.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}