/**
 * Tests for CMS Authentication and Security
 */

import { 
  CMSAuthManager, 
  initializeCMSAuth, 
  isCMSAuthenticated, 
  getCurrentCMSUser, 
  canUserPerformAction 
} from '../lib/cms-auth';

import { 
  validateFileUpload, 
  sanitizeContent, 
  validateOrigin, 
  AuthRateLimiter, 
  SecurityAuditor 
} from '../lib/cms-security';

// Mock sessionStorage
const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockSessionStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockSessionStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockSessionStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockSessionStorage.store = {};
  })
};

// Mock window object
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

describe('CMSAuthManager', () => {
  let authManager: CMSAuthManager;

  beforeEach(() => {
    mockSessionStorage.clear();
    authManager = CMSAuthManager.getInstance();
  });

  describe('Token Management', () => {
    const mockToken = {
      access_token: 'test-token-123',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'cms'
    };

    test('should store and retrieve token', () => {
      authManager.storeToken(mockToken);
      const retrievedToken = authManager.getToken();
      
      expect(retrievedToken).toBeTruthy();
      expect(retrievedToken?.access_token).toBe(mockToken.access_token);
      expect(retrievedToken?.token_type).toBe(mockToken.token_type);
    });

    test('should return null for expired token', () => {
      const expiredToken = {
        ...mockToken,
        expires_in: -1 // Already expired
      };
      
      authManager.storeToken(expiredToken);
      
      // Wait a bit to ensure expiration
      setTimeout(() => {
        const retrievedToken = authManager.getToken();
        expect(retrievedToken).toBeNull();
      }, 10);
    });

    test('should clear token', () => {
      authManager.storeToken(mockToken);
      authManager.clearToken();
      
      const retrievedToken = authManager.getToken();
      expect(retrievedToken).toBeNull();
    });

    test('should validate token format', () => {
      expect(authManager.validateToken(mockToken)).toBe(true);
      expect(authManager.validateToken({})).toBe(false);
      expect(authManager.validateToken({ access_token: '' })).toBe(false);
    });
  });

  describe('User Management', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'editor' as const,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    };

    test('should store and retrieve user', () => {
      authManager.storeUser(mockUser);
      const retrievedUser = authManager.getUser();
      
      expect(retrievedUser).toEqual(mockUser);
    });

    test('should check user roles', () => {
      authManager.storeUser(mockUser);
      
      expect(authManager.hasRole('contributor')).toBe(true);
      expect(authManager.hasRole('editor')).toBe(true);
      expect(authManager.hasRole('admin')).toBe(false);
    });

    test('should check user permissions', () => {
      authManager.storeUser(mockUser);
      
      expect(authManager.canPerformAction('create')).toBe(true);
      expect(authManager.canPerformAction('update')).toBe(true);
      expect(authManager.canPerformAction('delete')).toBe(false);
      expect(authManager.canPerformAction('publish')).toBe(false);
    });

    test('should check admin permissions', () => {
      const adminUser = { ...mockUser, role: 'admin' as const };
      authManager.storeUser(adminUser);
      
      expect(authManager.canPerformAction('create')).toBe(true);
      expect(authManager.canPerformAction('update')).toBe(true);
      expect(authManager.canPerformAction('delete')).toBe(true);
      expect(authManager.canPerformAction('publish')).toBe(true);
      expect(authManager.canPerformAction('unpublish')).toBe(true);
    });
  });

  describe('Authentication Status', () => {
    test('should return false when not authenticated', () => {
      expect(authManager.isAuthenticated()).toBe(false);
    });

    test('should return true when authenticated with valid token', () => {
      const mockToken = {
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'cms'
      };
      
      authManager.storeToken(mockToken);
      expect(authManager.isAuthenticated()).toBe(true);
    });
  });

  describe('Auth Headers', () => {
    test('should generate correct auth headers', () => {
      const mockToken = {
        access_token: 'test-token-123',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'cms'
      };
      
      authManager.storeToken(mockToken);
      const headers = authManager.getAuthHeaders();
      
      expect(headers['Authorization']).toBe('Bearer test-token-123');
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
    });

    test('should throw error when no token available', () => {
      expect(() => authManager.getAuthHeaders()).toThrow('No authentication token available');
    });
  });
});

