/**
 * CMS Security Configuration and Utilities
 * Handles security policies, validation, and protection for Decap CMS
 */

export interface SecurityConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  maxLoginAttempts: number;
  sessionTimeout: number;
  requireTwoFactor: boolean;
  allowedDomains: string[];
}

export const CMS_SECURITY_CONFIG: SecurityConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/markdown'
  ],
  maxLoginAttempts: 5,
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  requireTwoFactor: false,
  allowedDomains: [
    'dhimahi-preview-site.netlify.app',
    'localhost:3000',
    '127.0.0.1:3000'
  ]
};

/**
 * Content Security Policy for CMS admin interface
 */
export const CMS_CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Decap CMS
    "'unsafe-eval'", // Required for Decap CMS
    "https://identity.netlify.com",
    "https://unpkg.com",
    "https://cdn.jsdelivr.net"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Decap CMS styling
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "*.netlify.app"
  ],
  'connect-src': [
    "'self'",
    "https://api.netlify.com",
    "https://identity.netlify.com",
    "https://api.github.com",
    "*.netlify.app"
  ],
  'frame-src': [
    "'self'",
    "https://identity.netlify.com"
  ],
  'media-src': ["'self'", "blob:", "data:"]
};

/**
 * Validate file upload security
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > CMS_SECURITY_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${CMS_SECURITY_CONFIG.maxFileSize / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!CMS_SECURITY_CONFIG.allowedFileTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  // Check file name for security
  const fileName = file.name;
  const dangerousPatterns = [
    /\.\./,  // Directory traversal
    /[<>:"|?*]/,  // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i,  // Reserved names
    /\.(exe|bat|cmd|scr|pif|com|dll)$/i  // Executable files
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(fileName)) {
      return {
        valid: false,
        error: 'File name contains invalid or dangerous characters'
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize content input
 */
export function sanitizeContent(content: string): string {
  // Remove potentially dangerous HTML tags and attributes
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const dangerousAttributes = /\s+on\w+\s*=\s*["'][^"']*["']/gi;
  const dangerousProtocols = /(href\s*=\s*["']?)(?:javascript:|data:|vbscript:)[^"']*/gi;

  return content
    .replace(dangerousTags, '')
    .replace(dangerousAttributes, '')
    .replace(dangerousProtocols, '$1');
}

/**
 * Validate domain origin
 */
export function validateOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    
    return CMS_SECURITY_CONFIG.allowedDomains.some(domain => {
      if (domain.includes(':')) {
        return origin === `${url.protocol}//${domain}`;
      }
      return hostname === domain || hostname.endsWith(`.${domain}`);
    });
  } catch {
    return false;
  }
}

/**
 * Generate Content Security Policy header value
 */
export function generateCSPHeader(): string {
  const policies = Object.entries(CMS_CSP_POLICY)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
  
  return policies;
}

/**
 * Rate limiting for authentication attempts
 */
export class AuthRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = CMS_SECURITY_CONFIG.maxLoginAttempts;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    // Reset if window has passed
    if (Date.now() - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return false;
    }

    return record.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      record.count++;
      record.lastAttempt = now;
    }
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getTimeUntilReset(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;

    const timeLeft = this.windowMs - (Date.now() - record.lastAttempt);
    return Math.max(0, timeLeft);
  }
}

/**
 * Security headers for CMS admin interface
 */
export const CMS_SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': generateCSPHeader()
};

/**
 * Audit logging for security events
 */
export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'file_upload' | 'content_change';
  userId?: string;
  userEmail?: string;
  timestamp: number;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export class SecurityAuditor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.events.push(fullEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', fullEvent);
    }
  }

  getEvents(type?: SecurityEvent['type'], limit = 100): SecurityEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = filtered.filter(event => event.type === type);
    }

    return filtered.slice(-limit);
  }

  getFailedLoginAttempts(timeWindow = 60 * 60 * 1000): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(
      event => event.type === 'failed_login' && event.timestamp > cutoff
    );
  }
}

// Global security auditor instance
export const securityAuditor = new SecurityAuditor();

// Global rate limiter instance
export const authRateLimiter = new AuthRateLimiter();