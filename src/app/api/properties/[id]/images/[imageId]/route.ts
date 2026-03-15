import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/properties/[id]/images/[imageId] - Get a single image (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { imageId } = params;

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}

// PUT /api/properties/[id]/images/[imageId] - Update an image (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { imageId } = params;
    const body = await request.json();
    const { imageUrl, isPrimary, sortOrder } = body;

    // Check if image exists
    const existingImage = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // If setting this as primary, unset other primaries
    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: { 
          propertyId: parseInt(params.id),
          id: { not: imageId },
        },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.propertyImage.update({
      where: { id: imageId },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(isPrimary !== undefined && { isPrimary }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

// DELETE /api/properties/[id]/images/[imageId] - Delete an image (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { imageId } = params;

    // Check if image exists
    const existingImage = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
