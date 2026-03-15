import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies/[id]/properties - Get properties for a specific company (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const properties = await prisma.property.findMany({
      where: { company_id: id },
      include: {
        company: true,
        images: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}