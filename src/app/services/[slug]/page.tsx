import React from "react";
import { notFound } from "next/navigation";
import { services, methodologySteps } from "@/data/services";
import { 
  ChevronRight, 
  Activity, 
  ShieldCheck, 
  Database 
} from "lucide-react";
import Section, { SectionTitle } from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import ServiceNav from "@/components/ui/ServiceNav";
import ServiceEngagementHeader from "@/components/ui/ServiceEngagementHeader";
import Button from "@/components/ui/Button";
import { ComplianceBar } from "@/components/ui/SystemUI";

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.id === params.slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} | AFTAZA PLC`,
    description: service.description,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.id === params.slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <main className="bg-brand-navy text-white min-h-screen">
      {/* 1. TECHNICAL HEADER / BREADCRUMB */}
      <section className="pt-32 pb-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-10" />
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="terminal-text text-[10px] text-slate-500 uppercase tracking-[0.3em]">Services</span>
                <ChevronRight size={12} className="text-slate-700" />
                <span className="terminal-text text-[10px] text-[#c8a34d] uppercase tracking-[0.3em]">{service.nodeId}</span>
              </div>
              <SectionTitle as="h1" tone="dark" size="hero" className="max-w-4xl !text-4xl md:!text-6xl">
                {service.title}
              </SectionTitle>
            </div>
            <div className="bg-white/5 border border-[#c8a34d]/20 p-6 backdrop-blur-md">
              <div className="terminal-text text-[9px] text-slate-500 mb-2 uppercase">Status_Protocol</div>
              <ComplianceBar
                tone="green"
                label={service.status}
                className="[&_.compliance-label]:font-display [&_.compliance-label]:font-bold [&_.compliance-label]:text-sm [&_.compliance-label]:tracking-widest"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ENGAGEMENT LIFECYCLE TRACKER (New) */}
      <ServiceEngagementHeader activePhase="01" />

      {/* 3. SYSTEM SUMMARY SECTION */}
      <Section className="relative" dark>
        <Container>
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-[#c8a34d]/10 text-[#c8a34d]">
                   <Icon size={32} strokeWidth={1.5} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#c8a34d]/30 to-transparent" />
              </div>
              <p className="text-2xl font-body font-light leading-relaxed text-slate-300 italic mb-8">
                "{service.fullDescription}"
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-12">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="p-6 bg-brand-navy border border-white/5 flex items-start gap-4 hover:border-[#c8a34d]/30 transition-colors">
                    <ShieldCheck size={18} className="text-[#c8a34d] mt-1" />
                    <span className="text-sm font-body text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Technical Data Panel */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 p-8 bg-brand-navy border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Database size={120} />
                </div>
                <h3 className="terminal-text text-[#c8a34d] mb-6 uppercase tracking-[0.2em]">Deployment_Specs</h3>
                <div className="space-y-6 relative z-10">
                   {[
                     { label: 'Architecture', val: 'Institutional_v2.6' },
                     { label: 'Security_Layer', val: 'Verification_Active' },
                     { label: 'Governance', val: 'Compliance_Ready' },
                     { label: 'Audit_Path', val: 'Transparent' }
                   ].map((item) => (
                     <div key={item.label} className="border-b border-white/5 pb-4 flex justify-between">
                       <span className="text-[10px] font-mono text-slate-500 uppercase">{item.label}</span>
                       <span className="text-[10px] font-mono text-white uppercase">{item.val}</span>
                     </div>
                   ))}
                </div>
                <Button className="btn-primary w-full mt-10">
                  Request {service.nodeId} Access
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. INTEGRATED GOVERNANCE (Methodology Preview) */}
      <section data-header-text="light" className="py-24 bg-white text-brand-dark">
        <Container>
          <div className="mb-16">
            <SectionTitle className="!text-3xl uppercase tracking-tighter">Governance Framework</SectionTitle>
            <div className="w-20 h-1 bg-[#c8a34d] mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {methodologySteps.map((step) => (
              <div key={step.code} className="group border-l border-slate-100 pl-8 py-4 hover:border-[#c8a34d] transition-colors">
                <div className="text-[10px] font-mono text-[#c8a34d] mb-4">{step.code}</div>
                <h4 className="font-display font-bold uppercase mb-3 text-sm">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. SERVICE SWITCHER (New) */}
      <ServiceNav />

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 border-t border-white/5 bg-[#04080f] text-center relative overflow-hidden">
         <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
         <Container>
            <div className="max-w-3xl mx-auto relative z-10">
               <Activity size={40} className="text-[#c8a34d] mx-auto mb-8 opacity-50" />
               <SectionTitle tone="dark" className="uppercase mb-6 italic">Ready to Initialize?</SectionTitle>
               <p className="text-slate-400 mb-10">
                 Deploy the AFTAZA {service.title} system into your project or transaction workflow to ensure maximum security and revenue stability.
               </p>
               <Button className="btn-primary">
                 Start Technical Consultation
               </Button>
            </div>
         </Container>
      </section>
    </main>
  );
}
