import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PropertyQueries } from '@/lib/queryOptimizer';
import { CacheManager, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { PerformanceMonitor } from '@/lib/performanceLogger';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12');
    const property_type = url.searchParams.get('property_type');
    const location = url.searchParams.get('location');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const bedrooms = url.searchParams.get('bedrooms');
    const featured = url.searchParams.get('featured');

    // Build cache key
    const cacheKey = CACHE_KEYS.PROPERTIES_LIST + `:${page}:${pageSize}:${property_type}:${location}:${minPrice}:${maxPrice}:${bedrooms}:${featured}`;

    // Try to get from cache first
    const cached = await CacheManager.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'X-Cache-Key': cacheKey
        }
      });
    }

    // Build filters
    const filters: any = {};
    if (property_type) filters.property_type = property_type;
    if (location) filters.location = location;
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (featured !== null) filters.featured = featured === 'true';

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    // Use optimized query
    const query = PropertyQueries.list(filters);
    const pagination = PropertyQueries.paginate(page, pageSize);

    // Execute query with performance monitoring
    const [properties, total] = await PerformanceMonitor.measure(
      'properties-list-query',
      async () => {
        const [props, count] = await Promise.all([
          prisma.properties.findMany({
            ...query,
            ...pagination
          }),
          prisma.properties.count({
            where: query.where
          })
        ]);
        return [props, count];
      },
      200
    );

    // Prepare response
    const response = {
      properties,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    };

    // Cache the result
    await CacheManager.set(cacheKey, response, CACHE_TTL.MEDIUM);

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Key': cacheKey,
        'X-Response-Time': 'optimized'
      }
    });

  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create property with optimized query
    const property = await prisma.properties.create({
      data: {
        title: data.title,
        slug: data.slug,
        price: data.price,
        location: data.location,
        property_type: data.property_type,
        status: data.status || 'active',
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parking: data.parking,
        area: data.area,
        description: data.description,
        featured: data.featured || false,
        company_id: data.company_id,
        created_by: data.created_by
      }
    });

    // Invalidate related caches
    await CacheManager.invalidateProperty();

    return NextResponse.json(property, { status: 201 });

  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}