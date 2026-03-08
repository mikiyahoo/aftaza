import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { getFeaturedProperties } from "@/lib/property-data";

export default async function FeaturedListings() {
  const properties = await getFeaturedProperties(6);

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
              Featured Inventory
            </p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-slate-950">
              Discover Our Featured Listings
            </h2>
            <p className="mt-3 text-slate-600">
              Server-rendered inventory, ordered newest-first, limited to six active listings.
            </p>
          </div>

          <Link
            href="/properties/listings"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition hover:border-[#c8a34d] hover:text-[#c8a34d]"
          >
            View All Listings
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              href={`/properties/${property.slug}`}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
