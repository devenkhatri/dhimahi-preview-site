'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import { MEDIA_FOLDERS, generateAltTextSuggestion, validateImageFile } from '@/lib/media-optimization';

interface MediaItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  filename: string;
  size: number;
  uploadDate: string;
  dimensions?: { width: number; height: number };
}

interface MediaBrowserProps {
  onSelect: (media: MediaItem) => void;
  selectedCategory?: string;
  allowMultiple?: boolean;
  maxSelection?: number;
}

export default function MediaBrowser({
  onSelect,
  selectedCategory,
  allowMultiple = false,
  maxSelection = 10
}: MediaBrowserProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Load media items (in a real implementation, this would fetch from the CMS)
  useEffect(() => {
    loadMediaItems();
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    let filtered = mediaItems;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.filename.toLowerCase().includes(term) ||
        item.alt.toLowerCase().includes(term) ||
        item.caption?.toLowerCase().includes(term)
      );
    }

    setFilteredItems(filtered);
  }, [mediaItems, activeCategory, searchTerm]);

  const loadMediaItems = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from the CMS API
      // For now, we'll simulate loading existing media
      const mockItems: MediaItem[] = [
        {
          id: '1',
          src: '/case-studies/healthcare-website-home.jpg',
          alt: 'Healthcare clinic website homepage design',
          category: 'case-studies',
          filename: 'healthcare-website-home.jpg',
          size: 245760,
          uploadDate: '2024-01-15',
          dimensions: { width: 1200, height: 800 }
        },
        {
          id: '2',
          src: '/case-studies/restaurant-analytics.jpg',
          alt: 'Restaurant analytics dashboard showing performance metrics',
          category: 'case-studies',
          filename: 'restaurant-analytics.jpg',
          size: 189440,
          uploadDate: '2024-01-10',
          dimensions: { width: 1200, height: 800 }
        }
      ];
      setMediaItems(mockItems);
    } catch (error) {
      console.error('Failed to load media items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    Array.from(files).forEach(file => {
      const validation = validateImageFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    setUploadProgress(0);

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const progress = ((i + 1) / validFiles.length) * 100;
        setUploadProgress(progress);

        // In a real implementation, this would upload to the CMS
        await simulateUpload(file);
      }

      // Reload media items after upload
      await loadMediaItems();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadProgress(null);
    }
  };

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(resolve, 1000); // Simulate upload delay
    });
  };

  const handleItemSelect = (item: MediaItem) => {
    if (allowMultiple) {
      if (selectedItems.find(selected => selected.id === item.id)) {
        setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      } else if (selectedItems.length < maxSelection) {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      onSelect(item);
    }
  };

  const handleConfirmSelection = () => {
    if (allowMultiple && selectedItems.length > 0) {
      selectedItems.forEach(item => onSelect(item));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="media-browser bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Library</h2>
        
        {/* Search and Upload */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              Upload Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({mediaItems.length})
          </button>
          {Object.entries(MEDIA_FOLDERS).map(([key, folder]) => {
            const count = mediaItems.filter(item => item.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading media...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No media files found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedItems.find(selected => selected.id === item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-square relative">
                  <OptimizedImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                  
                  {/* Selection indicator */}
                  {allowMultiple && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* File info */}
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {formatFileSize(item.size)}
                    </span>
                    {item.dimensions && (
                      <span className="text-xs text-gray-500">
                        {item.dimensions.width}×{item.dimensions.height}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selection Actions */}
      {allowMultiple && selectedItems.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">
            {selectedItems.length} file{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedItems([])}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleConfirmSelection}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use Selected Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}