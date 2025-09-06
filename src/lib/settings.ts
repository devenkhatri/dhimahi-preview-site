import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

export interface SocialMediaLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface GeneralSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialMedia: SocialMediaLinks;
}

let cachedSettings: GeneralSettings | null = null;

export function getGeneralSettings(): GeneralSettings {
  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const settingsPath = join(process.cwd(), 'content/settings/general.yml');
    const fileContents = readFileSync(settingsPath, 'utf8');
    const settings = yaml.load(fileContents) as GeneralSettings;
    
    cachedSettings = settings;
    return settings;
  } catch (error) {
    console.error('Error loading general settings:', error);
    // Return default settings if file can't be loaded
    return {
      siteTitle: "Dhīmahi Technolabs",
      siteDescription: "Transform your SME with AI automation, digital marketing, and smart IT strategy.",
      contactEmail: "hello@dhimahitechnolabs.com",
      phone: "",
      address: "Dhīmahi Technolabs\nGandhinagar, Gujarat, India",
      socialMedia: {
        linkedin: "https://linkedin.com/company/dhimahi-technolabs",
        twitter: "https://twitter.com/dhimahitech",
        facebook: "https://www.facebook.com/dhimahi.technolabs",
        instagram: "https://instagram.com/dhimahitechnolabs",
        youtube: "https://youtube.com/@dhimahitechnolabs"
      }
    };
  }
}