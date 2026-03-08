import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Property, PropertyType } from "@/types/property";

export const PROPERTY_CARD_SHADOW = "0 20px 40px rgba(0,0,0,0.08)";

export type PropertySearchFilters = {
  search?: string;
  location?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  limit?: number;
};

const PROPERTY_FALLBACK_IMAGES = [
  "/property/property-1.jpg",
  "/property/property-2.jpg",
  "/property/property-3.jpg",
  "/property/luxury-house-image.jpg",
];

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "fallback-serenity-heights",
    title: "Serenity Heights Apartment",
    slug: "serenity-heights-apartment",
    type: "APARTMENT",
    status: "FOR_SALE",
    price: 12500000,
    location: "Bole, Addis Ababa",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    landSize: 145,
    description:
      "A modern apartment with generous natural light, efficient circulation, and a layout optimized for diaspora and local family buyers.",
    published: true,
    companyId: null,
    createdAt: new Date("2026-03-01T09:00:00.000Z"),
    updatedAt: new Date("2026-03-01T09:00:00.000Z"),
    images: [
      {
        id: "fallback-serenity-heights-image",
        url: "/property/property-1.jpg",
        position: 0,
        propertyId: "fallback-serenity-heights",
        createdAt: new Date("2026-03-01T09:00:00.000Z"),
      },
    ],
  },
  {
    id: "fallback-kazanchis-villa",
    title: "Kazanchis Family Villa",
    slug: "kazanchis-family-villa",
    type: "VILLA",
    status: "FOR_SALE",
    price: 35000000,
    location: "Kazanchis, Addis Ababa",
    bedrooms: 5,
    bathrooms: 4,
    parking: 2,
    landSize: 420,
    description:
      "A large freehold villa configured for executive families, with a private compound and premium access to the city core.",
    published: true,
    companyId: null,
    createdAt: new Date("2026-02-26T11:00:00.000Z"),
    updatedAt: new Date("2026-02-26T11:00:00.000Z"),
    images: [
      {
        id: "fallback-kazanchis-villa-image",
        url: "/property/property-2.jpg",
        position: 0,
        propertyId: "fallback-kazanchis-villa",
        createdAt: new Date("2026-02-26T11:00:00.000Z"),
      },
    ],
  },
  {
    id: "fallback-cmc-commercial",
    title: "CMC Commercial Building",
    slug: "cmc-commercial-building",
    type: "COMMERCIAL",
    status: "FOR_SALE",
    price: 150000000,
    location: "CMC, Addis Ababa",
    bedrooms: null,
    bathrooms: null,
    parking: 10,
    landSize: 2500,
    description:
      "A commercial asset positioned for retail, office, and mixed-use occupancy with strong frontage and parking supply.",
    published: true,
    companyId: null,
    createdAt: new Date("2026-02-18T08:30:00.000Z"),
    updatedAt: new Date("2026-02-18T08:30:00.000Z"),
    images: [
      {
        id: "fallback-cmc-commercial-image",
        url: "/property/property-3.jpg",
        position: 0,
        propertyId: "fallback-cmc-commercial",
        createdAt: new Date("2026-02-18T08:30:00.000Z"),
      },
    ],
  },
];

function buildPropertyWhere(filters: PropertySearchFilters = {}): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    published: true,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};

    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters.bedrooms !== undefined) {
    where.bedrooms =
      filters.bedrooms >= 4
        ? { gte: filters.bedrooms }
        : { equals: filters.bedrooms };
  }

  return where;
}

function toNumber(value?: string | string[]) {
  if (!value || Array.isArray(value)) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parsePropertySearchFilters(
  searchParams?: Record<string, string | string[] | undefined>
): PropertySearchFilters {
  const search = typeof searchParams?.search === "string" ? searchParams.search.trim() : undefined;
  const location = typeof searchParams?.location === "string" ? searchParams.location.trim() : undefined;
  const type = typeof searchParams?.type === "string" ? (searchParams.type as PropertyType) : undefined;

  return {
    search: search || undefined,
    location: location || undefined,
    type,
    minPrice: toNumber(searchParams?.minPrice),
    maxPrice: toNumber(searchParams?.maxPrice),
    bedrooms: toNumber(searchParams?.bedrooms),
  };
}

export function getPropertyImageUrl(url?: string | null, index = 0) {
  if (url && url.trim().length > 0) {
    return url;
  }

  return PROPERTY_FALLBACK_IMAGES[index % PROPERTY_FALLBACK_IMAGES.length];
}

export async function getProperties(filters: PropertySearchFilters = {}) {
  try {
    const properties = await prisma.property.findMany({
      where: buildPropertyWhere(filters),
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: filters.limit ?? 24,
    });

    if (properties.length > 0) {
      return properties as unknown as Property[];
    }
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }

  return FALLBACK_PROPERTIES.slice(0, filters.limit ?? FALLBACK_PROPERTIES.length);
}

export async function getFeaturedProperties(limit = 6) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        published: true,
        status: "FOR_SALE",
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (properties.length > 0) {
      return properties as unknown as Property[];
    }
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
  }

  return FALLBACK_PROPERTIES.slice(0, limit);
}

export async function getPropertyFilterOptions() {
  try {
    const properties = await prisma.property.findMany({
      where: { published: true },
      select: {
        location: true,
        type: true,
      },
    });

    return {
      locations: Array.from(new Set(properties.map((property) => property.location))).sort(),
      types: Array.from(new Set(properties.map((property) => property.type))),
    };
  } catch (error) {
    console.error("Failed to fetch property filter options:", error);
  }

  return {
    locations: Array.from(new Set(FALLBACK_PROPERTIES.map((property) => property.location))).sort(),
    types: Array.from(new Set(FALLBACK_PROPERTIES.map((property) => property.type))),
  };
}

export async function getPropertyBySlug(slug: string) {
  try {
    const property = await prisma.property.findFirst({
      where: {
        slug,
        published: true,
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (property) {
      return property as unknown as Property;
    }
  } catch (error) {
    console.error("Failed to fetch property by slug:", error);
  }

  return FALLBACK_PROPERTIES.find((property) => property.slug === slug) ?? null;
}
