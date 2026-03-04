"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Target, 
  Layers, 
  Activity, 
  ArrowRight, 
  AlertTriangle,
  ChevronRight 
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Section";

const failurePatterns = [
  "No transaction governance", "Informal sales processes", "Documentation inconsistency",
  "Weak buyer qualification", "Over-reliance on brokers", "Absorption instability",
  "Pricing distortions", "Reputation erosion"
];

const systemModules = [
  {
    title: "Transaction Governance",
    icon: ShieldCheck,
    desc: "Structuring sales documentation frameworks, payment sequencing models, and compliance audit trails."
  },
  {
    title: "Demand Engineering",
    icon: Target,
    desc: "Designing structured project narratives and buyer segmentation to generate qualified demand, not noise."
  },
  {
    title: "Structured Absorption",
    icon: Layers,
    desc: "Regulating phased release models and pricing logic to ensure stable, predictable revenue flow."
  },
  {
    title: "Conversion Governance",
    icon: Activity,
    desc: "Monitoring lead-to-commitment ratios and payment compliance via performance-tracking analytics."
  }
];

export default function DeveloperSystemsPage() {
  return (
    <main data-header-text="light" className="bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* HERO: THE ENGINEERING PROMISE */}
      <section data-header-text="light" className="relative pt-32 pb-20 border-b-8 border-slate-950">
        <div className="container-x">
          <div className="max-w-5xl">
            <span className="text-[#c8a34d] font-mono text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block">Revenue_Silo_01 // Institutional_Grade</span>
            <SectionTitle as="h1" size="hero" className="uppercase tracking-tighter leading-[0.85] mb-10 !text-6xl md:!text-8xl">
              We Engineer the <br /> 
              <span className="text-[#c8a34d] italic font-light">Commercial</span> Absorption <br />
              of Projects.
            </SectionTitle>
            <p className="text-xl md:text-3xl text-slate-500 font-light max-w-3xl mb-12 leading-tight">
              AFTAZA structures governance-driven commercialization systems that transform real estate developments into <span className="text-slate-950 font-medium underline decoration-[#c8a34d] underline-offset-8">credible, investable assets.</span>
            </p>
            <div className="flex flex-wrap gap-6">
              <Button className="bg-slate-950 text-white px-12 py-6 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#c8a34d] transition-all flex items-center gap-4">
                Structure a Developer Engagement <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* THE MARKET PROBLEM: DIAGNOSTIC CRITIQUE */}
      <section data-header-text="light" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <SectionTitle className="uppercase tracking-tighter leading-none mb-6">
                Projects Fail Because of <br /> <span className="text-[#c8a34d]">Unstructured Commercialization.</span>
              </SectionTitle>
              <p className="text-slate-500 text-lg mb-8">
                Most developments in Ethiopia prioritize construction milestones while neglecting the **Transaction Ecosystem.** This gap creates systemic value-leakage.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {failurePatterns.map((pattern, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-mono font-bold text-slate-300">0{i+1}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE INTERVENTION: SYSTEM ARCHITECTURE */}
      <section data-header-text="light" className="py-24 bg-white">
        <div className="container-x">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20">
            <SectionTitle className="uppercase tracking-tighter leading-none md:!text-6xl">
              Commercialization as a <br /> <span className="text-[#c8a34d]">Structured System.</span>
            </SectionTitle>
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-[0.4em] mt-6 lg:mt-0">Ref: AFTAZA_Protocol_v2.0</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100">
            {systemModules.map((module, i) => (
              <div key={i} className="bg-white p-12 group hover:bg-slate-50 transition-all flex flex-col h-[420px] relative overflow-hidden">
                <module.icon size={32} className="text-[#c8a34d] mb-12" strokeWidth={1} />
                <h3 className="text-xl font-display font-bold uppercase mb-6 tracking-tight group-hover:text-[#c8a34d] transition-colors">{module.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light">{module.desc}</p>
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="h-1 w-12 bg-[#c8a34d]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* LIFECYCLE MODEL: PHASED EXECUTION */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container-x">
          <div className="max-w-3xl mb-20">
             <SectionTitle tone="dark" className="uppercase tracking-tighter mb-8 leading-none md:!text-6xl">The Commercialization <br /> <span className="text-[#c8a34d]">Lifecycle Model.</span></SectionTitle>
             <p className="text-slate-400 font-mono text-xs tracking-widest uppercase italic italic">This is not marketing. This is transaction engineering.</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            {["Governance Structuring", "Market Positioning", "Demand Qualification", "Controlled Absorption", "Performance Monitoring"].map((phase, i) => (
              <div key={i} className="flex items-center gap-12 p-8 border border-white/10 hover:border-[#c8a34d]/50 transition-all group">
                <span className="text-4xl font-display font-black text-white/10 group-hover:text-[#c8a34d] transition-colors italic">0{i+1}</span>
                <h4 className="text-2xl font-display font-bold uppercase tracking-tight">{phase}</h4>
                <div className="ml-auto h-px flex-1 bg-white/5 mx-12 hidden md:block" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Protocol_Active</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRIC TRACKING SECTION */}
      <section data-header-text="light" className="py-24 bg-white">
        <div className="container-x">
          <div className="bg-slate-50 border border-slate-200 p-12 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
               <h3 className="text-3xl font-display font-black uppercase mb-4">Performance Metrics.</h3>
               <p className="text-slate-500 text-sm italic italic">We operate with metrics, not assumptions. Our systems provide full visibility into the project's health.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full lg:w-auto">
               {["Absorption Rate", "Lead-to-Unit Ratio", "Conversion Velocity", "Payment Compliance", "Revenue Stability"].map((m, i) => (
                 <div key={i} className="border-l-2 border-[#c8a34d] pl-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Tracked</span>
                    <span className="text-xs font-black uppercase">{m}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC CTA: THE DECISION POINT */}
      <section data-header-text="light" className="py-32 bg-white relative">
        <div className="container-x text-center border-t border-slate-100 pt-32">
          <div className="max-w-3xl mx-auto">
             <SectionTitle size="hero" className="uppercase tracking-tighter mb-10 leading-[0.85] md:!text-7xl">
               Ready to Engineer <br /> Your <span className="text-[#c8a34d]">Absorption?</span>
             </SectionTitle>
             <p className="text-slate-500 text-lg mb-12 font-light italic">
                Developers who build without transaction governance risk capital instability. Developers who structure commercialization build long-term institutional value.
             </p>
             <div className="flex flex-col items-center gap-6">
                <Button className="bg-slate-950 text-white px-16 py-7 text-xs font-black uppercase tracking-[0.4em] hover:bg-[#c8a34d] transition-all">
                  Structure a Developer Engagement
                </Button>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Engagement via formal advisory review only.</p>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
