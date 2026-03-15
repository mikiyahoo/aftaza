import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/testimonials/[id] - Get a single testimonial (admin only)
export async function GET(
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

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PUT /api/testimonials/[id] - Update a testimonial (admin only)
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
    const body = await request.json();
    const { name, title, quote, image } = body;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(title !== undefined && { title }),
        ...(quote && { quote }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE /api/testimonials/[id] - Delete a testimonial (admin only)
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

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
