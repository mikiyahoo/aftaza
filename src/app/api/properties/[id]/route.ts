import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/properties/[id] - Get a single property by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Convert string ID to number
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await prisma.properties.findUnique({
      where: { id: numericId },
      include: {
        company: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PUT /api/properties/[id] - Update a property (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = params;
    
    // Convert string ID to number
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }
    
    const body = await request.json();

    const {
      title,
      slug,
      price,
      location,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      parking,
      area,
      description,
      featured,
      companyId,
    } = body;

    // Check if property exists
    const existingProperty = await prisma.properties.findUnique({
      where: { id: numericId },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingProperty.slug) {
      const slugExists = await prisma.properties.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Property with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const property = await prisma.properties.update({
      where: { id: numericId },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(location && { location }),
        ...(propertyType && { property_type: propertyType }),
        ...(status && { status }),
        ...(bedrooms !== undefined && { bedrooms: (bedrooms || bedrooms === 0) ? parseInt(bedrooms) : null }),
        ...(bathrooms !== undefined && { bathrooms: (bathrooms || bathrooms === 0) ? parseInt(bathrooms) : null }),
        ...(parking !== undefined && { parking: (parking || parking === 0) ? parseInt(parking) : null }),
        ...(area !== undefined && { area: (area || area === 0) ? parseFloat(area) : null }),
        ...(description !== undefined && { description }),
        ...(featured !== undefined && { featured }),
        ...(companyId !== undefined && { company_id: companyId || null }),
      },
      include: {
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
        company: true,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE /api/properties/[id] - Delete a property (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { id } = params;
    
    // Convert string ID to number
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    // Check if property exists
    const existingProperty = await prisma.properties.findUnique({
      where: { id: numericId },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Delete property (images will be cascade deleted)
    await prisma.properties.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
