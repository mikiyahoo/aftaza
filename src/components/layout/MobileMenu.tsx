"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Button, { DropdownMenuButton } from "@/components/ui/Button";
import { usePathname, useRouter } from "next/navigation";
import { SITE, NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const filteredNavLinks = NAV_LINKS.filter(
    item => item.label !== "Contact" && item.label !== "Case Studies"
  );

  const handleChildClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

    if (pathname === "/ecosystem" && href.startsWith("/ecosystem#")) {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(href);
    }
  };

  const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

  const containerVariants: Variants = {
    closed: { x: "100%", transition: { duration: 0.4, ease: easing } },
    open: { x: 0, transition: { duration: 0.4, ease: easing } }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.1 + i * 0.1, duration: 0.5 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex justify-end"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop Click-off */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm" 
          />

          <motion.div 
            variants={containerVariants}
            className="relative w-full max-w-md bg-brand-navy h-full shadow-2xl border-l border-white/5 flex flex-col p-8 md:p-12"
          >
            {/* Close Button */}
            <Button onClick={onClose} className="self-end mb-12 text-white/50 hover:text-white flex items-center gap-2 uppercase text-[10px] tracking-[0.3em] font-bold transition-colors">
              Close <span className="text-xl">×</span>
            </Button>

            {/* Links Section */}
            <nav className="flex-1 flex flex-col gap-8">
              {filteredNavLinks.map((item, i) => {
                // Determine if this item should have an expandable submenu
                const hasSubmenu = item.children && item.label !== "Services";

                return (
                  <motion.div key={item.label} custom={i} variants={linkVariants}>
                    {hasSubmenu ? (
                      // Item with submenu (e.g., Ecosystem)
                      <div className="flex flex-col">
                        <DropdownMenuButton
                          onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          className="flex items-center justify-between text-2xl font-bold text-white uppercase tracking-tighter"
                        >
                          {item.label}
                          <span className={`transition-transform duration-300 ${expanded === item.label ? "rotate-180 text-[#c8a34d]" : ""}`}>
                            ↓
                          </span>
                        </DropdownMenuButton>
                        
                        <AnimatePresence>
                          {expanded === item.label && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden flex flex-col gap-4 mt-6 ml-2 border-l border-[#c8a34d]/30 pl-6"
                            >
                              {item.children.map((child) => (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  onClick={(e) => handleChildClick(e, child.href)}
                                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  <span className="block text-sm font-bold uppercase tracking-widest">{child.label}</span>
                                  <span className="block text-[10px] text-slate-600 mt-1">{child.desc}</span>
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      // Simple link (including Services)
                      <Link href={item.href} onClick={onClose} className="text-2xl font-bold text-white uppercase tracking-tighter hover:text-[#c8a34d] transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer Contact Info */}
            <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
              <Link href="/contact" onClick={onClose} className="btn-primary w-full text-center">
                Initialize Consultation
              </Link>
              <div className="mt-4 flex flex-col gap-2 opacity-40">
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white">{SITE.email}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white">{SITE.phone}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
