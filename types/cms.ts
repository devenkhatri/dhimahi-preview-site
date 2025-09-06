// CMS Content Types
export interface CMSConfig {
  backend: {
    name: string;
    repo?: string;
    branch?: string;
    base_url?: string;
    auth_url?: string;
  };
  media_folder: string;
  public_folder: string;
  collections: CMSCollection[];
}

export interface CMSCollection {
  name: string;
  label: string;
  folder?: string;
  create?: boolean;
  slug?: string;
  fields: CMSField[];
  files?: CMSFile[];
}

export interface CMSFile {
  label: string;
  name: string;
  file: string;
  fields: CMSField[];
}

export interface CMSField {
  label: string;
  name: string;
  widget: string;
  default?: any;
  required?: boolean;
  hint?: string;
  pattern?: [string, string];
  options?: string[] | { label: string; value: string }[];
  fields?: CMSField[];
  types?: CMSField[];
  collapsed?: boolean;
  summary?: string;
  minimize_collapsed?: boolean;
}

// Content Types
export interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  content: string;
  slug: string;
  tags?: string[];
  featured?: boolean;
  image?: string;
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  featured_image?: string;
}

export interface SiteSettings {
  site_title: string;
  site_description: string;
  site_url: string;
  logo?: string;
  favicon?: string;
  social_links?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// CMS Event Types
export interface CMSEvent {
  type: 'preSave' | 'postSave' | 'prePublish' | 'postPublish' | 'preUnpublish' | 'postUnpublish';
  entry: {
    get: (field: string) => any;
    getIn: (path: string[]) => any;
  };
}

// CMS Widget Types
export interface CMSWidget {
  name: string;
  controlComponent: React.ComponentType<any>;
  previewComponent?: React.ComponentType<any>;
  schema?: any;
}

// CMS Preview Template Props
export interface PreviewTemplateProps {
  entry: {
    getIn: (path: string[]) => any;
  };
  widgetFor: (name: string) => React.ReactNode;
  widgetsFor: (name: string) => React.ReactNode[];
}