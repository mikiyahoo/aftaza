"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bath, BedDouble, CarFront, LandPlot, MapPin, X } from "lucide-react";
import { getPropertyImageUrl } from "@/lib/property-data";
import { formatPrice, type Property } from "@/types/property";

type PropertyPreviewPanelProps = {
  property: Property | null;
  similarProperties: Property[];
  onClose: () => void;
  onSelectSimilar: (propertyId: string) => void;
};

export default function PropertyPreviewPanel({
  property,
  similarProperties,
  onClose,
  onSelectSimilar,
}: PropertyPreviewPanelProps) {
  const images = useMemo(
    () =>
      property?.images?.length
        ? property.images.map((image, index) => ({
            id: image.id,
            src: getPropertyImageUrl(image.url, index),
            alt: `${property.title} image ${index + 1}`,
          }))
        : property
          ? [
              {
                id: `${property.id}-fallback`,
                src: getPropertyImageUrl(undefined),
                alt: property.title,
              },
            ]
          : [],
    [property]
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  const handleSelectSimilar = useCallback(
    (propertyId: string) => {
      onSelectSimilar(propertyId);
      setActiveImageIndex(0);
    },
    [onSelectSimilar]
  );

  return (
    <AnimatePresence initial={false}>
      {property ? (
        <motion.aside
          key={property.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] lg:sticky lg:top-28"
        >
          <div className="relative aspect-[16/10] bg-slate-100">
            <Image
              src={images[activeImageIndex]?.src ?? getPropertyImageUrl(undefined)}
              alt={images[activeImageIndex]?.alt ?? property.title}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <div className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px]">
                {formatPrice(property.price)}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/60 text-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                aria-label="Close property preview"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#c8a34d]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a6e2f]">
                  Selected Listing
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-700">
                  Above the Fold CTA
                </span>
              </div>

              <div>
                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-slate-950">
                  {property.title}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                  {property.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/contact?subject=book-tour&property=${property.slug}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-white shadow-[0_0_32px_rgba(14,165,233,0.28)] transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  Book a Tour
                </Link>
                <Link
                  href={`/properties/${property.slug}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition hover:border-[#c8a34d] hover:text-[#c8a34d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a34d] focus-visible:ring-offset-2"
                >
                  View Full Details
                </Link>
              </div>
            </div>

            {images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-[20px] border bg-slate-100"
                    aria-label={`Show image ${index + 1} for ${property.title}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {activeImageIndex === index ? (
                      <span className="absolute inset-0 border-2 border-[#c8a34d]" aria-hidden="true" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
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

            {property.description ? (
              <div className="rounded-[28px] bg-slate-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                  Listing Overview
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{property.description}</p>
              </div>
            ) : null}

            {similarProperties.length > 0 ? (
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  Similar Properties
                </h3>
                <div className="space-y-3">
                  {similarProperties.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSimilar(item.id)}
                      className="flex w-full items-center gap-3 rounded-[24px] border border-slate-100 p-3 text-left transition hover:border-[#c8a34d]/50 hover:bg-slate-50"
                    >
                      <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-[18px] bg-slate-100">
                        <Image
                          src={getPropertyImageUrl(item.images?.[0]?.url)}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-bold uppercase tracking-tight text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{item.location}</p>
                        <p className="mt-2 text-sm font-bold text-[#c8a34d]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
