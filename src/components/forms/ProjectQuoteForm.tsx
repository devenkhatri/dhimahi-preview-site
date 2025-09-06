"use client";
import { useState } from "react";
import MultiStepForm, { FormStep } from "./MultiStepForm";
import { DocumentTextIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

interface ProjectQuoteFormProps {
  onSubmit?: (data: Record<string, any>) => Promise<void>;
  className?: string;
}

const PROJECT_TYPES = [
  { value: "website", label: "Website Development" },
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "ecommerce", label: "E-commerce Platform" },
  { value: "crm", label: "CRM System" },
  { value: "erp", label: "ERP Solution" },
  { value: "ai-automation", label: "AI & Automation" },
  { value: "digital-marketing", label: "Digital Marketing Campaign" },
  { value: "seo", label: "SEO Services" },
  { value: "other", label: "Other" }
];

const BUDGET_RANGES = [
  { value: "under-1l", label: "Under ₹1,00,000" },
  { value: "1l-3l", label: "₹1,00,000 - ₹3,00,000" },
  { value: "3l-5l", label: "₹3,00,000 - ₹5,00,000" },
  { value: "5l-10l", label: "₹5,00,000 - ₹10,00,000" },
  { value: "10l-25l", label: "₹10,00,000 - ₹25,00,000" },
  { value: "25l+", label: "₹25,00,000+" },
  { value: "discuss", label: "Prefer to discuss" }
];

const TIMELINES = [
  { value: "asap", label: "ASAP (Rush job)" },
  { value: "1-month", label: "Within 1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-months+", label: "6+ months" },
  { value: "flexible", label: "Flexible timeline" }
];

const FEATURES = {
  website: [
    { value: "responsive-design", label: "Responsive Design" },
    { value: "cms", label: "Content Management System" },
    { value: "seo-optimization", label: "SEO Optimization" },
    { value: "contact-forms", label: "Contact Forms" },
    { value: "blog", label: "Blog/News Section" },
    { value: "multilingual", label: "Multi-language Support" },
    { value: "analytics", label: "Analytics Integration" },
    { value: "social-media", label: "Social Media Integration" }
  ],
  "web-app": [
    { value: "user-auth", label: "User Authentication" },
    { value: "database", label: "Database Integration" },
    { value: "api", label: "API Development" },
    { value: "admin-panel", label: "Admin Panel" },
    { value: "payment", label: "Payment Integration" },
    { value: "notifications", label: "Push Notifications" },
    { value: "reporting", label: "Reporting & Analytics" },
    { value: "third-party", label: "Third-party Integrations" }
  ],
  "digital-marketing": [
    { value: "seo", label: "Search Engine Optimization" },
    { value: "google-ads", label: "Google Ads Management" },
    { value: "social-media", label: "Social Media Marketing" },
    { value: "content-marketing", label: "Content Marketing" },
    { value: "email-marketing", label: "Email Marketing" },
    { value: "analytics", label: "Analytics & Reporting" },
    { value: "conversion-optimization", label: "Conversion Optimization" },
    { value: "brand-strategy", label: "Brand Strategy" }
  ]
};

