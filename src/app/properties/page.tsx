import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BadgeCheck, Building2, BuildingIcon, HomeIcon } from "lucide-react";
import FeaturedListings from "@/components/properties/FeaturedListings";
import PropertyFilters from "@/components/properties/PropertyFilters";
import InsightsSection from "@/components/sections/InsightsSection";
import { getPropertyFilterOptions } from "@/lib/property-data";

export const metadata: Metadata = {
  title: "Properties | AFTAZA PLC",
  description:
    "Search premium Addis Ababa property inventory, review featured listings, and move directly into Aftaza's governed lead funnel.",
};

export const revalidate = 300;

const categories = [
  {
    label: "Residential",
    href: "/properties/listings?type=HOUSE",
    icon: HomeIcon,
    description: "Homes and villas curated for owner-occupiers and diaspora buyers.",
  },
  {
    label: "Commercial",
    href: "/properties/listings?type=COMMERCIAL",
    icon: Building2,
    description: "Retail, office, and mixed-use assets ready for performance-led review.",
  },
  {
    label: "Apartments",
    href: "/properties/listings?type=APARTMENT",
    icon: BuildingIcon,
    description: "Apartment inventory optimized for speed, clarity, and price discovery.",
  },
];

function SectionSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="container-x py-20">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="h-[420px] animate-pulse rounded-[32px] bg-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
          />
        ))}
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  const filterOptions = await getPropertyFilterOptions();

  return (
    <main data-header-text="light" className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#20304d_0%,#0f172a_42%,#09111f_100%)] pt-32 pb-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,163,77,0.22),transparent_32%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.06)_100%)]" />
        </div>

        <div className="container-x relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#dfc278] backdrop-blur-[12px]">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Governed Property Discovery
            </div>

            <h1 className="mt-6 font-display text-5xl font-black uppercase tracking-tight md:text-6xl">
              Find The Right Property Without Losing Speed Or Trust
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Move from inventory search to preview to lead capture in one flow. The public property system now uses server-rendered queries, split-screen browsing, and always-visible tour CTAs.
            </p>
          </div>

          <PropertyFilters
            locations={filterOptions.locations}
            targetPath="/properties/listings"
            className="mt-10"
          />
        </div>
      </section>

      <section className="-mt-10 pb-8">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.label}
                  href={category.href}
                  className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-tight text-slate-950">
                    {category.label}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton cards={6} />}>
        <FeaturedListings />
      </Suspense>

      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="rounded-[32px] border border-white/70 bg-white/60 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px] md:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
                  Trust Signal
                </p>
                <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-slate-950">
                  Every Listing Should Move A Lead Toward Action
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  The preview panel keeps the tour CTA above the fold, the footer CTA captures supply-side leads, and the insights section converts undecided buyers with contextual education instead of dead-end browsing.
                </p>
              </div>

              <blockquote className="rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-[12px]">
                <p className="text-lg leading-8 text-slate-700">
                  "A lead-generation property experience should reduce uncertainty, not just show images. Search, preview, trust cues, and contact actions need to operate as one system."
                </p>
                <footer className="mt-4 text-sm font-semibold text-slate-900">
                  AFTAZA Product Review
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton cards={5} />}>
        <InsightsSection />
      </Suspense>

      <section className="bg-[linear-gradient(180deg,#0f172a_0%,#09111f_100%)] py-20 text-white">
        <div className="container-x text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#dfc278]">
            Lead Capture
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
            Ready To Book A Tour Or List Inventory?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Use the listings browser for buyer-side discovery and the floating footer CTA for company-side acquisition. Both now share the same design rules and conversion intent.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/properties/listings"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#c8a34d] px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-950 shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition hover:bg-[#d6b15a]"
            >
              Browse Listings
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-white transition hover:border-[#c8a34d] hover:text-[#c8a34d]"
            >
              Contact Aftaza
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
