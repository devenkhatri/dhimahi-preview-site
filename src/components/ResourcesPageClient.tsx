'use client';

import { useState } from 'react';
import ResourceDownloadForm from "@/components/forms/ResourceDownloadForm";
import ResourceFilters from "@/components/ResourceFilters";
import { Resource } from '@/lib/content';

interface ResourcesPageClientProps {
  allResources: Resource[];
  featuredResource: Resource | null;
  resourceTypes: Resource['type'][];
}

export default function ResourcesPageClient({ 
  allResources, 
  featuredResource, 
  resourceTypes 
}: ResourcesPageClientProps) {
  // Get non-featured resources for the grid (exclude the featured resource)
  const otherResources = allResources.filter(resource => 
    !featuredResource || resource.id !== featuredResource.id
  );

  const [filteredResources, setFilteredResources] = useState<Resource[]>(otherResources);

  const handleFilterChange = (filtered: Resource[]) => {
    setFilteredResources(filtered);
  };

  return (
    <>
      {/* Featured Resource */}
      {featuredResource && (
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🎯 Most Popular Resource
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {featuredResource.title}
            </h3>
            <p className="text-primary-light mb-6 max-w-2xl mx-auto">
              {featuredResource.description}
            </p>
            <div className="flex justify-center">
              <ResourceDownloadForm
                resource={featuredResource}
                className="max-w-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* All Resources Grid with Filters */}
      {otherResources.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            All Resources
          </h2>
          
          {/* Resource Filters */}
          {resourceTypes.length > 1 && (
            <ResourceFilters
              resources={otherResources}
              onFilterChange={handleFilterChange}
              resourceTypes={resourceTypes}
            />
          )}
          
          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-soft">
                <ResourceDownloadForm resource={resource} />
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredResources.length === 0 && otherResources.length > 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more resources.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No Resources Fallback */}
      {allResources.length === 0 && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-soft p-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're preparing valuable resources for you. Check back soon for free templates, 
              checklists, and guides to help grow your business.
            </p>
            <a
              href="/consultation"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
            >
              Get Free Consultation Instead
            </a>
          </div>
        </div>
      )}
    </>
  );
}