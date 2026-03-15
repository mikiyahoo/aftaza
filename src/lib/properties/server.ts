import { PrismaClient } from '@prisma/client';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getDatabaseProperties = cache(async (options?: {
  featured?: boolean;
  status?: string; // This should be the normalized status: "active" | "inactive"
  limit?: number;
  offset?: number;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}) => {
  try {
    const { featured, status, limit = 50, offset = 0, location, propertyType, minPrice, maxPrice, bedrooms } = options || {};

    const where: any = {};

    if (featured !== undefined) {
      where.featured = featured;
    }

    // Convert normalized status to database status values
    if (status) {
      if (status === "active") {
        // For active, we want both "For Sale" and "For Rent"
        where.status = {
          in: ["For Sale", "For Rent"]
        };
      } else if (status === "inactive") {
        // For inactive, we want "Sold"
        where.status = "Sold";
      }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (bedrooms !== undefined) {
      where.bedrooms = { gte: bedrooms };
    }

    const properties = await prisma.properties.findMany({
      where,
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
});

export const getDatabasePropertyBySlug = cache(async (slug: string) => {
  try {
    const property = await prisma.properties.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    });

    return property;
  } catch (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
});

export const getDatabaseTestimonials = cache(async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
});

export const getDatabaseFeaturedProperties = cache(async (options?: {
  limit?: number;
  offset?: number;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
}) => {
  try {
    const { limit = 50, offset = 0, location, propertyType, minPrice, maxPrice, bedrooms } = options || {};

    const where: any = {};

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (bedrooms !== undefined) {
      where.bedrooms = { gte: bedrooms };
    }

    // For featured properties, we want both "For Sale" and "For Rent"
    where.status = {
      in: ["For Sale", "For Rent"]
    };
    where.featured = true;

    const properties = await prisma.properties.findMany({
      where,
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });

    return properties;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
});

export const getDatabaseCompanies = cache(async () => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });

    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
});

export const createDatabaseInquiry = async (data: {
  propertyId?: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) => {
  try {
    const inquiry = await prisma.propertyInquiry.create({
      data: {
        propertyId: data.propertyId || null,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message || null,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return inquiry;
  } catch (error) {
    console.error("Error creating inquiry:", error);
    throw error;
  }
};
