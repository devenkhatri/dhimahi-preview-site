"use client";
import { useState, useEffect } from "react";
import { UserIcon, BuildingOfficeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface UserProfile {
  email: string;
  name?: string;
  company?: string;
  companySize?: string;
  industry?: string;
  role?: string;
  interests?: string[];
  challenges?: string[];
  budget?: string;
  timeline?: string;
  previousInteractions?: number;
}

interface ProgressiveProfilingFormProps {
  userEmail: string;
  existingProfile?: Partial<UserProfile>;
  onSubmit?: (profile: UserProfile) => Promise<void>;
  onSkip?: () => void;
  className?: string;
}

const INDUSTRIES = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "trading", label: "Trading & Distribution" },
  { value: "services", label: "Professional Services" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance & Banking" },
  { value: "real-estate", label: "Real Estate" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "other", label: "Other" }
];

const ROLES = [
  { value: "ceo", label: "CEO/Founder" },
  { value: "cto", label: "CTO/IT Head" },
  { value: "marketing", label: "Marketing Manager" },
  { value: "operations", label: "Operations Manager" },
  { value: "business-dev", label: "Business Development" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" }
];

const CHALLENGES = [
  { value: "digital-presence", label: "Weak digital presence" },
  { value: "lead-generation", label: "Not enough leads" },
  { value: "automation", label: "Manual processes" },
  { value: "competition", label: "Increasing competition" },
  { value: "technology", label: "Outdated technology" },
  { value: "scaling", label: "Difficulty scaling" },
  { value: "costs", label: "High operational costs" },
  { value: "talent", label: "Finding tech talent" }
];

export default function ProgressiveProfilingForm({
  userEmail,
  existingProfile = {},
  onSubmit,
  onSkip,
  className = ""
}: ProgressiveProfilingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    email: userEmail,
    ...existingProfile
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which questions to ask based on existing profile
  const getQuestionsToAsk = () => {
    const questions = [];

    if (!profile.name || !profile.company) {
      questions.push({
        id: 'basic-info',
        title: 'Tell us about yourself',
        icon: UserIcon,
        fields: ['name', 'company']
      });
    }

    if (!profile.industry || !profile.role) {
      questions.push({
        id: 'business-info',
        title: 'Your business context',
        icon: BuildingOfficeIcon,
        fields: ['industry', 'role', 'companySize']
      });
    }

    if (!profile.challenges || profile.challenges.length === 0) {
      questions.push({
        id: 'challenges',
        title: 'What challenges are you facing?',
        icon: ChartBarIcon,
        fields: ['challenges']
      });
    }

    return questions;
  };

  const questions = getQuestionsToAsk();

  // If no questions needed, don't show the form
  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        ...profile,
        previousInteractions: (profile.previousInteractions || 0) + 1,
        lastUpdated: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(updatedProfile);
      } else {
        // Default submission to Netlify forms
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'progressive-profiling',
            ...Object.fromEntries(
              Object.entries(updatedProfile).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(',') : String(value || '')
              ])
            )
          }).toString()
        });

        if (!response.ok) {
          throw new Error('Failed to submit profile');
        }
      }

      // Store profile in localStorage for future use
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Progressive profiling submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const renderField = (field: string) => {
    switch (field) {
      case 'name':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => updateProfile('name', e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      case 'company':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={profile.company || ''}
              onChange={(e) => updateProfile('company', e.target.value)}
              placeholder="Your company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        );

      case 'industry':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={profile.industry || ''}
              onChange={(e) => updateProfile('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'role':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Role
            </label>
            <select
              value={profile.role || ''}
              onChange={(e) => updateProfile('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select your role</option>
              {ROLES.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'companySize':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            <select
              value={profile.companySize || ''}
              onChange={(e) => updateProfile('companySize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
          </div>
        );

      case 'challenges':
        return (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are your main challenges? (Select all that apply)
            </label>
            <div className="space-y-2">
              {CHALLENGES.map(challenge => (
                <label key={challenge.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(profile.challenges || []).includes(challenge.value)}
                    onChange={(e) => {
                      const currentChallenges = profile.challenges || [];
                      if (e.target.checked) {
                        updateProfile('challenges', [...currentChallenges, challenge.value]);
                      } else {
                        updateProfile('challenges', currentChallenges.filter(c => c !== challenge.value));
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{challenge.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hidden form for Netlify */}
      <form name="progressive-profiling" data-netlify="true" hidden>
        <input name="email" />
        <input name="name" />
        <input name="company" />
        <input name="companySize" />
        <input name="industry" />
        <input name="role" />
        <input name="challenges" />
        <input name="previousInteractions" />
        <input name="lastUpdated" />
      </form>

      <div className={`max-w-md mx-auto ${className}`}>
        <div className="bg-white rounded-2xl shadow-soft p-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <currentQuestion.icon className="w-6 h-6 text-primary mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {questions.length}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQuestion.title}
            </h3>
            <div className="space-y-4">
              {currentQuestion.fields.map(renderField)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip for now
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-primary text-white font-medium py-2 px-6 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : currentStep === questions.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Why we ask:</strong> This helps us provide more relevant content and 
              personalized recommendations for your business.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}