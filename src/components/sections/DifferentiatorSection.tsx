"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Fingerprint, Check, Zap } from "lucide-react";
import { ComplianceBar, TrustIndicator } from "@/components/ui/SystemUI";
import { SectionTitle } from "@/components/ui/Section";

const differentiators = [
  {
    num: "01",
    icon: ShieldCheck,
    title: "Structured Institution",
    desc: "Consultative advisory and documented processes. Every engagement produces governance-grade outputs.",
    nodeId: "SYS-ARC-01"
  },
  {
    num: "02",
    icon: Fingerprint,
    title: "Risk-Reduced Systems",
    desc: "Verification protocols are embedded at every stage, protecting stakeholders from documentation risk.",
    nodeId: "SYS-GOV-02"
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Performance-Driven",
    desc: "Measurable outcomes: cleaner transaction flow and faster absorption velocity tracked against KPIs.",
    nodeId: "SYS-PER-03"
  },
];

const principles = [
  "Truth-in-Marketing",
  "Documented Consent",
  "Clean Handover Paths",
  "Data Discipline",
  "Conflict-of-Interest Hygiene",
  "Compliance-First Documentation",
];

export default function DifferentiatorSection() {
  return (
    <section className="relative py-24 bg-brand-dark overflow-hidden">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,163,77,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(200,163,77,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

      <div className="container-x relative z-10">
        
        {/* TITLE ON TOP - LEFT ALIGNED */}
        <div className="mb-16 max-w-3xl">
          <motion.span 
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            className="h-px bg-[#c8a34d] block mb-8" 
          />
          <SectionTitle tone="dark">
            The AFTAZA <br />
            <span className="text-[#c8a34d]">Institutional</span> Difference
          </SectionTitle>
        </div>

        {/* TWO EQUAL COLUMN BOXES */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT COLUMN: MODULE STACK */}
          <div className="flex flex-col gap-4">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.num}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex-1 flex items-start gap-6 p-7 bg-white/[0.02] border border-white/5 hover:border-[#c8a34d]/30 transition-all duration-500 rounded-sm"
              >
                <div className="absolute top-3 right-4 text-[7px] font-mono text-slate-600 tracking-widest uppercase group-hover:text-[#c8a34d]">
                  {d.nodeId}
                </div>

                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold bg-brand-navy group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500 shadow-lg">
                  <d.icon size={20} strokeWidth={1.5} />
                </div>

                <div className="pt-0.5">
                  <h3 className="text-white font-display text-lg mb-2 group-hover:text-[#c8a34d] transition-colors">
                    {d.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-body">
                    {d.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT COLUMN: GOVERNANCE BLOCK (EQUAL HEIGHT) */}
          <div className="flex flex-col bg-[#c8a34d]/5 border border-[#c8a34d]/20 p-10 relative group overflow-hidden rounded-sm">
            {/* Aesthetic Detail: Scanner Line */}
            <motion.div 
              animate={{ y: [0, 500, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c8a34d]/30 to-transparent z-0 opacity-40"
            />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-10">
                <div className="max-w-md">
                  <h3 className="text-2xl font-display text-white mb-4">
                    Credibility <em className="text-[#c8a34d] not-italic font-serif">Compounds.</em>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    We protect transactions and reputations with documentation-first execution. 
                    Governance is not a formality—it is our primary product.
                  </p>
                </div>
                <Zap className="text-[#c8a34d] opacity-30 animate-pulse" size={20} />
              </div>

              {/* Principles Grid - Flexible to fill middle space */}
              <div className="grid grid-cols-2 gap-3 flex-1 items-center">
                {principles.map((p) => (
                  <div 
                    key={p} 
                    className="flex items-center gap-3 p-4 bg-brand-dark/60 border border-white/5 group-hover:border-[#c8a34d]/20 transition-all duration-300 h-full min-h-[60px]"
                  >
                    <div className="w-1 h-4 bg-[#c8a34d]/20 group-hover:bg-[#c8a34d] transition-colors" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                      {p}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Footer */}
              <div className="mt-10 pt-6 border-t border-[#c8a34d]/10 flex justify-between items-center font-mono text-[8px] tracking-[0.4em] uppercase">
                <ComplianceBar
                  label="System: Operational"
                  className="[&_.compliance-label]:text-slate-500"
                />
                <TrustIndicator
                  className="!bg-transparent !border-0 !p-0 !text-[8px]"
                  protocol="Ref"
                  version="Institutional_Protocol_v2"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
