"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import MobileMenu from "./MobileMenu";
import { HamburgerMenuButton } from "@/components/ui/Button";

type NavItem = (typeof NAV_LINKS)[number];
const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

function DropdownMenu({ item, close }: { item: NavItem; close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  if (!item.children) return null;

  const handleChildClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    close();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      transition={{ duration: 0.4, ease: easing }}
      className="absolute top-full left-0 mt-4 w-80 bg-brand-navy/95 backdrop-blur-2xl border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50"
    >
      <div className="relative z-10 grid gap-1">
        {item.children.map((child, i) => (
          <a
            key={i}
            href={child.href}
            onClick={(e) => handleChildClick(e, child.href)}
            className="group flex flex-col p-4 transition-all hover:bg-white/5 border border-transparent hover:border-white/5 cursor-pointer"
          >
            <span className="text-white text-sm font-medium tracking-[0.1em] group-hover:text-[#c8a34d] transition-colors">
              {child.label}
            </span>
            {"desc" in child && child.desc && (
              <span className="text-slate-500 text-[11px] leading-relaxed mt-1 font-medium">
                {child.desc}
              </span>
            )}
          </a>
        ))}
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#c8a34d]/30 pointer-events-none" />
    </motion.div>
  );
}

const FORCE_NAVY_PATHS = ["/ecosystem", "/intelligence/methodology", "/services"];
const FORCE_DARK_TEXT_PATHS = ["/intelligence/media-market-education"];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for measuring header height
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const intersectingSet = useRef<Set<Element>>(new Set());

  // Scroll listener for shrinking header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update header height whenever it changes (resize, scroll‑induced padding change)
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight); // height may change on scroll
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
    };
  }, []);

  // Observe sections with data-header-text and adapt text colour
  useEffect(() => {
    if (headerHeight === 0) return;

    const set = intersectingSet.current;
    set.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            set.add(entry.target);
          } else {
            set.delete(entry.target);
          }
        });
        // Check if any intersecting section has a light background
        const anyLight = [...set].some(
          (el) => el.getAttribute("data-header-text") === "light"
        );
        setLightBg(anyLight);
      },
      {
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    const elements = document.querySelectorAll("[data-header-text]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      set.clear();
      observer.disconnect();
    };
  }, [headerHeight]);

  const forceNavy = FORCE_NAVY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "#") || pathname.startsWith(p + "/"));
  const forceDarkText = FORCE_DARK_TEXT_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Determine the text colour:
  // - White when scrolled (semi-transparent header) OR when over a dark section
  // - brand-dark (#09111f) when over a light (white) section
  // - forceDarkText overrides forceNavy for paths with light backgrounds
  const textColor = forceDarkText ? "text-brand-dark" : (scrolled || forceNavy ? "text-white" : lightBg ? "text-brand-dark" : "text-white");

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const filteredNavLinks = NAV_LINKS.filter(
    (item) => item.label !== "Contact" && item.label !== "Case Studies"
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
          scrolled || forceNavy
            ? "bg-brand-navy/90 backdrop-blur-md py-4 border-b border-white/5"
            : "bg-transparent py-10"
        }`}
      >
        <div className="container-x flex items-center justify-between">
          {/* Logo Cross‑Fade (switch to colour when header text is dark) */}
          <Link href="/" className="relative h-10 w-36 overflow-hidden">
            {/* white logo shows when not scrolled and background is dark */}
            <div
              className={`absolute inset-0 transition-all duration-700 transform ${
                  !scrolled && (forceDarkText || (!forceNavy && lightBg)) ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                }`}
            >
              <Image
                src="/logos/aftaza-logo-white.svg"
                alt="AFTAZA"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* colour logo slides up when scrolled or light section detected */}
            <div
              className={`absolute inset-0 transition-all duration-700 transform ${
                  !scrolled && (forceDarkText || (!forceNavy && lightBg)) ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
            >
              <Image
                src="/logos/aftaza-logo-color.svg"
                alt="AFTAZA"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-12 ${textColor}`}>
            {filteredNavLinks.map((item) => {
              const hasDropdown = item.children && item.label !== "Services";

              return (
                <div
                  key={item.label}
                  className="relative py-2"
                  onMouseEnter={() => (hasDropdown ? handleMouseEnter(item.label) : undefined)}
                  onMouseLeave={() => (hasDropdown ? handleMouseLeave() : undefined)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-semibold tracking-[0.12em] transition-colors ${
                      activeDropdown === item.label ? "text-[#c8a34d]" : textColor
                    }`}
                  >
                    {item.label}
                    {hasDropdown && (
                      <motion.span
                        animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                        className="origin-center"
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.span>
                    )}
                  </Link>

                  <AnimatePresence>
                    {hasDropdown && activeDropdown === item.label && (
                      <DropdownMenu item={item} close={() => setActiveDropdown(null)} />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-8">
            <Link
              href="/contact"
              className={`hidden sm:flex btn-primary !px-6 !py-2.5 !text-[9px] ${textColor}`}
            >
              Engage Firm
            </Link>

            {/* Architectural Hamburger */}
            <HamburgerMenuButton
              className="flex flex-col gap-1.5 justify-center items-end w-8 h-8 group"
              onClick={() => setMobileOpen(true)}
            >
              <span
                className={`w-full h-[1px] transition-all group-hover:bg-[#c8a34d] ${textColor.replace(
                  "text-",
                  "bg-"
                )}`}
              />
              <span
                className={`w-2/3 h-[1px] transition-all group-hover:w-full group-hover:bg-[#c8a34d] ${textColor.replace(
                  "text-",
                  "bg-"
                )}`}
              />
              <span
                className={`w-full h-[1px] transition-all group-hover:bg-[#c8a34d] ${textColor.replace(
                  "text-",
                  "bg-"
                )}`}
              />
            </HamburgerMenuButton>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}