import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SearchFilters, SearchResponse } from '@/types/search';
import { CacheManager, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse filters
  const filters: SearchFilters = {
    query: searchParams.get('q') || undefined,
    property_type: searchParams.getAll('type[]'),
    location: searchParams.get('location') || undefined,
    min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
    max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
    bathrooms: searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined,
    min_area: searchParams.get('min_area') ? parseFloat(searchParams.get('min_area')!) : undefined,
    max_area: searchParams.get('max_area') ? parseFloat(searchParams.get('max_area')!) : undefined,
    parking: searchParams.get('parking') ? parseInt(searchParams.get('parking')!) : undefined,
    status: searchParams.getAll('status[]'),
    featured: searchParams.get('featured') === 'true',
    sort_by: searchParams.get('sort_by') as any || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12')
  };

  // Generate cache key
  const cacheKey = `search:${JSON.stringify(filters)}`;
  
  try {
    // Check cache
    const cached = await CacheManager.get<SearchResponse>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    // Build where clause
    const where: any = { status: 'active' };
    
    // Text search
    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
        { location: { contains: filters.query, mode: 'insensitive' } }
      ];
    }
    
    // Property type filter
    if (filters.property_type?.length) {
      where.property_type = { in: filters.property_type };
    }
    
    // Location filter
    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }
    
    // Price range
    if (filters.min_price || filters.max_price) {
      where.price = {};
      if (filters.min_price) where.price.gte = filters.min_price;
      if (filters.max_price) where.price.lte = filters.max_price;
    }
    
    // Bedrooms
    if (filters.bedrooms) {
      where.bedrooms = filters.bedrooms;
    }
    
    // Bathrooms
    if (filters.bathrooms) {
      where.bathrooms = filters.bathrooms;
    }
    
    // Area range
    if (filters.min_area || filters.max_area) {
      where.area = {};
      if (filters.min_area) where.area.gte = filters.min_area;
      if (filters.max_area) where.area.lte = filters.max_area;
    }
    
    // Parking
    if (filters.parking) {
      where.parking = { gte: filters.parking };
    }
    
    // Status
    if (filters.status?.length) {
      where.status = { in: filters.status };
    }
    
    // Featured
    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    // Sorting
    const orderBy: any = {};
    switch (filters.sort_by) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'oldest':
        orderBy.created_at = 'asc';
        break;
      case 'area_asc':
        orderBy.area = 'asc';
        break;
      case 'area_desc':
        orderBy.area = 'desc';
        break;
      case 'newest':
      default:
        orderBy.created_at = 'desc';
    }

    // Execute main query
    const [properties, total, facets] = await Promise.all([
      prisma.properties.findMany({
        where,
        orderBy,
        skip: ((filters.page || 1) - 1) * (filters.limit || 12),
        take: filters.limit || 12,
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
          parking: true,
          featured: true,
          images: {
            where: { isPrimary: true },
            select: { imageUrl: true },
            take: 1
          }
        }
      }),
      
      // Total count
      prisma.properties.count({ where }),
      
      // Facets for filtering
      prisma.$transaction([
        // Property types facet
        prisma.properties.groupBy({
          by: ['property_type'],
          where,
          _count: true
        }),
        
        // Locations facet
        prisma.properties.groupBy({
          by: ['location'],
          where,
          _count: true
        }),
        
        // Price ranges facet
        prisma.properties.groupBy({
          by: ['price'],
          where,
          _count: true
        })
      ])
    ]);

    const response: SearchResponse = {
      properties,
      total,
      page: filters.page || 1,
      pages: Math.ceil(total / (filters.limit || 12)),
      facets: {
        property_types: facets[0].map(f => ({
          value: f.property_type || 'Unknown',
          count: f._count
        })),
        locations: facets[1].map(f => ({
          value: f.location || 'Unknown',
          count: f._count
        })),
        price_ranges: facets[2].map(f => ({
          min: f.price ?? 0,
          max: f.price ?? 0,
          count: f._count
        }))
      }
    };

    // Cache results
    await CacheManager.set(cacheKey, response, CACHE_TTL.SHORT);

    return NextResponse.json(response, {
      headers: { 'X-Cache': 'MISS' }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}