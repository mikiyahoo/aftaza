import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// GET /api/properties - List all properties with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const companyId = searchParams.get('companyId');
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.company_id = companyId;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (propertyType) {
      where.property_type = propertyType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea);
      if (maxArea) where.area.lte = parseFloat(maxArea);
    }

    if (bedrooms) {
      // Using gte (greater than or equal) for bedrooms/bathrooms is common filtering behavior
      where.bedrooms = {
        gte: parseInt(bedrooms)
      };
    }

    if (bathrooms) {
      where.bathrooms = {
        gte: parseInt(bathrooms)
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

     const [properties, total] = await Promise.all([
       prisma.properties.findMany({
         where,
         include: {
           company: {
             select: {
               id: true,
               name: true,
             }
           },
           images: {
             where: { isPrimary: true },
             take: 1,
           },
         },
         orderBy: { created_at: 'desc' },
         take: limit,
         skip: offset,
       }),
       prisma.properties.count({ where }),
     ]);

     return NextResponse.json({
       properties: properties.map((p: any) => ({
         ...p,
         primaryImage: p.images?.[0]?.imageUrl || null,
         images: undefined,
       })),
       total,
       limit,
       offset,
     });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// Function to remove null characters and control characters, preserve valid Unicode
const cleanString = (str: any): string | null => {
  if (str === null || str === undefined) return null;
  // Convert to string
  let s = String(str);
  // Remove null bytes and control characters, preserve valid Unicode
  // This removes: null byte, control characters (\u0000-\u001f), and delete control character (\u007f-\u009f)
  s = s.replace(/[\u0000-\u001f\u007f-\u009f]/g, '');
  // Trim whitespace
  return s.trim();
};

// Function to clean numeric values
const cleanNumber = (num: any): number | null => {
  if (num === null || num === undefined) return null;
  if (typeof num === 'number') return num;
  
  // Remove whitespace and handle common formats
  const str = String(num).trim();
  
  // Handle negative numbers
  const isNegative = str.startsWith('-');
  let cleaned = str.replace(/[^\d.-]/g, '');
  
  // Ensure only one decimal point and minus sign
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    // Multiple decimal points - take first part as integer, rest as decimals
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Handle negative sign
  if (isNegative && !cleaned.startsWith('-')) {
    cleaned = '-' + cleaned;
  }
  
  const result = parseFloat(cleaned);
  return isNaN(result) ? null : result;
};

// POST /api/properties - Create a new property (admin only)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const token = await requireAdminAuth(request);
  if (!token) {
    return unauthorizedResponse();
  }
  
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      price,
      location,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      parking,
      area,
      description,
      featured,
      companyId,
      createdBy,
      images,
    } = body;

     // Clean all string fields
     const cleanedData = {
       title: cleanString(title),
       slug: cleanString(slug),
       price: cleanNumber(price) ?? 0,
       location: cleanString(location),
       propertyType: cleanString(propertyType),
       status: cleanString(status) || 'For Sale',
       bedrooms: cleanNumber(bedrooms) ?? null,
       bathrooms: cleanNumber(bathrooms) ?? null,
       parking: cleanNumber(parking) ?? null,
       area: cleanNumber(area) ?? null,
       description: cleanString(description),
       featured: featured || false,
       companyId: cleanString(companyId),
       createdBy: cleanString(createdBy),
       images: images?.map((img: any) => ({
         ...img,
         imageUrl: cleanString(img.imageUrl),
       })) || [],
     };

     // Check for any remaining null characters or invalid data
     const checkForNullBytes = (fieldName: string, value: any) => {
       if (typeof value === 'string' && value.includes('\0')) {
         // Only log in development
         if (process.env.NODE_ENV !== 'production') {
           console.error(`NULL BYTE DETECTED in ${fieldName}:`, value);
         }
         return true;
       }
       return false;
     };

     let hasNullBytes = false;
     hasNullBytes = checkForNullBytes('title', cleanedData.title) || hasNullBytes;
     hasNullBytes = checkForNullBytes('slug', cleanedData.slug) || hasNullBytes;
     hasNullBytes = checkForNullBytes('location', cleanedData.location) || hasNullBytes;
     hasNullBytes = checkForNullBytes('propertyType', cleanedData.propertyType) || hasNullBytes;
     hasNullBytes = checkForNullBytes('status', cleanedData.status) || hasNullBytes;
     hasNullBytes = checkForNullBytes('description', cleanedData.description) || hasNullBytes;
     hasNullBytes = checkForNullBytes('companyId', cleanedData.companyId) || hasNullBytes;
     hasNullBytes = checkForNullBytes('createdBy', cleanedData.createdBy) || hasNullBytes;
     
     if (hasNullBytes) {
       // Only log in development
       if (process.env.NODE_ENV !== 'production') {
         console.error('Null bytes detected in cleaned data - this will cause database errors');
       }
     }

    // Validate required fields
    if (!cleanedData.title || !cleanedData.slug || !cleanedData.price || !cleanedData.location || !cleanedData.propertyType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, price, location, propertyType' },
        { status: 400 }
      );
    }

    // Validate numeric values are positive
    if (cleanedData.price < 0 || (cleanedData.area && cleanedData.area < 0)) {
      return NextResponse.json(
        { error: 'Price and Area must be positive numbers' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProperty = await prisma.properties.findUnique({
      where: { slug: cleanedData.slug },
    });

    if (existingProperty) {
      return NextResponse.json(
        { error: 'Property with this slug already exists' },
        { status: 400 }
      );
    }

    // Create property with images - explicitly exclude id field
    const property = await prisma.properties.create({
      data: {
        title: cleanedData.title,
        slug: cleanedData.slug,
        price: cleanedData.price,
        location: cleanedData.location,
        property_type: cleanedData.propertyType,
        status: cleanedData.status,
        bedrooms: cleanedData.bedrooms,
        bathrooms: cleanedData.bathrooms,
        parking: cleanedData.parking,
        area: cleanedData.area,
        description: cleanedData.description,
        featured: cleanedData.featured,
        company_id: cleanedData.companyId,
        created_by: cleanedData.createdBy,
        images: cleanedData.images.length > 0 ? {
          create: cleanedData.images.map((img: any, index: number) => ({
            imageUrl: cleanString(img.imageUrl),
            isPrimary: img.isPrimary || index === 0,
            sortOrder: img.sortOrder || index,
          })),
        } : undefined,
      },
      include: {
        images: true,
        company: true,
      },
    });

    console.log('Created property:', JSON.stringify(property, null, 2));

    return NextResponse.json({
      ...property,
      primaryImage: property.images?.[0]?.imageUrl || null,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
