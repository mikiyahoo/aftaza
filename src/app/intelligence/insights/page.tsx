import Link from 'next/link'
import { SectionTitle } from "@/components/ui/Section";
import { insights } from "@/data/protocols";

export default async function IntelligenceHub() {
  return (
    <main data-header-text="light" className="bg-white pt-32 pb-20">
      <div className="container-x">
        <header className="border-b border-slate-900 pb-12 mb-16">
          <SectionTitle as="h1" size="hero" className="!text-6xl uppercase tracking-tighter">
            Market Intelligence <br /> &{' '}
            <span className="text-[#c8a34d]">Systemic Frameworks</span>
          </SectionTitle>
          <p className="mt-8 text-slate-500 font-mono text-xs uppercase tracking-widest max-w-xl">
            AFTAZA Institutional Publication // Series 2026.01 // Focus:
            Ethiopia Real Estate Ecosystem Alignment.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-20">
            {insights.map((protocol) => (
              <Link
                key={protocol.slug}
                href={`/intelligence/insights/${protocol.slug}`}
                className="group block"
              >
                <article>
                  <span className="text-[#c8a34d] font-mono text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
                    {protocol.silo.replace('-', ' ')}
                  </span>
                  <SectionTitle className="font-bold uppercase leading-none group-hover:underline decoration-[#c8a34d] decoration-2 underline-offset-8 mb-6 transition-all">
                    {protocol.title}
                  </SectionTitle>
                  <p className="text-slate-500 text-lg font-light mb-6">
                    {protocol.metadata.problemStatement}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span>Read Protocol</span>
                    <div className="h-px w-8 bg-slate-900 group-hover:w-16 transition-all" />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 border-l border-slate-100 pl-12 h-fit sticky top-32">
            <h3 className="font-display font-black uppercase text-xs tracking-widest mb-8 text-slate-400">
              Governance Silos
            </h3>
            <ul className="space-y-6">
              {[
                'Transaction Governance',
                'Absorption Strategy',
                'Capital Structuring',
                'Market Intelligence',
              ].map((silo) => (
                <li key={silo} className="group cursor-pointer">
                  <span className="text-sm font-bold uppercase hover:text-[#c8a34d] transition-colors">
                    {silo}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">
                    Browse Protocols →
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  )
}
