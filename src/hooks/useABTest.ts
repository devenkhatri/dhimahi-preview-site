'use client';

import { useState, useEffect } from 'react';
import { abTestManager, ABTestVariant } from '@/lib/analytics';

export function useABTest(testId: string): ABTestVariant | null {
  const [variant, setVariant] = useState<ABTestVariant | null>(null);

  useEffect(() => {
    const selectedVariant = abTestManager.getVariant(testId);
    setVariant(selectedVariant);
  }, [testId]);

  return variant;
}

export function useABTestConfig<T = any>(testId: string, defaultConfig: T): T {
  const variant = useABTest(testId);
  return variant?.config as T || defaultConfig;
}