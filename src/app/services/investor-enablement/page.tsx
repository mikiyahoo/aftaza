"use client";

import { 
  TrendingUp, BarChart3, Globe, Landmark, 
  ShieldAlert, Workflow, PieChart, ArrowUpRight,
  GanttChartSquare, Briefcase, Activity, Scale
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Section";

const marketGaps = [
  "Weak transaction governance", "Informal documentation systems", 
  "Limited performance visibility", "Inconsistent absorption data",
  "Developer transparency gaps", "Risk mispricing"
];

const enablementModel = [
  { p: "Phase 01", t: "Governance Review", d: "Audit of existing developer documentation and reporting discipline." },
  { p: "Phase 02", t: "Risk Structuring", d: "Identifying project viability indicators and cash flow predictability." },
  { p: "Phase 03", t: "Capital Sequencing", d: "Designing tranche-based disbursement logic and payment triggers." },
  { p: "Phase 04", t: "Deployment Oversight", d: "Active monitoring of capital flow against technical milestones." },
  { p: "Phase 05", t: "Performance Monitoring", d: "Ongoing reporting on absorption and revenue stabilization." }
];

export default function InvestorEnablementPage() {
  return (
    <main className="bg-slate-950 text-white min-h-screen selection:bg-[#c8a34d] selection:text-white">
      
      {/* HERO: CAPITAL TRUST */}
      <section className="relative pt-40 pb-32 border-b border-white/5">
        <div className="container-x relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c8a34d]/10 border border-[#c8a34d]/20 rounded-full mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a34d] animate-pulse" />
              <span className="text-[#c8a34d] font-mono text-[9px] font-bold uppercase tracking-widest">Capital_Governance_Active</span>
            </div>
            <SectionTitle as="h1" tone="dark" size="hero" className="uppercase tracking-tighter leading-[0.9] mb-10 md:!text-8xl">
              Structured Capital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a34d] to-[#dfc278]">Deployment.</span>
            </SectionTitle>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mb-12 leading-relaxed">
              AFTAZA enables investors and financiers to deploy capital into governed, documented, and performance-aligned environments across Ethiopia.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button className="bg-white text-slate-950 px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-[#c8a34d] hover:text-white transition-all">
                Initiate Capital Consultation
              </Button>
              <Button className="px-12 py-5 text-xs font-black uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-all">
                Request Screening Framework
              </Button>
            </div>
          </div>
        </div>
        {/* Architectural Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </section>

      {/* THE MARKET GAP: OPACITY ANALYSIS */}
      <section className="py-24 bg-slate-900/50">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <SectionTitle tone="dark" className="uppercase tracking-tighter mb-8 leading-none">
                Capital Does Not Fear Risk. <br />
                <span className="text-[#c8a34d]">Capital Fears Opacity.</span>
              </SectionTitle>
              <p className="text-slate-400 mb-10 leading-relaxed">
                Opportunity in Ethiopia is high, but deployment is constrained by systemic governance gaps. We solve for transparency.
              </p>
              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                {marketGaps.map((gap, i) => (
                  <div key={i} className="p-4 bg-slate-950 flex items-center gap-3">
                    <div className="w-1 h-1 bg-red-500 shadow-[0_0_8px_red]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center border border-white/5 bg-slate-950/50 p-12 relative overflow-hidden">
               <div className="relative z-10 text-center">
                  <Activity size={48} className="text-[#c8a34d] mx-auto mb-6" strokeWidth={1} />
                  <h4 className="text-xl font-display font-bold uppercase mb-4 tracking-tight">Structured Visibility</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto italic">Transitioning from speculative positioning to documented performance clarity.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE ENABLEMENT MODEL: PHASED DEPLOYMENT */}
      <section className="py-24 bg-slate-950">
        <div className="container-x">
          <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-12">
            <SectionTitle tone="dark" className="uppercase tracking-tighter md:!text-6xl">The Capital <br /> <span className="text-[#c8a34d]">Enablement Model.</span></SectionTitle>
            <p className="hidden lg:block text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mb-2">Ref: AFTAZA_Stewardship_Protocol</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {enablementModel.map((phase, i) => (
              <div key={i} className="group relative border-l border-white/10 pl-8 pb-12 last:pb-0">
                <span className="text-[#c8a34d] font-mono text-[10px] font-bold mb-4 block group-hover:translate-x-2 transition-transform">{phase.p}</span>
                <h4 className="text-lg font-display font-bold uppercase mb-4 leading-tight group-hover:text-[#c8a34d] transition-colors">{phase.t}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{phase.d}</p>
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#c8a34d] group-hover:h-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* METRIC ALIGNMENT */}
      <section data-header-text="light" className="py-24 bg-white text-slate-950">
        <div className="container-x">
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-1">
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-6">Aligning with <br /> Performance.</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                AFTAZA is not a fund or a broker. We are a **Structuring Institution** that aligns capital with technical performance checkpoints.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-12 border-l border-slate-100 pl-16">
              {[
                { l: "Absorption Stability", d: "Monitoring unit release velocity to protect pricing floors." },
                { l: "Revenue Predictability", d: "Evaluating developer cash flows and payment compliance ratios." },
                { l: "Capital Velocity", d: "Ensuring deployment speed matches construction milestones." },
                { l: "Governance Integrity", d: "Auditing documentation chains to ensure asset financeability." }
              ].map((item, i) => (
                <div key={i}>
                  <h4 className="font-bold uppercase text-xs mb-3 flex items-center gap-2">
                    <div className="w-4 h-px bg-[#c8a34d]" /> {item.l}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA: INSTITUTIONAL INQUIRY */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="container-x text-center relative z-10">
          <Scale size={48} className="mx-auto text-[#c8a34d] mb-10 opacity-50" strokeWidth={1} />
          <SectionTitle tone="dark" size="hero" className="uppercase tracking-tighter mb-10 leading-[0.85] md:!text-8xl">
            Engineering Capital <br /> <span className="text-[#c8a34d]">Confidence.</span>
          </SectionTitle>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Investment begins with structured intake review. Engagement is limited to formal advisory mandates for institutional and HNW capital groups.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button className="bg-[#c8a34d] text-white px-16 py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all">
              Initiate Capital Consultation
            </Button>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest italic">
              AFTAZA Institutional // Capital Stewardship Division
            </p>
          </div>
        </div>
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#c8a34d]/5 blur-[120px] rounded-full pointer-events-none" />
      </section>
    </main>
  );
}
