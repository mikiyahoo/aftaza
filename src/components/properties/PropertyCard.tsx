import { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, MapPin, Square } from "lucide-react";
import { formatArea, formatBirr } from "@/lib/properties/config";
import { cn } from "@/lib/utils";
import type { PropertyRecord } from "@/types/property";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface PropertyCardProps {
  property: PropertyRecord;
  variant?: "featured" | "list" | "mini";
  href?: string;
  active?: boolean;
  priority?: boolean;
  condensed?: boolean;
  expanded?: boolean;
  onSelect?: (property: PropertyRecord) => void;
  className?: string;
}

function PropertyCardComponent({
  property,
  variant = "featured",
  href,
  active = false,
  priority = false,
  condensed = false,
  expanded = false,
  onSelect,
  className,
}: PropertyCardProps) {
  const listingSpecs =
    property.type === "Commercial"
      ? [
          { key: "rooms", icon: BedDouble, label: `${property.bedrooms} Office Rooms` },
          { key: "restrooms", icon: Bath, label: `${property.bathrooms} Restrooms` },
          { key: "area", icon: Square, label: formatArea(property.areaSqm) },
        ]
      : [
          { key: "bedrooms", icon: BedDouble, label: `${property.bedrooms} Bedrooms` },
          { key: "bathrooms", icon: Bath, label: `${property.bathrooms} Bathrooms` },
          { key: "area", icon: Square, label: formatArea(property.areaSqm) },
        ];

  const rootClassName = cn(
    "group overflow-hidden text-left",
    variant === "list"
      ? "property-floating-card property-listings-panel property-listing-card property-card-lift w-full"
      : "property-floating-card property-card-lift",
    active && variant === "list" && "border-[1.5px] border-[var(--property-action-blue)]",
    variant === "featured" && "h-full",
    variant === "mini" && "h-full",
    className
  );

  const listContent = expanded ? (
    <article className="flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <OptimizedImage
          src={property.heroImage || property.image}
          alt={property.title}
          fill
          sizes="(max-width: 1280px) 100vw, 720px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/14 to-transparent" />
        <div className="property-rounded-tag absolute left-5 top-5 px-4 py-2 text-xs font-semibold">
          {formatBirr(property.price)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col p-6 md:p-7">
        <div>
          <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 md:text-[2rem]">
            {property.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="text-[var(--property-action-blue)]" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="property-selected-detail-btn mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
          <span>Detail Pane Open</span>
          <ArrowUpRight size={15} />
        </div>
      </div>
    </article>
  ) : condensed ? (
    <article className="grid gap-0 sm:grid-cols-[180px_minmax(0,1fr)]">
      <div className="relative min-h-[180px] overflow-hidden bg-slate-950">
        <OptimizedImage
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 180px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 property-glass-pill px-4 py-2 text-xs font-semibold text-slate-900">
          {formatBirr(property.price)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
            <span>{property.type}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{property.category}</span>
          </div>
          <h3 className="mt-3 text-xl font-display font-bold tracking-tight text-slate-900">
            {property.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="text-[var(--property-action-blue)]" />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--property-action-blue)]">
          <span>Preview Listing</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </article>
  ) : (
    <article className="grid gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="relative min-h-[260px] overflow-hidden bg-slate-950">
        <OptimizedImage
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 1024px) 100vw, 260px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/48 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 property-glass-pill px-4 py-2 text-xs font-semibold text-slate-900">
          {formatBirr(property.price)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-between p-6 md:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">
            <span>{property.type}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{property.category}</span>
          </div>
          <h3 className="mt-3 text-2xl font-display font-bold tracking-tight text-slate-900">
            {property.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="text-[var(--property-action-blue)]" />
            <span>{property.location}</span>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
            {property.shortDescription}
          </p>
        </div>

        <div className="mt-6 grid gap-3 border-t border-[rgba(15,23,42,0.08)] pt-5 text-sm text-slate-600 md:grid-cols-3">
          {listingSpecs.map(({ key, icon: Icon, label }) => (
            <div key={`${property.id}-${key}`} className="flex items-center gap-2">
              <Icon size={16} className="text-[var(--property-action-blue)]" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );

  const content =
    variant === "list" ? (
      listContent
    ) : (
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <OptimizedImage
            src={variant === "mini" ? property.image : property.heroImage || property.image}
            alt={property.title}
            fill
            priority={priority}
            sizes={
              variant === "mini"
                ? "(max-width: 768px) 100vw, 280px"
                : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            }
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="property-glass-pill px-4 py-2 text-xs font-semibold text-slate-900">
              {formatBirr(property.price)}
            </span>
            <span className="property-glass-pill px-3 py-2 text-[11px] font-semibold text-slate-700">
              {property.type}
            </span>
          </div>
        </div>

        <div className={cn("flex h-full flex-col", variant === "mini" ? "p-5" : "p-6")}>
          <h3
            className={cn(
              "font-display font-bold tracking-tight text-slate-900",
              variant === "mini" ? "text-lg" : "text-2xl"
            )}
          >
            {property.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={16} className="text-[var(--property-action-blue)]" />
            <span>{property.location}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{property.shortDescription}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-[16px] bg-slate-50 p-4 text-xs text-slate-600">
            {property.type === "Commercial" ? (
              <>
                <div className="flex items-center gap-2">
                  <BedDouble size={15} className="text-[var(--property-action-blue)]" />
                  <span>{property.bedrooms || 0} Rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={15} className="text-[var(--property-action-blue)]" />
                  <span>{property.bathrooms || 0} Restrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={15} className="text-[var(--property-action-blue)]" />
                  <span>{formatArea(property.areaSqm)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <BedDouble size={15} className="text-[var(--property-action-blue)]" />
                  <span>{property.bedrooms || 0} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={15} className="text-[var(--property-action-blue)]" />
                  <span>{property.bathrooms || 0} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={15} className="text-[var(--property-action-blue)]" />
                  <span>{formatArea(property.areaSqm)}</span>
                </div>
              </>
            )}
          </div>

          {href ? (
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--property-action-blue)]">
              <span>Explore Property</span>
              <ArrowUpRight size={16} />
            </div>
          ) : null}
        </div>
      </article>
    );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(property)}
        className={rootClassName}
        aria-pressed={active}
        aria-label={`Preview ${property.title}`}
        data-active={active ? "true" : "false"}
        data-expanded={expanded ? "true" : "false"}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={rootClassName}
        aria-label={`Open ${property.title}`}
        data-active={active ? "true" : "false"}
        data-expanded={expanded ? "true" : "false"}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={rootClassName} data-active={active ? "true" : "false"} data-expanded={expanded ? "true" : "false"}>
      {content}
    </div>
  );
}

const PropertyCard = memo(PropertyCardComponent);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
