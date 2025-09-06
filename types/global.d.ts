// Global type declarations for Decap CMS
declare module 'decap-cms-app' {
  export interface CMS {
    init: (config?: any) => void;
    registerWidget: (name: string, widget: any) => void;
    registerPreviewTemplate: (name: string, component: React.ComponentType<any>) => void;
    registerPreviewStyle: (file: string) => void;
    registerEventListener: (event: string, handler: (event: any) => void) => void;
    getWidget: (name: string) => any;
    resolveWidget: (name: string) => any;
  }

  const CMS: CMS;
  export default CMS;
}

declare module 'decap-cms-core' {
  export * from 'decap-cms-app';
}

// Extend the global Window interface for CMS
declare global {
  interface Window {
    CMS: any;
    netlifyIdentity: any;
  }
}

export {};