import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if id is a slug or UUID
    const property = await prisma.property.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        company: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      title,
      slug,
      type,
      status,
      price,
      location,
      bedrooms,
      bathrooms,
      parking,
      landSize,
      description,
      published,
      companyId,
    } = body;

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== existingProperty.slug) {
      const slugExists = await prisma.property.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A property with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(type && { type }),
        ...(status && { status }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(location && { location }),
        ...(bedrooms !== undefined && { bedrooms: bedrooms ? parseInt(bedrooms) : null }),
        ...(bathrooms !== undefined && { bathrooms: bathrooms ? parseInt(bathrooms) : null }),
        ...(parking !== undefined && { parking: parking ? parseInt(parking) : null }),
        ...(landSize !== undefined && { landSize: landSize ? parseFloat(landSize) : null }),
        ...(description !== undefined && { description }),
        ...(published !== undefined && { published }),
        ...(companyId !== undefined && { companyId: companyId || null }),
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        company: true,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete property (images will be cascade deleted)
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
