// Form Components Export Index
export { default as MultiStepForm } from './MultiStepForm';
export { default as ConsultationBookingForm } from './ConsultationBookingForm';
export { default as ProjectQuoteForm } from './ProjectQuoteForm';
export { default as ExitIntentPopup } from './ExitIntentPopup';
export { default as ScrollBasedReveal } from './ScrollBasedReveal';
export { default as ResourceDownloadForm } from './ResourceDownloadForm';
export { default as ProgressiveProfilingForm } from './ProgressiveProfilingForm';
export { default as FormProvider, useFormContext } from './FormProvider';

// Types
export type { FormStep, FormField } from './MultiStepForm';

// Utility functions
export { 
  submitFormData, 
  calculateLeadScore, 
  getEmailTemplate,
  defaultIntegrationConfig,
  formIntegrationService 
} from '../../lib/form-integrations';