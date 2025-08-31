// Form integration utilities for CRM and email systems

export interface FormSubmission {
  formType: string;
  submittedAt: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  [key: string]: any;
}

export interface IntegrationConfig {
  netlify?: {
    enabled: boolean;
    formName: string;
  };
  hubspot?: {
    enabled: boolean;
    portalId: string;
    formId: string;
    apiKey?: string;
  };
  mailchimp?: {
    enabled: boolean;
    apiKey: string;
    listId: string;
    serverPrefix: string;
  };
  zapier?: {
    enabled: boolean;
    webhookUrl: string;
  };
  webhook?: {
    enabled: boolean;
    url: string;
    headers?: Record<string, string>;
  };
}

class FormIntegrationService {
  private config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  async submitForm(data: FormSubmission): Promise<void> {
    const promises: Promise<any>[] = [];

    // Netlify Forms (default)
    if (this.config.netlify?.enabled) {
      promises.push(this.submitToNetlify(data));
    }

    // HubSpot
    if (this.config.hubspot?.enabled) {
      promises.push(this.submitToHubSpot(data));
    }

    // Mailchimp
    if (this.config.mailchimp?.enabled) {
      promises.push(this.submitToMailchimp(data));
    }

    // Zapier
    if (this.config.zapier?.enabled) {
      promises.push(this.submitToZapier(data));
    }

    // Custom Webhook
    if (this.config.webhook?.enabled) {
      promises.push(this.submitToWebhook(data));
    }

    // Execute all integrations in parallel
    const results = await Promise.allSettled(promises);
    
    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Form integration ${index} failed:`, result.reason);
      }
    });

    // If all integrations fail, throw an error
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    if (successCount === 0 && promises.length > 0) {
      throw new Error('All form integrations failed');
    }
  }

  private async submitToNetlify(data: FormSubmission): Promise<void> {
    const formName = this.config.netlify?.formName || data.formType;
    
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        'form-name': formName,
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(',') : String(value || '')
          ])
        )
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`Netlify form submission failed: ${response.statusText}`);
    }
  }

  private async submitToHubSpot(data: FormSubmission): Promise<void> {
    if (!this.config.hubspot?.portalId || !this.config.hubspot?.formId) {
      throw new Error('HubSpot configuration missing');
    }

    const { portalId, formId } = this.config.hubspot;
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    // Map form data to HubSpot format
    const hubspotData = {
      fields: Object.entries(data)
        .filter(([key]) => key !== 'formType' && key !== 'submittedAt')
        .map(([name, value]) => ({
          name,
          value: Array.isArray(value) ? value.join(';') : String(value || '')
        })),
      context: {
        pageUri: typeof window !== 'undefined' ? window.location.href : '',
        pageName: typeof document !== 'undefined' ? document.title : ''
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData)
    });

    if (!response.ok) {
      throw new Error(`HubSpot submission failed: ${response.statusText}`);
    }
  }

  private async submitToMailchimp(data: FormSubmission): Promise<void> {
    if (!this.config.mailchimp?.apiKey || !this.config.mailchimp?.listId) {
      throw new Error('Mailchimp configuration missing');
    }

    const { apiKey, listId, serverPrefix } = this.config.mailchimp;
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;

    const mailchimpData = {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.name?.split(' ')[0] || '',
        LNAME: data.name?.split(' ').slice(1).join(' ') || '',
        COMPANY: data.company || '',
        PHONE: data.phone || ''
      },
      tags: [data.formType]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`
      },
      body: JSON.stringify(mailchimpData)
    });

    if (!response.ok && response.status !== 400) { // 400 might be duplicate email
      throw new Error(`Mailchimp submission failed: ${response.statusText}`);
    }
  }

  private async submitToZapier(data: FormSubmission): Promise<void> {
    if (!this.config.zapier?.webhookUrl) {
      throw new Error('Zapier webhook URL missing');
    }

    const response = await fetch(this.config.zapier.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.statusText}`);
    }
  }

  private async submitToWebhook(data: FormSubmission): Promise<void> {
    if (!this.config.webhook?.url) {
      throw new Error('Webhook URL missing');
    }

    const response = await fetch(this.config.webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.webhook.headers
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Webhook submission failed: ${response.statusText}`);
    }
  }
}

