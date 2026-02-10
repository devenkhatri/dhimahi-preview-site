import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import {
  validateEmail,
  validatePhone,
  validateUrl,
  validateSocialMediaUrl,
  validateBusinessHours,
  validateTimezone,
  validateStringArray,
  validateYear,
  validateEmployeeCount,
  ValidationResult
} from './validation';
import { settingsLogger } from './error-logging';

export interface SocialMediaLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface BusinessSettings {
  type?: string;
  foundedYear?: number;
  employeeCount?: string;
  registrationNumber?: string;
  gstNumber?: string;
  website?: string;
}

export interface SEOSettings {
  keywords?: string[];
  targetAudience?: string;
  primaryMarkets?: string[];
}

export interface BrandSettings {
  companyName: string;
  tagline: string;
  description: string;
  shortDescription?: string;
  mission?: string;
  vision?: string;
  trustBadge?: string;
  yearsOfExperience?: number;
}

export interface LocationSettings {
  primaryLocation: string;
  serviceAreas: string[];
  fullAddress: string;
}

export interface ContactSettings {
  primaryEmail: string;
  supportEmail?: string;
  phone?: string;
  businessHours?: string;
  whatsapp?: string;
  timezone?: string;
}

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  brand: BrandSettings;
  location: LocationSettings;
  contact: ContactSettings;
  socialMedia: SocialMediaLinks;
  business?: BusinessSettings;
  seo?: SEOSettings;
  // Legacy fields for backward compatibility
  contactEmail?: string;
  phone?: string;
  address?: string;
}

let cachedSettings: GeneralSettings | null = null;

// Helper function to safely validate and return value or fallback
function validateAndFallback<T>(
  value: any,
  validator: (val: any) => ValidationResult,
  fallback: T,
  fieldName: string
): T {
  if (value === undefined || value === null) {
    return fallback;
  }

  const validation = validator(value);
  if (!validation.isValid) {
    settingsLogger.validationFailure(fieldName, value, validation.error || 'Unknown validation error');
    settingsLogger.fallbackUsed(fieldName, value, fallback, validation.error);
    return fallback;
  }

  return validation.sanitized as T || value;
}

function extractCompanyName(siteTitle: string): string {
  // Extract company name from site title (before first dash or hyphen)
  const match = siteTitle.match(/^([^-–]+)/);
  return match ? match[1].trim() : siteTitle;
}