describe('Security Utilities', () => {
  describe('File Upload Validation', () => {
    test('should validate allowed file types', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileUpload(validFile);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject disallowed file types', () => {
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-executable' });
      const result = validateFileUpload(invalidFile);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    test('should reject oversized files', () => {
      // Create a mock file that's too large
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });
      
      const result = validateFileUpload(largeFile);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    test('should reject dangerous file names', () => {
      const dangerousFile = new File(['test'], '../../../etc/passwd', { type: 'text/plain' });
      const result = validateFileUpload(dangerousFile);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('invalid or dangerous');
    });
  });

  describe('Content Sanitization', () => {
    test('should remove script tags', () => {
      const maliciousContent = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
      const sanitized = sanitizeContent(maliciousContent);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Hello</p>');
      expect(sanitized).toContain('<p>World</p>');
    });

    test('should remove dangerous attributes', () => {
      const maliciousContent = '<div onclick="alert(\'xss\')">Click me</div>';
      const sanitized = sanitizeContent(maliciousContent);
      
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('Click me');
    });

    test('should remove dangerous protocols', () => {
      const maliciousContent = '<a href="javascript:alert(\'xss\')">Link</a>';
      const sanitized = sanitizeContent(maliciousContent);
      
      expect(sanitized).not.toContain('javascript:');
      expect(sanitized).toContain('Link');
    });
  });

  describe('Origin Validation', () => {
    test('should validate allowed origins', () => {
      expect(validateOrigin('https://dhimahi-preview-site.netlify.app')).toBe(true);
      expect(validateOrigin('http://localhost:3000')).toBe(true);
      expect(validateOrigin('http://127.0.0.1:3000')).toBe(true);
    });

    test('should reject disallowed origins', () => {
      expect(validateOrigin('https://malicious-site.com')).toBe(false);
      expect(validateOrigin('http://evil.example.com')).toBe(false);
    });

    test('should handle invalid URLs', () => {
      expect(validateOrigin('not-a-url')).toBe(false);
      expect(validateOrigin('')).toBe(false);
    });
  });
});

describe('Rate Limiting', () => {
  let rateLimiter: AuthRateLimiter;

  beforeEach(() => {
    rateLimiter = new AuthRateLimiter();
  });

  test('should allow initial attempts', () => {
    expect(rateLimiter.isBlocked('user@example.com')).toBe(false);
  });

  test('should block after max attempts', () => {
    const email = 'user@example.com';
    
    // Record max attempts
    for (let i = 0; i < 5; i++) {
      rateLimiter.recordAttempt(email);
    }
    
    expect(rateLimiter.isBlocked(email)).toBe(true);
  });

  test('should reset after time window', () => {
    const email = 'user@example.com';
    
    // Record attempts
    for (let i = 0; i < 5; i++) {
      rateLimiter.recordAttempt(email);
    }
    
    expect(rateLimiter.isBlocked(email)).toBe(true);
    
    // Reset manually (simulating time passage)
    rateLimiter.reset(email);
    
    expect(rateLimiter.isBlocked(email)).toBe(false);
  });

  test('should calculate time until reset', () => {
    const email = 'user@example.com';
    rateLimiter.recordAttempt(email);
    
    const timeLeft = rateLimiter.getTimeUntilReset(email);
    expect(timeLeft).toBeGreaterThan(0);
  });
});

describe('Security Auditing', () => {
  let auditor: SecurityAuditor;

  beforeEach(() => {
    auditor = new SecurityAuditor();
  });

  test('should log security events', () => {
    auditor.logEvent({
      type: 'login',
      userId: 'user-123',
      userEmail: 'test@example.com'
    });
    
    const events = auditor.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('login');
    expect(events[0].userId).toBe('user-123');
  });

  test('should filter events by type', () => {
    auditor.logEvent({ type: 'login', userId: 'user-1' });
    auditor.logEvent({ type: 'logout', userId: 'user-1' });
    auditor.logEvent({ type: 'failed_login', userId: 'user-2' });
    
    const loginEvents = auditor.getEvents('login');
    expect(loginEvents).toHaveLength(1);
    expect(loginEvents[0].type).toBe('login');
  });

  test('should get failed login attempts', () => {
    auditor.logEvent({ type: 'failed_login', userEmail: 'test@example.com' });
    auditor.logEvent({ type: 'login', userEmail: 'test@example.com' });
    
    const failedAttempts = auditor.getFailedLoginAttempts();
    expect(failedAttempts).toHaveLength(1);
    expect(failedAttempts[0].type).toBe('failed_login');
  });

  test('should limit stored events', () => {
    // Log more than max events
    for (let i = 0; i < 1100; i++) {
      auditor.logEvent({ type: 'login', userId: `user-${i}` });
    }
    
    const events = auditor.getEvents();
    expect(events.length).toBeLessThanOrEqual(1000);
  });
});

describe('Utility Functions', () => {
  test('should initialize auth manager', () => {
    const manager = initializeCMSAuth();
    expect(manager).toBeInstanceOf(CMSAuthManager);
  });

  test('should check authentication status', () => {
    expect(isCMSAuthenticated()).toBe(false);
  });

  test('should get current user', () => {
    expect(getCurrentCMSUser()).toBeNull();
  });

  test('should check user permissions', () => {
    expect(canUserPerformAction('create')).toBe(false);
  });
});