"use client";

import { useEffect, useState } from "react";
import type { PropertyRecord, PropertyFilters } from "@/types/property";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";

interface PropertiesListProps {
  initialProperties: PropertyRecord[];
  filters: PropertyFilters;
}

export default function PropertiesList({ initialProperties, filters }: PropertiesListProps) {
  const [properties, setProperties] = useState<PropertyRecord[]>(initialProperties);
  const [clientOffset, setClientOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset when filters change (from server)
  useEffect(() => {
    setProperties(initialProperties);
    setClientOffset(0);
    setHasMore(initialProperties.length >= 12);
  }, [initialProperties, filters]);

  const loadMore = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "12");
      params.set("offset", String(clientOffset + 12));

      if (filters.location) params.set("location", filters.location);
      if (filters.type) params.set("type", filters.type);
      if (filters.category) params.set("category", filters.category);
      if (filters.realEstateType) params.set("realEstateType", filters.realEstateType);
      if (filters.status) params.set("status", filters.status);
      if (filters.featured) params.set("featured", "true");
      if (typeof filters.minPrice === "number") params.set("minPrice", String(filters.minPrice));
      if (typeof filters.maxPrice === "number") params.set("maxPrice", String(filters.maxPrice));
      if (typeof filters.bedrooms === "number") params.set("bedrooms", String(filters.bedrooms));
      if (filters.view) params.set("view", filters.view);

      const res = await fetch(`/api/public/properties?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load properties");
      }

      const data = (await res.json()) as { properties?: PropertyRecord[] };
      const newProperties = data.properties ?? [];
      setProperties(prev => [...prev, ...newProperties]);
      setClientOffset(prev => prev + 12);
      if (newProperties.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more properties:", error);
    } finally {
      setLoading(false);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="property-floating-card property-listings-panel mt-6 p-10 text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900">No properties found</h2>
        <p className="mt-4 text-slate-600">
          Clear the advanced filters or broaden the price range to see more inventory.
        </p>
        <Link
          href="/properties/listings"
          className="property-secondary-btn mt-6 inline-flex items-center px-5 py-3 text-sm font-semibold"
        >
          Reset Filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-5">
        {properties.map((property) => (
          <Link key={property.id} href={`/properties/${property.slug}`}>
            <PropertyCard
              property={property}
            />
          </Link>
        ))}
      </div>
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="property-secondary-btn inline-flex items-center px-5 py-3 text-sm font-semibold"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}