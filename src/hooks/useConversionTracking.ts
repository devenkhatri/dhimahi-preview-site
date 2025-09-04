'use client';

import { useCallback, useRef } from 'react';
import { FormTracker, ConversionFunnel, trackCTAClick } from '@/lib/conversion-tracking';
import { trackLeadEvent, LeadEvent } from '@/lib/analytics';

export function useFormTracking(formId: string, formType: string) {
  const trackerRef = useRef<FormTracker | null>(null);

  const startTracking = useCallback(() => {
    trackerRef.current = new FormTracker();
    trackerRef.current.startTracking(formId, formType);
  }, [formId, formType]);

  const trackFieldInteraction = useCallback((fieldName: string, fieldValue?: any) => {
    trackerRef.current?.trackFieldInteraction(fieldName, fieldValue);
  }, []);

  const trackCompletion = useCallback((conversionGoalId: string, additionalData?: Record<string, any>) => {
    trackerRef.current?.trackFormCompletion(conversionGoalId, additionalData);
  }, []);

  const trackAbandonment = useCallback((reason?: string) => {
    trackerRef.current?.trackFormAbandonment(reason);
  }, []);

  return {
    startTracking,
    trackFieldInteraction,
    trackCompletion,
    trackAbandonment
  };
}

export function useConversionFunnel() {
  const funnel = ConversionFunnel.getInstance();

  const trackStage = useCallback((stage: any, data?: Record<string, any>) => {
    funnel.trackStage(stage, data);
  }, [funnel]);

  const trackConversion = useCallback((goalId: string, additionalData?: Record<string, any>) => {
    funnel.trackConversion(goalId, additionalData);
  }, [funnel]);

  const getCurrentStage = useCallback(() => {
    return funnel.getCurrentStage();
  }, [funnel]);

  const getFunnelProgress = useCallback(() => {
    return funnel.getFunnelProgress();
  }, [funnel]);

  return {
    trackStage,
    trackConversion,
    getCurrentStage,
    getFunnelProgress
  };
}

export function useCTATracking() {
  const trackClick = useCallback((
    ctaText: string,
    ctaLocation: string,
    targetUrl?: string,
    additionalData?: Record<string, any>
  ) => {
    trackCTAClick(ctaText, ctaLocation, targetUrl, additionalData);
  }, []);

  return { trackClick };
}

export function useLeadTracking() {
  const trackLead = useCallback((event: LeadEvent, additionalData?: Record<string, any>) => {
    trackLeadEvent(event, additionalData);
  }, []);

  const trackPhoneClick = useCallback((phoneNumber: string, location: string) => {
    trackLeadEvent(LeadEvent.PHONE_CLICK, {
      phone_number: phoneNumber,
      click_location: location
    });
  }, []);

  const trackEmailClick = useCallback((emailAddress: string, location: string) => {
    trackLeadEvent(LeadEvent.EMAIL_CLICK, {
      email_address: emailAddress,
      click_location: location
    });
  }, []);



  const trackResourceDownload = useCallback((resourceName: string, resourceType: string) => {
    trackLeadEvent(LeadEvent.RESOURCE_DOWNLOAD, {
      resource_name: resourceName,
      resource_type: resourceType
    });
  }, []);

  return {
    trackLead,
    trackPhoneClick,
    trackEmailClick,
    trackResourceDownload
  };
}