import { NextRequest, NextResponse } from "next/server";
import type { PropertyFilters } from "@/types/property";
import { getProperties } from "@/lib/supabase/properties";

function parseNumber(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const limit = Math.max(1, Math.min(60, parseInt(searchParams.get("limit") || "12", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    const filters: PropertyFilters = {
      location: searchParams.get("location") || undefined,
      type: (searchParams.get("type") as PropertyFilters["type"]) || undefined,
      category: (searchParams.get("category") as PropertyFilters["category"]) || undefined,
      realEstateType: (searchParams.get("realEstateType") as PropertyFilters["realEstateType"]) || undefined,
      status: (searchParams.get("status") as PropertyFilters["status"]) || undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      bedrooms: parseNumber(searchParams.get("bedrooms")) as PropertyFilters["bedrooms"],
      minPrice: parseNumber(searchParams.get("minPrice")),
      maxPrice: parseNumber(searchParams.get("maxPrice")),
      view: (searchParams.get("view") as PropertyFilters["view"]) || undefined,
    };

    const properties = await getProperties(filters, limit, offset);

    return NextResponse.json({ properties, limit, offset });
  } catch (error) {
    console.error("Error fetching public properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

