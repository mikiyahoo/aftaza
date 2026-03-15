import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const location = url.searchParams.get('location');
    const priceMin = url.searchParams.get('priceMin');
    const priceMax = url.searchParams.get('priceMax');

    const where: any = {};

    if (status) where.status = status;
    if (type) where.propertyType = type;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (priceMin) where.price = { gte: parseFloat(priceMin) };
    if (priceMax) where.price = { ...where.price, lte: parseFloat(priceMax) };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      properties,
      total,
      pages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug,
        price: data.price,
        location: data.location,
        property_type: data.propertyType,
        status: data.status,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        parking: data.parking,
        area: data.area,
        description: data.description,
        featured: data.featured,
        company_id: data.companyId,
        images: {
          create: data.images.map((img: any) => ({
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary,
          })),
        },
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}