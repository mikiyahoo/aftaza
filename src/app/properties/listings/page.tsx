import type { Metadata } from "next";
import PropertyListingsBrowser from "@/components/properties/PropertyListingsBrowser";
import {
  getProperties,
  getPropertyFilterOptions,
  parsePropertySearchFilters,
} from "@/lib/property-data";

type PropertyListingsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "Property Listings | AFTAZA PLC",
  description:
    "Browse Aftaza's active property inventory with split-screen previews, server-side filtering, and direct lead capture CTAs.",
};

export const revalidate = 300;

export default async function PropertyListingsPage({
  searchParams,
}: PropertyListingsPageProps) {
  const filters = parsePropertySearchFilters(searchParams);

  const [properties, filterOptions] = await Promise.all([
    getProperties({ ...filters, limit: 24 }),
    getPropertyFilterOptions(),
  ]);

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50">
      <PropertyListingsBrowser
        properties={properties}
        locations={filterOptions.locations}
        initialFilters={filters}
      />
    </main>
  );
}
