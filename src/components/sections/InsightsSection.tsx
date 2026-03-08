import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestInsights } from "@/lib/insights-data";

function InsightCard({
  href,
  title,
  excerpt,
  thumbnailUrl,
  featured = false,
}: {
  href: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 ${
        featured ? "h-full" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-slate-100 ${featured ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 320px"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)]" />
        )}
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
            Aftaza Insight
          </p>
          <h3
            className={`mt-2 font-display font-black uppercase tracking-tight text-slate-950 transition-colors group-hover:text-[#c8a34d] ${
              featured ? "text-3xl" : "text-xl"
            }`}
          >
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{excerpt}</p>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition group-hover:text-[#c8a34d]">
          Read More
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default async function InsightsSection() {
  const insights = await getLatestInsights(5);
  const [featured, ...secondary] = insights;

  return (
    <section className="bg-white py-20">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#c8a34d]">
              Insights Integration
            </p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-slate-950">
              Latest Real Estate Insights
            </h2>
            <p className="mt-3 text-slate-600">
              Reusing the live blog data source keeps the property funnel connected to search, trust, and education content.
            </p>
          </div>

          <Link
            href="/insights"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-xs font-black uppercase tracking-[0.28em] text-slate-700 transition hover:border-[#c8a34d] hover:text-[#c8a34d]"
          >
            Explore Insights
          </Link>
        </div>

        {featured ? (
          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
            <InsightCard
              href={`/insights/${featured.slug}`}
              title={featured.title}
              excerpt={featured.excerpt}
              thumbnailUrl={featured.thumbnailUrl}
              featured
            />

            <div className="grid gap-6 sm:grid-cols-2">
              {secondary.map((insight) => (
                <InsightCard
                  key={insight.id}
                  href={`/insights/${insight.slug}`}
                  title={insight.title}
                  excerpt={insight.excerpt}
                  thumbnailUrl={insight.thumbnailUrl}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-[32px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
            <p className="text-lg font-semibold text-slate-700">
              No published insights are available yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Publish at least five posts to fill the featured plus four-card layout.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
