'use client';

import { useState } from 'react';
import { Resource } from '@/lib/content';

interface ResourceFiltersProps {
  resources: Resource[];
  onFilterChange: (filteredResources: Resource[]) => void;
  resourceTypes: Resource['type'][];
}

export default function ResourceFilters({ 
  resources, 
  onFilterChange, 
  resourceTypes 
}: ResourceFiltersProps) {
  const [selectedTypes, setSelectedTypes] = useState<Resource['type'][]>([]);
  const [sortBy, setSortBy] = useState<'order' | 'date' | 'title' | 'type'>('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const applyFilters = (
    types: Resource['type'][] = selectedTypes,
    sort: typeof sortBy = sortBy,
    order: typeof sortOrder = sortOrder
  ) => {
    let filtered = [...resources];

    // Filter by types
    if (types.length > 0) {
      filtered = filtered.filter(resource => types.includes(resource.type));
    }

    // Sort resources
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sort) {
        case 'order':
          if (a.order !== b.order) {
            comparison = a.order - b.order;
          } else {
            comparison = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
          }
          break;
          
        case 'date':
          comparison = new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
          break;
          
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
          
        case 'type':
          if (a.type !== b.type) {
            comparison = a.type.localeCompare(b.type);
          } else {
            comparison = a.order - b.order;
          }
          break;
      }
      
      return order === 'desc' ? -comparison : comparison;
    });

    onFilterChange(filtered);
  };

  const handleTypeToggle = (type: Resource['type']) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    applyFilters(newTypes, sortBy, sortOrder);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
    applyFilters(selectedTypes, newSortBy, sortOrder);
  };

  const handleSortOrderChange = (newOrder: typeof sortOrder) => {
    setSortOrder(newOrder);
    applyFilters(selectedTypes, sortBy, newOrder);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSortBy('order');
    setSortOrder('asc');
    applyFilters([], 'order', 'asc');
  };

  const getTypeLabel = (type: Resource['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeCount = (type: Resource['type']) => {
    return resources.filter(r => r.type === type).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Type Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          <div className="flex flex-wrap gap-2">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getTypeLabel(type)} ({getTypeCount(type)})
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="order">Display Order</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
            </select>
            <button
              onClick={() => handleSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedTypes.length > 0 || sortBy !== 'order' || sortOrder !== 'asc') && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary-dark underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing:</span>
            <div className="flex flex-wrap gap-1">
              {selectedTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2 py-1 bg-primary-light text-primary text-xs rounded-md"
                >
                  {getTypeLabel(type)}
                  <button
                    onClick={() => handleTypeToggle(type)}
                    className="ml-1 hover:text-primary-dark"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}