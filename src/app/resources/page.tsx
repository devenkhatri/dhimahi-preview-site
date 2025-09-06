import { Metadata } from "next";
import { COMPANY_NAME } from "@/lib/constants";
import { getAllResources, getFeaturedResource, getResourceTypes } from "@/lib/content";
import ResourcesPageClient from "@/components/ResourcesPageClient";

export const metadata: Metadata = {
  title: `Free Resources | ${COMPANY_NAME}`,
  description: "Download free business resources including checklists, templates, and guides for digital transformation, AI implementation, and business growth.",
  keywords: ["free resources", "business templates", "digital transformation checklist", "AI implementation guide", "business automation roadmap", "SME resources", "business growth"],
  openGraph: {
    title: `Free Resources | ${COMPANY_NAME}`,
    description: "Download valuable resources to help grow your business with technology and digital solutions.",
    type: "website"
  }
};

export default function ResourcesPage() {
  // Load resources dynamically from CMS
  const allResources = getAllResources();
  const featuredResource = getFeaturedResource();
  const resourceTypes = getResourceTypes();
  
  // Get non-featured resources for the grid (exclude the featured resource)
  const otherResources = allResources.filter(resource => 
    !featuredResource || resource.id !== featuredResource.id
  );

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

        {/* Client-side Resources Component */}
        <ResourcesPageClient
          allResources={allResources}
          featuredResource={featuredResource}
          resourceTypes={resourceTypes}
        />



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
                Check back regularly or follow us on social media for updates.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}