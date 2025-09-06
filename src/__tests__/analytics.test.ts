/**
 * @jest-environment jsdom
 */

import { 
  initializeAnalytics, 
  trackEvent, 
  trackLeadEvent, 
  trackFunnelStage,
  trackServiceInquiry,
  abTestManager,
  LeadEvent,
  FunnelStage
} from '@/lib/analytics';
import { ConversionFunnel, FormTracker } from '@/lib/conversion-tracking';

// Mock window.gtag
const mockGtag = jest.fn();
const mockFbq = jest.fn();

beforeEach(() => {
  // Reset mocks
  mockGtag.mockClear();
  mockFbq.mockClear();
  
  // Setup window mocks
  Object.defineProperty(window, 'gtag', {
    value: mockGtag,
    writable: true
  });
  
  Object.defineProperty(window, 'fbq', {
    value: mockFbq,
    writable: true
  });

  Object.defineProperty(window, 'dataLayer', {
    value: [],
    writable: true
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });

  // Set environment variables
  process.env.NEXT_PUBLIC_GA_ID = 'GA-TEST-ID';
  process.env.NEXT_PUBLIC_FB_PIXEL_ID = 'FB-TEST-ID';
});

describe('Analytics Library', () => {
  describe('Event Tracking', () => {
    it('should track basic events', () => {
      trackEvent('test_event', 'Test Category', 'Test Label', 100);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', {
        event_category: 'Test Category',
        event_label: 'Test Label',
        value: 100
      });
    });

    it('should track lead events', () => {
      trackLeadEvent(LeadEvent.FORM_COMPLETE, {
        form_type: 'consultation',
        email: 'test@example.com'
      });

      expect(mockGtag).toHaveBeenCalledWith('event', LeadEvent.FORM_COMPLETE, {
        event_category: 'Lead Generation',
        form_type: 'consultation',
        email: 'test@example.com'
      });

      expect(mockFbq).toHaveBeenCalledWith('track', 'Lead', {
        form_type: 'consultation',
        email: 'test@example.com'
      });
    });

    it('should track funnel stages', () => {
      trackFunnelStage(FunnelStage.INTEREST, 'Web Development', {
        page: '/services/web-development'
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'funnel_stage', {
        event_category: 'Conversion Funnel',
        event_label: FunnelStage.INTEREST,
        funnel_stage: FunnelStage.INTEREST,
        service_name: 'Web Development',
        page: '/services/web-development'
      });
    });

    it('should track service inquiries with ecommerce data', () => {
      trackServiceInquiry('Web Development', 'Development', 50000);

      expect(mockGtag).toHaveBeenCalledWith('event', 'begin_checkout', {
        currency: 'INR',
        value: 50000,
        items: [{
          item_id: 'web-development',
          item_name: 'Web Development',
          item_category: 'Development',
          item_brand: 'Dhimahi Technolabs',
          price: 50000,
          quantity: 1,
          currency: 'INR'
        }]
      });
    });
  });

  describe('A/B Testing', () => {
    it('should assign variants based on weights', () => {
      const test = {
        id: 'hero-test',
        name: 'Hero Section Test',
        active: true,
        variants: [
          { id: 'control', name: 'Control', weight: 0.5, config: { version: 'A' } },
          { id: 'variant', name: 'Variant', weight: 0.5, config: { version: 'B' } }
        ]
      };

      abTestManager.addTest(test);
      
      // Mock Math.random to return 0.3 (should select control)
      jest.spyOn(Math, 'random').mockReturnValue(0.3);
      
      const variant = abTestManager.getVariant('hero-test');
      expect(variant?.id).toBe('control');
      expect(variant?.config.version).toBe('A');

      // Verify tracking was called
      expect(mockGtag).toHaveBeenCalledWith('event', 'ab_test_assignment', {
        event_category: 'A/B Testing',
        event_label: 'hero-test:control'
      });

      Math.random = jest.fn().mockRestore();
    });

    it('should track A/B test conversions', () => {
      const test = {
        id: 'cta-test',
        name: 'CTA Button Test',
        active: true,
        variants: [
          { id: 'blue', name: 'Blue Button', weight: 1.0, config: { color: 'blue' } }
        ]
      };

      abTestManager.addTest(test);
      const variant = abTestManager.getVariant('cta-test');
      
      abTestManager.trackConversion('cta-test', 'consultation_request', 500);

      expect(mockGtag).toHaveBeenCalledWith('event', 'ab_test_conversion', {
        event_category: 'A/B Testing',
        event_label: 'cta-test:blue:consultation_request',
        value: 500
      });
    });
  });
});

describe('Conversion Tracking', () => {
  describe('ConversionFunnel', () => {
    let funnel: ConversionFunnel;

    beforeEach(() => {
      funnel = ConversionFunnel.getInstance();
      funnel.reset();
    });

    it('should track funnel progression', () => {
      funnel.trackStage(FunnelStage.AWARENESS);
      funnel.trackStage(FunnelStage.INTEREST, { service: 'web-development' });

      expect(funnel.getCurrentStage()).toBe(FunnelStage.INTEREST);
      expect(funnel.getFunnelProgress()).toBeGreaterThan(0);
    });

    it('should track conversions with goal mapping', () => {
      funnel.trackConversion('consultation_request', {
        service_name: 'AI Automation',
        estimated_value: 75000
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'conversion_goal', 
        expect.objectContaining({
          event_category: 'Conversions',
          event_label: 'Consultation Request',
          value: 500,
          goal_id: 'consultation_request'
        })
      );
    });
  });

  describe('FormTracker', () => {
    let tracker: FormTracker;

    beforeEach(() => {
      tracker = new FormTracker();
    });

    it('should track form lifecycle', () => {
      tracker.startTracking('contact-form', 'contact');
      
      expect(mockGtag).toHaveBeenCalledWith('event', LeadEvent.FORM_START, {
        event_category: 'Lead Generation',
        form_id: 'contact-form',
        form_type: 'contact',
        timestamp: expect.any(Number)
      });

      tracker.trackFieldInteraction('email', 'test@example.com');
      tracker.trackFieldInteraction('name', 'John Doe');
      tracker.trackFieldInteraction('company', 'Test Company');

      tracker.trackFormCompletion('consultation_request', {
        lead_source: 'website'
      });

      expect(mockGtag).toHaveBeenCalledWith('event', LeadEvent.FORM_COMPLETE, 
        expect.objectContaining({
          event_category: 'Lead Generation',
          form_id: 'contact-form',
          form_type: 'contact',
          fields_completed: 3
        })
      );
    });

    it('should track form abandonment', () => {
      tracker.startTracking('quote-form', 'quote');
      tracker.trackFieldInteraction('email');
      tracker.trackFormAbandonment('user_navigated_away');

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_abandonment', {
        event_category: 'Lead Generation',
        event_label: 'quote',
        abandonment_reason: 'user_navigated_away',
        fields_completed: 1
      });
    });
  });
});

describe('Performance Monitoring', () => {
  it('should track errors', () => {
    const { trackError } = require('@/lib/analytics');
    
    const error = new Error('Test error');
    trackError(error, { component: 'TestComponent' });

    expect(mockGtag).toHaveBeenCalledWith('event', 'exception', {
      description: 'Test error',
      fatal: false,
      error_stack: expect.any(String),
      error_info: JSON.stringify({ component: 'TestComponent' })
    });
  });
});