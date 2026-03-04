"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, PenTool, Rocket, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const engagementPhases = [
  { id: "01", label: "Audit", icon: Search },
  { id: "02", label: "Design", icon: PenTool },
  { id: "03", label: "Deploy", icon: Rocket },
  { id: "04", label: "Optimize", icon: BarChart2 },
];

interface ServiceEngagementHeaderProps {
  activePhase?: string; // e.g., "01"
}

export default function ServiceEngagementHeader({ activePhase = "01" }: ServiceEngagementHeaderProps) {
  return (
    <div className="w-full bg-brand-dark border-y border-white/5 py-6">
      <div className="container-x">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Label */}
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[#c8a34d] rounded-full animate-pulse" />
            <span className="terminal-text text-[10px] uppercase tracking-[0.4em] text-slate-400">
              Engagement_Lifecycle_Status
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-2xl w-full">
            {engagementPhases.map((phase, idx) => {
              const isActive = phase.id === activePhase;
              const isPast = parseInt(phase.id) < parseInt(activePhase);

              return (
                <React.Fragment key={phase.id}>
                  <div className="flex flex-col items-center gap-2 flex-1 group">
                    <div className={cn(
                      "flex items-center gap-3 transition-colors",
                      isActive ? "text-[#c8a34d]" : isPast ? "text-white" : "text-slate-700"
                    )}>
                      <phase.icon size={14} strokeWidth={isActive ? 2.5 : 1.5} />
                      <span className="hidden lg:block text-[9px] font-bold uppercase tracking-widest">
                        {phase.label}
                      </span>
                    </div>
                    
                    {/* Visual Bar */}
                    <div className="relative w-full h-[2px] bg-white/5 overflow-hidden">
                      {(isActive || isPast) && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className={cn(
                            "absolute inset-0",
                            isActive ? "bg-[#c8a34d] shadow-[0_0_10px_rgba(200,163,77,0.5)]" : "bg-white/40"
                          )}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Connector dots between phases */}
                  {idx < engagementPhases.length - 1 && (
                    <div className="h-px w-4 bg-white/5 mt-5 hidden md:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Version / Ref Code */}
          <div className="hidden xl:block">
            <span className="terminal-text text-[8px] text-slate-600 uppercase border border-white/5 px-3 py-1">
              Ref_Protocol: ENG-V2.1
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}