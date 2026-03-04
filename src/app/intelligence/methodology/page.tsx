"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, FileText, Search, Scale, 
  Handshake, CheckCircle2, ArrowRight, Download, 
  ShieldAlert, Building2, UserCheck, 
  Users, Landmark, PieChart, Briefcase, ChevronRight,
  Sparkles, Shield, Zap
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GlassPanel } from "@/components/ui/Panels";
import { ComplianceBar } from "@/components/ui/SystemUI";
import { SectionTitle } from "@/components/ui/Section";

const pillars = [
  { title: "Process Integrity", icon: ShieldCheck, desc: "Documented checklists and timestamped verification points for every stage." },
  { title: "Disclosure Discipline", icon: FileText, desc: "Pricing logic and payment structures confirmed in writing before commitment." },
  { title: "Documentation Hygiene", icon: Search, desc: "Verification of identity, authority, and alignment between marketing and law." },
  { title: "Risk Screening", icon: ShieldAlert, desc: "Early detection of red flags before financial commitment occurs." },
  { title: "Negotiation Clarity", icon: Handshake, desc: "Balanced commercial terms and explicit risk allocation." },
  { title: "Closing Governance", icon: UserCheck, desc: "Traceable approval sequencing and CRM-backed recordkeeping." }
];

export default function MethodologyPage() {
  return (
    <main data-header-text="light" className="bg-white text-slate-900 overflow-x-hidden snap-container">
      
      {/* HERO SECTION - SNAP 1 */}
      <section data-header-text="light" className="snap-section bg-[#F8F9FB]">
        <div className="grid-pattern absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        
        {/* Decorative background "01" */}
        <div className="absolute top-1/4 -right-10 opacity-[0.03] select-none pointer-events-none">
          <span className="text-[30rem] lg:text-[40rem] font-display font-black leading-none">01</span>
        </div>

        <div className="container-x relative z-10 h-full flex items-center">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: "80px" }} 
              className="h-1 bg-[#c8a34d] mb-8" 
            />
            <SectionTitle as="h1" size="hero" className="text-slate-900 mb-6 leading-[0.9] tracking-tighter md:!text-7xl lg:!text-8xl">
              Transactions Should Be <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a34d] via-[#dfc278] to-[#9a7b32]">Governed.</span>
            </SectionTitle>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-500 max-w-2xl mb-10 font-light leading-relaxed">
              AFTAZA PLC operates a documentation-led methodology designed to
              <span className="text-slate-900 font-medium"> eliminate improvisation</span> in Ethiopian real estate.
            </p>
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <Link href="/contact" className="btn-primary px-10 py-4 shadow-2xl shadow-[#c8a34d]/20">
                Start Structured Transaction
              </Link>
              <button className="btn-outline !text-slate-900 group px-10 py-4">
                <Download size={18} className="mr-3 inline text-[#c8a34d] group-hover:translate-y-1 transition-transform" /> 
                Framework Protocol v3.0
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE OPERATING SYSTEM - SNAP 2 */}
      <section className="snap-section bg-slate-950 relative overflow-hidden">
        {/* Background Integration */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/aftaza-buyer-capital-protection.jpg" 
            alt="AFTAZA Capital Protection" 
            className="h-full w-full object-cover grayscale opacity-10"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,163,77,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,163,77,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="container-x relative z-10 h-full flex flex-col justify-end pb-12 lg:pb-16">
          {/* Content wrapper pushed to bottom with padding */}
          <div className="w-full">
            {/* HORIZONTAL HEADER BLOCK */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-4">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[1px] w-6 bg-[#c8a34d]" />
                  <span className="text-[#c8a34d] font-mono text-[8px] tracking-[0.3em] uppercase font-bold">Protocol_v3.2 // Governance</span>
                </div>
                <SectionTitle tone="dark" className="!text-2xl md:!text-3xl lg:!text-4xl xl:!text-5xl uppercase tracking-tighter leading-tight">
                  <span>The Operating <span className="text-[#c8a34d]">System</span></span>
                  <span className="block text-base lg:text-lg opacity-40 italic mt-1">For Transaction Trust.</span>
                </SectionTitle>
              </div>

              <div className="flex items-center gap-3">
                <GlassPanel className="p-2 border-white/5 bg-white/5">
                  <ComplianceBar
                    tone="green"
                    label="Monitoring_Active"
                    className="gap-2 [&_.compliance-label]:text-[7px] [&_.compliance-label]:font-bold [&_.compliance-label]:text-slate-300 [&_.compliance-label]:tracking-widest"
                  />
                </GlassPanel>
              </div>
            </div>

            {/* PILLARS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-6">
              {pillars.map((pillar, i) => (
                <Card key={i} className="pillar-card-os p-5 lg:p-6 group hover:bg-white/[0.03] transition-all duration-500 relative flex flex-col h-[180px] lg:h-[200px]">
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-[#c8a34d]/40" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-1.5 bg-slate-900 border border-white/5 group-hover:border-[#c8a34d]/30">
                      <pillar.icon size={18} strokeWidth={1.5} className="text-[#c8a34d]" />
                    </div>
                    <span className="font-mono text-[7px] text-slate-600 font-bold group-hover:text-[#c8a34d]">NODE_0{i+1}</span>
                  </div>
                  
                  <h3 className="text-xs lg:text-sm font-display font-bold text-white uppercase tracking-tight mb-1.5 leading-tight line-clamp-2">
                    {pillar.title}
                  </h3>
                  
                  <p className="text-[10px] lg:text-xs text-slate-400 leading-relaxed group-hover:text-slate-200 line-clamp-3">
                    {pillar.desc}
                  </p>
                  
                  {/* Thinner hover line */}
                  <div className="mt-auto pt-2 w-0 h-[0.5px] bg-[#c8a34d]/30 group-hover:w-full transition-all duration-700" />
                </Card>
              ))}
            </div>

            {/* Technical Footer */}
            <div className="flex justify-between items-center opacity-20 pt-4 border-t border-white/10 mt-2">
              <div className="text-[6px] font-mono text-white tracking-[0.2em] uppercase">Architecture: Structured_Advisory</div>
              <div className="flex gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-0.5 h-0.5 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STRUCTURED FLOW + CTA CARD - PERFECTLY BALANCED */}
      <section data-header-text="light" className="snap-section bg-slate-50 relative overflow-hidden flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#c8a34d20_1px,transparent_1px),linear-gradient(to_bottom,#c8a34d20_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#c8a34d]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-200/50 rounded-full blur-3xl"></div>

        <div className="container-x relative z-10 w-full max-w-7xl mx-auto py-8 lg:py-10">
          {/* Structured Flow Section - Top Half */}
          <div className="mb-12 lg:mb-16">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-[#c8a34d]" />
                <span className="text-[#c8a34d] font-mono text-[10px] tracking-[0.3em] uppercase font-bold">Execution_Protocol</span>
                <div className="h-[1px] w-8 bg-[#c8a34d]" />
              </div>
              <SectionTitle className="!text-2xl lg:!text-3xl xl:!text-4xl uppercase tracking-tighter">
                Structured Flow <span className="text-[#c8a34d] relative">Sequence
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#c8a34d]/30"></span>
                </span>
              </SectionTitle>
            </div>
            
            {/* Steps Grid - 3x2 layout for better balance */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto">
              {[
                { num: "01", step: "Demand" },
                { num: "02", step: "Verification" },
                { num: "03", step: "Alignment" },
                { num: "04", step: "Commitment" },
                { num: "05", step: "Closing" },
                { num: "06", step: "Handover" }
              ].map((item, i) => (
                <div key={i} className="group relative">
                  <Card className="bg-white border border-slate-200 p-5 lg:p-6 hover:border-[#c8a34d]/40 hover:shadow-xl transition-all duration-500 relative overflow-hidden h-full">
                    {/* Background number */}
                    <span className="absolute -bottom-2 -right-2 text-6xl lg:text-7xl font-display font-black text-slate-100 group-hover:text-[#c8a34d]/10 transition-colors duration-500 pointer-events-none">
                      {item.num}
                    </span>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <p className="text-[8px] font-mono text-[#c8a34d] mb-2 tracking-[0.3em] uppercase font-bold">
                        Step_Secure
                      </p>
                      <h4 className="text-base lg:text-lg font-display font-black uppercase tracking-tight text-slate-900">
                        {item.step}
                      </h4>
                      <div className="mt-4 flex gap-1">
                        <div className="w-6 h-[2px] bg-[#c8a34d]" />
                        <div className="w-2 h-[2px] bg-slate-200" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* CTA CARD - Bottom Half with negative margin for overlap effect */}
          <div className="relative -mb-20 lg:-mb-24 mt-4">
            {/* Main Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl lg:rounded-3xl shadow-2xl border border-[#c8a34d]/20 overflow-hidden">
              {/* Gold accent line */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#c8a34d] to-transparent"></div>
              
              <div className="p-8 lg:p-10 xl:p-12 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8a34d]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
                
                {/* Status Badge */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                    <Sparkles size={14} className="text-[#c8a34d]" />
                    <span className="text-[9px] font-mono text-[#c8a34d] tracking-[0.2em] uppercase font-bold">
                      Ready to structure your transaction?
                    </span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="text-center max-w-3xl mx-auto">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                    Structure the Transaction <br className="hidden sm:block" /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8a34d] to-[#dfc278] relative">
                      Before It Structures You.
                      <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8a34d]/30 to-transparent"></span>
                    </span>
                  </h3>
                  
                  <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    Join institutional investors and developers who trust AFTAZA's governed approach 
                    to Ethiopian real estate transactions.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link 
                      href="/contact" 
                      className="group relative overflow-hidden px-8 py-4 bg-[#c8a34d] text-slate-900 font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 rounded-lg hover:shadow-[0_0_30px_rgba(200,163,77,0.5)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Begin Advisory Engagement
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#dfc278] to-[#c8a34d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    </Link>
                    
                    <Link 
                      href="/contact" 
                      className="group px-8 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500 rounded-lg hover:border-[#c8a34d]/50 hover:text-[#c8a34d] hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2">
                        Speak with AFTAZA
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </span>
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-[#c8a34d]" /> 24h Response
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="flex items-center gap-1.5">
                      <Shield size={12} className="text-[#c8a34d]" /> Confidential
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#c8a34d]" /> Framework v3.2
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
