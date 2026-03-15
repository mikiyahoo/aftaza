export const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Land", "Commercial"] as const;
export const PROPERTY_CATEGORIES = ["Residential", "Commercial", "Apartments"] as const;
export const PROPERTY_VIEWS = ["City View", "Garden View", "Courtyard", "Street Facing"] as const;
export const PROPERTY_BADGES = ["Verified Listing", "Featured", "Expert Pick"] as const;
export const REAL_ESTATE_TYPES = ["Houses", "Apartments", "Commercial", "Land"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];
export type PropertyView = (typeof PROPERTY_VIEWS)[number];
export type PropertyBadge = (typeof PROPERTY_BADGES)[number];
export type RealEstateType = (typeof REAL_ESTATE_TYPES)[number];

export interface PropertyRecord {
  id: string;
  slug: string;
  title: string;
  location: string;
  neighborhood: string;
  city: string;
  type: PropertyType;
  category: PropertyCategory;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  areaSqm: number;
  areaSqft: number;
  shortDescription: string;
  description: string;
  image: string;
  heroImage: string;
  gallery: string[];
  viewTags: PropertyView[];
  status: "active" | "inactive";
  trustBadges: PropertyBadge[];
  createdAt: string;
  // Company information
  companyId?: string;
  companyName?: string;
}

export interface PropertyFilters {
  location?: string;
  type?: PropertyType | "";
  category?: PropertyCategory | "";
  realEstateType?: RealEstateType | "";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bedroomsMode?: "exact" | "gte";
  view?: PropertyView | "";
  status?: "active" | "inactive";
  featured?: boolean;
}

export interface PropertyRouteFilters extends PropertyFilters {
  priceRange?: string;
  selected?: string;
}

export interface PropertyInsightPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string;
  createdAt: string;
}
