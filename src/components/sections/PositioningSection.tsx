"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { PillarCard } from "@/components/ui/Card";
import { ComplianceBar, Ledger, TrustIndicator } from "@/components/ui/SystemUI";
import { SectionTitle } from "@/components/ui/Section";

const MotionPillarCard = motion(PillarCard);
const MotionLedger = motion(Ledger);

export default function PositioningSection() {
  const pillars = [
    {
      label: "Strategy",
      desc: "Commercialization architecture & positioning",
      nodeId: "MOD-01"
    },
    {
      label: "Sales Operations",
      desc: "Governance-led pipeline & CRM frameworks",
      nodeId: "MOD-02"
    },
    {
      label: "Governance",
      desc: "Compliance-first transaction protocols",
      nodeId: "MOD-03"
    },
    {
      label: "Documentation",
      desc: "Audit-ready records at every stage",
      nodeId: "MOD-04"
    },
    {
      label: "Institutional Trust",
      desc: "Credibility systems that compound over time",
      nodeId: "MOD-05"
    },
  ];

  return (
    <section className="positioning-section section-y relative overflow-hidden min-h-screen flex items-center bg-brand-dark">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,163,77,0.04),transparent_70%)] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,163,77,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,163,77,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_30%,transparent_80%)]" />

      <div className="container-x relative z-10 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left - Messaging (Vertically Centered) */}
          <div className="flex flex-col justify-center h-full">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              className="gold-rule block mb-8"
            />

            <Badge className="mb-6 w-fit" pulse hideDefaultDot>
              SYSTEM STATUS: OPERATIONAL
            </Badge>

            <SectionTitle tone="dark" className="mb-8">
              Not a Broker. Not a Marketing Agency.{" "}
              <em className="text-[#c8a34d] not-italic block mt-2 font-display">An Institutional System.</em>
            </SectionTitle>

            <div className="space-y-4 mb-10">
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-mono text-xs tracking-wide">
                <span className="text-[#c8a34d] font-bold">01/</span> AFTAZA is a compliance-driven Transaction Advisory firm.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-mono text-xs tracking-wide">
                <span className="text-[#c8a34d] font-bold">02/</span> We don&apos;t decorate projects. <span className="text-white">We commercialize them.</span>
              </p>
            </div>

            {/* Micro Ledger */}
            <MotionLedger
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-10 p-5 border border-[#c8a34d]/20 bg-[#c8a34d]/5 relative group max-w-sm rounded-sm"
              hashValue="0x7a3f...b9e2"
            />

            <div className="pl-6 border-l border-[#c8a34d]/30 italic text-slate-500 space-y-1 max-w-md">
              <p className="text-xs">"Strategy becomes execution."</p>
              <p className="text-xs">"Execution becomes market leadership."</p>
            </div>
          </div>

          {/* Right - The System (Clean Nodes) */}
          <div className="relative">
            <div className="flex flex-col gap-3.5 relative">
              {pillars.map((p, i) => (
                <MotionPillarCard
                  key={p.label}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="rounded-sm"
                  index={i + 1}
                  title={p.label}
                  description={p.desc}
                  contentClassName="pt-1"
                />
              ))}
            </div>

            {/* Bottom System Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center"
            >
              <ComplianceBar
                label="System Load: Stable"
                className="gap-3"
                rightSlot={
                  <div className="h-0.5 w-16 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-[#c8a34d]/40"
                    />
                  </div>
                }
              />
              <TrustIndicator
                className="!bg-transparent !border-[#c8a34d]/20 !text-[8px] !py-1 !px-2"
                protocol="Transaction Advisory Methodology"
                version="v2.6"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
