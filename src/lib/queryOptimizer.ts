import { Prisma } from '@prisma/client';

// Type-safe query builders with optimized includes
export const PropertyQueries = {
  // List view - minimal data for cards
  list: (filters: any = {}) => ({
    where: {
      status: 'active',
      ...filters
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      location: true,
      property_type: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      featured: true,
      company: {
        select: {
          id: true,
          name: true
        }
      },
      images: {
        where: { isPrimary: true },
        select: {
          imageUrl: true,
          isPrimary: true
        },
        take: 1
      }
    },
    orderBy: { created_at: 'desc' as const }
  }),

  // Detail view - full data with relations
  detail: (id: number) => ({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true
        }
      },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          imageUrl: true,
          isPrimary: true,
          sortOrder: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  }),

  // Search query with full-text
  search: (query: string, filters: any = {}) => ({
    where: {
      status: 'active',
      ...filters,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      location: true,
      property_type: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      images: {
        where: { isPrimary: true },
        select: { imageUrl: true },
        take: 1
      }
    },
    orderBy: [
      { featured: 'desc' },
      { created_at: 'desc' }
    ]
  }),

  // Filter query with multiple conditions
  filter: (params: {
    property_type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    featured?: boolean;
  }) => {
    const where: any = { status: 'active' };
    
    if (params.property_type) where.property_type = params.property_type;
    if (params.location) where.location = params.location;
    if (params.bedrooms) where.bedrooms = params.bedrooms;
    if (params.featured !== undefined) where.featured = params.featured;
    
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) where.price.gte = params.minPrice;
      if (params.maxPrice) where.price.lte = params.maxPrice;
    }

    return {
      where,
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        property_type: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        images: {
          where: { isPrimary: true },
          select: { imageUrl: true },
          take: 1
        }
      },
      orderBy: { created_at: 'desc' }
    };
  },

  // Pagination helper
  paginate: (page: number = 1, pageSize: number = 12) => ({
    skip: (page - 1) * pageSize,
    take: pageSize
  })
};

export const CompanyQueries = {
  // List companies with property counts
  listWithStats: () => ({
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      _count: {
        select: {
          properties: {
            where: { status: 'active' }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  }),

  // Get company with properties
  withProperties: (companyId: string) => ({
    where: { id: companyId },
    include: {
      properties: {
        where: { status: 'active' },
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
          property_type: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          images: {
            where: { isPrimary: true },
            select: { imageUrl: true },
            take: 1
          }
        },
        orderBy: { created_at: 'desc' }
      }
    }
  })
};

export const TestimonialQueries = {
  // Get featured testimonials
  featured: () => ({
    where: {
      // Assuming we have a way to mark featured testimonials
      // For now, just get recent ones
    },
    orderBy: { createdAt: 'desc' },
    take: 6
  })
};

export const InquiryQueries = {
  // Get inquiries for a property
  forProperty: (propertyId: number) => ({
    where: { propertyId },
    orderBy: { createdAt: 'desc' }
  }),

  // Get recent inquiries
  recent: (limit: number = 10) => ({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      property: {
        select: {
          id: true,
          title: true,
          location: true
        }
      }
    }
  })
};

// Utility functions for query optimization
export const QueryUtils = {
  // Build WHERE clause for property filters
  buildPropertyFilters: (filters: {
    property_type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    featured?: boolean;
    company_id?: string;
  }) => {
    const where: any = { status: 'active' };
    
    if (filters.property_type) where.property_type = filters.property_type;
    if (filters.location) where.location = filters.location;
    if (filters.bedrooms) where.bedrooms = filters.bedrooms;
    if (filters.bathrooms) where.bathrooms = filters.bathrooms;
    if (filters.featured !== undefined) where.featured = filters.featured;
    if (filters.company_id) where.company_id = filters.company_id;
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    return where;
  },

  // Build ORDER BY clause
  buildOrderBy: (sort: string = 'created_at', order: 'asc' | 'desc' = 'desc') => {
    const orderBy: any = {};
    orderBy[sort] = order;
    return orderBy;
  },

  // Safe pagination
  paginate: (page: number, pageSize: number) => {
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, Math.min(100, pageSize)); // Limit max page size
    
    return {
      skip: (safePage - 1) * safePageSize,
      take: safePageSize
    };
  },

  // Count helper
  count: (model: string, where: any = {}) => ({
    where,
    _count: true
  })
};