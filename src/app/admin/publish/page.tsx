"use client";

import { useState } from "react";
import { Send, Eye, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminPublishPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    silo: "absorption-strategy",
    problem: "",
    cause: "",
    solution: "",
    cta: "/developer-commercialization"
  });

  const handlePublish = async () => {
    setStatus("loading");
    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Publishing failed");

      setStatus("success");
      // Reset form after 2 seconds on success
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <main data-header-text="light" className="min-h-screen bg-slate-50 text-slate-900 pt-20 pb-20">
      <div className="container-x">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#c8a34d] font-mono text-[10px] font-bold uppercase tracking-[0.4em]">AFTAZA_Internal</span>
            <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-brand-dark">Protocol Publisher</h1>
          </div>
          
          <Button 
            onClick={handlePublish}
            disabled={status === "loading" || !formData.title}
            className={`px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all ${
              status === "success" ? "bg-green-600 text-white" : "bg-slate-950 text-white hover:bg-[#c8a34d]"
            } disabled:opacity-50`}
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={14} /> : 
             status === "success" ? <CheckCircle2 size={14} /> : <Send size={14} />}
            {status === "loading" ? "Syncing to DB..." : status === "success" ? "Protocol Live" : "Publish Protocol"}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: THE STRUCTURED FORM */}
          <section data-header-text="light" className="bg-white p-10 border border-slate-200 space-y-8 shadow-sm">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest">Protocol Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Structured Absorption Control"
                  className="w-full border-b-2 border-slate-100 py-2 focus:border-[#c8a34d] outline-none text-slate-900 placeholder:text-slate-400 text-xl font-display uppercase font-bold transition-colors"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')}
                  placeholder="auto-generated-slug"
                  className="w-full bg-slate-50 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30"
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest">Revenue Silo</label>
                <select 
                  value={formData.silo}
                  onChange={(e) => setFormData({...formData, silo: e.target.value})}
                  className="w-full bg-slate-50 p-3 text-xs font-bold uppercase text-slate-900 outline-none border border-transparent focus:border-[#c8a34d]/30 cursor-pointer"
                >
                  <option value="absorption-strategy">Absorption Strategy</option>
                  <option value="transaction-governance">Transaction Governance</option>
                  <option value="capital-structuring">Capital Structuring</option>
                  <option value="market-intelligence">Market Intelligence</option>
                  <option value="developer-systems">Developer Systems</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest italic">I. Market Problem</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30 transition-all"
                  placeholder="What systemic failure is this addressing?"
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest italic">II. Systemic Cause</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30 transition-all"
                  placeholder="Why is this happening in the current market?"
                  onChange={(e) => setFormData({...formData, cause: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 tracking-widest italic">III. Structural Solution</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none border border-transparent focus:border-[#c8a34d]/30 transition-all"
                  placeholder="What is the AFTAZA framework for this?"
                  onChange={(e) => setFormData({...formData, solution: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* RIGHT: INSTITUTIONAL PREVIEW */}
          <section className="sticky top-24 h-fit">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-slate-400">
                    <Eye size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                 </div>
                 {status === "error" && (
                   <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase">
                     <AlertCircle size={12} /> Sync Error
                   </div>
                 )}
              </div>
              
              <div data-header-text="light" className="bg-white border border-slate-200 p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rotate-45 border-b border-slate-100" />
                
                <span className="text-[#c8a34d] font-mono text-[9px] font-bold uppercase tracking-[0.3em] mb-4 block">
                  {formData.silo.replace('-', ' ')}
                </span>
                
                <h2 className="text-3xl font-display font-black uppercase mb-10 leading-none tracking-tighter text-brand-dark">
                  {formData.title || "Untitled Protocol"}
                </h2>
                
                <div className="space-y-8 border-l border-slate-100 pl-8">
                  <div>
                    <h4 className="text-[9px] font-black uppercase text-brand-dark mb-2 tracking-widest">Problem Statement</h4>
                    <p className="text-slate-500 text-xs leading-relaxed italic">{formData.problem || "Awaiting systemic input..."}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase text-brand-dark mb-2 tracking-widest">Systemic Analysis</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{formData.cause || "Analysis pending..."}</p>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black uppercase text-brand-dark mb-2 tracking-widest">Proposed Framework</h4>
                    <p className="text-slate-900 text-xs leading-relaxed font-medium">{formData.solution || "Structural design phase..."}</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                   <div className="h-2 w-24 bg-slate-100" />
                   <span className="text-[8px] font-mono text-slate-300 uppercase">Aftaza_Institutional_Output</span>
                </div>
              </div>
          </section>
        </div>
      </div>
    </main>
  );
}
