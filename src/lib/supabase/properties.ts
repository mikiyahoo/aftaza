import "server-only";

import { propertySeed } from "@/data/propertySeed";
import { mapRealEstateTypeToPropertyType } from "@/lib/properties/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getDatabaseProperties, getDatabasePropertyBySlug } from "@/lib/properties/server";
import type { PropertyFilters, PropertyRecord, PropertyType } from "@/types/property";

const PROPERTY_TABLE = "properties";
const PROPERTY_IMAGE_BASE = "/property/";

function sortByCreatedAtDesc(properties: PropertyRecord[]) {
  return [...properties].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function normalizeImagePath(value: unknown, fallback: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  const normalized = value.trim();

  if (
    normalized.startsWith("/") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:")
  ) {
    return normalized;
  }

  return `${PROPERTY_IMAGE_BASE}${normalized.replace(/^\.?\/*/, "")}`;
}

function normalizeParking(value: unknown) {
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeType(value: unknown): PropertyType {
  const normalized = typeof value === "string" ? value : "";

  switch (normalized) {
    case "House":
    case "Apartment":
    case "Villa":
    case "Land":
    case "Commercial":
      return normalized;
    default:
      return "Apartment";
  }
}

function normalizeProperty(row: Record<string, unknown>): PropertyRecord {
  const location = String(row.location ?? "");
  const neighborhood = String(row.neighborhood ?? location.split(",")[0]?.trim() ?? "Addis Ababa");
  const city = String(row.city ?? "Addis Ababa");
  const image = normalizeImagePath(row.image ?? row.thumbnail, "/property/property-1.jpg");
  const heroImage = normalizeImagePath(row.hero_image ?? row.heroImage ?? row.image, image);
  const gallery = Array.isArray(row.gallery)
    ? row.gallery.map((item) => normalizeImagePath(item, heroImage))
    : Array.isArray(row.images)
      ? row.images.map((item) => normalizeImagePath(item, heroImage))
      : [];
  const areaSqm = Number(row.area_sqm ?? row.areaSqm ?? row.area ?? 0);

  return {
    id: String(row.id ?? row.slug ?? crypto.randomUUID()),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? row.name ?? "Untitled Property"),
    location,
    neighborhood,
    city,
    type: normalizeType(row.type),
    category:
      row.category === "Residential" || row.category === "Commercial" || row.category === "Apartments"
        ? row.category
        : "Residential",
    price: Number(row.price ?? 0),
    bedrooms: Number(row.bedrooms ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    parking: normalizeParking(row.parking),
    areaSqm,
    areaSqft: Number(row.area_sqft ?? row.areaSqft ?? (areaSqm > 0 ? Math.round(areaSqm * 10.7639) : 0)),
    shortDescription: String(row.short_description ?? row.shortDescription ?? row.description ?? ""),
    description: String(row.description ?? row.short_description ?? row.shortDescription ?? ""),
    image,
    heroImage,
    gallery:
      gallery.length > 0
        ? gallery
        : [heroImage],
    viewTags: Array.isArray(row.view_tags)
      ? row.view_tags
          .map((item) => String(item))
          .filter(Boolean) as PropertyRecord["viewTags"]
      : [],
     status: row.status === "For Sale" || row.status === "For Rent" ? "active" : "inactive",
    trustBadges: Array.isArray(row.trust_badges)
      ? row.trust_badges.map((item) => String(item)) as PropertyRecord["trustBadges"]
      : ["Verified Listing"],
    createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
  };
}

// Normalize property from Prisma database
function normalizeDbProperty(dbProperty: any): PropertyRecord {
  const primaryImage = dbProperty.images?.find((img: any) => img.isPrimary) || dbProperty.images?.[0];
  const gallery = dbProperty.images?.map((img: any) => img.imageUrl) || [];

  return {
    id: dbProperty.id,
    slug: dbProperty.slug,
    title: dbProperty.title,
    location: dbProperty.location,
    neighborhood: dbProperty.location.split(',')[0]?.trim() || 'Addis Ababa',
    city: 'Addis Ababa',
    type: dbProperty.propertyType as PropertyType,
    category: 'Residential',
    price: dbProperty.price,
    bedrooms: dbProperty.bedrooms || 0,
    bathrooms: dbProperty.bathrooms || 0,
    parking: dbProperty.parking || 0,
    areaSqm: dbProperty.area || 0,
    areaSqft: dbProperty.area ? Math.round(dbProperty.area * 10.7639) : 0,
    shortDescription: dbProperty.description?.substring(0, 150) || '',
    description: dbProperty.description || '',
    image: primaryImage?.imageUrl || '/property/property-1.jpg',
    heroImage: primaryImage?.imageUrl || '/property/property-hero.jpg',
    gallery: gallery.length > 0 ? gallery : ['/property/property-hero.jpg'],
    viewTags: [],
     status: dbProperty.status === 'For Sale' || dbProperty.status === 'For Rent' ? 'active' : 'inactive',
    trustBadges: dbProperty.featured ? ['Featured'] : ['Verified Listing'],
    createdAt: dbProperty.createdAt.toISOString(),
    // Company information
    companyId: dbProperty.companyId,
    companyName: dbProperty.company?.name,
  };
}

function matchesFilters(property: PropertyRecord, filters: PropertyFilters) {
  const resolvedType = filters.type || mapRealEstateTypeToPropertyType(filters.realEstateType);

  if (filters.status && property.status !== filters.status) {
    return false;
  }

  if (!filters.status && property.status !== "active") {
    return false;
  }

  if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
    return false;
  }

  if (resolvedType && property.type !== resolvedType) {
    return false;
  }

  if (filters.category && property.category !== filters.category) {
    return false;
  }

  if (typeof filters.minPrice === "number" && property.price < filters.minPrice) {
    return false;
  }

  if (typeof filters.maxPrice === "number" && property.price > filters.maxPrice) {
    return false;
  }

  if (typeof filters.bedrooms === "number") {
    if (filters.bedroomsMode === "gte" && property.bedrooms < filters.bedrooms) {
      return false;
    }

    if (filters.bedroomsMode !== "gte" && property.bedrooms !== filters.bedrooms) {
      return false;
    }
  }

  if (filters.view && !property.viewTags.includes(filters.view)) {
    return false;
  }

  return true;
}

function filterSeedProperties(filters: PropertyFilters, limit?: number, offset: number = 0) {
  const filtered = sortByCreatedAtDesc(propertySeed).filter((property) => matchesFilters(property, filters));
  if (typeof limit === "number") {
    return filtered.slice(offset, offset + limit);
  }
  return filtered.slice(offset);
}

async function querySupabaseProperties(filters: PropertyFilters, limit?: number, offset: number = 0) {
  const client = getSupabaseServerClient();

  if (!client) {
    return null;
  }

  const executeQuery = async (orderColumn: "createdAt" | "created_at") => {
    let query = client.from(PROPERTY_TABLE).select("*");
    const resolvedType = filters.type || mapRealEstateTypeToPropertyType(filters.realEstateType);

    query = query.eq("status", filters.status ?? "active");

    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (resolvedType) {
      query = query.eq("type", resolvedType);
    }

    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    if (typeof filters.minPrice === "number") {
      query = query.gte("price", filters.minPrice);
    }

    if (typeof filters.maxPrice === "number") {
      query = query.lte("price", filters.maxPrice);
    }

    if (typeof filters.bedrooms === "number") {
      query =
        filters.bedroomsMode === "gte"
          ? query.gte("bedrooms", filters.bedrooms)
          : query.eq("bedrooms", filters.bedrooms);
    }

    if (filters.view) {
      query = query.contains("view_tags", [filters.view]);
    }

    query = query.order(orderColumn, { ascending: false });

    if (typeof offset === "number" && typeof limit === "number") {
      query = query.range(offset, offset + limit - 1);
    } else if (typeof limit === "number") {
      query = query.limit(limit);
    }

    return query;
  };

  try {
    let result = await executeQuery("createdAt");

    if (result.error) {
      result = await executeQuery("created_at");
    }

    if (result.error) {
      throw result.error;
    }

    return (result.data ?? []).map((row) => normalizeProperty(row));
  } catch (error) {
    console.error("Property query failed, using local fallback.", error);
    return null;
  }
}

export async function getProperties(filters: PropertyFilters = {}, limit = 24, offset = 0) {
  // First try to fetch from Prisma database
  try {
    const dbProperties = await getDatabaseProperties({
      status: filters.status,
      featured: filters.featured,
      limit,
      offset,
      location: filters.location,
      propertyType: filters.type || mapRealEstateTypeToPropertyType(filters.realEstateType),
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
    });

    if (dbProperties && dbProperties.length > 0) {
      return dbProperties.map(normalizeDbProperty);
    }
  } catch (error) {
    console.log('Prisma fetch failed, trying Supabase...', error);
  }

  // Fallback to Supabase
  const supabaseProperties = await querySupabaseProperties(filters, limit, offset);

  if (supabaseProperties) {
    return supabaseProperties;
  }

  return filterSeedProperties(filters, limit, offset);
}

export async function getFeaturedProperties(limit = 6) {
  // First try Prisma
  try {
    const dbProperties = await getDatabaseProperties({
      featured: true,
      status: 'For Sale',
      limit,
    });

    if (dbProperties && dbProperties.length > 0) {
      return dbProperties.map(normalizeDbProperty);
    }
  } catch (error) {
    console.log('Prisma featured fetch failed, trying Supabase...', error);
  }

  return getProperties({ status: "active" }, limit);
}

export async function getPropertyBySlug(slug: string) {
  // First try Prisma
  try {
    const dbProperty = await getDatabasePropertyBySlug(slug);
    if (dbProperty) {
      return normalizeDbProperty(dbProperty);
    }
  } catch (error) {
    console.log('Prisma property fetch failed, trying Supabase...', error);
  }

  const client = getSupabaseServerClient();

  if (client) {
    try {
      const attempts = await Promise.all([
        client.from(PROPERTY_TABLE).select("*").eq("slug", slug).maybeSingle(),
        client.from(PROPERTY_TABLE).select("*").eq("slug", slug).eq("status", "active").maybeSingle(),
      ]);

      const result = attempts.find((attempt) => !attempt.error && attempt.data);
      if (result?.data) {
        return normalizeProperty(result.data);
      }
    } catch (error) {
      console.error("Property detail query failed, using local fallback.", error);
    }
  }

  return propertySeed.find((property) => property.slug === slug) ?? null;
}

export async function getRelatedProperties(property: PropertyRecord, limit = 3) {
  const related = await getProperties(
    {
      type: property.type,
      status: "active",
    },
    limit + 1
  );

  return related.filter((candidate) => candidate.slug !== property.slug).slice(0, limit);
}
