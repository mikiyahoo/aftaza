import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CarFront, LandPlot, MapPin } from "lucide-react";
import { getPropertyBySlug, getPropertyImageUrl } from "@/lib/property-data";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS, formatPrice } from "@/types/property";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found | AFTAZA PLC",
    };
  }

  return {
    title: `${property.title} | AFTAZA PLC`,
    description:
      property.description ??
      `${property.title} listed at ${formatPrice(property.price)} in ${property.location}.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const images = property.images?.length
    ? property.images.map((image, index) => getPropertyImageUrl(image.url, index))
    : [getPropertyImageUrl(undefined)];

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container-x">
        <nav className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">
            <li>
              <Link href="/" className="transition hover:text-[#c8a34d]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/properties" className="transition hover:text-[#c8a34d]">
                Properties
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900">{property.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.8fr)]">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <Image
                src={images[0]}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            {images.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.slice(1).map((image, index) => (
                  <div
                    key={`${property.id}-gallery-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                  >
                    <Image
                      src={image}
                      alt={`${property.title} gallery image ${index + 2}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-[32px] border border-slate-200/80 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#c8a34d]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a6e2f]">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-700">
                  {PROPERTY_STATUS_LABELS[property.status]}
                </span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-slate-950">
                {property.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                {property.location}
              </p>

              <p className="mt-6 font-display text-4xl font-black text-[#c8a34d]">
                {formatPrice(property.price)}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {property.bedrooms ? (
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <BedDouble className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                      {property.bedrooms} Bedrooms
                    </p>
                  </div>
                ) : null}
                {property.bathrooms ? (
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Bath className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                      {property.bathrooms} Bathrooms
                    </p>
                  </div>
                ) : null}
                {property.parking ? (
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CarFront className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                      {property.parking} Parking
                    </p>
                  </div>
                ) : null}
                {property.landSize ? (
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <LandPlot className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                      {property.landSize} m2
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/contact?subject=book-tour&property=${property.slug}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-white shadow-[0_0_32px_rgba(14,165,233,0.28)] transition hover:bg-sky-500"
                >
                  Book a Tour
                </Link>
                <Link
                  href="/properties/listings"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition hover:border-[#c8a34d] hover:text-[#c8a34d]"
                >
                  Back to Listings
                </Link>
              </div>

              {property.description ? (
                <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
                    Description
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-slate-600">
                    {property.description}
                  </p>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
