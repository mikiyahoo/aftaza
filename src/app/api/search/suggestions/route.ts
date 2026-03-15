import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SearchSuggestion } from '@/types/search';
import { CacheManager } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5');

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const cacheKey = `suggestions:${query}:${limit}`;

  try {
    // Check cache
    const cached = await CacheManager.get<SearchSuggestion[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ suggestions: cached });
    }

    // Get property suggestions
    const properties = await prisma.properties.findMany({
      where: {
        status: 'active',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit,
      select: {
        id: true,
        title: true,
        location: true,
        slug: true,
        images: {
          where: { isPrimary: true },
          select: { imageUrl: true },
          take: 1
        }
      }
    });

    // Get location suggestions
    const locations = await prisma.properties.groupBy({
      by: ['location'],
      where: {
        status: 'active',
        location: { contains: query, mode: 'insensitive' }
      },
      _count: true,
      take: limit
    });

    // Format suggestions
    const suggestions: SearchSuggestion[] = [
      // Property suggestions
      ...properties.map(p => ({
        id: `prop-${p.id}`,
        type: 'property' as const,
        text: p.title,
        subtitle: p.location || undefined,
        image: p.images[0]?.imageUrl,
        url: `/properties/${p.slug}`
      })),
      
      // Location suggestions
      ...locations.map(l => ({
        id: `loc-${l.location}`,
        type: 'location' as const,
        text: l.location || '',
        subtitle: `${l._count} properties`,
        url: `/search?location=${encodeURIComponent(l.location || '')}`
      }))
    ];

    // Cache for 5 minutes
    await CacheManager.set(cacheKey, suggestions, 300);

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}