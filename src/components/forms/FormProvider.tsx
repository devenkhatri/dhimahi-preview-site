"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ExitIntentPopup from "./ExitIntentPopup";
import ScrollBasedReveal from "./ScrollBasedReveal";
import ProgressiveProfilingForm from "./ProgressiveProfilingForm";
import { submitFormData, FormSubmission } from "@/lib/form-integrations";

interface FormContextType {
  showExitIntent: boolean;
  showScrollReveal: boolean;
  showProgressiveProfiling: boolean;
  userProfile: any;
  setShowExitIntent: (show: boolean) => void;
  setShowScrollReveal: (show: boolean) => void;
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
  enableExitIntent?: boolean;
  enableScrollReveal?: boolean;
  enableProgressiveProfiling?: boolean;
}

export default function FormProvider({
  children,
  enableExitIntent = true,
  enableScrollReveal = true,
  enableProgressiveProfiling = true
}: FormProviderProps) {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showScrollReveal, setShowScrollReveal] = useState(false);
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

  const submitForm = async (data: FormSubmission) => {
    try {
      await submitFormData(data);
      
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
    showExitIntent,
    showScrollReveal,
    showProgressiveProfiling,
    userProfile,
    setShowExitIntent,
    setShowScrollReveal,
    setShowProgressiveProfiling,
    updateUserProfile,
    submitForm
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
      
      {/* Exit Intent Popup */}
      {enableExitIntent && (
        <ExitIntentPopup
          onSubmit={async (email) => {
            await submitForm({
              formType: 'exit-intent-popup',
              email,
              submittedAt: new Date().toISOString()
            });
          }}
          onClose={() => setShowExitIntent(false)}
        />
      )}

      {/* Scroll-based Reveal */}
      {enableScrollReveal && (
        <ScrollBasedReveal
          onSubmit={async (data) => {
            await submitForm({
              formType: 'scroll-based-reveal',
              ...data,
              submittedAt: new Date().toISOString()
            });
          }}
          onClose={() => setShowScrollReveal(false)}
        />
      )}

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