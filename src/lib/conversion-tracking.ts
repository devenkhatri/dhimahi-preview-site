// Conversion tracking and funnel analysis

import { 
  trackLeadEvent, 
  trackFunnelStage, 
  trackServiceInquiry, 
  trackServiceInterest,
  trackEvent,
  LeadEvent, 
  FunnelStage,
  abTestManager
} from './analytics';

// Conversion goals configuration
export interface ConversionGoal {
  id: string;
  name: string;
  value: number;
  category: 'lead' | 'sale' | 'engagement';
  funnelStage: FunnelStage;
}

export const CONVERSION_GOALS: ConversionGoal[] = [
  {
    id: 'consultation_request',
    name: 'Consultation Request',
    value: 500,
    category: 'lead',
    funnelStage: FunnelStage.INTENT
  },
  {
    id: 'quote_request',
    name: 'Quote Request',
    value: 1000,
    category: 'lead',
    funnelStage: FunnelStage.EVALUATION
  },
  {
    id: 'newsletter_signup',
    name: 'Newsletter Signup',
    value: 50,
    category: 'lead',
    funnelStage: FunnelStage.INTEREST
  },
  {
    id: 'resource_download',
    name: 'Resource Download',
    value: 100,
    category: 'lead',
    funnelStage: FunnelStage.CONSIDERATION
  },
  {
    id: 'phone_call',
    name: 'Phone Call Click',
    value: 200,
    category: 'lead',
    funnelStage: FunnelStage.INTENT
  },
  {
    id: 'service_purchase',
    name: 'Service Purchase',
    value: 50000,
    category: 'sale',
    funnelStage: FunnelStage.PURCHASE
  }
];

// Conversion funnel tracking
export class ConversionFunnel {
  private static instance: ConversionFunnel;
  private userJourney: FunnelStage[] = [];
  private sessionData: Record<string, any> = {};

  static getInstance(): ConversionFunnel {
    if (!ConversionFunnel.instance) {
      ConversionFunnel.instance = new ConversionFunnel();
    }
    return ConversionFunnel.instance;
  }

  // Track user progression through funnel
  trackStage(stage: FunnelStage, data?: Record<string, any>) {
    this.userJourney.push(stage);
    this.sessionData = { ...this.sessionData, ...data };

    trackFunnelStage(stage, data?.serviceName, {
      journey_position: this.userJourney.length,
      previous_stages: this.userJourney.slice(0, -1),
      session_data: this.sessionData,
      ...data
    });

    // Store in session storage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('conversion_funnel', JSON.stringify({
        journey: this.userJourney,
        data: this.sessionData
      }));
    }
  }

  // Get current funnel position
  getCurrentStage(): FunnelStage | null {
    return this.userJourney[this.userJourney.length - 1] || null;
  }

  // Get funnel completion percentage
  getFunnelProgress(): number {
    const stages = Object.values(FunnelStage);
    const currentIndex = stages.indexOf(this.getCurrentStage() || FunnelStage.AWARENESS);
    return ((currentIndex + 1) / stages.length) * 100;
  }

  // Track conversion goal completion
  trackConversion(goalId: string, additionalData?: Record<string, any>) {
    const goal = CONVERSION_GOALS.find(g => g.id === goalId);
    if (!goal) return;

    // Track the conversion
    trackEvent('conversion_goal', 'Conversions', goal.name, goal.value, {
      goal_id: goalId,
      goal_category: goal.category,
      funnel_stage: goal.funnelStage,
      journey_length: this.userJourney.length,
      ...additionalData
    });

    // Update funnel stage
    this.trackStage(goal.funnelStage, additionalData);

    // Track A/B test conversion if applicable
    Object.keys(this.sessionData).forEach(key => {
      if (key.startsWith('ab_test_')) {
        const testId = key.replace('ab_test_', '');
        abTestManager.trackConversion(testId, goalId, goal.value);
      }
    });
  }

  // Load stored funnel data
  loadStoredData() {
    if (typeof window === 'undefined') return;

    const stored = sessionStorage.getItem('conversion_funnel');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.userJourney = data.journey || [];
        this.sessionData = data.data || {};
      } catch (error) {
        console.warn('Failed to load stored funnel data:', error);
      }
    }
  }

  // Reset funnel (new session)
  reset() {
    this.userJourney = [];
    this.sessionData = {};
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('conversion_funnel');
    }
  }
}

// Form tracking utilities
export class FormTracker {
  private formStartTime: number = 0;
  private fieldInteractions: Record<string, number> = {};
  private formData: Record<string, any> = {};

