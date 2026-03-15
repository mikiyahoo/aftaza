import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  CalendarCheck2,
  Home,
  Search,
  ShieldCheck,
} from "lucide-react";
import FeaturedListings from "@/components/properties/FeaturedListings";
import InsightsSection from "@/components/properties/InsightsSection";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyImage from "@/components/properties/PropertyImage";
import Badge from "@/components/ui/Badge";
import { getPropertyInsightsFeed } from "@/lib/supabase/blogs";
import { getFeaturedProperties } from "@/lib/supabase/properties";
import { getDatabaseTestimonials } from "@/lib/properties/server";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Discover premium residential, commercial, and investment properties curated by AFTAZA experts in Addis Ababa.",
};

export const dynamic = "force-dynamic";

const steps = [
  {
    num: "01",
    title: "Discover",
    description: "Browse properties that match your needs.",
    icon: Search,
  },
  {
    num: "02",
    title: "Schedule",
    description: "Book a viewing with our experts.",
    icon: CalendarCheck2,
  },
  {
    num: "03",
    title: "Purchase",
    description: "Secure the property that fits your goals.",
    icon: Home,
  },
  {
    num: "04",
    title: "Buyback Guarantee",
    description: "Enjoy peace of mind with our support.",
    icon: ShieldCheck,
  },
];

