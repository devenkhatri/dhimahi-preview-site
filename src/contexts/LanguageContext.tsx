'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'gu';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, enText: string, guText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'gu')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Translation helper function
  const t = (key: string, enText: string, guText: string): string => {
    return language === 'en' ? enText : guText;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Common translations
export const translations = {
  // Navigation
  services: { en: 'Services', gu: 'સેવાઓ' },
  portfolio: { en: 'Portfolio', gu: 'પોર્ટફોલિયો' },
  insights: { en: 'Insights', gu: 'અંતર્દૃષ્ટિ' },
  about: { en: 'About', gu: 'વિશે' },
  contact: { en: 'Contact', gu: 'સંપર્ક' },
  
  // Actions
  freeConsultation: { en: 'Free Consultation', gu: 'મફત સલાહ' },
  search: { en: 'Search', gu: 'શોધો' },
  readMore: { en: 'Read more', gu: 'વધુ વાંચો' },
  learnMore: { en: 'Learn more', gu: 'વધુ જાણો' },
  
  // Common phrases
  futureReadyIT: { en: 'Future-Ready IT Solutions', gu: 'ભવિષ્યની IT સોલ્યુશન્સ' },
  switchToGujarati: { en: 'Switch to ગુજરાતી', gu: 'Switch to English' },
  
  // Search
  searchPlaceholder: { 
    en: 'Search services, insights, or solutions...', 
    gu: 'સેવાઓ, અંતર્દૃષ્ટિ અથવા સોલ્યુશન્સ શોધો...' 
  },
};