function validateAndEnhanceSettings(rawSettings: any): GeneralSettings {
  let validationIssues = 0;

  // Validate and build brand settings with comprehensive validation
  const companyName = rawSettings.brand?.companyName ||
    extractCompanyName(rawSettings.siteTitle || '') ||
    (() => {
      settingsLogger.fallbackUsed('brand.companyName', rawSettings.brand?.companyName, 'Dhīmahi Technolabs', 'Missing company name');
      validationIssues++;
      return 'Dhīmahi Technolabs';
    })();

  const tagline = rawSettings.brand?.tagline ||
    (() => {
      settingsLogger.fallbackUsed('brand.tagline', rawSettings.brand?.tagline, 'Future-Ready IT Solutions', 'Missing tagline');
      validationIssues++;
      return 'Future-Ready IT Solutions';
    })();

  const description = rawSettings.brand?.description ||
    rawSettings.siteDescription ||
    (() => {
      settingsLogger.fallbackUsed('brand.description', rawSettings.brand?.description, 'Default description', 'Missing description');
      validationIssues++;
      return 'Transform your SME with AI automation, digital marketing, and smart IT strategy.';
    })();

  // Validate years of experience if provided (this is a count, not a calendar year)
  let yearsOfExperience = rawSettings.brand?.yearsOfExperience;
  if (yearsOfExperience !== undefined) {
    if (typeof yearsOfExperience !== 'number' || yearsOfExperience < 0 || yearsOfExperience > 200) {
      settingsLogger.validationFailure('brand.yearsOfExperience', yearsOfExperience, 'Years of experience must be a number between 0 and 200');
      yearsOfExperience = undefined;
      validationIssues++;
    }
  }

  const brandSettings: BrandSettings = {
    companyName,
    tagline,
    description,
    shortDescription: rawSettings.brand?.shortDescription,
    mission: rawSettings.brand?.mission,
    vision: rawSettings.brand?.vision,
    trustBadge: rawSettings.brand?.trustBadge,
    yearsOfExperience
  };

  // Validate and build location settings with comprehensive validation
  const primaryLocation = rawSettings.location?.primaryLocation ||
    (() => {
      settingsLogger.fallbackUsed('location.primaryLocation', rawSettings.location?.primaryLocation, 'Ahmedabad & Gandhinagar', 'Missing primary location');
      validationIssues++;
      return 'Ahmedabad & Gandhinagar';
    })();

  let serviceAreas = rawSettings.location?.serviceAreas;
  if (serviceAreas !== undefined) {
    const areasValidation = validateStringArray(serviceAreas, 'location.serviceAreas', 1, 50);
    if (!areasValidation.isValid) {
      settingsLogger.validationFailure('location.serviceAreas', serviceAreas, areasValidation.error || 'Invalid service areas');
      serviceAreas = ['Ahmedabad', 'Gandhinagar', 'Gujarat'];
      validationIssues++;
    } else {
      serviceAreas = areasValidation.sanitized;
    }
  } else {
    settingsLogger.fallbackUsed('location.serviceAreas', undefined, ['Ahmedabad', 'Gandhinagar', 'Gujarat'], 'Missing service areas');
    serviceAreas = ['Ahmedabad', 'Gandhinagar', 'Gujarat'];
    validationIssues++;
  }

  const fullAddress = rawSettings.location?.fullAddress ||
    rawSettings.address ||
    (() => {
      settingsLogger.fallbackUsed('location.fullAddress', rawSettings.location?.fullAddress, 'Default address', 'Missing full address');
      validationIssues++;
      return 'Dhīmahi Technolabs\nGandhinagar, Gujarat, India';
    })();

  const locationSettings: LocationSettings = {
    primaryLocation,
    serviceAreas,
    fullAddress
  };

  // Validate and build contact settings with comprehensive validation
  const primaryEmailRaw = rawSettings.contact?.primaryEmail || rawSettings.contactEmail;
  const primaryEmail = validateAndFallback(
    primaryEmailRaw,
    validateEmail,
    'hello@dhimahitechnolabs.com',
    'contact.primaryEmail'
  );
  if (primaryEmailRaw && primaryEmailRaw !== primaryEmail) {
    validationIssues++;
  }

  let supportEmail = rawSettings.contact?.supportEmail;
  if (supportEmail) {
    const emailValidation = validateEmail(supportEmail);
    if (!emailValidation.isValid) {
      settingsLogger.validationFailure('contact.supportEmail', supportEmail, emailValidation.error || 'Invalid email');
      supportEmail = undefined;
      validationIssues++;
    } else {
      supportEmail = emailValidation.sanitized;
    }
  }

  let phone = rawSettings.contact?.phone || rawSettings.phone;
  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      settingsLogger.validationFailure('contact.phone', phone, phoneValidation.error || 'Invalid phone');
      // Keep original for display but log the issue
      validationIssues++;
    } else {
      phone = phoneValidation.sanitized;
    }
  }

  let whatsapp = rawSettings.contact?.whatsapp;
  if (whatsapp) {
    const whatsappValidation = validatePhone(whatsapp);
    if (!whatsappValidation.isValid) {
      settingsLogger.validationFailure('contact.whatsapp', whatsapp, whatsappValidation.error || 'Invalid WhatsApp number');
      validationIssues++;
    } else {
      whatsapp = whatsappValidation.sanitized;
    }
  }

  let businessHours = rawSettings.contact?.businessHours;
  if (businessHours) {
    const hoursValidation = validateBusinessHours(businessHours);
    if (!hoursValidation.isValid) {
      settingsLogger.validationFailure('contact.businessHours', businessHours, hoursValidation.error || 'Invalid business hours');
      validationIssues++;
    } else {
      businessHours = hoursValidation.sanitized;
    }
  }

  let timezone = rawSettings.contact?.timezone;
  if (timezone) {
    const timezoneValidation = validateTimezone(timezone);
    if (!timezoneValidation.isValid) {
      settingsLogger.validationFailure('contact.timezone', timezone, timezoneValidation.error || 'Invalid timezone');
      timezone = undefined;
      validationIssues++;
    } else {
      timezone = timezoneValidation.sanitized;
    }
  }

  const contactSettings: ContactSettings = {
    primaryEmail,
    supportEmail,
    phone,
    businessHours,
    whatsapp,
    timezone
  };

  // Validate social media URLs with platform-specific validation
  const socialMedia: SocialMediaLinks = {};
  if (rawSettings.socialMedia && typeof rawSettings.socialMedia === 'object') {
    Object.entries(rawSettings.socialMedia).forEach(([platform, url]) => {
      if (typeof url === 'string' && url.trim()) {
        const socialValidation = validateSocialMediaUrl(platform, url);
        if (socialValidation.isValid) {
          socialMedia[platform as keyof SocialMediaLinks] = socialValidation.sanitized;
        } else {
          settingsLogger.validationFailure(`socialMedia.${platform}`, url, socialValidation.error || 'Invalid social media URL');
          validationIssues++;
        }
      }
    });
  }

  // Validate business settings if provided
  let business = rawSettings.business;
  if (business && typeof business === 'object') {
    const validatedBusiness: BusinessSettings = { ...business };

    if (business.foundedYear !== undefined) {
      const yearValidation = validateYear(business.foundedYear);
      if (!yearValidation.isValid) {
        settingsLogger.validationFailure('business.foundedYear', business.foundedYear, yearValidation.error || 'Invalid founded year');
        delete validatedBusiness.foundedYear;
        validationIssues++;
      }
    }

    if (business.employeeCount !== undefined) {
      const countValidation = validateEmployeeCount(business.employeeCount);
      if (!countValidation.isValid) {
        settingsLogger.validationFailure('business.employeeCount', business.employeeCount, countValidation.error || 'Invalid employee count');
        delete validatedBusiness.employeeCount;
        validationIssues++;
      }
    }

    if (business.website !== undefined) {
      const urlValidation = validateUrl(business.website);
      if (!urlValidation.isValid) {
        settingsLogger.validationFailure('business.website', business.website, urlValidation.error || 'Invalid website URL');
        delete validatedBusiness.website;
        validationIssues++;
      } else {
        validatedBusiness.website = urlValidation.sanitized;
      }
    }

    business = validatedBusiness;
  }

  // Validate SEO settings if provided
  let seo = rawSettings.seo;
  if (seo && typeof seo === 'object') {
    const validatedSeo: SEOSettings = { ...seo };

    if (seo.keywords !== undefined) {
      const keywordsValidation = validateStringArray(seo.keywords, 'seo.keywords', 0, 100);
      if (!keywordsValidation.isValid) {
        settingsLogger.validationFailure('seo.keywords', seo.keywords, keywordsValidation.error || 'Invalid keywords');
        delete validatedSeo.keywords;
        validationIssues++;
      } else {
        validatedSeo.keywords = keywordsValidation.sanitized;
      }
    }

    if (seo.primaryMarkets !== undefined) {
      const marketsValidation = validateStringArray(seo.primaryMarkets, 'seo.primaryMarkets', 0, 50);
      if (!marketsValidation.isValid) {
        settingsLogger.validationFailure('seo.primaryMarkets', seo.primaryMarkets, marketsValidation.error || 'Invalid primary markets');
        delete validatedSeo.primaryMarkets;
        validationIssues++;
      } else {
        validatedSeo.primaryMarkets = marketsValidation.sanitized;
      }
    }

    seo = validatedSeo;
  }

  // Log successful loading with validation summary
  settingsLogger.settingsLoaded('cms', validationIssues > 0 ? validationIssues : undefined);

  return {
    siteTitle: rawSettings.siteTitle || "Dhīmahi Technolabs",
    siteDescription: rawSettings.siteDescription || "Transform your SME with AI automation, digital marketing, and smart IT strategy.",
    brand: brandSettings,
    location: locationSettings,
    contact: contactSettings,
    socialMedia,
    business,
    seo,

    // Legacy fields for backward compatibility
    contactEmail: contactSettings.primaryEmail,
    phone: contactSettings.phone,
    address: locationSettings.fullAddress
  };
}

