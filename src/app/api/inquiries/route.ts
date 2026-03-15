import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/inquiries - List all inquiries (admin only)
export async function GET(request: NextRequest) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const { searchParams } = new URL(request.url);
    
    const propertyId = searchParams.get('propertyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    const [inquiries, total] = await Promise.all([
      prisma.propertyInquiry.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.propertyInquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// POST /api/inquiries - Create a new inquiry (public endpoint for website forms)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Convert propertyId to number if provided
    let parsedPropertyId: number | null = null;
    if (propertyId !== undefined && propertyId !== null) {
      const num = Number(propertyId);
      if (isNaN(num)) {
        return NextResponse.json(
          { error: 'Invalid propertyId format' },
          { status: 400 }
        );
      }
      parsedPropertyId = num;
    }

    const inquiry = await prisma.propertyInquiry.create({
      data: {
        propertyId: parsedPropertyId,
        name: name,
        email: email,
        phone: phone || null,
        message: message || null,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
