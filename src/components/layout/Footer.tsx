"use client";

import Link from "next/link";
import { SITE } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { 
  MapPin, 
  Mail, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck,
  Send,
  Globe
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Intelligence", href: "/intelligence" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Developer Commercialization", href: "/services/developer-commercialization" },
  { label: "Buyer Advisory", href: "/services/buyer-advisory" },
  { label: "Investor Structuring", href: "/services/investor-enablement" },
  { label: "Transaction Governance", href: "/services/transaction-governance" },
  { label: "Media Systems", href: "/services/media-education" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--dark)",
        borderTop: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container-x" style={{ paddingTop: "5rem", paddingBottom: "3rem", position: "relative" }}>
        
        {/* --- NEWSLETTER SECTION: STARK WHITE BACKGROUND --- */}
        <div 
          style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            justifyContent: "space-between", 
            alignItems: "center",
            gap: "2rem",
            padding: "3.5rem 3rem",
            marginBottom: "5rem",
            background: "#FFFFFF", // Pure White
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)", // Subtle depth
            borderRadius: "2px" 
          }}
        >
          <div style={{ maxWidth: "500px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Globe size={20} className="text-[#c8a34d]" />
              <h3 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "1.25rem", 
                color: "var(--dark)", // Dark Navy text for white bg
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 700
              }}>
                The Intelligence Brief
              </h3>
            </div>
            <p style={{ color: "#475569", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
              Direct access to documented transaction governance and institutional real estate insights.
            </p>
          </div>
          
          <form 
            style={{ 
              display: "flex", 
              width: "100%", 
              maxWidth: "420px", 
              gap: "0" // No gap for a "joined" look
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="email" 
              placeholder="Email Address"
              style={{
                flex: 1,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "1rem 1.25rem",
                color: "#0f172a",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                outline: "none"
              }}
            />
            <Button 
              type="submit"
              className="hover:bg-[#dfc278] transition-all"
              style={{
                background: "#c8a34d", // Gold
                color: "var(--dark)", // Dark Navy
                border: "none",
                padding: "0 2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap"
              }}
            >
              Subscribe <Send size={14} />
            </Button>
          </form>
        </div>

        {/* --- GRID SECTION --- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem" }}>
          {/* Identity */}
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "var(--text-primary)", letterSpacing: "0.08em", fontWeight: 600 }}>
                AFTAZA PLC
              </span>
              <div className="gold-rule" style={{ marginTop: "0.5rem" }} />
            </div>
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "0.875rem", lineHeight: 1.7 }}>
              Ethiopia's institutional real estate commercialization firm — designing governance-first systems.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Navigation
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {navLinks.map((link) => (
                <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                  <Link href={link.href} className="flex items-center gap-2 group transition-colors text-slate-400 hover:text-[#c8a34d] text-[0.8375rem]">
                    <ChevronRight size={12} className="text-[#c8a34d]/40 group-hover:text-[#c8a34d] transition-transform group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Services
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {services.map((s) => (
                <li key={s.label} style={{ marginBottom: "0.625rem" }}>
                  <Link href={s.href} className="flex items-center gap-2 group transition-colors text-slate-400 hover:text-[#c8a34d] text-[0.8375rem]">
                    <ChevronRight size={12} className="text-[#c8a34d]/40 group-hover:text-[#c8a34d] transition-transform group-hover:translate-x-1" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <MapPin size={16} className="text-[#c8a34d] shrink-0" />
                <span style={{ color: "var(--text-muted)", fontSize: "0.8375rem" }}>{SITE.address}</span>
              </div>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-slate-400 hover:text-[#c8a34d] transition-colors text-[0.8375rem]">
                <Mail size={16} className="text-[#c8a34d]" />
                {SITE.email}
              </a>
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.5rem" }}>
                {[
                  { name: "WA", href: SITE.whatsapp },
                  { name: "TG", href: SITE.telegram }
                ].map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 border-b border-[#c8a34d]/20 text-[10px] uppercase tracking-widest text-slate-500 hover:text-[#c8a34d] transition-all">
                    {social.name} <ArrowUpRight size={10} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ marginTop: "4rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(200,163,77,0.1)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <p style={{ color: "var(--text-muted)", opacity: 0.5, fontSize: "0.75rem" }}>
            © 2026 AFTAZA PLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}