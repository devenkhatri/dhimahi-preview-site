"use client";
import { useState } from "react";
import MultiStepForm, { FormStep } from "./MultiStepForm";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useFormTracking } from "@/hooks/useConversionTracking";
import { submitConsultationBooking } from "@/lib/netlify-forms";

interface ConsultationBookingFormProps {
  onSubmit?: (data: Record<string, any>) => Promise<void>;
  className?: string;
}

// Available time slots (in a real app, this would come from a calendar API)
const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

const BUSINESS_TYPES = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "trading", label: "Trading" },
  { value: "services", label: "Services" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "200+", label: "200+ employees" },
];

const CONSULTATION_TYPES = [
  { value: "general", label: "General IT Consultation" },
  { value: "ai-automation", label: "AI & Automation" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "application-portfolio-rationalisation", label: "Application Portfolio Rationalisation" },
  { value: "fractional-cto", label: "Fractional CTO Services" },
];

const URGENCY_LEVELS = [
  { value: "immediate", label: "Immediate (Within 1 week)" },
  { value: "soon", label: "Soon (Within 1 month)" },
  { value: "planning", label: "Planning (Within 3 months)" },
  { value: "exploring", label: "Just exploring options" },
];

export default function ConsultationBookingForm({
  onSubmit,
  className = ""
}: ConsultationBookingFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { startTracking, trackFieldInteraction, trackCompletion, trackAbandonment } = useFormTracking(
    'consultation-booking-form',
    'consultation'
  );

  const steps: FormStep[] = [
    {
      id: "contact-info",
      title: "Let's get to know you",
      description: "We'll use this information to prepare for your consultation",
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name"
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "your@email.com",
          validation: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? null : "Please enter a valid email address";
          }
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          placeholder: "+91 99999 99999"
        },
        {
          name: "company",
          label: "Company Name",
          type: "text",
          required: true,
          placeholder: "Your company name"
        }
      ]
    },
    {
      id: "business-info",
      title: "Tell us about your business",
      description: "This helps us understand your context and prepare relevant insights",
      fields: [
        {
          name: "businessType",
          label: "Business Type",
          type: "select",
          required: true,
          options: BUSINESS_TYPES
        },
        {
          name: "companySize",
          label: "Company Size",
          type: "select",
          required: true,
          options: COMPANY_SIZES
        },
        {
          name: "location",
          label: "Business Location",
          type: "text",
          required: true,
          placeholder: "City, State"
        },
        {
          name: "website",
          label: "Website (if any)",
          type: "text",
          placeholder: "https://yourwebsite.com"
        }
      ]
    },
    {
      id: "consultation-details",
      title: "What can we help you with?",
      description: "Let us know your specific interests and challenges",
      fields: [
        {
          name: "consultationType",
          label: "Type of Consultation",
          type: "select",
          required: true,
          options: CONSULTATION_TYPES
        },
        {
          name: "challenges",
          label: "Current Challenges",
          type: "textarea",
          required: true,
          placeholder: "Describe the main challenges or goals you'd like to discuss..."
        },
        {
          name: "urgency",
          label: "Timeline",
          type: "select",
          required: true,
          options: URGENCY_LEVELS
        },
        {
          name: "budget",
          label: "Approximate Budget Range (Optional)",
          type: "select",
          options: [
            { value: "under-50k", label: "Under ₹50,000" },
            { value: "50k-2l", label: "₹50,000 - ₹2,00,000" },
            { value: "2l-5l", label: "₹2,00,000 - ₹5,00,000" },
            { value: "5l-10l", label: "₹5,00,000 - ₹10,00,000" },
            { value: "10l+", label: "₹10,00,000+" },
            { value: "discuss", label: "Prefer to discuss" }
          ]
        }
      ]
    },
    {
      id: "scheduling",
      title: "Schedule your consultation",
      description: "Pick a convenient time for your free 30-minute consultation",
      fields: [
        {
          name: "preferredDate",
          label: "Preferred Date",
          type: "text", // In a real app, this would be a date picker
          required: true,
          placeholder: "DD/MM/YYYY"
        },
        {
          name: "preferredTime",
          label: "Preferred Time",
          type: "select",
          required: true,
          options: TIME_SLOTS
        },
        {
          name: "alternativeDate",
          label: "Alternative Date",
          type: "text",
          placeholder: "DD/MM/YYYY (optional)"
        },
        {
          name: "alternativeTime",
          label: "Alternative Time",
          type: "select",
          options: TIME_SLOTS,
          conditional: (data) => !!data.alternativeDate
        },
        {
          name: "meetingPreference",
          label: "Meeting Preference",
          type: "radio",
          required: true,
          options: [
            { value: "video", label: "Video call (Google Meet/Zoom)" },
            { value: "phone", label: "Phone call" },
            { value: "in-person", label: "In-person (Ahmedabad/Gandhinagar)" }
          ]
        },
        {
          name: "additionalNotes",
          label: "Additional Notes",
          type: "textarea",
          placeholder: "Any specific topics you'd like to cover or questions you have..."
        }
      ]
    }
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const submissionData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        businessType: data.businessType,
        companySize: data.companySize,
        location: data.location,
        website: data.website,
        consultationType: data.consultationType,
        challenges: data.challenges,
        urgency: data.urgency,
        budget: data.budget,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        alternativeDate: data.alternativeDate,
        alternativeTime: data.alternativeTime,
        meetingPreference: data.meetingPreference,
        additionalNotes: data.additionalNotes,
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Submit to Netlify forms
        await submitConsultationBooking(submissionData);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Consultation booking submission error:', error);
      throw error;
    }
  };

  if (isSubmitted) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDaysIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Consultation Booked!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for booking a consultation with us. We'll review your information and
            confirm your appointment within 2 hours. You'll receive a calendar invite with
            meeting details.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">What's Next?</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll call you within 2 hours to confirm the appointment</li>
              <li>• You'll receive a calendar invite with meeting link</li>
              <li>• We'll prepare insights specific to your business</li>
              <li>• The consultation is completely free - no obligations</li>
            </ul>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-primary hover:underline font-medium"
          >
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Hidden form for Netlify */}
      <form name="consultation-booking" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="phone" />
        <input name="company" />
        <input name="businessType" />
        <input name="companySize" />
        <input name="location" />
        <input name="website" />
        <input name="consultationType" />
        <textarea name="challenges" />
        <input name="urgency" />
        <input name="budget" />
        <input name="preferredDate" />
        <input name="preferredTime" />
        <input name="alternativeDate" />
        <input name="alternativeTime" />
        <input name="meetingPreference" />
        <textarea name="additionalNotes" />
        <input name="formType" />
        <input name="submittedAt" />
      </form>

      <MultiStepForm
        steps={steps}
        onSubmit={handleSubmit}
        submitButtonText="Book Consultation"
        showProgress={true}
      />
    </div>
  );
}