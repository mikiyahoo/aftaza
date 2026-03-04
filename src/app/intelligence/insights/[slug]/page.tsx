import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SectionTitle } from "@/components/ui/Section";
import { insights } from "@/data/protocols";

export default async function InsightPage({
  params,
}: {
  params: { slug: string }
}) {
  const insight = insights.find((item) => item.slug === params.slug);
  if (!insight) {
    notFound()
  }

  return (
    <main data-header-text="light" className="bg-white pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <Link
          href="/intelligence/insights"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-12 hover:text-[#c8a34d] transition-colors"
        >
          ← Back to Intelligence Hub
        </Link>

        <span className="text-[#c8a34d] font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
          {insight.silo.replace('-', ' ')}
        </span>

        <SectionTitle as="h1" className="!text-5xl uppercase leading-tight mb-8">
          {insight.title}
        </SectionTitle>

        <div className="border-l-4 border-[#c8a34d] pl-8 space-y-12">
          <section>
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
              Problem Statement
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              {insight.metadata.problemStatement}
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
              Systemic Cause
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              {insight.metadata.systemicCause}
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
              Structural Solution
            </h2>
            <p className="text-slate-900 text-lg font-medium leading-relaxed">
              {insight.metadata.structuralSolution}
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
          <div className="text-[10px] font-mono text-slate-400">
            Published: {insight.publishedDate}
          </div>
          <Link
            href={insight.ctaLink}
            className="btn-primary text-xs"
          >
            Explore Service →
          </Link>
        </div>
      </div>
    </main>
  )
}
