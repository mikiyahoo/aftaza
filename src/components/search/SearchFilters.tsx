'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters as FilterType } from '@/types/search';

interface FilterPanelProps {
  facets?: {
    property_types: Array<{ value: string; count: number }>;
    locations: Array<{ value: string; count: number }>;
  };
  onClose?: () => void;
}

export default function SearchFilters({ facets, onClose }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Filter state
  const [filters, setFilters] = useState<FilterType>({
    property_type: searchParams.getAll('type[]'),
    location: searchParams.get('location') || '',
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
    min_area: searchParams.get('min_area') ? parseFloat(searchParams.get('min_area')!) : undefined,
    max_area: searchParams.get('max_area') ? parseFloat(searchParams.get('max_area')!) : undefined,
    parking: searchParams.get('parking') ? parseInt(searchParams.get('parking')!) : undefined,
    sort_by: (searchParams.get('sort_by') as any) || 'newest'
  });

  // Price range presets
  const pricePresets = [
    { label: 'Under 5M', min: 0, max: 5000000 },
    { label: '5M - 10M', min: 5000000, max: 10000000 },
    { label: '10M - 20M', min: 10000000, max: 20000000 },
    { label: '20M - 50M', min: 20000000, max: 50000000 },
    { label: 'Above 50M', min: 50000000, max: undefined }
  ];

  // Property types from facets
  const propertyTypes = facets?.property_types.map(f => f.value) || [
    'Apartment', 'Villa', 'House', 'Commercial', 'Land'
  ];

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update property types
    params.delete('type[]');
    filters.property_type?.forEach(type => params.append('type[]', type));
    
    // Update other filters
    if (filters.location) params.set('location', filters.location);
    else params.delete('location');
    
    if (filters.min_price) params.set('min_price', filters.min_price.toString());
    else params.delete('min_price');
    
    if (filters.max_price) params.set('max_price', filters.max_price.toString());
    else params.delete('max_price');
    
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    else params.delete('bedrooms');
    
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString());
    else params.delete('bathrooms');
    
    if (filters.min_area) params.set('min_area', filters.min_area.toString());
    else params.delete('min_area');
    
    if (filters.max_area) params.set('max_area', filters.max_area.toString());
    else params.delete('max_area');
    
    if (filters.parking) params.set('parking', filters.parking.toString());
    else params.delete('parking');
    
    params.set('sort_by', filters.sort_by || 'newest');
    params.set('page', '1'); // Reset to first page
    
    router.push(`/search?${params.toString()}`);
    onClose?.();
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      property_type: [],
      location: '',
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      min_area: undefined,
      max_area: undefined,
      parking: undefined,
      sort_by: 'newest'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* Sort by */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sort by</h3>
        <select
          value={filters.sort_by}
          onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          title="Sort by"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="area_asc">Area: Small to Large</option>
          <option value="area_desc">Area: Large to Small</option>
        </select>
      </div>

      {/* Property type */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Property type</h3>
        <div className="space-y-2">
          {propertyTypes.map((type) => {
            const count = facets?.property_types.find(f => f.value === type)?.count;
            return (
              <label key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.property_type?.includes(type)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...(filters.property_type || []), type]
                        : (filters.property_type || []).filter(t => t !== type);
                      setFilters({ ...filters, property_type: newTypes });
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </div>
                {count !== undefined && (
                  <span className="text-xs text-gray-500">({count})</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Price range</h3>
        <div className="space-y-3">
          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setFilters({
                  ...filters,
                  min_price: preset.min,
                  max_price: preset.max
                })}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => setFilters({
                ...filters,
                min_price: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => setFilters({
                ...filters,
                max_price: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setFilters({
                ...filters,
                bedrooms: filters.bedrooms === num ? undefined : num
              })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.bedrooms === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Bathrooms</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setFilters({
                ...filters,
                bathrooms: filters.bathrooms === num ? undefined : num
              })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.bathrooms === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Area range */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Area (m²)</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_area || ''}
            onChange={(e) => setFilters({
              ...filters,
              min_area: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_area || ''}
            onChange={(e) => setFilters({
              ...filters,
              max_area: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Parking */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Parking</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setFilters({
                ...filters,
                parking: filters.parking === num ? undefined : num
              })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.parking === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <button
        onClick={applyFilters}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}