"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  buildPropertySearchQuery,
  PROPERTY_LOCATION_OPTIONS,
  PROPERTY_PRICE_RANGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "@/lib/properties/config";
import { cn } from "@/lib/utils";
import type { PropertyRouteFilters } from "@/types/property";

interface PropertyFiltersProps {
  actionPath: string;
  initialFilters?: Partial<PropertyRouteFilters>;
  className?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface PropertyFilterDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

function PropertyFilterDropdown({
  label,
  placeholder,
  value,
  options,
  onChange,
}: PropertyFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const buttonId = useId();
  const listboxId = useId();

  const allOptions = useMemo<FilterOption[]>(
    () => [{ value: "", label: placeholder }, ...options],
    [options, placeholder]
  );

  const selectedIndex = allOptions.findIndex((option) => option.value === value);
  const selectedLabel = allOptions[selectedIndex]?.label ?? placeholder;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const focusOption = useCallback((index: number) => {
    window.requestAnimationFrame(() => {
      optionRefs.current[index]?.focus();
    });
  }, []);

  const openDropdown = useCallback(
    (index?: number) => {
      setIsOpen(true);
      focusOption(index ?? (selectedIndex >= 0 ? selectedIndex : 0));
    },
    [focusOption, selectedIndex]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeDropdown, isOpen]);

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openDropdown(selectedIndex >= 0 ? selectedIndex : 0);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        openDropdown(selectedIndex >= 0 ? selectedIndex : allOptions.length - 1);
      }
    },
    [allOptions.length, openDropdown, selectedIndex]
  );

  const handleOptionKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusOption((index + 1) % allOptions.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusOption((index - 1 + allOptions.length) % allOptions.length);
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusOption(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        focusOption(allOptions.length - 1);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
      }
    },
    [allOptions.length, closeDropdown, focusOption]
  );

  return (
    <div
      ref={dropdownRef}
      className="property-filter-dropdown property-filter-field"
      data-open={isOpen ? "true" : "false"}
    >
      <div className="property-filter-control">
        <button
          id={buttonId}
          type="button"
          className="property-filter-trigger"
          aria-label={label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => (isOpen ? closeDropdown() : openDropdown())}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="property-filter-trigger-label">{selectedLabel}</span>
          <ChevronDown
            size={18}
            className={cn("property-filter-chevron transition-transform duration-300", isOpen && "rotate-180")}
          />
        </button>
      </div>

      <ul id={listboxId} role="listbox" aria-labelledby={buttonId} className="property-filter-panel" hidden={!isOpen}>
        {allOptions.map((option, index) => {
          const isSelected = option.value === value;

          return (
            <li key={`${label}-${option.value || "all"}`} role="presentation">
              <button
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="property-filter-option"
                data-active={isSelected ? "true" : "false"}
                onClick={() => {
                  onChange(option.value);
                  closeDropdown();
                }}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PropertyFilters({
  actionPath,
  initialFilters,
  className,
}: PropertyFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState(initialFilters?.location ?? "");
  const [type, setType] = useState<NonNullable<PropertyRouteFilters["type"]> | "">(
    initialFilters?.type ?? ""
  );
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange ?? "");
  const locationOptions = useMemo(
    () => PROPERTY_LOCATION_OPTIONS.map((option) => ({ value: option, label: option })),
    []
  );
  const typeOptions = useMemo(
    () => PROPERTY_TYPE_OPTIONS.map((option) => ({ value: option, label: option })),
    []
  );
  const priceOptions = useMemo(
    () => PROPERTY_PRICE_RANGE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
    []
  );

  const handleSearch = useCallback(() => {
    const nextFilters: Partial<PropertyRouteFilters> = {
      ...initialFilters,
      location,
      type,
      priceRange,
      selected: "",
    };

    if (priceRange) {
      nextFilters.minPrice = undefined;
      nextFilters.maxPrice = undefined;
    }

    startTransition(() => {
      const query = buildPropertySearchQuery(nextFilters);
      router.push(query ? `${actionPath}?${query}` : actionPath);
    });
  }, [actionPath, initialFilters, location, priceRange, router, type]);

  return (
    <div className={cn("property-filter-wrap property-floating-card w-full p-2 md:p-3", className)}>
      <div className="property-filter-grid grid gap-2 xl:grid-cols-[124px_repeat(3,minmax(0,1fr))_minmax(152px,168px)]">
        <div className="flex">
          <div className="property-tab-active w-full px-4 py-4 text-sm font-semibold tracking-[0.2em]">
            BUY
          </div>
        </div>

        <PropertyFilterDropdown
          label="Location"
          placeholder="Select Neighborhood"
          value={location}
          options={locationOptions}
          onChange={setLocation}
        />

        <PropertyFilterDropdown
          label="Property type"
          placeholder="Property Type"
          value={type}
          options={typeOptions}
          onChange={(nextValue) =>
            setType(nextValue as NonNullable<PropertyRouteFilters["type"]> | "")
          }
        />

        <PropertyFilterDropdown
          label="Price range"
          placeholder="Price Range"
          value={priceRange}
          options={priceOptions}
          onChange={setPriceRange}
        />

        <button
          type="button"
          onClick={handleSearch}
          className="property-filter-search inline-flex items-center justify-center disabled:pointer-events-none disabled:opacity-70"
          aria-label="Search properties"
          disabled={isPending}
        >
          <Search size={16} />
          <span>{isPending ? "Loading" : "Search"}</span>
        </button>
      </div>
    </div>
  );
}