function getFallbackSettings(): GeneralSettings {
  settingsLogger.completeFallbackUsed('CMS load failure - using hardcoded defaults');
  return {
    siteTitle: "Dhīmahi Technolabs",
    siteDescription: "Transform your SME with AI automation, digital marketing, and smart IT strategy.",
    brand: {
      companyName: 'Dhīmahi Technolabs',
      tagline: 'Future-Ready IT Solutions',
      description: 'Transform your SME with AI automation, digital marketing, and smart IT strategy.',
      shortDescription: 'Transform your SME with AI automation, digital marketing, and smart IT strategy.',
      mission: 'To empower small and medium businesses in Ahmedabad & Gandhinagar and beyond with practical, affordable, and future-ready technology solutions that drive real business growth.',
      vision: 'To be Gujarat\'s most trusted IT consultancy, known for transforming SMEs into digitally empowered, future-ready businesses that compete confidently in the modern marketplace.',
      trustBadge: 'Gujarat\'s Preferred IT Partner',
      yearsOfExperience: 25
    },
    location: {
      primaryLocation: 'Ahmedabad & Gandhinagar',
      serviceAreas: ['Ahmedabad', 'Gandhinagar', 'Gujarat'],
      fullAddress: 'Dhīmahi Technolabs\nGandhinagar, Gujarat, India'
    },
    contact: {
      primaryEmail: 'hello@dhimahitechnolabs.com',
      supportEmail: 'support@dhimahitechnolabs.com',
      phone: '+91 99999 99999',
      businessHours: 'Mon-Fri 9:00 AM - 6:00 PM IST',
      whatsapp: '+91 99999 99999',
      timezone: 'Asia/Kolkata'
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/dhimahi-technolabs',
      twitter: 'https://x.com/dhimahitechno',
      facebook: 'https://www.facebook.com/dhimahi.technolabs',
      instagram: 'https://www.instagram.com/dhimahi.technolabs/',
      youtube: 'https://youtube.com/@dhimahitechnolabs'
    },
    business: {
      type: 'IT Consulting & Services',
      foundedYear: 1999,
      employeeCount: '10-50',
      website: 'https://www.dhimahitechnolabs.com'
    },
    seo: {
      keywords: ['IT consulting', 'AI automation', 'digital marketing', 'application portfolio rationalisation', 'SME solutions', 'Gujarat', 'Ahmedabad', 'Gandhinagar'],
      targetAudience: 'Small and Medium Enterprises (SMEs)',
      primaryMarkets: ['Gujarat', 'India']
    },
    // Legacy fields
    contactEmail: 'hello@dhimahitechnolabs.com',
    phone: '+91 99999 99999',
    address: 'Dhīmahi Technolabs\nGandhinagar, Gujarat, India'
  };
}

