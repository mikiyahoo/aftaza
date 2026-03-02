"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/Section";

const MotionCard = motion(Card);
const MotionSectionTitle = motion(SectionTitle);
const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Type definition for segments
interface ServiceSegment {
  num: string;
  label: string;
  href: string;
  cta: string;
  desc: string;
  benefits: string[];
}

// Data decoupled from component
const segments: ServiceSegment[] = [
  {
    num: "01",
    label: "For Developers",
    href: "/services/developer-commercialization",
    cta: "Explore Developer Systems",
    desc: "We design and operate full-stack commercialization systems — from go-to-market strategy to sales governance and reporting discipline.",
    benefits: [
      "Faster absorption velocity",
      "Institutional market positioning",
      "Financeability alignment",
      "Scalable, repeatable revenue systems",
    ],
  },
  {
    num: "02",
    label: "For Buyers",
    href: "/services/buyer-advisory",
    cta: "Start a Safe-Transaction Journey",
    desc: "We serve as independent transaction advisors, guiding buyers through a safe, structured, and verified property acquisition journey.",
    benefits: [
      "Verification and disclosure workflows",
      "Clean, traceable documentation",
      "Negotiation clarity and advocacy",
      "Risk screening at every stage",
    ],
  },
  {
    num: "03",
    label: "For Investors & Financiers",
    href: "/services/investor-enablement",
    cta: "Enable Investment Readiness",
    desc: "We structure projects for credibility, traceability, and disciplined capital deployment — from due diligence to exit pathway documentation.",
    benefits: [
      "Documentation readiness and audit trails",
      "Investment-grade transaction narratives",
      "Risk screening and governance systems",
      "Exit pathway clarity and structuring",
    ],
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

export default function WhoWeServe() {
  return (
    <section className="section-light section-y relative overflow-hidden">
      {/* Top divider */}
      <div className="section-divider" />

      {/* Background pattern */}
      <div className="grid-pattern" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container-x relative z-10">
        {/* Header with Framer Motion */}
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <motion.span 
            variants={headerItemVariants}
            className="gold-rule mx-auto"
          />
          <MotionSectionTitle
            variants={headerItemVariants}
            className="text-center"
          >
            <span>Structured Systems for </span>
            <span className="section-title-accent">Every Stakeholder</span>
          </MotionSectionTitle>
          <motion.p 
            variants={headerItemVariants}
            className="subtitle"
          >
            One institution. Three governed pathways. Every participant protected.
          </motion.p>
        </motion.div>

        {/* Cards with staggered animation */}
        <motion.div 
          className="cards-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {segments.map((seg) => (
            <MotionCard
              key={seg.num}
              variants={itemVariants}
              className="card group relative bg-white border border-[#E2E8F0] hover:border-[#c8a34d] transition-all duration-500 p-8"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: easing }}
            >
              {/* Number watermark - preserved original styling */}
              <span className="number-watermark absolute top-6 right-8 font-display text-6xl font-semibold text-[rgba(200,163,77,0.08)] select-none" aria-hidden="true">
                {seg.num}
              </span>

              {/* Top bar accent - preserved original styling */}
              <div className="w-10 h-[3px] bg-[#c8a34d] mb-6 group-hover:w-16 transition-all duration-500 ease-out" />

              <h3 className="font-display text-2xl font-extrabold text-[#0f172a] mb-4 leading-tight pr-12">
                {seg.label}
              </h3>

              <p className="font-body text-sm text-[#475569] leading-relaxed mb-6 pr-4">
                {seg.desc}
              </p>

              {/* Benefits list with preserved styling */}
              <ul className="space-y-3 mb-8 flex-grow">
                {seg.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-[#64748b] font-body text-sm">
                    <span className="w-1.5 h-1.5 bg-[#c8a34d] rounded-full flex-shrink-0 mt-1.5" />
                    <span className="flex-1">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Link with preserved styling */}
              <Link 
                href={seg.href} 
                className="inline-flex items-center gap-2 text-[#c8a34d] font-semibold text-xs uppercase tracking-wider hover:gap-3 transition-all duration-300 group/link"
              >
                {seg.cta}
                <MoveRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>

              {/* Decorative corner elements - subtle addition */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 right-0 w-8 h-[1px] bg-gradient-to-l from-[#c8a34d] to-transparent" />
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-[#c8a34d] to-transparent" />
              </div>
            </MotionCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
