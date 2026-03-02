"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/Section";

const steps = [
  {
    num: "01",
    label: "Demand",
    desc: "Media, intelligence, and campaign architecture generate qualified interest from the right stakeholders.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    num: "02",
    label: "Trust",
    desc: "Verification workflows, disclosure discipline, and governance protocols build institutional credibility.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    num: "03",
    label: "Conversion",
    desc: "Sales operations and CRM systems turn trust into structured, documented commitments.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    num: "04",
    label: "Delivery",
    desc: "Handover readiness and documented closing governance protect all stakeholders at transaction close.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

export default function EcosystemSection() {
  return (
    <section className="section-light section-y relative overflow-hidden bg-white border-t border-slate-100">
      <div className="grid-pattern absolute inset-0 opacity-[0.4]" />

      {/* Large Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 overflow-hidden">
         <span className="text-[clamp(8rem,20vw,24rem)] font-display font-black text-[#c8a34d]/[0.03] leading-none tracking-tighter">
            SYSTEM
         </span>
      </div>

      <div className="container-x relative z-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-8 mb-20">
          <div className="max-w-[550px]">
            <div className="h-1 w-12 bg-[#c8a34d] mb-8" />
            <SectionTitle className="mb-6">
              <span className="text-slate-900">The Structured </span> <br/>
              <span className="text-[#c8a34d] font-bold">Commercialization Flow</span>
            </SectionTitle>
            <p className="text-slate-500 font-body text-base leading-relaxed">
              Value moves through a documented system designed to reduce friction and increase conversion.
            </p>
          </div>
          
          <Link href="/ecosystem" className="group inline-flex items-center gap-3 px-8 py-4 border border-[#c8a34d]/30 text-[#c8a34d] font-bold text-xs uppercase tracking-[0.2em] transition-all bg-white hover:bg-[#c8a34d] hover:text-white">
            Full Ecosystem Map
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Steps Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#c8a34d]/10 border border-[#c8a34d]/10 shadow-2xl"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={itemVariants}
              className="group relative bg-white p-10 flex flex-col gap-6 hover:bg-slate-50 transition-colors duration-500"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] font-black tracking-[0.3em] text-[#c8a34d] uppercase">
                  Step {step.num}
                </span>
                <div className="text-[#c8a34d] opacity-40 group-hover:opacity-100 transition-opacity">
                  {step.icon}
                </div>
              </div>

              {/* BOLDED TITLE */}
              <h3 className="font-display text-2xl font-bold text-slate-900 uppercase tracking-tighter leading-none group-hover:text-[#c8a34d] transition-colors">
                {step.label}
              </h3>

              <p className="text-slate-500 font-body text-sm leading-relaxed min-h-[80px]">
                {step.desc}
              </p>

              {/* Arrow Connector (Desktop Only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#c8a34d]/20 items-center justify-center z-20 text-[#c8a34d] group-hover:bg-[#c8a34d] group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}

              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 h-1 bg-[#c8a34d] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
            </motion.div>
          ))}
        </motion.div>

        {/* Closing metrics */}
        <div className="mt-20 text-center border-t border-slate-100 pt-12">
          <p className="font-display text-xl text-slate-400 italic mb-8">
            This is not random selling. <span className="text-[#c8a34d] font-bold not-italic">It is engineered commercialization.</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { label: "CONVERSION", value: "3.2x" },
              { label: "TRUST SCORE", value: "98%" },
              { label: "VERIFICATION", value: "AUDIT-READY" },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-[#c8a34d] text-lg font-mono font-black">{m.value}</div>
                <div className="text-[9px] text-slate-400 font-mono tracking-[0.3em] uppercase mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



