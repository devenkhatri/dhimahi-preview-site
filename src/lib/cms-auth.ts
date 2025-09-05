/**
 * CMS Authentication and Security Utilities
 * Handles secure token management and API access for Decap CMS
 */

export interface CMSUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'contributor';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CMSAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class CMSAuthManager {
  private static instance: CMSAuthManager;
  private tokenKey = 'cms_auth_token';
  private userKey = 'cms_user_data';

  private constructor() {}

  static getInstance(): CMSAuthManager {
    if (!CMSAuthManager.instance) {
      CMSAuthManager.instance = new CMSAuthManager();
    }
    return CMSAuthManager.instance;
  }

  /**
   * Store authentication token securely
   */
  storeToken(token: CMSAuthToken): void {
    try {
      const tokenData = {
        ...token,
        stored_at: Date.now(),
        expires_at: Date.now() + (token.expires_in * 1000)
      };
      
      if (typeof window !== 'undefined') {
        // Use sessionStorage for security - tokens don't persist across browser sessions
        sessionStorage.setItem(this.tokenKey, JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('Failed to store authentication token:', error);
    }
  }

  /**
   * Retrieve stored authentication token
   */
  getToken(): CMSAuthToken | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const tokenData = sessionStorage.getItem(this.tokenKey);
      if (!tokenData) return null;

      const parsed = JSON.parse(tokenData);
      
      // Check if token is expired
      if (parsed.expires_at && Date.now() > parsed.expires_at) {
        this.clearToken();
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to retrieve authentication token:', error);
      return null;
    }
  }

  /**
   * Clear stored authentication token
   */
  clearToken(): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.userKey);
      }
    } catch (error) {
      console.error('Failed to clear authentication token:', error);
    }
  }

  /**
   * Store user data securely
   */
  storeUser(user: CMSUser): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.userKey, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  /**
   * Retrieve stored user data
   */
  getUser(): CMSUser | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const userData = sessionStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: CMSAuthToken & { expires_at?: number }): boolean {
    if (!token.expires_at) return false;
    return Date.now() > token.expires_at;
  }

  /**
   * Check if user has required role
   */
  hasRole(requiredRole: CMSUser['role']): boolean {
    const user = this.getUser();
    if (!user) return false;

    const roleHierarchy = {
      admin: 3,
      editor: 2,
      contributor: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user can perform specific action
   */
  canPerformAction(action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'media_library'): boolean {
    const user = this.getUser();
    if (!user) return false;

    const permissions = {
      admin: ['create', 'update', 'delete', 'publish', 'unpublish', 'media_library'],
      editor: ['create', 'update', 'media_library'],
      contributor: ['create', 'media_library']
    };

    return permissions[user.role].includes(action);
  }

  /**
   * Generate secure API headers for CMS requests
   */
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `${token.token_type} ${token.access_token}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  /**
   * Validate token format and structure
   */
  validateToken(token: any): token is CMSAuthToken {
    return (
      typeof token === 'object' &&
      typeof token.access_token === 'string' &&
      typeof token.token_type === 'string' &&
      typeof token.expires_in === 'number' &&
      token.access_token.length > 0
    );
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error: any): void {
    console.error('CMS Authentication Error:', error);
    
    // Clear invalid tokens
    if (error.status === 401 || error.status === 403) {
      this.clearToken();
    }

    // Redirect to login if needed
    if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
      // Let Netlify Identity handle the redirect
      window.location.reload();
    }
  }
}

/**
 * Initialize CMS authentication
 */
export function initializeCMSAuth(): CMSAuthManager {
  return CMSAuthManager.getInstance();
}

/**
 * Utility function to check authentication status
 */
export function isCMSAuthenticated(): boolean {
  return CMSAuthManager.getInstance().isAuthenticated();
}

/**
 * Utility function to get current user
 */
export function getCurrentCMSUser(): CMSUser | null {
  return CMSAuthManager.getInstance().getUser();
}

/**
 * Utility function to check user permissions
 */
export function canUserPerformAction(action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'media_library'): boolean {
  return CMSAuthManager.getInstance().canPerformAction(action);
}