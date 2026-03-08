import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, type PropertyStatus, type PropertyType } from "@/types/property";

function parseNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || undefined;
    const location = searchParams.get("location")?.trim() || undefined;
    const type = (searchParams.get("type") as PropertyType | null) ?? undefined;
    const status = (searchParams.get("status") as PropertyStatus | null) ?? undefined;
    const companyId = searchParams.get("companyId") || undefined;
    const published = searchParams.get("published");
    const minPrice = parseNumber(searchParams.get("minPrice"));
    const maxPrice = parseNumber(searchParams.get("maxPrice"));
    const bedrooms = parseNumber(searchParams.get("bedrooms"));

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        (where.price as { gte?: number }).gte = minPrice;
      }

      if (maxPrice !== undefined) {
        (where.price as { lte?: number }).lte = maxPrice;
      }
    }

    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms >= 4 ? { gte: bedrooms } : bedrooms;
    }

    if (published !== null && published !== undefined) {
      where.published = published === "true";
    }

    if (searchParams.get("public") === "true") {
      where.published = true;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { position: "asc" },
          },
          company: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const type = body.type as PropertyType | undefined;
    const status = body.status as PropertyStatus | undefined;
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const price = Number(body.price);

    if (!title || !type || !status || !location || !Number.isFinite(price)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const propertySlug =
      typeof body.slug === "string" && body.slug.trim().length > 0
        ? body.slug.trim()
        : generateSlug(title);

    const existingProperty = await prisma.property.findUnique({
      where: { slug: propertySlug },
    });

    if (existingProperty) {
      return NextResponse.json(
        { error: "A property with this slug already exists" },
        { status: 400 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        slug: propertySlug,
        type,
        status,
        price,
        location,
        bedrooms: Number.isFinite(Number(body.bedrooms)) ? Number(body.bedrooms) : null,
        bathrooms: Number.isFinite(Number(body.bathrooms)) ? Number(body.bathrooms) : null,
        parking: Number.isFinite(Number(body.parking)) ? Number(body.parking) : null,
        landSize: Number.isFinite(Number(body.landSize)) ? Number(body.landSize) : null,
        description:
          typeof body.description === "string" && body.description.trim().length > 0
            ? body.description.trim()
            : null,
        published: typeof body.published === "boolean" ? body.published : true,
        companyId:
          typeof body.companyId === "string" && body.companyId.trim().length > 0
            ? body.companyId.trim()
            : null,
      },
      include: {
        images: true,
        company: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
