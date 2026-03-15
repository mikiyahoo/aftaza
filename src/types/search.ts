export interface SearchFilters {
  // Basic filters
  query?: string;
  property_type?: string[];
  location?: string;
  
  // Price range
  min_price?: number;
  max_price?: number;
  
  // Property details
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  parking?: number;
  
  // Status & features
  status?: string[];
  featured?: boolean;
  
  // Sorting
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'area_asc' | 'area_desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  id: string;
  type: 'property' | 'location' | 'recent';
  text: string;
  subtitle?: string;
  image?: string;
  url?: string;
}

export interface SearchResponse {
  properties: any[];
  total: number;
  page: number;
  pages: number;
  facets?: {
    property_types: Array<{ value: string; count: number }>;
    locations: Array<{ value: string; count: number }>;
    price_ranges: Array<{ min: number; max: number; count: number }>;
  };
}