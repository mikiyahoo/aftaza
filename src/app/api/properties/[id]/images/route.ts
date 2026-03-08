import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { position: 'desc' },
          take: 1,
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get the next position
    const nextPosition = property.images.length > 0 
      ? property.images[0].position + 1 
      : 0;

    const image = await prisma.propertyImage.create({
      data: {
        url,
        position: nextPosition,
        propertyId: id,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error adding property image:', error);
    return NextResponse.json(
      { error: 'Failed to add property image' },
      { status: 500 }
    );
  }
}
