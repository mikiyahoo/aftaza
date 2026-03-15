import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/properties/[id]/images - Get all images for a property (public - for displaying property)
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

    const images = await prisma.propertyImage.findMany({
      where: { propertyId: numericId },
      orderBy: [
        { isPrimary: 'desc' },
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST /api/properties/[id]/images - Add images to a property (admin only)
export async function POST(
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
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Images array is required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await prisma.properties.findUnique({
      where: { id: numericId },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get current max sort order
    const lastImage = await prisma.propertyImage.findFirst({
      where: { propertyId: numericId },
      orderBy: { sortOrder: 'desc' },
    });

    const startOrder = lastImage ? lastImage.sortOrder + 1 : 0;

    // Create images
    const createdImages = await Promise.all(
      images.map((img: any, index: number) =>
        prisma.propertyImage.create({
          data: {
            propertyId: numericId,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary || (index === 0 && startOrder === 0),
            sortOrder: img.sortOrder ?? startOrder + index,
          },
        })
      )
    );

    return NextResponse.json(createdImages, { status: 201 });
  } catch (error) {
    console.error('Error adding property images:', error);
    return NextResponse.json({ error: 'Failed to add images' }, { status: 500 });
  }
}