  startTracking(formId: string, formType: string) {
    this.formStartTime = Date.now();
    this.fieldInteractions = {};
    this.formData = { formId, formType };

    trackLeadEvent(LeadEvent.FORM_START, {
      form_id: formId,
      form_type: formType,
      timestamp: this.formStartTime
    });

    // Track funnel progression
    const funnel = ConversionFunnel.getInstance();
    funnel.trackStage(FunnelStage.INTENT, { form_type: formType });
  }

  trackFieldInteraction(fieldName: string, fieldValue?: any) {
    this.fieldInteractions[fieldName] = (this.fieldInteractions[fieldName] || 0) + 1;
    
    if (fieldValue !== undefined) {
      this.formData[fieldName] = fieldValue;
    }

    // Track form progress every few fields
    const totalFields = Object.keys(this.fieldInteractions).length;
    if (totalFields % 3 === 0) {
      trackLeadEvent(LeadEvent.FORM_PROGRESS, {
        form_id: this.formData.formId,
        form_type: this.formData.formType,
        fields_completed: totalFields,
        time_spent: Date.now() - this.formStartTime
      });
    }
  }

  trackFormCompletion(conversionGoalId: string, additionalData?: Record<string, any>) {
    const completionTime = Date.now() - this.formStartTime;
    const totalFields = Object.keys(this.fieldInteractions).length;

    trackLeadEvent(LeadEvent.FORM_COMPLETE, {
      form_id: this.formData.formId,
      form_type: this.formData.formType,
      completion_time: completionTime,
      fields_completed: totalFields,
      field_interactions: this.fieldInteractions,
      ...additionalData
    });

    // Track conversion goal
    const funnel = ConversionFunnel.getInstance();
    funnel.trackConversion(conversionGoalId, {
      form_completion_time: completionTime,
      form_fields: totalFields,
      ...additionalData
    });
  }

  trackFormAbandonment(reason?: string) {
    const abandonmentTime = Date.now() - this.formStartTime;
    const completedFields = Object.keys(this.fieldInteractions).length;

    trackEvent('form_abandonment', 'Lead Generation', this.formData.formType, abandonmentTime, {
      form_id: this.formData.formId,
      abandonment_reason: reason,
      time_before_abandonment: abandonmentTime,
      fields_completed: completedFields,
      last_field: Object.keys(this.fieldInteractions).pop()
    });
  }
}

// CTA tracking
export function trackCTAClick(
  ctaText: string, 
  ctaLocation: string, 
  targetUrl?: string,
  additionalData?: Record<string, any>
) {
  trackEvent('cta_click', 'CTA Interactions', ctaText, undefined, {
    cta_location: ctaLocation,
    target_url: targetUrl,
    ...additionalData
  });

  // Track service interest if CTA is service-related
  if (additionalData?.serviceName) {
    trackServiceInterest(
      additionalData.serviceName,
      additionalData.serviceCategory || 'General',
      additionalData.estimatedValue
    );
  }
}

// Page engagement tracking
export function trackPageEngagement(pageName: string, engagementData: {
  timeOnPage: number;
  scrollDepth: number;
  interactions: number;
  ctaClicks: number;
}) {
  const engagementScore = calculatePageEngagementScore(engagementData);

  trackEvent('page_engagement', 'Engagement', pageName, engagementScore, {
    time_on_page: engagementData.timeOnPage,
    scroll_depth: engagementData.scrollDepth,
    interactions: engagementData.interactions,
    cta_clicks: engagementData.ctaClicks,
    engagement_score: engagementScore
  });
}

function calculatePageEngagementScore(data: {
  timeOnPage: number;
  scrollDepth: number;
  interactions: number;
  ctaClicks: number;
}): number {
  let score = 0;
  
  // Time on page (max 40 points)
  score += Math.min(40, data.timeOnPage / 1000 / 30); // 1 point per 30 seconds
  
  // Scroll depth (max 30 points)
  score += Math.min(30, data.scrollDepth * 0.3);
  
  // Interactions (max 20 points)
  score += Math.min(20, data.interactions * 2);
  
  // CTA clicks (max 10 points)
  score += Math.min(10, data.ctaClicks * 5);
  
  return Math.round(score);
}

// Attribution tracking
export function trackAttribution() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  
  const attribution = {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
    referrer: referrer,
    landing_page: window.location.pathname,
    timestamp: Date.now()
  };

  // Store attribution data
  sessionStorage.setItem('attribution_data', JSON.stringify(attribution));

  // Track attribution
  trackEvent('attribution', 'Marketing', 'session_start', undefined, attribution);

  return attribution;
}

// Initialize conversion tracking
export function initializeConversionTracking() {
  const funnel = ConversionFunnel.getInstance();
  funnel.loadStoredData();
  
  // Track initial funnel stage
  funnel.trackStage(FunnelStage.AWARENESS);
  
  // Track attribution
  trackAttribution();
}