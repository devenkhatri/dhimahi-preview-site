"use client";
import { useState } from "react";
import { DocumentArrowDownIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Resource } from "../../../types/cms";
import { submitResourceDownload } from "@/lib/netlify-forms";

// Backward compatibility interface for existing hardcoded resources
interface LegacyResource {
  id: string;
  title: string;
  description: string;
  type: 'checklist' | 'guide' | 'template' | 'calculator';
  fileSize: string;
  pages: number;
  downloadUrl: string;
}

// Union type to support both CMS resources and legacy hardcoded resources
type ResourceDownloadFormResource = Resource | LegacyResource;

interface ResourceDownloadFormProps {
  resource: ResourceDownloadFormResource;
  onSubmit?: (data: { email: string; name: string; company?: string; interest?: string }) => Promise<void>;
  className?: string;
}

const INTERESTS = [
  { value: "ai-automation", label: "AI & Automation" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "web-development", label: "Web Development" },
  { value: "fractional-cto", label: "Fractional CTO Services" },
  { value: "business-strategy", label: "Business Strategy" },
  { value: "other", label: "Other" }
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "200+", label: "200+ employees" }
];

// Type guard to check if resource is from CMS (has all required CMS fields)
function isCMSResource(resource: ResourceDownloadFormResource): resource is Resource {
  return 'featured' in resource && 'order' in resource && 'publishDate' in resource && 'slug' in resource;
}

export default function ResourceDownloadForm({
  resource,
  onSubmit,
  className = ""
}: ResourceDownloadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "",
    interest: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submissionData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        companySize: formData.companySize,
        interest: formData.interest,
        resourceId: resource.id,
        resourceTitle: resource.title,
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Submit to Netlify forms
        await submitResourceDownload(submissionData);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Resource download submission error:', error);
      setErrors({ _submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getResourceIcon = () => {
    switch (resource.type) {
      case 'checklist':
        return '✅';
      case 'template':
        return '📋';
      case 'guide':
        return '📖';
      case 'calculator':
        return '🧮';
      default:
        return '📄';
    }
  };

  if (isSubmitted) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Download Ready!
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Check your email for the download link. Thank you for your interest in our resources!
          </p>
          
          <a
            href={resource.downloadUrl}
            download
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors mb-4"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Download Now
          </a>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>What's Next?</strong><br />
              • Get weekly tips for growing your business with technology<br />
              • Receive invitations to exclusive webinars and events<br />
              • Access to more premium resources and templates
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {/* Hidden form for Netlify */}
      <form name="resource-download" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="company" />
        <input name="companySize" />
        <input name="interest" />
        <input name="resourceId" />
        <input name="resourceTitle" />
        <input name="formType" />
        <input name="submittedAt" />
      </form>

      <div className="bg-white rounded-2xl shadow-soft p-6">
        {/* Resource Preview */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{getResourceIcon()}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resource.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center">
              📁 {resource.fileSize}
            </span>
            {resource.pages && resource.pages > 0 && (
              <span className="flex items-center">
                📄 {resource.pages} pages
              </span>
            )}
            <span className="flex items-center">
              ⚡ Instant download
            </span>
          </div>
        </div>

        {/* Download Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your company name (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Size
            </label>
            <select
              value={formData.companySize}
              onChange={(e) => handleInputChange('companySize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-colors"
            >
              <option value="">Select company size</option>
              {COMPANY_SIZES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Interest
            </label>
            <select
              value={formData.interest}
              onChange={(e) => handleInputChange('interest', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 transition-colors"
            >
              <option value="">Select your primary interest</option>
              {INTERESTS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {errors._submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors._submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                Get Free Download
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              ✓ No spam • ✓ Unsubscribe anytime • ✓ Your data is secure
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}