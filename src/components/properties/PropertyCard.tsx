import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, CarFront, LandPlot, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPropertyImageUrl } from "@/lib/property-data";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  formatPrice,
  type Property,
} from "@/types/property";

type PropertyCardProps = {
  property: Property;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  variant?: "default" | "compact";
  priority?: boolean;
  className?: string;
};

const statusClasses: Record<Property["status"], string> = {
  FOR_SALE: "bg-emerald-600 text-white",
  SOLD: "bg-slate-700 text-white",
  RENTED: "bg-amber-500 text-slate-950",
  PENDING: "bg-sky-600 text-white",
};

function Specs({ property, compact = false }: { property: Property; compact?: boolean }) {
  const itemClassName = compact
    ? "inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600"
    : "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600";

  return (
    <div className={cn("flex flex-wrap gap-x-4 gap-y-2", !compact && "border-t border-slate-100 pt-4")}>
      {property.bedrooms ? (
        <span className={itemClassName}>
          <BedDouble className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
          {property.bedrooms} Beds
        </span>
      ) : null}
      {property.bathrooms ? (
        <span className={itemClassName}>
          <Bath className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
          {property.bathrooms} Baths
        </span>
      ) : null}
      {property.parking ? (
        <span className={itemClassName}>
          <CarFront className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
          {property.parking} Parking
        </span>
      ) : null}
      {property.landSize ? (
        <span className={itemClassName}>
          <LandPlot className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
          {property.landSize} m2
        </span>
      ) : null}
    </div>
  );
}

export default function PropertyCard({
  property,
  href,
  onClick,
  selected = false,
  variant = "default",
  priority = false,
  className,
}: PropertyCardProps) {
  const imageSrc = getPropertyImageUrl(property.images?.[0]?.url);

  const sharedClassName = cn(
    "group overflow-hidden rounded-[32px] border border-slate-200/80 bg-white text-left shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
    selected && "ring-2 ring-[#c8a34d] ring-offset-2",
    className
  );

  const content =
    variant === "compact" ? (
      <div className={sharedClassName}>
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-slate-100 sm:w-44 sm:flex-shrink-0">
            <Image
              src={imageSrc}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, 176px"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]",
                  statusClasses[property.status]
                )}
              >
                {PROPERTY_STATUS_LABELS[property.status]}
              </span>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-700">
                {PROPERTY_TYPE_LABELS[property.type]}
              </span>
            </div>

            <div>
              <h3 className="line-clamp-1 font-display text-xl font-black uppercase tracking-tight text-slate-950 transition-colors group-hover:text-[#c8a34d]">
                {property.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
                <span className="line-clamp-1">{property.location}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="font-display text-2xl font-black text-[#c8a34d]">{formatPrice(property.price)}</p>
              <Specs property={property} compact />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={sharedClassName}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em]",
                statusClasses[property.status]
              )}
            >
              {PROPERTY_STATUS_LABELS[property.status]}
            </span>
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-800 backdrop-blur-[12px]">
              {PROPERTY_TYPE_LABELS[property.type]}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div>
            <h3 className="line-clamp-1 font-display text-2xl font-black uppercase tracking-tight text-slate-950 transition-colors group-hover:text-[#c8a34d]">
              {property.title}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-[#c8a34d]" aria-hidden="true" />
              <span className="line-clamp-1">{property.location}</span>
            </p>
          </div>

          <p className="font-display text-3xl font-black text-[#c8a34d]">{formatPrice(property.price)}</p>
          <Specs property={property} />
        </div>
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="block" aria-label={`View ${property.title}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full" aria-pressed={selected}>
      {content}
    </button>
  );
}
