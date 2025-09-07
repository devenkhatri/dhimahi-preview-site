"use client";
import CalendlyEmbed from "./CalendlyEmbed";
import ConsultationBookingForm from "./forms/ConsultationBookingForm";

/**
 * Client component that wraps CalendlyEmbed with fallback functionality
 * This is separated to avoid serialization issues with server components
 */
export default function CalendlyWithFallback() {
  return (
    <CalendlyEmbed
      url="https://calendly.com/dhimahitechnolabs/30min"
      fullHeight
      pageSettings={{
        backgroundColor: "#ffffff",
        textColor: "#000000",
        primaryColor: "#215b6f", // Dhīmahi Tech Blue
        hideEventTypeDetails: false
      }}
      utm={{
        utmSource: "website",
        utmMedium: "consultation_page"
      }}
      timeout={8000} // 8 seconds timeout
      onError={() => {
        console.log('Calendly failed to load, showing consultation form fallback');
        // You could also track this event with analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'calendly_fallback_shown', {
            event_category: 'consultation',
            event_label: 'calendly_load_failed'
          });
        }
      }}
      fallbackComponent={
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-blue-800 text-sm">
              <strong>Having trouble with the calendar?</strong><br />
              No worries! Fill out the form below and we'll get back to you within 2 hours to schedule your consultation.
            </p>
          </div>
          <ConsultationBookingForm />
        </div>
      }
    />
  );
}