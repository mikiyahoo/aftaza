import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeProperties = searchParams.get('includeProperties') === 'true';

    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      include: {
        ...(includeProperties
          ? {
              properties: {
                take: 5,
                orderBy: { createdAt: 'desc' },
              },
            }
          : {}),
        _count: {
          select: { properties: true },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, phone, email } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
