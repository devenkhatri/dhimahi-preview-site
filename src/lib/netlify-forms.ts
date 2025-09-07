/**
 * Utility functions for handling Netlify forms in static sites
 */

export interface NetlifyFormSubmission {
  formName: string;
  data: Record<string, any>;
  honeypot?: string;
}

/**
 * Submit form data to Netlify forms for static sites
 * @param submission - Form submission data
 * @returns Promise that resolves when form is submitted
 */
export async function submitToNetlify({ 
  formName, 
  data, 
  honeypot = '' 
}: NetlifyFormSubmission): Promise<void> {
  // Create form data
  const formData = new FormData();
  
  // Add form name (required by Netlify)
  formData.append('form-name', formName);
  
  // Add honeypot field for spam protection
  formData.append('bot-field', honeypot);
  
  // Add all form fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      formData.append(key, stringValue);
    }
  });

  // Submit to Netlify
  const response = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData as any).toString()
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Form submission failed: ${response.status} ${response.statusText}. ${errorText}`);
  }
}

/**
 * Submit resource download form
 */
export async function submitResourceDownload(data: {
  name: string;
  email: string;
  company?: string;
  companySize?: string;
  interest?: string;
  resourceId: string;
  resourceTitle: string;
}): Promise<void> {
  return submitToNetlify({
    formName: 'resource-download',
    data: {
      ...data,
      formType: 'resource-download',
      submittedAt: new Date().toISOString()
    }
  });
}

/**
 * Submit consultation booking form
 */
export async function submitConsultationBooking(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  companySize: string;
  location: string;
  website?: string;
  consultationType: string;
  challenges: string;
  urgency: string;
  budget?: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate?: string;
  alternativeTime?: string;
  meetingPreference: string;
  additionalNotes?: string;
}): Promise<void> {
  return submitToNetlify({
    formName: 'consultation-booking',
    data: {
      ...data,
      formType: 'consultation-booking',
      submittedAt: new Date().toISOString()
    }
  });
}

/**
 * Submit contact form
 */
export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}): Promise<void> {
  return submitToNetlify({
    formName: 'contact',
    data: {
      ...data,
      formType: 'contact',
      submittedAt: new Date().toISOString()
    }
  });
}

/**
 * Submit project quote form
 */
export async function submitProjectQuote(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
}): Promise<void> {
  return submitToNetlify({
    formName: 'project-quote',
    data: {
      ...data,
      formType: 'project-quote',
      submittedAt: new Date().toISOString()
    }
  });
}