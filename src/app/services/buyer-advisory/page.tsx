"use client";

import { 
  ShieldCheck, FileText, AlertTriangle, 
  Search, Landmark, Scale, ClipboardCheck, 
  ArrowRight, Fingerprint, Construction,
  CheckCircle 
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Section";

const systemicRisks = [
  "Incomplete documentation", "Informal sales processes", "Payment exposure",
  "Title inconsistencies", "Project delays", "Verbal commitments",
  "Legal ambiguity", "Pricing opacity"
];

const engagementSteps = [
  { s: "Step 01", t: "Intake & Objective Definition", d: "Defining capital allocation goals and risk tolerance." },
  { s: "Step 02", t: "Project Risk Screening", d: "Evaluating developer track record and delivery capacity." },
  { s: "Step 03", t: "Documentation Audit", d: "Deep-dive into title chains and permit validity." },
  { s: "Step 04", t: "Payment Structuring", d: "Engineering milestone-based disbursement logic." },
  { s: "Step 05", t: "Governed Commitment", d: "Contractual scrubbing and negotiation support." },
  { s: "Step 06", t: "Transaction Monitoring", d: "Post-signature compliance and oversight." }
];

export default function BuyerAdvisoryPage() {
  return (
    <main data-header-text="light" className="bg-white text-slate-900 min-h-screen">
      
      {/* HERO: THE GOVERNED PATHWAY */}
      <section data-header-text="light" className="pt-32 pb-20 border-b border-slate-100 bg-slate-50">
        <div className="container-x">
          <div className="max-w-4xl">
            <span className="text-[#c8a34d] font-mono text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block underline underline-offset-8">Fiduciary_Silo_02</span>
            <SectionTitle as="h1" size="hero" className="uppercase tracking-tighter leading-[0.9] mb-8 md:!text-7xl">
              Buy Real Estate Through a <br />
              <span className="text-[#c8a34d]">Governed Pathway.</span>
            </SectionTitle>
            <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl mb-12 leading-relaxed">
              AFTAZA structures safe, documented, and transparent acquisition journeys that protect buyer capital and reduce transaction risk across Ethiopia’s market.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-slate-950 text-white px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-[#c8a34d] transition-all">Begin Structured Consultation</Button>
              <Button className="border border-slate-200 px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-white">Download Safe Transaction Guide</Button>
            </div>
          </div>
        </div>
      </section>

      {/* THE MARKET REALITY: RISK DIAGNOSTIC */}
      <section className="py-24 border-b border-slate-100">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 text-red-600 mb-6">
                <AlertTriangle size={20} />
                <span className="font-mono text-xs font-black uppercase tracking-widest">Market_Exposure_Warning</span>
              </div>
              <SectionTitle className="uppercase tracking-tighter mb-8">Trust Without Structure <br /> is Exposure.</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                {systemicRisks.map((risk, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                    <span className="text-[11px] font-bold uppercase text-slate-600">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-12 bg-slate-950 text-white relative">
              <h3 className="text-2xl font-display font-bold uppercase mb-6 text-[#c8a34d]">The AFTAZA Intervention</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-8">
                We do not sell property. We structure the transaction environment. Our intervention replaces "broker-led hope" with "institutional-grade governance."
              </p>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#c8a34d]" /> Due Diligence Screening</li>
                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#c8a34d]" /> Transaction Structuring</li>
                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-[#c8a34d]" /> Capital Protection Logic</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* THE STEP MODEL: VISUAL JOURNEY */}
      <section data-header-text="light" className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionTitle className="uppercase tracking-tighter mb-6 md:!text-6xl">The Structured <br /> <span className="text-[#c8a34d]">Buyer Journey.</span></SectionTitle>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Step-by-Step Risk Management Protocol</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {engagementSteps.map((step, i) => (
              <div key={i} className="bg-white p-12 group hover:bg-slate-50 transition-all">
                <span className="text-[#c8a34d] font-mono text-[10px] font-black mb-4 block">{step.s}</span>
                <h4 className="text-xl font-display font-bold uppercase mb-4 tracking-tight group-hover:text-[#c8a34d] transition-colors">{step.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* RISK INDICATORS TABLE */}
      <section data-header-text="light" className="py-24 bg-slate-50">
        <div className="container-x">
          <div className="bg-white border border-slate-200 p-12 shadow-sm">
            <h3 className="text-2xl font-display font-black uppercase mb-10 text-center tracking-tight">Technical Indicators We Monitor</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                { label: "Documentation Integrity", icon: FileText },
                { label: "Title Chain Clarity", icon: Fingerprint },
                { label: "Developer Performance", icon: Construction },
                { label: "Capital Exposure Timing", icon: Landmark },
                { label: "Contract Compliance", icon: Scale },
                { label: "Payment Sequencing", icon: ClipboardCheck }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <item.icon size={20} className="text-[#c8a34d] shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-black uppercase tracking-widest leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC POSITIONING & CTA */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="container-x relative z-10 text-center">
          <SectionTitle tone="dark" size="hero" className="uppercase tracking-tighter mb-12 leading-[0.9] md:!text-7xl">
            Capital Deserves <br /> <span className="text-[#c8a34d]">Governance.</span>
          </SectionTitle>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Buying real estate is not a purchase. It is a structured capital allocation decision. Begin your journey with a formal intake review.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Button className="bg-[#c8a34d] text-white px-16 py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all">
              Schedule Buyer Consultation
            </Button>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest italic">
              All engagements begin with a formal intake and objective definition.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
