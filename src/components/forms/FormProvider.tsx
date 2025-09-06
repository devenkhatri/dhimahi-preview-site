"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ProgressiveProfilingForm from "./ProgressiveProfilingForm";
// Form submission types
interface FormSubmission {
  formType: string;
  email: string;
  [key: string]: any;
}
import { useFormTracking, useConversionFunnel } from "@/hooks/useConversionTracking";
import { FunnelStage } from "@/lib/analytics";

interface FormContextType {
  showProgressiveProfiling: boolean;
  userProfile: any;
  setShowProgressiveProfiling: (show: boolean) => void;
  updateUserProfile: (profile: any) => void;
  submitForm: (data: FormSubmission) => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

interface FormProviderProps {
  children: ReactNode;
  enableProgressiveProfiling?: boolean;
}

export default function FormProvider({
  children,
  enableProgressiveProfiling = true
}: FormProviderProps) {
  const [showProgressiveProfiling, setShowProgressiveProfiling] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved user profile:', error);
      }
    }
  }, []);

  // Check if user should see progressive profiling
  useEffect(() => {
    if (!enableProgressiveProfiling || !userProfile?.email) return;

    // Show progressive profiling if user has minimal profile data
    const hasMinimalData = !userProfile.company || !userProfile.industry || !userProfile.challenges;
    const lastShown = localStorage.getItem('progressiveProfilingLastShown');
    const daysSinceLastShown = lastShown ? 
      (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24) : 999;

    // Show if user has minimal data and hasn't been shown in the last 7 days
    if (hasMinimalData && daysSinceLastShown > 7) {
      const timer = setTimeout(() => {
        setShowProgressiveProfiling(true);
        localStorage.setItem('progressiveProfilingLastShown', Date.now().toString());
      }, 10000); // Show after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [userProfile, enableProgressiveProfiling]);

  const updateUserProfile = (profile: any) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const { trackConversion } = useConversionFunnel();

  const submitForm = async (data: FormSubmission) => {
    try {
      // Submit to Netlify forms
      const formData = new FormData();
      formData.append('form-name', data.formType);
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });

      const response = await fetch('/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Track conversion based on form type
      const conversionGoalMap: Record<string, string> = {
        'consultation-booking': 'consultation_request',
        'project-quote': 'quote_request',
        'resource-download': 'resource_download',
        'progressive-profiling': 'progressive_profiling'
      };

      const goalId = conversionGoalMap[data.formType];
      if (goalId) {
        trackConversion(goalId, {
          form_type: data.formType,
          email: data.email,
          company: data.company,
          service_interest: data.serviceInterest
        });
      }
      
      // Update user profile if email is provided
      if (data.email) {
        const updatedProfile = {
          ...userProfile,
          email: data.email,
          name: data.name || userProfile?.name,
          company: data.company || userProfile?.company,
          phone: data.phone || userProfile?.phone,
          lastInteraction: new Date().toISOString(),
          formSubmissions: [...(userProfile?.formSubmissions || []), data.formType]
        };
        updateUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  const contextValue: FormContextType = {
    showProgressiveProfiling,
    userProfile,
    setShowProgressiveProfiling,
    updateUserProfile,
    submitForm
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
      
      {/* Progressive Profiling */}
      {enableProgressiveProfiling && showProgressiveProfiling && userProfile?.email && (
        <ProgressiveProfilingForm
          userEmail={userProfile.email}
          existingProfile={userProfile}
          onSubmit={async (profile) => {
            await submitForm({
              formType: 'progressive-profiling',
              ...profile,
              submittedAt: new Date().toISOString()
            });
            updateUserProfile(profile);
            setShowProgressiveProfiling(false);
          }}
          onSkip={() => {
            setShowProgressiveProfiling(false);
            localStorage.setItem('progressiveProfilingLastShown', Date.now().toString());
          }}
        />
      )}
    </FormContext.Provider>
  );
}