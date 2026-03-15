import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { Bath, BedDouble, CarFront, MapPin, ShieldCheck, Square } from "lucide-react";
import { notFound } from "next/navigation";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyImage from "@/components/properties/PropertyImage";
import PropertyInquiryForm from "@/components/properties/PropertyInquiryForm";
import { SITE } from "@/lib/constants";
import { formatBirr } from "@/lib/properties/config";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/supabase/properties";
import type { PropertyRecord } from "@/types/property";

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all property slugs
export async function generateStaticParams() {
  try {
    // We'll fetch all property slugs from the database
    // For now, we'll return an empty array and rely on fallback or ISR
    // In a production app, you would fetch all slugs here
    return [];
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  return {
    title: property.title,
    description: property.shortDescription,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);

  if (!property) {
    notFound();
  }

  const relatedProperties = await getRelatedProperties(property, 3);
  const bookTourUrl = `https://wa.me/${getPhoneDigits(SITE.phone)}?text=${encodeURIComponent(
    `Hello Aftaza Team, I want to book a tour for ${property.title} in ${property.location}. Please share the next available viewing slots.`
  )}`;

  return (
    <main data-header-surface="light" className="property-shell min-h-screen">
      <div className="container-x pb-20 pt-28 md:pt-36">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Link href="/properties" className="hover:text-[var(--property-action-blue)]">
            Properties
          </Link>
          <span>/</span>
          <Link href="/properties/listings" className="hover:text-[var(--property-action-blue)]">
            Listings
          </Link>
          <span>/</span>
          <span className="text-slate-900">{property.title}</span>
        </div>

        {/* Main Property Info - More Visible */}
        <div className="property-floating-card p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin size={20} className="text-[var(--property-action-blue)]" />
                <span className="text-lg">📍 {property.location}</span>
              </div>
              <p className="text-3xl font-display font-black text-[var(--property-action-blue)] mb-6">
                {formatBirr(property.price)}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {property.trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="property-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                  >
                    <ShieldCheck size={14} className="text-[var(--property-action-blue)]" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <a
                href={bookTourUrl}
                target="_blank"
                rel="noreferrer"
                className="property-action-btn inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
              >
                Book a Tour
              </a>
              <Link
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                className="property-secondary-btn inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
              >
                Request More Info
              </Link>
            </div>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] mb-12">
          <section className="space-y-6">
            <div className="property-floating-card overflow-hidden p-4 md:p-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[16px]">
                <PropertyImage
                  src={property.heroImage}
                  alt={property.title}
                  fallbackLabel={property.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {property.gallery.slice(0, 3).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                    <PropertyImage
                      src={image}
                      alt={`${property.title} gallery ${index + 1}`}
                      fallbackLabel={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 18vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="property-floating-card p-6 md:p-8">
              <h2 className="text-3xl font-display font-black tracking-tight text-slate-900">
                Property Overview
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">{property.description}</p>
            </div>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="property-floating-card p-6 md:p-8">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                {property.type === "Commercial" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.bedrooms} Office Rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.bathrooms} Restrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.areaSqm} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CarFront size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.parking} Parking</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.areaSqm} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CarFront size={18} className="text-[var(--property-action-blue)]" />
                      <span>{property.parking} Parking</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Company Information */}
        {property.companyName && (
          <div className="property-floating-card p-6 md:p-8 mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-4">
              Listed by
            </h3>
            <p className="text-base text-slate-600">
              {property.companyName}
            </p>
          </div>
        )}

        {/* Similar Properties - Separated into two sections */}
        {relatedProperties.length > 0 ? (
          <>
            {/* First section - Featured similar properties */}
            <section className="mb-12">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--property-action-blue)]">
                  Similar Properties
                </p>
                <h2 className="mt-4 text-3xl md:text-4xl font-display font-black tracking-tight text-slate-900">
                  You Might Also Like
                </h2>
                <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                  Explore other premium properties that match your preferences
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedProperties.slice(0, 3).map((candidate) => (
                  <PropertyCard
                    key={candidate.id}
                    property={candidate}
                    href={`/properties/${candidate.slug}`}
                  />
                ))}
              </div>
            </section>

            {/* Second section - More properties to explore */}
            {relatedProperties.length > 3 && (
              <section className="pb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-display font-bold tracking-tight text-slate-900">
                    More Properties to Explore
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Continue your search with additional options
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedProperties.slice(3).map((candidate) => (
                    <PropertyCard
                      key={candidate.id}
                      property={candidate}
                      href={`/properties/${candidate.slug}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}

        {/* Inquiry Form */}
        <section className="mb-12">
          <div className="property-floating-card p-6 md:p-8">
            <PropertyInquiryForm 
              propertyId={property.id} 
              propertyTitle={property.title} 
            />
          </div>
        </section>
      </div>
    </main>
  );
}
