import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string; imageId: string }>;
};

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, imageId } = await params;
    
    // Check if image exists and belongs to property
    const image = await prisma.propertyImage.findFirst({
      where: {
        id: imageId,
        propertyId: id,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the image
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting property image:', error);
    return NextResponse.json(
      { error: 'Failed to delete property image' },
      { status: 500 }
    );
  }
}