// Default configuration - can be overridden via environment variables
export const defaultIntegrationConfig: IntegrationConfig = {
  netlify: {
    enabled: true,
    formName: 'contact' // Default form name
  },
  hubspot: {
    enabled: false,
    portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '',
    formId: process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || '',
    apiKey: process.env.HUBSPOT_API_KEY
  },
  mailchimp: {
    enabled: false,
    apiKey: process.env.MAILCHIMP_API_KEY || '',
    listId: process.env.MAILCHIMP_LIST_ID || '',
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1'
  },
  zapier: {
    enabled: false,
    webhookUrl: process.env.ZAPIER_WEBHOOK_URL || ''
  },
  webhook: {
    enabled: false,
    url: process.env.CUSTOM_WEBHOOK_URL || '',
    headers: {
      'Authorization': `Bearer ${process.env.WEBHOOK_AUTH_TOKEN || ''}`
    }
  }
};

// Create default service instance
export const formIntegrationService = new FormIntegrationService(defaultIntegrationConfig);

// Utility function for easy form submission
export async function submitFormData(data: FormSubmission): Promise<void> {
  return formIntegrationService.submitForm(data);
}

// Lead scoring utility
export function calculateLeadScore(data: FormSubmission): number {
  let score = 0;

  // Base score for any form submission
  score += 10;

  // Form type scoring
  switch (data.formType) {
    case 'consultation-booking':
      score += 50;
      break;
    case 'project-quote':
      score += 40;
      break;
    case 'resource-download':
      score += 20;
      break;
    case 'exit-intent-popup':
      score += 15;
      break;
    case 'scroll-based-reveal':
      score += 10;
      break;
  }

  // Company information scoring
  if (data.company) score += 10;
  if (data.phone) score += 15;

  // Budget information scoring
  if (data.budget) {
    switch (data.budget) {
      case '10l+':
      case '25l+':
        score += 30;
        break;
      case '5l-10l':
      case '10l-25l':
        score += 20;
        break;
      case '3l-5l':
        score += 15;
        break;
      default:
        score += 10;
    }
  }

  // Urgency scoring
  if (data.urgency) {
    switch (data.urgency) {
      case 'immediate':
        score += 25;
        break;
      case 'soon':
        score += 20;
        break;
      case 'planning':
        score += 15;
        break;
      default:
        score += 5;
    }
  }

  // Company size scoring
  if (data.companySize) {
    switch (data.companySize) {
      case '200+':
        score += 25;
        break;
      case '51-200':
        score += 20;
        break;
      case '11-50':
        score += 15;
        break;
      default:
        score += 10;
    }
  }

  return Math.min(score, 100); // Cap at 100
}

// Email template utility
export function getEmailTemplate(formType: string, data: FormSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const leadScore = calculateLeadScore(data);
  const priority = leadScore >= 70 ? 'HIGH' : leadScore >= 40 ? 'MEDIUM' : 'LOW';

  switch (formType) {
    case 'consultation-booking':
      return {
        subject: `[${priority}] New Consultation Booking - ${data.name}`,
        html: `
          <h2>New Consultation Booking</h2>
          <p><strong>Lead Score:</strong> ${leadScore}/100 (${priority} Priority)</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Consultation Type:</strong> ${data.consultationType}</p>
          <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
          <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
          <p><strong>Challenges:</strong> ${data.challenges}</p>
        `,
        text: `New Consultation Booking\nLead Score: ${leadScore}/100\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}`
      };

    case 'project-quote':
      return {
        subject: `[${priority}] New Project Quote Request - ${data.company}`,
        html: `
          <h2>New Project Quote Request</h2>
          <p><strong>Lead Score:</strong> ${leadScore}/100 (${priority} Priority)</p>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Project Type:</strong> ${data.projectType}</p>
          <p><strong>Budget:</strong> ${data.budget}</p>
          <p><strong>Timeline:</strong> ${data.timeline}</p>
          <p><strong>Description:</strong> ${data.projectDescription}</p>
        `,
        text: `New Project Quote Request\nLead Score: ${leadScore}/100\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nProject: ${data.projectType}`
      };

    default:
      return {
        subject: `[${priority}] New Form Submission - ${formType}`,
        html: `
          <h2>New Form Submission</h2>
          <p><strong>Form Type:</strong> ${formType}</p>
          <p><strong>Lead Score:</strong> ${leadScore}/100 (${priority} Priority)</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
          <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        `,
        text: `New Form Submission\nForm Type: ${formType}\nLead Score: ${leadScore}/100\nEmail: ${data.email}`
      };
  }
}