export function getGeneralSettings(): GeneralSettings {
  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const settingsPath = join(process.cwd(), 'content/settings/general.yml');

    // Check if file exists and read contents
    let fileContents: string;
    try {
      fileContents = readFileSync(settingsPath, 'utf8');
    } catch (fileError) {
      settingsLogger.cmsLoadFailure(fileError as Error, settingsPath);
      const fallbackSettings = getFallbackSettings();
      cachedSettings = fallbackSettings;
      return fallbackSettings;
    }

    // Parse YAML content with enhanced error handling
    let rawSettings: any;
    try {
      rawSettings = yaml.load(fileContents);
    } catch (parseError) {
      settingsLogger.yamlParseFailure(parseError as Error, fileContents);
      const fallbackSettings = getFallbackSettings();
      cachedSettings = fallbackSettings;
      return fallbackSettings;
    }

    // Validate that we have valid object data
    if (!rawSettings || typeof rawSettings !== 'object') {
      settingsLogger.error('Settings file does not contain valid object data', {
        component: 'SettingsLoader',
        function: 'getGeneralSettings',
        value: typeof rawSettings
      });
      const fallbackSettings = getFallbackSettings();
      cachedSettings = fallbackSettings;
      return fallbackSettings;
    }

    // Validate and enhance settings with comprehensive error handling
    try {
      const enhancedSettings = validateAndEnhanceSettings(rawSettings);
      cachedSettings = enhancedSettings;
      return enhancedSettings;
    } catch (validationError) {
      settingsLogger.error('Failed to validate and enhance settings', {
        component: 'SettingsLoader',
        function: 'validateAndEnhanceSettings'
      }, validationError as Error);
      const fallbackSettings = getFallbackSettings();
      cachedSettings = fallbackSettings;
      return fallbackSettings;
    }
  } catch (error) {
    settingsLogger.error('Unexpected error loading general settings', {
      component: 'SettingsLoader',
      function: 'getGeneralSettings'
    }, error as Error);
    const fallbackSettings = getFallbackSettings();
    cachedSettings = fallbackSettings;
    return fallbackSettings;
  }
}

// Function to clear cache (useful for testing or when settings are updated)
export function clearSettingsCache(): void {
  cachedSettings = null;
  settingsLogger.cacheCleared();
}

// Function to get settings without caching (useful for testing)
export function getGeneralSettingsUncached(): GeneralSettings {
  const originalCache = cachedSettings;
  cachedSettings = null;
  const settings = getGeneralSettings();
  cachedSettings = originalCache;
  return settings;
}

// Function to validate settings without loading (useful for testing)
export function validateSettings(rawSettings: any): { isValid: boolean; errors: string[]; settings?: GeneralSettings } {
  try {
    const settings = validateAndEnhanceSettings(rawSettings);
    const errors = settingsLogger.getLogs('WARN').map(log => log.message);
    return {
      isValid: errors.length === 0,
      errors,
      settings
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// Function to get settings health status
export function getSettingsHealth(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  source: 'cms' | 'fallback';
  errors: number;
  warnings: number;
  lastUpdated: string;
} {
  const summary = settingsLogger.getErrorSummary(new Date(Date.now() - 24 * 60 * 60 * 1000)); // Last 24 hours
  const isUsingFallback = cachedSettings === null || settingsLogger.getLogs('WARN').some(log =>
    log.message.includes('complete fallback settings')
  );

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (summary.totalErrors > 0) {
    status = 'unhealthy';
  } else if (summary.totalWarnings > 5 || isUsingFallback) {
    status = 'degraded';
  }

  return {
    status,
    source: isUsingFallback ? 'fallback' : 'cms',
    errors: summary.totalErrors,
    warnings: summary.totalWarnings,
    lastUpdated: new Date().toISOString()
  };
}

// Export logger for external monitoring
export { settingsLogger };