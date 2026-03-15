import { NextRequest, NextResponse } from 'next/server';
import { optimizePropertyImages } from '@/lib/imageOptimizer';
import { requireAdminAuth } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAdminAuth(request);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      );
    }

    // Optimize images
    await optimizePropertyImages(parseInt(propertyId));

    return NextResponse.json({
      success: true,
      message: 'Images optimized successfully'
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json(
      { error: 'Optimization failed' },
      { status: 500 }
    );
  }
}