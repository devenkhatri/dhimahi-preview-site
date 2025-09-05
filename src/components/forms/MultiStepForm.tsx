"use client";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  validation?: (data: Record<string, any>) => string | null;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
  conditional?: (data: Record<string, any>) => boolean;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onStepChange?: (currentStep: number, totalSteps: number) => void;
  className?: string;
  submitButtonText?: string;
  showProgress?: boolean;
}

export default function MultiStepForm({
  steps,
  onSubmit,
  onStepChange,
  className = "",
  submitButtonText = "Submit",
  showProgress = true
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onStepChange?.(currentStep, steps.length);
  }, [currentStep, steps.length, onStepChange]);

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const stepErrors: Record<string, string> = {};

    // Validate required fields
    step.fields.forEach(field => {
      if (field.conditional && !field.conditional(formData)) return;
      
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        stepErrors[field.name] = `${field.label} is required`;
      } else if (field.validation && formData[field.name]) {
        const validationError = field.validation(formData[field.name]);
        if (validationError) {
          stepErrors[field.name] = validationError;
        }
      }
    });

    // Custom step validation
    if (step.validation) {
      const stepValidationError = step.validation(formData);
      if (stepValidationError) {
        stepErrors._step = stepValidationError;
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ _submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderField = (field: FormField) => {
    if (field.conditional && !field.conditional(formData)) {
      return null;
    }

    const fieldError = errors[field.name];
    const fieldValue = formData[field.name] || '';

    const baseInputClasses = `form-input mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
      fieldError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="form-label block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={fieldValue}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`form-textarea ${baseInputClasses}`}
            />
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="form-label block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={fieldValue}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              className={`form-select ${baseInputClasses}`}
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="space-y-2">
            <label className="form-label block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={fieldValue === option.value}
                    onChange={(e) => updateFormData(field.name, e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="form-label ml-2 text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                name={field.name}
                checked={fieldValue === true}
                onChange={(e) => updateFormData(field.name, e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="form-label ml-2 text-sm">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-1">
            <label className="form-label block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={fieldValue}
              onChange={(e) => updateFormData(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
            />
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}
          </div>
        );
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="mt-2 text-gray-600">{currentStepData.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step Fields */}
          <div className="space-y-4">
            {currentStepData.fields.map(renderField)}
          </div>

          {/* Step Error */}
          {errors._step && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors._step}</p>
            </div>
          )}

          {/* Submit Error */}
          {errors._submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors._submit}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Previous
            </button>

            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : submitButtonText}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}