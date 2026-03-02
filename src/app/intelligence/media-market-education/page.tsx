"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, PlayCircle, Fingerprint, LineChart, 
  ShieldCheck, FileSearch, Megaphone, Target,
  ArrowRight, Layers, HardDrive, MonitorPlay,
  CheckCircle2, Globe, Sparkles
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Section";

const mediaSystems = [
  {
    title: "Institutional Identity",
    icon: Fingerprint,
    desc: "Structured brand systems that signal credibility. We replace 'hype' with disclosure-aligned positioning."
  },
  {
    title: "Demand Engineering",
    icon: Target,
    desc: "Integrated campaign architecture aligned with absorption strategy and measurable pipeline health."
  },
  {
    title: "TAZA Production",
    icon: MonitorPlay,
    desc: "High-quality property films, founder narratives, and project explainers aligned with commercial objectives."
  },
  {
    title: "Sales-Enabling Content",
    icon: Layers,
    desc: "FAQ video libraries and risk-explanation guides designed to reduce buyer anxiety and accelerate closing."
  }
];

export default function MediaMarketingPage() {
  return (
    <main className="snap-container bg-white text-slate-900">
      
      {/* HERO SECTION - THE COMMAND CENTER */}
      <section className="snap-section bg-slate-50 relative flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#c8a34d_1px,transparent_1px),linear-gradient(to_bottom,#c8a34d_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="container-x relative z-10 w-full">
          <div className="max-w-5xl">
            <motion.div initial={{ width: 0 }} animate={{ width: "100px" }} className="h-1.5 bg-[#c8a34d] mb-10" />
            <SectionTitle as="h1" size="hero" className="uppercase mb-8 !text-6xl md:!text-8xl lg:!text-9xl tracking-tighter leading-[0.85]">
              We Don’t Create <span className="text-slate-300">Noise.</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a34d] to-[#9a7b32]">We Engineer Credibility.</span>
            </SectionTitle>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl font-light leading-relaxed mb-12">
              AFTAZA’s media systems are built to generate <span className="text-slate-900 font-medium">qualified demand</span> and accelerate real estate conversion—not just impressions.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact" className="btn-primary px-12 py-5 text-sm uppercase tracking-widest font-bold">Build Structured Campaign</Link>
              <Button className="btn-outline px-12 py-5 text-sm uppercase tracking-widest font-bold border-slate-200">Explore Media Systems</Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: POSITIONING & PHILOSOPHY */}
      <section className="snap-section bg-white flex items-center">
        <div className="container-x w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#c8a34d] font-mono text-xs tracking-[0.4em] uppercase font-black block mb-6">Strategic_Positioning</span>
              <SectionTitle className="md:!text-6xl tracking-tighter uppercase leading-tight mb-8">
                Marketing Without <br /> Governance Creates <span className="text-[#c8a34d]">Distrust.</span>
              </SectionTitle>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>In Ethiopian real estate, exaggerated campaigns and vague promises destroy long-term equity.</p>
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-slate-900 font-bold uppercase text-xs mb-3">Traditional Focus</h4>
                    <ul className="text-sm space-y-2 opacity-60">
                      <li>• Visual Short-term Hype</li>
                      <li>• Aggressive Messaging</li>
                      <li>• Vanity Impressions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[#c8a34d] font-bold uppercase text-xs mb-3">AFTAZA Alignment</h4>
                    <ul className="text-sm space-y-2 text-slate-900">
                      <li>• Documentation Integrity</li>
                      <li>• Disclosure Discipline</li>
                      <li>• Sales Governance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden group">
                <img src="/images/aftaza-real-estate-marketing.jpg" alt="Structured Marketing" className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-white font-serif-accent italic text-xl italic">"Education builds trust. Trust increases velocity."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CORE MEDIA ARCHITECTURE GRID */}
      <section className="snap-section bg-slate-950 flex items-center">
        <div className="container-x w-full py-20">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-3xl">
              <span className="text-[#c8a34d] font-mono text-xs tracking-[0.4em] uppercase font-black block mb-6">Core_Architecture</span>
              <SectionTitle tone="dark" className="md:!text-6xl uppercase tracking-tighter">
                The AFTAZA Media <br /> & Marketing <span className="text-[#c8a34d]">Systems</span>
              </SectionTitle>
            </div>
            <div className="hidden lg:block h-px flex-1 bg-white/10 mx-10 mb-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {mediaSystems.map((system, i) => (
              <div key={i} className="p-10 lg:p-12 bg-slate-950 hover:bg-slate-900 transition-colors group relative overflow-hidden min-h-[400px] flex flex-col">
                <div className="mb-10">
                  <system.icon size={32} className="text-[#c8a34d] mb-8" strokeWidth={1} />
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight mb-4">{system.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{system.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-[#c8a34d] text-[10px] font-mono font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  System_Integrated <ArrowRight size={12} />
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-black text-6xl text-white">0{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PERFORMANCE GOVERNANCE (The Table Section) */}
      <section className="snap-section bg-white flex items-center">
        <div className="container-x w-full">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <SectionTitle className="uppercase tracking-tighter mb-6">
              Marketing With <span className="text-[#c8a34d]">Accountability.</span>
            </SectionTitle>
            <p className="text-slate-500">We are not a creative agency. We are a commercialization institution.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[10px] tracking-widest uppercase">
                  <th className="p-6 border-r border-white/10">Metric Category</th>
                  <th className="p-6 border-r border-white/10">Traditional Agencies</th>
                  <th className="p-6 text-[#c8a34d]">AFTAZA Focus</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["Attention", "Impressions & Views", "Qualified Lead Conversion"],
                  ["Engagement", "Likes & Clicks", "Pipeline Velocity"],
                  ["Strategy", "Creative Hype", "Documentation Alignment"],
                  ["Outcome", "Vanity Growth", "Absorption Revenue"]
                ].map(([cat, trad, aft], i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="p-6 font-bold uppercase text-xs border-r border-slate-200">{cat}</td>
                    <td className="p-6 text-slate-400 border-r border-slate-200 italic">{trad}</td>
                    <td className="p-6 font-medium text-slate-900">{aft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4: FINAL CTA OVERLAY */}
      <section className="snap-section bg-white relative flex items-center justify-center overflow-hidden">
        {/* Background Ghost Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <span className="text-[30vw] font-black uppercase leading-none">AFTAZA</span>
        </div>

        <div className="container-x relative z-10 w-full">
          <div className="max-w-4xl mx-auto bg-slate-950 p-12 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c8a34d]" />
            <span className="text-[#c8a34d] font-mono text-[10px] tracking-[0.5em] uppercase font-black mb-8 block">Execution_Ready</span>
            <SectionTitle tone="dark" className="md:!text-6xl lg:!text-7xl uppercase tracking-tighter mb-10 leading-none italic">
              Build Credibility <br /> <span className="text-[#c8a34d]">That Converts.</span>
            </SectionTitle>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/contact" className="btn-primary px-12 py-5 text-sm uppercase tracking-widest font-bold">Launch Structured Campaign</Link>
              <Link href="/contact" className="btn-outline !text-white !border-white/20 px-12 py-5 text-sm uppercase tracking-widest font-bold">Discuss Commercialization</Link>
            </div>
            <div className="mt-12 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {['KPI Definition', 'Weekly Rhythm', 'Sales Alignment', 'Pipeline Health'].map((tag) => (
                <div key={tag} className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={12} className="text-[#c8a34d]" />
                  <span className="text-[8px] font-mono uppercase text-white/40 tracking-widest">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
