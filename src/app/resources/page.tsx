import { Metadata } from "next";
import ResourceDownloadForm from "@/components/forms/ResourceDownloadForm";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Resources | ${COMPANY_NAME}`,
  description: "Download free business resources including checklists, templates, and guides for digital transformation, AI implementation, and business growth.",
  keywords: ["free resources", "business templates", "digital transformation checklist", "AI implementation guide", "SME resources", "business growth"],
  openGraph: {
    title: `Free Resources | ${COMPANY_NAME}`,
    description: "Download valuable resources to help grow your business with technology and digital solutions.",
    type: "website"
  }
};

const FEATURED_RESOURCES = [
  {
    id: "digital-transformation-checklist",
    title: "Digital Transformation Checklist for SMEs",
    description: "A comprehensive 25-point checklist to modernize your business with AI, automation, and smart IT solutions. Includes implementation timeline and budget guidelines.",
    type: "checklist" as const,
    fileSize: "2.1 MB",
    pages: 12,
    downloadUrl: "/resources/digital-transformation-checklist.pdf"
  },
  {
    id: "ai-implementation-guide",
    title: "AI Implementation Guide for Small Businesses",
    description: "Step-by-step guide to implementing AI solutions in your business. Covers use cases, tool selection, and ROI measurement for SMEs.",
    type: "guide" as const,
    fileSize: "3.5 MB",
    pages: 24,
    downloadUrl: "/resources/ai-implementation-guide.pdf"
  },
  {
    id: "website-redesign-template",
    title: "Website Redesign Planning Template",
    description: "Complete template for planning your website redesign project. Includes content audit, competitor analysis, and project timeline templates.",
    type: "template" as const,
    fileSize: "1.8 MB",
    pages: 16,
    downloadUrl: "/resources/website-redesign-template.pdf"
  },
  {
    id: "digital-marketing-roi-calculator",
    title: "Digital Marketing ROI Calculator",
    description: "Excel template to calculate and track ROI for your digital marketing campaigns. Includes templates for Google Ads, social media, and email marketing.",
    type: "template" as const,
    fileSize: "850 KB",
    pages: 8,
    downloadUrl: "/resources/digital-marketing-roi-calculator.xlsx"
  },
  {
    id: "crm-selection-guide",
    title: "CRM Selection Guide for SMEs",
    description: "Comprehensive guide to choosing the right CRM system for your business. Includes comparison matrix and implementation checklist.",
    type: "guide" as const,
    fileSize: "2.7 MB",
    pages: 20,
    downloadUrl: "/resources/crm-selection-guide.pdf"
  },
  {
    id: "cybersecurity-checklist",
    title: "Cybersecurity Essentials Checklist",
    description: "Essential cybersecurity measures every small business should implement. Includes free tools recommendations and security audit template.",
    type: "checklist" as const,
    fileSize: "1.5 MB",
    pages: 10,
    downloadUrl: "/resources/cybersecurity-checklist.pdf"
  }
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Free Business Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Download valuable templates, checklists, and guides to help grow your business 
            with technology and digital solutions. All resources are free and created by our experts.
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Expert Created
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Instantly Downloadable
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Spam
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Regular Updates
            </div>
          </div>
        </div>

        {/* Featured Resource */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🎯 Most Popular Resource
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {FEATURED_RESOURCES[0].title}
            </h3>
            <p className="text-primary-light mb-6 max-w-2xl mx-auto">
              {FEATURED_RESOURCES[0].description}
            </p>
            <div className="flex justify-center">
              <ResourceDownloadForm 
                resource={FEATURED_RESOURCES[0]}
                className="max-w-sm"
              />
            </div>
          </div>
        </div>

        {/* All Resources Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            All Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_RESOURCES.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-3">
                    {resource.type === 'checklist' && '✅'}
                    {resource.type === 'template' && '📋'}
                    {resource.type === 'guide' && '📖'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                    {resource.fileSize && (
                      <span className="flex items-center">
                        📁 {resource.fileSize}
                      </span>
                    )}
                    {resource.pages && (
                      <span className="flex items-center">
                        📄 {resource.pages} pages
                      </span>
                    )}
                  </div>
                </div>

                <ResourceDownloadForm resource={resource} />
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get New Resources First
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and be the first to access new templates, 
              guides, and business insights. We publish new resources monthly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white font-medium py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              ✓ Monthly resources • ✓ Business tips • ✓ Unsubscribe anytime
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Resource FAQ
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Are these resources really free?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Yes, all our resources are completely free. We believe in providing value upfront 
                and helping SMEs grow with practical, actionable insights.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Will I receive spam emails after downloading?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                No, we hate spam too! You'll only receive valuable business insights and new resource 
                notifications. You can unsubscribe at any time with one click.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I share these resources with my team?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                Absolutely! These resources are meant to be used and shared within your organization. 
                We just ask that you don't redistribute them publicly.
              </p>
            </details>
            <details className="bg-white rounded-xl shadow-soft p-6">
              <summary className="font-semibent text-gray-900 cursor-pointer">
                How often do you add new resources?
              </summary>
              <p className="mt-3 text-gray-600 text-sm">
                We add new resources monthly based on the latest trends and feedback from our clients. 
                Subscribe to our newsletter to get notified of new releases.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}