"use client";

import { SITE } from "@/lib/constants";
import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <div className="hidden lg:block w-full bg-brand-navy border-b border-white/[0.03] overflow-hidden">
      <div className="container-x flex items-center justify-between py-2 relative">
        
        {/* Left - Status / Location Indicator */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8a34d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c8a34d]"></span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c8a34d]">
              System Active
            </span>
          </div>
          
          <div className="h-3 w-[1px] bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Location:</span>
            <span className="text-[9px] font-medium text-slate-300 uppercase tracking-wider">
              {SITE.address}
            </span>
          </div>
        </div>

        {/* Right - Contact Data */}
        <div className="flex items-center gap-8">
          <a href={SITE.call} className="group flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#c8a34d] transition-colors">Tel:</span>
            <span className="text-[9px] font-mono text-slate-300 group-hover:text-white transition-colors">
              {SITE.phone}
            </span>
          </a>

          <a href={`mailto:${SITE.email}`} className="group flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#c8a34d] transition-colors">Auth:</span>
            <span className="text-[9px] font-mono text-slate-300 group-hover:text-white transition-colors lowercase">
              {SITE.email}
            </span>
          </a>
          
          {/* Subtle "Time" indicator (Optional, adds to the dashboard feel) */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 font-mono text-[9px] text-slate-500">
            {new Date().getFullYear()} © GS-V.01
          </div>
        </div>

        {/* Subtle scanning glow effect that moves across the top bar */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#c8a34d]/20 to-transparent pointer-events-none"
        />
      </div>
    </div>
  );
}