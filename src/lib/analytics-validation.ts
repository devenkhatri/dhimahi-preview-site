// Analytics implementation validation

import { 
  GA_TRACKING_ID, 
  GTM_ID, 
  FB_PIXEL_ID,
  LeadEvent,
  FunnelStage,
  BehaviorEvent
} from './analytics';

export function validateAnalyticsSetup(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment variables
  if (!GA_TRACKING_ID) {
    errors.push('Google Analytics ID (NEXT_PUBLIC_GA_ID) is not configured');
  }

  if (!GTM_ID) {
    warnings.push('Google Tag Manager ID (NEXT_PUBLIC_GTM_ID) is not configured');
  }

  if (!FB_PIXEL_ID) {
    warnings.push('Facebook Pixel ID (NEXT_PUBLIC_FB_PIXEL_ID) is not configured');
  }

  // Check if running in browser
  if (typeof window !== 'undefined') {
    // Check if gtag is loaded
    if (!window.gtag) {
      errors.push('Google Analytics gtag is not loaded');
    }

    // Check if dataLayer exists
    if (!window.dataLayer) {
      errors.push('Google Analytics dataLayer is not initialized');
    }

    // Check localStorage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      warnings.push('localStorage is not available - some features may not work');
    }

    // Check sessionStorage availability
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
    } catch (e) {
      warnings.push('sessionStorage is not available - some features may not work');
    }
  }

  // Validate enum completeness
  const leadEventKeys = Object.keys(LeadEvent);
  const funnelStageKeys = Object.keys(FunnelStage);
  const behaviorEventKeys = Object.keys(BehaviorEvent);

  if (leadEventKeys.length === 0) {
    errors.push('LeadEvent enum is empty');
  }

  if (funnelStageKeys.length === 0) {
    errors.push('FunnelStage enum is empty');
  }

  if (behaviorEventKeys.length === 0) {
    errors.push('BehaviorEvent enum is empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logAnalyticsStatus() {
  const validation = validateAnalyticsSetup();
  
  console.group('🔍 Analytics Setup Validation');
  
  if (validation.isValid) {
    console.log('✅ Analytics setup is valid');
  } else {
    console.log('❌ Analytics setup has errors');
  }

  if (validation.errors.length > 0) {
    console.group('❌ Errors:');
    validation.errors.forEach(error => console.error(`  • ${error}`));
    console.groupEnd();
  }

  if (validation.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
    console.groupEnd();
  }

  // Log configuration status
  console.group('📊 Configuration Status:');
  console.log(`Google Analytics: ${GA_TRACKING_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`Google Tag Manager: ${GTM_ID ? '✅ Configured' : '⚠️ Not configured'}`);
  console.log(`Facebook Pixel: ${FB_PIXEL_ID ? '✅ Configured' : '⚠️ Not configured'}`);
  console.groupEnd();

  // Log available events
  console.group('📈 Available Events:');
  console.log('Lead Events:', Object.values(LeadEvent));
  console.log('Funnel Stages:', Object.values(FunnelStage));
  console.log('Behavior Events:', Object.values(BehaviorEvent));
  console.groupEnd();

  console.groupEnd();

  return validation;
}

// Development helper to test analytics
export function testAnalyticsImplementation() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Analytics testing is only available in development mode');
    return;
  }

  console.group('🧪 Testing Analytics Implementation');

  try {
    // Test basic event tracking
    const { trackEvent, trackLeadEvent, trackFunnelStage } = require('./analytics');
    
    console.log('Testing basic event tracking...');
    trackEvent('test_event', 'Test', 'Analytics Test', 1);
    
    console.log('Testing lead event tracking...');
    trackLeadEvent(LeadEvent.FORM_START, { test: true });
    
    console.log('Testing funnel stage tracking...');
    trackFunnelStage(FunnelStage.AWARENESS, 'Test Service', { test: true });
    
    console.log('✅ All analytics functions executed without errors');
  } catch (error) {
    console.error('❌ Analytics testing failed:', error);
  }

  console.groupEnd();
}

// Initialize validation in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run validation after a short delay to ensure everything is loaded
  setTimeout(() => {
    logAnalyticsStatus();
  }, 2000);
}