"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyPreviewPanel from "@/components/properties/PropertyPreviewPanel";
import FloatingListingCTA from "@/components/properties/FloatingListingCTA";
import type { PropertySearchFilters } from "@/lib/property-data";
import type { Property } from "@/types/property";

type PropertyListingsBrowserProps = {
  properties: Property[];
  locations: string[];
  initialFilters?: PropertySearchFilters;
};

export default function PropertyListingsBrowser({
  properties,
  locations,
  initialFilters,
}: PropertyListingsBrowserProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id ?? null);

  useEffect(() => {
    if (properties.length === 0) {
      setSelectedPropertyId(null);
      return;
    }

    const selectedStillExists = properties.some((property) => property.id === selectedPropertyId);

    if (!selectedStillExists) {
      setSelectedPropertyId(properties[0]?.id ?? null);
    }
  }, [properties, selectedPropertyId]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId]
  );

  const similarProperties = useMemo(() => {
    if (!selectedProperty) {
      return [];
    }

    return properties
      .filter(
        (property) =>
          property.id !== selectedProperty.id &&
          property.type === selectedProperty.type
      )
      .slice(0, 3);
  }, [properties, selectedProperty]);

  const handleSelectProperty = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedPropertyId(null);
  }, []);

  return (
    <>
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#132238_100%)] pt-28 text-white">
        <div className="container-x pb-12">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
              Split Screen Browser
            </p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase tracking-tight">
              Browse Properties Without Losing Context
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Review inventory on the left, open a live preview on the right, and keep the primary booking action above the fold.
            </p>
          </div>

          <PropertyFilters
            initialFilters={initialFilters}
            locations={locations}
            className="mt-8"
          />
        </div>
      </section>

      <section className="bg-slate-50 py-10 pb-36">
        <div className="container-x">
          {properties.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
                No Listings Match
              </p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-slate-950">
                Try broadening your filters
              </h2>
              <p className="mt-3 text-slate-600">
                The server query returned no published properties for the selected constraints.
              </p>
            </div>
          ) : (
            <div
              className={`grid items-start gap-6 transition-all duration-300 ${
                selectedProperty ? "xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.76fr)]" : "grid-cols-1"
              }`}
            >
              <div className="min-w-0">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
                      Inventory
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-slate-950">
                      {properties.length} Active Listings
                    </h2>
                  </div>

                  {selectedProperty ? (
                    <button
                      type="button"
                      onClick={handleClosePreview}
                      className="rounded-full border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.24em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Full Width List
                    </button>
                  ) : null}
                </div>

                <div className="space-y-4 xl:max-h-[calc(100vh-13rem)] xl:overflow-y-auto xl:pr-2">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="compact"
                      selected={property.id === selectedPropertyId}
                      onClick={() => handleSelectProperty(property.id)}
                    />
                  ))}
                </div>
              </div>

              <PropertyPreviewPanel
                property={selectedProperty}
                similarProperties={similarProperties}
                onClose={handleClosePreview}
                onSelectSimilar={handleSelectProperty}
              />
            </div>
          )}
        </div>
      </section>

      <FloatingListingCTA />
    </>
  );
}
