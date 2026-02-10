/**
 * Validation utilities for CMS settings
 * Provides comprehensive validation for email addresses, phone numbers, URLs, and other data types
 */

export interface ValidationResult<T = string> {
  isValid: boolean;
  error?: string;
  sanitized?: T;
}

/**
 * Validates email addresses using RFC 5322 compliant regex
 */
export function validateEmail(email: string): ValidationResult {
  if (typeof email !== 'string') {
    return { isValid: false, error: 'Email is required and must be a string' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long (max 254 characters)' };
  }

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, sanitized: trimmedEmail.toLowerCase() };
}

/**
 * Validates phone numbers supporting international formats
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number must be a string' };
  }

  const trimmedPhone = phone.trim();

  if (trimmedPhone.length === 0) {
    return { isValid: false, error: 'Phone number cannot be empty' };
  }

  // Remove all non-digit characters except + for international prefix
  const cleanPhone = trimmedPhone.replace(/[^\d+]/g, '');

  // Check for valid international format
  const internationalRegex = /^\+[1-9]\d{6,14}$/;
  // Check for valid domestic format (assuming 10+ digits)
  const domesticRegex = /^\d{10,15}$/;

  if (internationalRegex.test(cleanPhone) || domesticRegex.test(cleanPhone)) {
    return { isValid: true, sanitized: cleanPhone };
  }

  return {
    isValid: false,
    error: 'Invalid phone format. Use international format (+country code) or domestic format (10-15 digits)'
  };
}

/**
 * Validates URLs with comprehensive checks
 */
export function validateUrl(url: string): ValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL must be a string' };
  }

  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  try {
    const urlObj = new URL(trimmedUrl);

    // Check for valid protocols
    const validProtocols = ['http:', 'https:'];
    if (!validProtocols.includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: `Invalid protocol. Only HTTP and HTTPS are allowed, got: ${urlObj.protocol}`
      };
    }

    // Check for valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { isValid: false, error: 'URL must have a valid hostname' };
    }

    // Check for suspicious patterns
    if (urlObj.hostname === 'localhost' || urlObj.hostname.startsWith('127.')) {
      return { isValid: false, error: 'Localhost URLs are not allowed' };
    }

    return { isValid: true, sanitized: urlObj.toString() };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validates social media URLs with platform-specific checks
 */
export function validateSocialMediaUrl(platform: string, url: string): ValidationResult {
  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();

  // Platform-specific domain validation
  const platformDomains: Record<string, string[]> = {
    linkedin: ['linkedin.com', 'www.linkedin.com'],
    twitter: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
    facebook: ['facebook.com', 'www.facebook.com', 'fb.com', 'www.fb.com'],
    instagram: ['instagram.com', 'www.instagram.com'],
    youtube: ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'],
    tiktok: ['tiktok.com', 'www.tiktok.com'],
    pinterest: ['pinterest.com', 'www.pinterest.com'],
    snapchat: ['snapchat.com', 'www.snapchat.com']
  };

  const validDomains = platformDomains[platform.toLowerCase()];
  if (validDomains && !validDomains.includes(hostname)) {
    return {
      isValid: false,
      error: `Invalid ${platform} URL. Expected domains: ${validDomains.join(', ')}, got: ${hostname}`
    };
  }

  return { isValid: true, sanitized: urlObj.toString() };
}

/**
 * Validates business hours format
 */
export function validateBusinessHours(hours: string): ValidationResult {
  if (!hours || typeof hours !== 'string') {
    return { isValid: false, error: 'Business hours must be a string' };
  }

  const trimmedHours = hours.trim();

  if (trimmedHours.length === 0) {
    return { isValid: false, error: 'Business hours cannot be empty' };
  }

  // Basic format validation - should contain days and times
  const hasDay = /\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(trimmedHours);
  const hasTime = /\b\d{1,2}:\d{2}\b|\b\d{1,2}\s*(am|pm)\b/i.test(trimmedHours);

  if (!hasDay && !hasTime) {
    return {
      isValid: false,
      error: 'Business hours should include days and times (e.g., "Mon-Fri 9:00 AM - 5:00 PM")'
    };
  }

  return { isValid: true, sanitized: trimmedHours };
}

/**
 * Validates timezone format
 */
export function validateTimezone(timezone: string): ValidationResult {
  if (!timezone || typeof timezone !== 'string') {
    return { isValid: false, error: 'Timezone must be a string' };
  }

  const trimmedTimezone = timezone.trim();

  if (trimmedTimezone.length === 0) {
    return { isValid: false, error: 'Timezone cannot be empty' };
  }

  try {
    // Test if timezone is valid by creating a date with it
    Intl.DateTimeFormat('en', { timeZone: trimmedTimezone });
    return { isValid: true, sanitized: trimmedTimezone };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid timezone format. Use IANA timezone names (e.g., "Asia/Kolkata", "America/New_York")`
    };
  }
}

/**
 * Validates array of strings (e.g., service areas, keywords)
 */
export function validateStringArray(arr: any, fieldName: string, minLength = 0, maxLength = 100): ValidationResult<string[]> {
  if (!Array.isArray(arr)) {
    return { isValid: false, error: `${fieldName} must be an array` };
  }

  if (arr.length < minLength) {
    return { isValid: false, error: `${fieldName} must have at least ${minLength} items` };
  }

  if (arr.length > maxLength) {
    return { isValid: false, error: `${fieldName} cannot have more than ${maxLength} items` };
  }

  const sanitized: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (typeof item !== 'string') {
      return { isValid: false, error: `${fieldName}[${i}] must be a string` };
    }

    const trimmed = item.trim();
    if (trimmed.length === 0) {
      return { isValid: false, error: `${fieldName}[${i}] cannot be empty` };
    }

    sanitized.push(trimmed);
  }

  return { isValid: true, sanitized };
}

/**
 * Validates year (for founded year, etc.)
 */
export function validateYear(year: any): ValidationResult<number> {
  if (typeof year !== 'number') {
    return { isValid: false, error: 'Year must be a number' };
  }

  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear + 10) {
    return {
      isValid: false,
      error: `Year must be between 1800 and ${currentYear + 10}`
    };
  }

  return { isValid: true, sanitized: year };
}

/**
 * Validates employee count format
 */
export function validateEmployeeCount(count: string): ValidationResult {
  if (!count || typeof count !== 'string') {
    return { isValid: false, error: 'Employee count must be a string' };
  }

  const trimmed = count.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Employee count cannot be empty' };
  }

  // Valid formats: "1-10", "50+", "100-500", single numbers
  const validFormats = /^(\d+|\d+-\d+|\d+\+)$/;

  if (!validFormats.test(trimmed)) {
    return {
      isValid: false,
      error: 'Employee count must be in format: "1-10", "50+", or single number'
    };
  }

  // Additional validation for ranges
  if (trimmed.includes('-')) {
    const [start, end] = trimmed.split('-').map(n => parseInt(n));
    if (start >= end) {
      return {
        isValid: false,
        error: 'Invalid range: start must be less than end'
      };
    }
  }

  return { isValid: true, sanitized: trimmed };
}