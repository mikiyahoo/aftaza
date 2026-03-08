export type PropertyType = 'HOUSE' | 'APARTMENT' | 'LAND' | 'VILLA' | 'COMMERCIAL';

export type PropertyStatus = 'FOR_SALE' | 'SOLD' | 'RENTED' | 'PENDING';

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  landSize: number | null;
  description: string | null;
  published: boolean;
  companyId: string | null;
  company?: Company | null;
  images?: PropertyImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyImage {
  id: string;
  url: string;
  position: number;
  propertyId: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFormData {
  title: string;
  slug?: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  landSize?: number;
  description?: string;
  published: boolean;
  companyId?: string;
}

export interface CompanyFormData {
  name: string;
  phone?: string;
  email?: string;
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  companyId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}

// Type labels for UI display
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  LAND: 'Land',
  VILLA: 'Villa',
  COMMERCIAL: 'Commercial',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  FOR_SALE: 'For Sale',
  SOLD: 'Sold',
  RENTED: 'Rented',
  PENDING: 'Pending',
};

// Helper to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
