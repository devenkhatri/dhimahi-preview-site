/**
 * Tests for validation utilities
 */

import {
  validateEmail,
  validatePhone,
  validateUrl,
  validateSocialMediaUrl,
  validateBusinessHours,
  validateTimezone,
  validateStringArray,
  validateYear,
  validateEmployeeCount
} from '../lib/validation';

describe('Email Validation', () => {
  test('validates correct email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'user123@test-domain.com'
    ];

    validEmails.forEach(email => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(email.toLowerCase());
    });
  });

  test('rejects invalid email addresses', () => {
    const invalidEmails = [
      'invalid',
      '@domain.com',
      'user@',
      'user@domain..com',
      'a'.repeat(255) + '@domain.com' // Too long
    ];

    invalidEmails.forEach(email => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('handles non-string inputs', () => {
    const result = validateEmail(null as any);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must be a string');
  });

  test('rejects empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });
});

describe('Phone Validation', () => {
  test('validates correct phone numbers', () => {
    const validPhones = [
      '+1234567890',
      '+919999999999',
      '1234567890',
      '+44 20 7946 0958'
    ];

    validPhones.forEach(phone => {
      const result = validatePhone(phone);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBeDefined();
    });
  });

  test('rejects invalid phone numbers', () => {
    const invalidPhones = [
      '',
      '123',
      'abc123',
      '+',
      '++1234567890',
      '12345678901234567890' // Too long
    ];

    invalidPhones.forEach(phone => {
      const result = validatePhone(phone);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('URL Validation', () => {
  test('validates correct URLs', () => {
    const validUrls = [
      { input: 'https://example.com', expected: 'https://example.com/' },
      { input: 'http://test.org', expected: 'http://test.org/' },
      { input: 'https://sub.domain.com/path?query=value', expected: 'https://sub.domain.com/path?query=value' },
      { input: 'https://example.com:8080/path', expected: 'https://example.com:8080/path' }
    ];

    validUrls.forEach(({ input, expected }) => {
      const result = validateUrl(input);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe(expected);
    });
  });

  test('rejects invalid URLs', () => {
    const invalidUrls = [
      '',
      'not-a-url',
      'ftp://example.com', // Invalid protocol
      'https://localhost', // Localhost not allowed
      'https://127.0.0.1', // Local IP not allowed
      'javascript:alert(1)' // Dangerous protocol
    ];

    invalidUrls.forEach(url => {
      const result = validateUrl(url);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

describe('Social Media URL Validation', () => {
  test('validates platform-specific URLs', () => {
    const validSocialUrls = [
      { platform: 'linkedin', url: 'https://linkedin.com/company/test' },
      { platform: 'twitter', url: 'https://x.com/testuser' },
      { platform: 'facebook', url: 'https://facebook.com/testpage' },
      { platform: 'instagram', url: 'https://instagram.com/testuser' },
      { platform: 'youtube', url: 'https://youtube.com/channel/test' }
    ];

    validSocialUrls.forEach(({ platform, url }) => {
      const result = validateSocialMediaUrl(platform, url);
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects URLs from wrong platforms', () => {
    const result = validateSocialMediaUrl('linkedin', 'https://facebook.com/test');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid linkedin URL');
  });
});

describe('Business Hours Validation', () => {
  test('validates correct business hours formats', () => {
    const validHours = [
      'Mon-Fri 9:00 AM - 5:00 PM',
      'Monday to Friday 9:00-17:00',
      'Weekdays 9am-5pm',
      'Mon-Sun 24/7'
    ];

    validHours.forEach(hours => {
      const result = validateBusinessHours(hours);
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects invalid business hours', () => {
    const invalidHours = [
      '',
      'Invalid format',
      '123456'
    ];

    invalidHours.forEach(hours => {
      const result = validateBusinessHours(hours);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('Timezone Validation', () => {
  test('validates correct timezone formats', () => {
    const validTimezones = [
      'Asia/Kolkata',
      'America/New_York',
      'Europe/London',
      'UTC'
    ];

    validTimezones.forEach(timezone => {
      const result = validateTimezone(timezone);
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects invalid timezones', () => {
    const invalidTimezones = [
      '',
      'Invalid/Timezone'
    ];

    invalidTimezones.forEach(timezone => {
      const result = validateTimezone(timezone);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('String Array Validation', () => {
  test('validates correct string arrays', () => {
    const validArrays = [
      ['item1', 'item2', 'item3'],
      ['single item'],
      []
    ];

    validArrays.forEach(arr => {
      const result = validateStringArray(arr, 'test field');
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects invalid arrays', () => {
    const invalidArrays = [
      'not an array',
      [1, 2, 3], // Numbers instead of strings
      ['valid', '', 'invalid'], // Empty string
      null
    ];

    invalidArrays.forEach(arr => {
      const result = validateStringArray(arr, 'test field');
      expect(result.isValid).toBe(false);
    });
  });

  test('respects length constraints', () => {
    const longArray = new Array(101).fill('item');
    const result = validateStringArray(longArray, 'test field', 0, 100);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot have more than 100 items');
  });
});

describe('Year Validation', () => {
  test('validates reasonable years', () => {
    const currentYear = new Date().getFullYear();
    const validYears = [1999, 2000, currentYear, currentYear + 1];

    validYears.forEach(year => {
      const result = validateYear(year);
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects invalid years', () => {
    const invalidYears = [
      1799, // Too old
      2050, // Too far in future
      '2000', // String instead of number
      null
    ];

    invalidYears.forEach(year => {
      const result = validateYear(year);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('Employee Count Validation', () => {
  test('validates correct employee count formats', () => {
    const validCounts = [
      '1-10',
      '50+',
      '100-500',
      '25'
    ];

    validCounts.forEach(count => {
      const result = validateEmployeeCount(count);
      expect(result.isValid).toBe(true);
    });
  });

  test('rejects invalid employee counts', () => {
    const invalidCounts = [
      '',
      'many',
      '10-',
      '-50',
      '10-5' // Invalid range
    ];

    invalidCounts.forEach(count => {
      const result = validateEmployeeCount(count);
      expect(result.isValid).toBe(false);
    });
  });
});