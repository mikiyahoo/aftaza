import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { action, ids } = await request.json();

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    let updatedCount: { count: number };

    switch (action) {
      case 'activate':
        updatedCount = await prisma.property.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: 'For Sale',
          },
        });
        break;

      case 'deactivate':
        updatedCount = await prisma.property.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: 'Pending',
          },
        });
        break;

      case 'delete':
        // Delete related images first
        await prisma.propertyImage.deleteMany({
          where: {
            propertyId: {
              in: ids,
            },
          },
        });

        // Then delete properties
        updatedCount = await prisma.property.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        break;

      case 'archive':
        updatedCount = await prisma.property.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            status: 'Sold',
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount.count} properties ${action}ed successfully`,
      count: updatedCount.count,
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}