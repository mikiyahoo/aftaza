"use client";

import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { SectionTitle } from "@/components/ui/Section";
import { 
  ShieldCheck, 
  Settings, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  FileText,
  Workflow,
  Zap,
  BarChart3
} from "lucide-react";

// --- Custom Sub-Components for Clean Code ---

const StatBarItem = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-4 p-6 border-r border-white/10 last:border-r-0 group">
    <Icon size={20} className="text-[#c8a34d] transition-transform duration-500 group-hover:scale-125" />
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">{label}</span>
  </div>
);

const EcosystemCard = ({ icon: Icon, title, desc, variant = "dark" }: any) => (
  <div className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 p-10 border ${
    variant === "gold" 
    ? "bg-[#c8a34d] border-[#c8a34d]" 
    : "bg-white/5 border-white/10 hover:border-[#c8a34d]/50"
  }`}>
    {/* Hover Glow for Dark Cards */}
    {variant === "dark" && (
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
           style={{ background: "radial-gradient(circle at top right, rgba(200,163,77,0.1) 0%, transparent 70%)" }} />
    )}
    
    <Icon size={32} className={`mb-6 transition-transform duration-500 group-hover:scale-110 ${variant === "gold" ? "text-slate-900" : "text-[#c8a34d]"}`} />
    <h3 className={`text-xl font-display mb-4 ${variant === "gold" ? "text-slate-900" : "text-white"}`}>{title}</h3>
    <p className={`text-sm leading-relaxed ${variant === "gold" ? "text-slate-800" : "text-slate-400 group-hover:text-slate-200"}`}>{desc}</p>
    
    {variant === "dark" && (
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c8a34d] transition-all duration-500 group-hover:w-full" />
    )}
  </div>
);

const PhaseCard = ({ step, title, desc }: { step: string; title: string; desc: string }) => (
  <div className="group bg-white p-8 border border-slate-100 hover:border-[#c8a34d]/30 hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500 cursor-default">
    <div className="flex justify-between items-start mb-8">
      <span className="text-[10px] font-black tracking-[0.3em] text-slate-300 group-hover:text-[#c8a34d] transition-colors">
        PHASE {step}
      </span>
      <ArrowRight size={16} className="text-[#c8a34d] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </div>
    <h4 className="text-slate-900 text-lg font-display mb-3 group-hover:translate-x-1 transition-transform">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

// --- Main Page Component ---

export default function AboutPage() {
  return (
    <main className="bg-brand-dark text-white">
      
      {/* --- HERO SECTION --- */}
      <section 
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ 
          backgroundImage: `url('/images/aftaza-transaction-architecture-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent z-10" />
        
        <div className="container-x relative z-20 pt-20">
          <div className="max-w-[850px]">
            <Badge className="mb-6">Institutional Profile</Badge>
            <SectionTitle as="h1" tone="dark" size="hero" className="mb-8 md:!text-7xl">
              About AFTAZA PLC — <br />
              <span className="text-[#c8a34d]">Industrializing Trust</span> <br />
              in Real Estate.
            </SectionTitle>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed border-l-2 border-[#c8a34d] pl-8">
              AFTAZA PLC is Ethiopia's structured Real Estate Transaction Advisory firm. 
              We build the governance systems that align developers, buyers, and investors 
              into a single high-trust ecosystem.
            </p>
          </div>
        </div>

        {/* Floating Institutional Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 z-20 hidden lg:block">
          <div className="container-x grid grid-cols-4">
            <StatBarItem icon={Settings} label="Strategy" />
            <StatBarItem icon={Layers} label="Sales Operations" />
            <StatBarItem icon={ShieldCheck} label="Governance" />
            <StatBarItem icon={FileText} label="Documentation" />
          </div>
        </div>
      </section>

      {/* --- THE INSTITUTION (WHITE SECTION) --- */}
      <section data-header-text="light" className="bg-white py-24 md:py-32">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <span className="gold-rule mb-8" />
              <SectionTitle className="mb-8">
                We Are Not an Intermediary. <br />
                We Are an Institution.
              </SectionTitle>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                AFTAZA PLC operates as a structured Real Estate Transaction Advisory & Commercialization firm based in Kirkos, Addis Ababa.
              </p>
              <p className="text-slate-500 leading-relaxed italic">
                While much of the market operates informally, AFTAZA was built to introduce discipline, transparency, and performance accountability into every transaction.
              </p>
            </div>
            
            <div className="bg-slate-50 p-12 border border-slate-100 relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={120} className="text-slate-900" />
               </div>
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-10">Institutional Logic</h4>
               <ul className="space-y-6">
                 {[
                   { t: "Strategy", d: "Engineering high-conversion revenue systems." },
                   { t: "Governance", d: "Documented integrity across the lifecycle." },
                   { t: "Trust", d: "Industrializing credibility for stakeholders." }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4 group">
                     <div className="mt-1 h-5 w-5 rounded-full border border-[#c8a34d] flex items-center justify-center shrink-0">
                        <div className="h-1.5 w-1.5 bg-[#c8a34d] rounded-full" />
                     </div>
                     <div>
                       <span className="block font-bold text-slate-900 text-sm uppercase tracking-wider">{item.t}</span>
                       <span className="text-slate-500 text-sm">{item.d}</span>
                     </div>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- ECOSYSTEM (DARK SECTION) --- */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c8a34d]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container-x relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge className="mx-auto mb-6">The Ecosystem</Badge>
            <SectionTitle tone="dark">The Central Coordination Point</SectionTitle>
            <p className="mt-6 text-slate-400">Reducing information asymmetry and execution chaos through institutional orchestration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <EcosystemCard 
              icon={Globe} 
              title="Vision" 
              desc="To become Ethiopia's most trusted commercialization institution where projects gain credibility and markets gain clarity." 
            />
            <EcosystemCard 
              icon={Workflow} 
              title="Mission" 
              desc="To design end-to-end commercialization systems that transform real estate projects into scalable revenue engines." 
            />
            <EcosystemCard 
              variant="gold"
              icon={Zap} 
              title="Brand Promise" 
              desc="We don't decorate projects. We commercialize them. Strategy becomes execution, and execution becomes market leadership." 
            />
          </div>
        </div>
      </section>

      {/* --- WORKFLOW (WHITE SECTION) --- */}
      <section data-header-text="light" className="bg-white py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div className="max-w-xl">
              <span className="gold-rule mb-8" />
              <SectionTitle>How We Engage</SectionTitle>
            </div>
            <p className="text-slate-500 max-w-xs text-sm italic">Structured phases designed for measurable outcomes and risk reduction.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PhaseCard step="01" title="Discovery" desc="Deep scoping of objectives, constraints, and success criteria." />
            <PhaseCard step="02" title="System Design" desc="Building transaction frameworks custom-built for governance." />
            <PhaseCard step="03" title="Implementation" desc="Deployment, team alignment, and rigorous execution oversight." />
            <PhaseCard step="04" title="Optimization" desc="Continuous improvement through dashboard monitoring." />
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 border-t border-white/5 relative">
        <div className="container-x text-center relative z-10">
          <SectionTitle tone="dark" className="mb-10 leading-tight md:!text-6xl">
            Structure Your <br />
            <span className="text-[#c8a34d]">Market Leadership</span>
          </SectionTitle>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact" className="btn-primary px-12 py-5 text-sm uppercase font-bold tracking-widest">
              Structure an Engagement
            </Link>
            <Link href="/services" className="btn-outline px-12 py-5 text-sm uppercase font-bold tracking-widest border-white/20 text-white hover:border-[#c8a34d]">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
