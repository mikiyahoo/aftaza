"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2, UserCheck, Briefcase, Landmark, Users, Layers, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/Section";

export default function EcosystemPage() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // Small delay to allow page to render before scrolling
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  return (
    <main data-header-text="light" className="snap-container bg-white text-slate-900 overflow-x-hidden">

      {/* HERO SECTION */}
      <section data-header-text="light" className="snap-section bg-[#F8F9FB] relative flex items-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#c8a34d_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>
        <div className="container-x relative z-10 w-full">
          <div className="max-w-5xl">
            <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} className="h-1 bg-[#c8a34d] mb-8" />
            <SectionTitle as="h1" size="hero" className="uppercase mb-8 md:!text-7xl lg:!text-8xl tracking-tighter leading-[0.9]">
              Structured Market <span className="text-[#c8a34d]">Infrastructure</span>
            </SectionTitle>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl font-light leading-relaxed mb-12">
              An integrated real estate ecosystem aligning developers, buyers, investors, governance, and demand into one controlled transaction framework.
            </p>
            <a href="#developers" className="btn-primary px-12 py-5 text-sm uppercase tracking-widest font-bold shadow-2xl shadow-[#c8a34d]/20">
              View Architecture
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1 — Developer Layer */}
      <section id="developers" data-header-text="light" className="snap-section bg-white flex items-center py-20">
        <div className="container-x w-full">
          <SectionTitle className="uppercase tracking-tighter mb-6">
            Developer Commercial Infrastructure
          </SectionTitle>
          <p className="text-slate-500 mb-10">
            We engineer structured commercialization systems that control absorption, pricing discipline, and project credibility.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Go-to-market system design",
              "Demand pacing & absorption control",
              "Sales governance protocols",
              "Documentation compliance"
            ].map((point, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition">
                <Building2 size={28} className="text-[#c8a34d] mb-4" />
                <p className="font-bold text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Buyer Layer */}
      <section id="buyers" data-header-text="light" className="snap-section bg-[#F8F9FB] flex items-center py-20">
        <div className="container-x w-full">
          <SectionTitle className="uppercase tracking-tighter mb-6">
            Buyer Protection Framework
          </SectionTitle>
          <p className="text-slate-500 mb-10">
            A governed acquisition pathway designed to eliminate uncertainty and legal exposure.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Project verification",
              "Legal & document validation",
              "Contract oversight",
              "Milestone payment control"
            ].map((point, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition">
                <UserCheck size={28} className="text-[#c8a34d] mb-4" />
                <p className="font-bold text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Investor Layer */}
      <section id="investors" data-header-text="light" className="snap-section bg-white flex items-center py-20">
        <div className="container-x w-full">
          <SectionTitle className="uppercase tracking-tighter mb-6">
            Capital Structuring Architecture
          </SectionTitle>
          <p className="text-slate-500 mb-10">
            Institutional-grade investment frameworks aligning capital with compliant projects.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Deal documentation structuring",
              "Risk segmentation",
              "Return modeling",
              "Compliance screening"
            ].map((point, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition">
                <Briefcase size={28} className="text-[#c8a34d] mb-4" />
                <p className="font-bold text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Financiers Layer */}
      <section id="financiers" data-header-text="light" className="snap-section bg-[#F8F9FB] flex items-center py-20">
        <div className="container-x w-full">
          <SectionTitle className="uppercase tracking-tighter mb-6">
            Transaction Governance
          </SectionTitle>
          <p className="text-slate-500 mb-10">
            Compliance-first protocols securing every stage of the transaction lifecycle.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Developer due diligence",
              "Contract governance",
              "Escrow discipline",
              "Audit documentation control"
            ].map((point, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition">
                <Layers size={28} className="text-[#c8a34d] mb-4" />
                <p className="font-bold text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Institutional Partners Layer */}
      <section id="partners" data-header-text="light" className="snap-section bg-white flex items-center py-20">
        <div className="container-x w-full">
          <SectionTitle className="uppercase tracking-tighter mb-6">
            Market Education & Demand Structuring
          </SectionTitle>
          <p className="text-slate-500 mb-10">
            We build informed demand through structured education and institutional communication.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Data-led awareness campaigns",
              "Transparent project communication",
              "Diaspora confidence frameworks",
              "Market trust engineering"
            ].map((point, i) => (
              <div key={i} className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition">
                <Users size={28} className="text-[#c8a34d] mb-4" />
                <p className="font-bold text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section data-header-text="light" className="snap-section bg-[#F8F9FB] flex items-center justify-center py-20">
        <div className="container-x text-center">
          <SectionTitle className="uppercase tracking-tighter mb-8 md:!text-6xl">
            Choose the <span className="text-[#c8a34d]">Structured Path.</span>
          </SectionTitle>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12">
            Whether you are launching a development, acquiring property, or deploying capital—AFTAZA provides the governance-driven infrastructure you require.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="btn-primary px-12 py-5 text-xs uppercase tracking-[0.2em] font-bold">
              Structure Your Engagement
            </Link>
            <Link href="/contact" className="btn-outline px-12 py-5 text-xs uppercase tracking-[0.2em] font-bold">
              Speak With AFTAZA
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
