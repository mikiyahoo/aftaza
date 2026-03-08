"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertySearchFilters } from "@/lib/property-data";
import { PROPERTY_TYPE_LABELS, type PropertyType } from "@/types/property";

type PropertyFiltersProps = {
  initialFilters?: PropertySearchFilters;
  locations: string[];
  targetPath?: string;
  className?: string;
};

const PRICE_RANGES = [
  { label: "Any Price", min: undefined, max: undefined },
  { label: "ETB 1M - 5M", min: 1000000, max: 5000000 },
  { label: "ETB 5M - 15M", min: 5000000, max: 15000000 },
  { label: "ETB 15M - 25M", min: 15000000, max: 25000000 },
  { label: "ETB 25M - 50M", min: 25000000, max: 50000000 },
  { label: "ETB 50M+", min: 50000000, max: undefined },
];

const BEDROOM_OPTIONS = [
  { label: "Any", value: undefined },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PILL_INPUT_CLASS =
  "h-12 rounded-full border border-white/50 bg-white/60 px-4 text-sm text-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition focus:border-[#c8a34d] focus:outline-none focus:ring-2 focus:ring-[#c8a34d]/20";

export default function PropertyFilters({
  initialFilters,
  locations,
  targetPath,
  className,
}: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialFilters?.search ?? "");
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [type, setType] = useState<PropertyType | "">(initialFilters?.type ?? "");
  const [bedrooms, setBedrooms] = useState<number | undefined>(initialFilters?.bedrooms);
  const [priceValue, setPriceValue] = useState(() => {
    const match = PRICE_RANGES.find(
      (range) =>
        range.min === initialFilters?.minPrice &&
        range.max === initialFilters?.maxPrice
    );
    return match?.label ?? PRICE_RANGES[0].label;
  });

  const target = targetPath ?? pathname;

  const selectedPriceRange = useMemo(
    () => PRICE_RANGES.find((range) => range.label === priceValue) ?? PRICE_RANGES[0],
    [priceValue]
  );

  const applyFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value?: string) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    };

    setOrDelete("search", search.trim() || undefined);
    setOrDelete("location", location || undefined);
    setOrDelete("type", type || undefined);
    setOrDelete("bedrooms", bedrooms !== undefined ? String(bedrooms) : undefined);
    setOrDelete(
      "minPrice",
      selectedPriceRange.min !== undefined ? String(selectedPriceRange.min) : undefined
    );
    setOrDelete(
      "maxPrice",
      selectedPriceRange.max !== undefined ? String(selectedPriceRange.max) : undefined
    );

    const query = nextParams.toString();
    router.push(query ? `${target}?${query}` : target, { scroll: false });
  }, [bedrooms, location, router, search, searchParams, selectedPriceRange, target, type]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setLocation("");
    setType("");
    setBedrooms(undefined);
    setPriceValue(PRICE_RANGES[0].label);
    router.push(target, { scroll: false });
  }, [router, target]);

  return (
    <div
      className={cn(
        "rounded-[40px] border border-white/50 bg-white/60 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px]",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#c8a34d]">
              Aftaza Filters
            </p>
            <p className="text-sm text-slate-600">
              Refine inventory by location, asset type, price, and bedroom count.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <label className="sr-only" htmlFor="property-search">
            Search properties
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="property-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or neighborhood"
              className={cn(PILL_INPUT_CLASS, "w-full pl-11")}
            />
          </div>

          <label className="sr-only" htmlFor="property-location">
            Filter by location
          </label>
          <select
            id="property-location"
            aria-label="Filter properties by location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className={cn(PILL_INPUT_CLASS, "w-full appearance-none")}
          >
            <option value="">All Locations</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="property-type">
            Filter by property type
          </label>
          <select
            id="property-type"
            aria-label="Filter properties by type"
            value={type}
            onChange={(event) => setType(event.target.value as PropertyType | "")}
            className={cn(PILL_INPUT_CLASS, "w-full appearance-none")}
          >
            <option value="">All Types</option>
            {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((value) => (
              <option key={value} value={value}>
                {PROPERTY_TYPE_LABELS[value]}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="property-price">
            Filter by price range
          </label>
          <select
            id="property-price"
            aria-label="Filter properties by price range"
            value={priceValue}
            onChange={(event) => setPriceValue(event.target.value)}
            className={cn(PILL_INPUT_CLASS, "w-full appearance-none")}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by bedrooms">
            {BEDROOM_OPTIONS.map((option) => {
              const active = option.value === bedrooms || (option.value === undefined && bedrooms === undefined);

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setBedrooms(option.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition",
                    active
                      ? "border-[#c8a34d] bg-[#c8a34d] text-slate-950"
                      : "border-white/60 bg-white/60 text-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] hover:border-[#c8a34d]/70 hover:text-[#c8a34d]"
                  )}
                >
                  {option.label} Beds
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-full bg-[#c8a34d] px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-950 shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition hover:bg-[#d6b15a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a34d] focus-visible:ring-offset-2"
            >
              Search Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
