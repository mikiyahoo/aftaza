"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { homeMetrics } from "@/data/metrics";
import { SectionTitle } from "@/components/ui/Section";

function CounterItem({
  value,
  suffix,
  label,
  description,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  description: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // High-performance spring animation for the numbers
  const springValue = useSpring(0, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      // Small delay based on index for staggered start
      const timer = setTimeout(() => {
        springValue.set(value);
      }, index * 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, springValue, index]);

  return (
    <div
      ref={ref}
      className="relative p-8 md:p-10 border-r border-white/5 last:border-r-0 group overflow-hidden bg-brand-dark transition-colors duration-500 hover:bg-brand-dark/90"
    >
      {/* Technical Header */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-mono text-[#c8a34d] tracking-[0.2em] uppercase">
          Metric_ID: 0{index + 1}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#c8a34d]/20 group-hover:bg-[#c8a34d] transition-colors" />
      </div>

      {/* Main Counter */}
      <div className="flex items-baseline gap-1 mb-4">
        <motion.span className="text-5xl md:text-6xl font-display text-white tracking-tighter">
          {displayValue}
        </motion.span>
        <span className="text-2xl md:text-3xl font-display text-[#c8a34d]">{suffix}</span>
      </div>

      {/* Info */}
      <div className="space-y-3 relative z-10">
        <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
          {label}
        </h4>
        <p className="text-slate-500 text-[11px] leading-relaxed font-body group-hover:text-slate-400 transition-colors">
          {description}
        </p>
      </div>

      {/* Decorative Bottom Bar */}
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#c8a34d]/30 to-transparent"
      />
    </div>
  );
}

export default function MetricsSection() {
  return (
    <section className="relative py-24 bg-brand-dark overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,163,77,0.03),transparent_50%)]" />
      
      {/* Large Decorative Watermark */}
      <div className="absolute -bottom-8 -right-4 font-display text-[15vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none">
        IMPACT
      </div>

      <div className="container-x relative z-10">
        {/* Header Alignment matching previous sections */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <motion.span 
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              className="h-px bg-[#c8a34d] block mb-8" 
            />
            <SectionTitle tone="dark">
              Measured Impact. <br />
              <span className="text-[#c8a34d]">Not Marketing Claims.</span>
            </SectionTitle>
          </div>
          
          <div className="md:text-right border-l md:border-l-0 md:border-r border-[#c8a34d]/30 pl-6 md:pl-0 md:pr-6 py-2">
            <p className="text-slate-500 font-mono text-[11px] uppercase tracking-[0.2em] mb-1">
              Data Integrity Status
            </p>
            <p className="text-white font-display italic text-lg">
              Predictable Revenue Rhythm.
            </p>
          </div>
        </div>

        {/* The Grid Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
          {homeMetrics.map((m, i) => (
            <CounterItem
              key={m.label}
              value={m.value}
              suffix={m.suffix}
              label={m.label}
              description={m.description}
              index={i}
            />
          ))}
        </div>

        {/* Footer Technical String */}
        <div className="mt-8 flex items-center gap-4 text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
          <span>Institutional Benchmarking</span>
          <div className="h-px flex-1 bg-white/5" />
          <span>Last Audit: Q4 2025</span>
        </div>
      </div>
    </section>
  );
}