export default function ProjectQuoteForm({ 
  onSubmit,
  className = "" 
}: ProjectQuoteFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps: FormStep[] = [
    {
      id: "contact-info",
      title: "Contact Information",
      description: "Let's start with your basic information",
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
        },
        {
          name: "designation",
          label: "Your Designation",
          type: "text",
          placeholder: "e.g., CEO, Marketing Manager, IT Head"
        }
      ]
    },
    {
      id: "project-overview",
      title: "Project Overview",
      description: "Tell us about your project requirements",
      fields: [
        {
          name: "projectType",
          label: "Project Type",
          type: "select",
          required: true,
          options: PROJECT_TYPES
        },
        {
          name: "projectTitle",
          label: "Project Title",
          type: "text",
          required: true,
          placeholder: "Give your project a descriptive title"
        },
        {
          name: "projectDescription",
          label: "Project Description",
          type: "textarea",
          required: true,
          placeholder: "Describe your project in detail - what you want to build, who will use it, and what problems it should solve..."
        },
        {
          name: "targetAudience",
          label: "Target Audience",
          type: "text",
          required: true,
          placeholder: "Who are your target users/customers?"
        }
      ]
    },
    {
      id: "project-details",
      title: "Project Requirements",
      description: "Let's dive into the specific features and requirements",
      fields: [
        {
          name: "existingWebsite",
          label: "Do you have an existing website/system?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes, we have an existing system" },
            { value: "no", label: "No, this is a new project" },
            { value: "redesign", label: "Yes, but we want a complete redesign" }
          ]
        },
        {
          name: "currentWebsite",
          label: "Current Website URL",
          type: "text",
          placeholder: "https://yourwebsite.com",
          conditional: (data) => data.existingWebsite === "yes" || data.existingWebsite === "redesign"
        },
        {
          name: "designPreferences",
          label: "Design Preferences",
          type: "textarea",
          placeholder: "Describe your design preferences, brand colors, style (modern, traditional, etc.), or share reference websites..."
        },
        {
          name: "technicalRequirements",
          label: "Technical Requirements",
          type: "textarea",
          placeholder: "Any specific technical requirements, integrations, or platforms you prefer..."
        }
      ]
    },
    {
      id: "budget-timeline",
      title: "Budget & Timeline",
      description: "Help us understand your budget and timeline expectations",
      fields: [
        {
          name: "budget",
          label: "Project Budget",
          type: "select",
          required: true,
          options: BUDGET_RANGES
        },
        {
          name: "timeline",
          label: "Expected Timeline",
          type: "select",
          required: true,
          options: TIMELINES
        },
        {
          name: "launchDate",
          label: "Preferred Launch Date",
          type: "text",
          placeholder: "DD/MM/YYYY (if you have a specific date in mind)"
        },
        {
          name: "paymentPreference",
          label: "Payment Preference",
          type: "radio",
          options: [
            { value: "milestone", label: "Milestone-based payments" },
            { value: "monthly", label: "Monthly payments" },
            { value: "upfront", label: "Upfront payment (with discount)" },
            { value: "discuss", label: "Prefer to discuss" }
          ]
        }
      ]
    },
    {
      id: "additional-info",
      title: "Additional Information",
      description: "Any other details that will help us prepare an accurate quote",
      fields: [
        {
          name: "competitors",
          label: "Competitor Websites/References",
          type: "textarea",
          placeholder: "Share URLs of competitor websites or reference sites you like..."
        },
        {
          name: "contentReady",
          label: "Is your content ready?",
          type: "radio",
          options: [
            { value: "ready", label: "Yes, content is ready" },
            { value: "partial", label: "Partially ready" },
            { value: "need-help", label: "Need help with content creation" },
            { value: "not-ready", label: "Content is not ready" }
          ]
        },
        {
          name: "maintenanceSupport",
          label: "Do you need ongoing maintenance & support?",
          type: "radio",
          options: [
            { value: "yes", label: "Yes, ongoing support needed" },
            { value: "no", label: "No, just development" },
            { value: "discuss", label: "Let's discuss options" }
          ]
        },
        {
          name: "additionalServices",
          label: "Additional Services Needed",
          type: "textarea",
          placeholder: "Digital marketing, SEO, hosting, training, etc."
        },
        {
          name: "questions",
          label: "Questions or Special Requirements",
          type: "textarea",
          placeholder: "Any questions or special requirements you'd like to discuss..."
        }
      ]
    }
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // Add form type identifier
      const submissionData = {
        ...data,
        formType: 'project-quote',
        submittedAt: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default submission to Netlify forms
        const formData = new FormData();
        formData.append('form-name', 'project-quote');
        
        // Add all form fields
        Object.entries(submissionData).forEach(([key, value]) => {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        });

        const response = await fetch('/', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Project quote submission error:', error);
      throw error;
    }
  };

  if (isSubmitted) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Quote Request Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your detailed project information. Our team will review your 
            requirements and prepare a comprehensive quote for you.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <CurrencyRupeeIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">What Happens Next?</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll review your requirements within 24 hours</li>
              <li>• Our team will prepare a detailed project proposal</li>
              <li>• You'll receive a comprehensive quote with timeline</li>
              <li>• We'll schedule a call to discuss the proposal</li>
              <li>• No obligations - the quote is completely free</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-primary hover:underline font-medium"
            >
              Submit Another Quote Request
            </button>
            <span className="text-gray-400 hidden sm:block">|</span>
            <a
              href="/services"
              className="text-primary hover:underline font-medium"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Hidden form for Netlify */}
      <form name="project-quote" data-netlify="true" hidden>
        <input name="name" />
        <input name="email" />
        <input name="phone" />
        <input name="company" />
        <input name="designation" />
        <input name="projectType" />
        <input name="projectTitle" />
        <textarea name="projectDescription" />
        <input name="targetAudience" />
        <input name="existingWebsite" />
        <input name="currentWebsite" />
        <textarea name="designPreferences" />
        <textarea name="technicalRequirements" />
        <input name="budget" />
        <input name="timeline" />
        <input name="launchDate" />
        <input name="paymentPreference" />
        <textarea name="competitors" />
        <input name="contentReady" />
        <input name="maintenanceSupport" />
        <textarea name="additionalServices" />
        <textarea name="questions" />
        <input name="formType" />
        <input name="submittedAt" />
      </form>

      <MultiStepForm
        steps={steps}
        onSubmit={handleSubmit}
        submitButtonText="Get Project Quote"
        showProgress={true}
      />
    </div>
  );
}