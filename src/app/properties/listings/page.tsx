import type { Metadata } from "next";
import { parsePropertySearchParams } from "@/lib/properties/config";
import { getProperties } from "@/lib/supabase/properties";
import PropertyBrowser from "@/components/properties/PropertyBrowser";

export const metadata: Metadata = {
  title: "Property Listings",
  description:
    "Browse AFTAZA property listings with split-screen previews, advanced filtering, and direct lead capture.",
};

export const dynamic = "force-dynamic";

interface ListingsPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function PropertyListingsPage({
  searchParams = {},
}: ListingsPageProps) {
  const filters = parsePropertySearchParams(searchParams);
  // Fetch listings (server-side) for the browser experience
  const properties = await getProperties(filters, 24, 0);

  return (
    <main data-header-surface="light" className="property-shell min-h-screen">
      <PropertyBrowser properties={properties} filters={filters} />
    </main>
  );
}