export default async function PropertiesPage() {
  const [featuredProperties, insightsFeed, testimonials] = await Promise.all([
    getFeaturedProperties(6),
    getPropertyInsightsFeed(),
    getDatabaseTestimonials(),
  ]);

  const featuredTestimonial = testimonials.length > 0 ? testimonials[0] : null;

  return (
    <main className="property-shell min-h-screen">
      <section
        data-header-surface="dark"
        data-header-shell="transparent"
        className="relative flex min-h-[100svh] items-center overflow-x-hidden overflow-y-visible bg-brand-navy py-28 md:py-32"
      >
        <div className="absolute inset-0 bg-brand-navy" />
        <div className="absolute inset-0">
          <PropertyImage
            src="/property/luxury-house-image.jpg"
            alt="Luxury house background"
            fallbackLabel="Luxury House"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/70 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(9,17,31,0.98) 0%, rgba(9,17,31,0.98) 36%, rgba(9,17,31,0.86) 54%, rgba(9,17,31,0.45) 72%, rgba(9,17,31,0) 100%)",
          }}
        />
        <div className="property-hero-grid absolute inset-0 opacity-20" />

        <div className="container-x relative z-20 w-full">
          <div className="mx-auto grid min-h-[calc(100svh-10rem)] w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,460px)] lg:gap-16">
            <div className="property-fade-up text-center lg:text-left">
              <Badge>Addis Ababa, Ethiopia</Badge>
              <h1 className="mb-4 mt-6 text-4xl font-display font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl lg:text-7xl">
                Find Your Perfect Property in Addis Ababa
              </h1>
              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-slate-300 md:mb-8 md:text-lg lg:mx-0 lg:text-xl">
                Explore premium residential, commercial, and investment properties curated by
                Aftaza experts.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:justify-start">
                <Link
                  href="/properties/listings"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Browse Listings
                  <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="btn-outline inline-flex items-center"
                >
                  Speak With A Specialist
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <PropertyFilters
                actionPath="/properties/listings"
                className="property-hero-filter-shell relative z-50 w-full max-w-[460px] property-fade-up"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-16 w-full bg-gradient-to-t from-brand-dark to-transparent md:h-24" />
      </section>

      <FeaturedListings properties={featuredProperties} />

      <section data-header-surface="light" className="section-light section-y relative overflow-hidden">
        <div className="section-divider" />
        <div className="grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

        <div className="container-x relative z-10">
          <div className="section-header">
            <span className="gold-rule mx-auto" />
            <h2 className="text-center">
              <span>How It </span>
              <span className="section-title-accent">Works</span>
            </h2>
            <p className="subtitle">
              One structured property journey. Four governed steps. Every stage handled with
              clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ num, title, description, icon: Icon }) => (
              <div
                key={title}
                className="card group relative flex h-full flex-col border border-[#E2E8F0] bg-white p-8 transition-all duration-500 hover:border-[#c8a34d]"
              >
                <span
                  className="number-watermark absolute right-8 top-6 select-none font-display text-6xl font-semibold text-[rgba(200,163,77,0.08)]"
                  aria-hidden="true"
                >
                  {num}
                </span>

                <div className="mb-6 h-[3px] w-10 bg-[#c8a34d] transition-all duration-500 ease-out group-hover:w-16" />

                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#0f172a] text-[#c8a34d]">
                  <Icon size={20} />
                </div>

                <h3 className="pr-12 font-display text-2xl font-extrabold leading-tight text-[#0f172a]">
                  {title}
                </h3>

                <p className="mb-8 mt-4 flex-grow pr-4 text-sm leading-relaxed text-[#475569]">
                  {description}
                </p>

                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c8a34d]">
                  <span>Step {num}</span>
                  <div className="h-px w-8 bg-[#c8a34d]/50 transition-all duration-300 group-hover:w-12" />
                </div>

                <div className="absolute right-0 top-0 h-12 w-12 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute right-0 top-0 h-[1px] w-8 bg-gradient-to-l from-[#c8a34d] to-transparent" />
                  <div className="absolute right-0 top-0 h-8 w-[1px] bg-gradient-to-b from-[#c8a34d] to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-header-surface="light" className="border-t border-slate-100 bg-white py-24 font-body md:py-32">
        <div className="container-x">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="gold-rule mx-auto" />
            <h2 className="text-4xl font-display font-black tracking-tight text-slate-900 md:text-5xl">
              Real <span className="text-[#c8a34d]">Success Stories</span>
            </h2>
          </div>

          <div>
            {featuredTestimonial ? (
        <div className="group relative mx-auto max-w-6xl overflow-hidden border border-white/10 bg-brand-navy text-white shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(200,163,77,0.1) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid gap-0 lg:grid-cols-[280px_1fr]">
            <div className="flex flex-col items-center justify-center gap-6 border-b border-white/10 px-8 py-10 text-center lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/10 shadow-2xl">
                <PropertyImage
                  src={featuredTestimonial.image || "/property/testimonial-client.jpg"}
                  alt={featuredTestimonial.name}
                  fallbackLabel={featuredTestimonial.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                  Client Profile
                </p>
                <h3 className="mt-4 text-3xl font-display font-bold text-white">{featuredTestimonial.name}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                  {featuredTestimonial.title}
                </p>
              </div>
            </div>

            <div className="px-8 py-10 md:px-10 md:py-12">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                Testimonial Detail
              </p>
              <p className="mt-6 max-w-3xl text-2xl font-display font-bold leading-tight text-white md:text-3xl">
                &ldquo;{featuredTestimonial.quote}&rdquo;
              </p>
              {featuredTestimonial.title && (
                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  {featuredTestimonial.title}
                </p>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#c8a34d] transition-transform duration-500 group-hover:scale-x-100" />
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c8a34d] transition-all duration-500 group-hover:w-full" />
        </div>
      ) : (
        <div className="group relative mx-auto max-w-6xl overflow-hidden border border-white/10 bg-brand-navy text-white shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(200,163,77,0.1) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid gap-0 lg:grid-cols-[280px_1fr]">
            <div className="flex flex-col items-center justify-center gap-6 border-b border-white/10 px-8 py-10 text-center lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/10 shadow-2xl">
                <PropertyImage
                  src="/property/testimonial-client.jpg"
                  alt="Testimonial client"
                  fallbackLabel="Abebech T."
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                  Client Profile
                </p>
                <h3 className="mt-4 text-3xl font-display font-bold text-white">Abebech Tesfaye</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                  Homeowner
                </p>
              </div>
            </div>

            <div className="px-8 py-10 md:px-10 md:py-12">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                Testimonial Detail
              </p>
              <p className="mt-6 max-w-3xl text-2xl font-display font-bold leading-tight text-white md:text-3xl">
                &ldquo;Aftaza made the entire process incredibly smooth – from viewing
                properties in Bole to closing the deal on my new home. The team
                understands the Addis market inside out.&rdquo;
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                A clear process, verified listings, and responsive coordination made the
                transaction easier to evaluate and complete with confidence.
              </p>
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#c8a34d] transition-transform duration-500 group-hover:scale-x-100" />
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c8a34d] transition-all duration-500 group-hover:w-full" />
        </div>
      )}
          </div>
        </div>
      </section>

      <section data-header-surface="dark" className="relative overflow-hidden bg-brand-navy py-24 font-body md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent pointer-events-none" />

        <div className="container-x relative z-10">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-12">
              <div className="mb-8 mx-auto h-1 w-[60px] bg-[#c8a34d]" />
              <h2 className="text-4xl font-display font-black tracking-tight text-white md:text-5xl">
                Ready to Find <span className="font-bold text-[#c8a34d]">Your Home?</span>
              </h2>
            </div>

            <div className="overflow-hidden border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm">
              <div className="group relative bg-brand-dark/80 p-10 transition-all duration-500 hover:bg-brand-dark/90 md:p-12">
                <div className="mb-10 flex items-center justify-center">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#c8a34d]">
                    Consultation CTA
                  </span>
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                  <div className="max-w-3xl">
                    <h3 className="text-3xl font-display font-bold leading-tight text-white md:text-4xl">
                      Book a guided consultation with the AFTAZA property desk.
                    </h3>
                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                      We help buyers, investors, and property companies move with more
                      confidence through verified review, viewing coordination, and a
                      disciplined advisory path.
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Book A Free Consultation
                    <ArrowUpRight size={16} />
                  </Link>
                </div>

                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#c8a34d] transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <InsightsSection
        featured={insightsFeed.featured}
        recent={insightsFeed.recent}
        error={insightsFeed.error}
      />
    </main>
  );
}

