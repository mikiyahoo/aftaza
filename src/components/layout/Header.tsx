"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { HamburgerMenuButton } from "@/components/ui/Button";

type NavItem = (typeof NAV_LINKS)[number];
type HeaderSurface = "light" | "dark";
type HeaderShellMode = "filled" | "transparent";

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];
const shellShape = {
  clipPath: "polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%)",
} as const;
const dropdownShape = {
  clipPath: "polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%)",
} as const;

function parseHeaderSurface(value: string | null): HeaderSurface | null {
  if (value === "light" || value === "dark") {
    return value;
  }

  return null;
}

function parseHeaderShellMode(value: string | null): HeaderShellMode | null {
  if (value === "filled" || value === "transparent") {
    return value;
  }

  return null;
}

function resolveHeaderContext() {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>("[data-header-surface], [data-header-text], [data-header-shell]")
  )
    .map((element) => ({
      surface:
        parseHeaderSurface(element.getAttribute("data-header-surface")) ??
        parseHeaderSurface(element.getAttribute("data-header-text")),
      shellMode: parseHeaderShellMode(element.getAttribute("data-header-shell")),
      top: element.getBoundingClientRect().top,
    }))
    .filter(
      (candidate): candidate is { surface: HeaderSurface; shellMode: HeaderShellMode | null; top: number } =>
        candidate.surface !== null
    )
    .sort((a, b) => a.top - b.top);

  const activeCandidates = candidates.filter(({ top }) => top <= window.innerHeight * 0.66);
  const activeCandidate = activeCandidates[activeCandidates.length - 1] ?? candidates[0];

  return {
    surface: activeCandidate?.surface ?? "dark",
    shellMode: activeCandidate?.shellMode ?? null,
  };
}

function DropdownMenu({
  item,
  close,
  surface,
  scrolled,
}: {
  item: NavItem;
  close: () => void;
  surface: HeaderSurface;
  scrolled: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLightSurface = surface === "light";

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
      className="absolute left-0 top-full z-[170] mt-4 w-80 overflow-visible p-2"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border shadow-[0_24px_50px_rgba(0,0,0,0.18)] backdrop-blur-[26px]",
          isLightSurface
            ? scrolled
              ? "border-slate-200/90 bg-white/94 shadow-[0_24px_50px_rgba(15,23,42,0.14)]"
              : "border-slate-200/70 bg-white/90 shadow-[0_20px_44px_rgba(15,23,42,0.12)]"
            : scrolled
              ? "border-white/12 bg-brand-navy/88 shadow-[0_24px_50px_rgba(0,0,0,0.42)]"
              : "border-white/10 bg-brand-navy/82 shadow-[0_20px_46px_rgba(2,6,23,0.4)]"
        )}
        style={dropdownShape}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-[1px]",
          isLightSurface
            ? scrolled
              ? "border border-white/78 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.12)_34%,transparent_64%)]"
              : "border border-white/48 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.08)_34%,transparent_64%)]"
            : scrolled
              ? "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_24%)]"
              : "border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),transparent_24%)]"
        )}
        style={dropdownShape}
      />
      <div className="relative z-10 grid gap-1">
        {item.children.map((child, i) => (
          <a
            key={i}
            href={child.href}
            onClick={(e) => handleChildClick(e, child.href)}
            className={cn(
              "group flex cursor-pointer flex-col border p-4 transition-all",
              isLightSurface
                ? scrolled
                  ? "border-slate-200/55 bg-slate-50/74 backdrop-blur-md hover:border-slate-200/90 hover:bg-white/90"
                  : "border-slate-200/50 bg-white/68 backdrop-blur-md hover:border-slate-200/90 hover:bg-white/86"
                : scrolled
                  ? "border-white/8 bg-white/[0.06] backdrop-blur-md hover:border-white/12 hover:bg-white/[0.1]"
                  : "border-white/6 bg-white/[0.04] backdrop-blur-md hover:border-white/10 hover:bg-white/[0.08]"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium tracking-[0.1em] transition-colors group-hover:text-[#c8a34d]",
                isLightSurface ? "text-brand-dark" : "text-white"
              )}
            >
              {child.label}
            </span>
            {"desc" in child && child.desc && (
              <span
                className={cn(
                  "mt-1 text-[11px] font-medium leading-relaxed",
                  isLightSurface ? "text-slate-500" : "text-slate-400"
                )}
              >
                {child.desc}
              </span>
            )}
          </a>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r border-t border-[#c8a34d]/30" />
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [heroSurface, setHeroSurface] = useState<HeaderSurface>("dark");
  const [shellMode, setShellMode] = useState<HeaderShellMode | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateSurface = () => {
      const nextContext = resolveHeaderContext();
      setHeroSurface(nextContext.surface);
      setShellMode(nextContext.shellMode);
    };

    const frame = window.requestAnimationFrame(updateSurface);
    const timeout = window.setTimeout(updateSurface, 180);

    window.addEventListener("resize", updateSurface);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("resize", updateSurface);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const usesLightSurface = heroSurface === "light";
  const showFilledShell =
    shellMode === "filled"
      ? true
      : shellMode === "transparent"
        ? scrolled
        : scrolled || usesLightSurface;
  const textColor = usesLightSurface ? "text-brand-dark" : "text-white";
  const hamburgerColor = usesLightSurface ? "bg-brand-dark" : "bg-white";
  const logoSrc = usesLightSurface ? "/logos/aftaza-logo-color.svg" : "/logos/aftaza-logo-white.svg";
  const shellSurfaceClasses = showFilledShell
    ? usesLightSurface
      ? scrolled
        ? "border-slate-200/85 bg-white/82 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-[22px]"
        : "border-slate-200/72 bg-white/80 shadow-[0_14px_36px_rgba(15,23,42,0.08)] backdrop-blur-[20px]"
      : "border-white/12 bg-brand-navy/80 shadow-[0_18px_48px_rgba(2,6,23,0.34)] backdrop-blur-[22px]"
    : "border-transparent bg-transparent shadow-none";
  const shellHighlightClasses = showFilledShell
    ? usesLightSurface
      ? scrolled
        ? "border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.48),transparent_28%)]"
        : "border-white/52 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),transparent_30%)]"
      : scrolled
        ? "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),transparent_24%)]"
        : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_24%)]"
    : "border-transparent bg-transparent";

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
      <header className={pathname.startsWith('/admin') ? "relative left-0 right-0 top-0 z-[100] px-3 pt-4 md:px-6 md:pt-6" : "fixed left-0 right-0 top-0 z-[100] px-3 pt-4 md:px-6 md:pt-6"}>
        <div className="container-x pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-[1280px]">
            <div className="relative w-full overflow-visible">
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 border transition-all duration-700",
                  shellSurfaceClasses
                )}
                style={shellShape}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-[1px] border transition-all duration-700",
                  shellHighlightClasses
                )}
                style={shellShape}
              />

              <div className="relative flex items-center justify-between gap-4 px-5 py-4 md:px-7 md:py-5">
                <Link href="/" className="relative block h-10 w-36 overflow-hidden">
                  <Image
                    src={logoSrc}
                    alt="AFTAZA"
                    fill
                    className="object-contain"
                    priority
                  />
                </Link>

                <nav
                  className={cn(
                    "absolute left-[46%] hidden -translate-x-1/2 items-center gap-10 xl:left-[45%] xl:gap-12 lg:flex",
                    textColor
                  )}
                >
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
                          className={cn(
                            "flex items-center gap-2 text-sm font-semibold tracking-[0.12em] transition-colors",
                            activeDropdown === item.label ? "text-[#c8a34d]" : textColor
                          )}
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
                            <DropdownMenu
                              item={item}
                              close={() => setActiveDropdown(null)}
                              surface={heroSurface}
                              scrolled={scrolled}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>

                <div className="ml-auto mr-2 flex items-center gap-4 md:mr-3 md:gap-5 lg:mr-4">
                  <Link
                    href="/contact"
                    className="btn-primary hidden items-center justify-center px-6 py-3 text-[9px] font-bold uppercase tracking-[0.22em] sm:inline-flex"
                  >
                    Engage Firm
                  </Link>

                  <HamburgerMenuButton
                    aria-label="Open navigation menu"
                    aria-expanded={mobileOpen}
                    className="group flex h-10 w-10 flex-col items-end justify-center gap-1.5"
                    onClick={() => setMobileOpen(true)}
                  >
                    <span
                      className={cn(
                        "h-[1px] w-full transition-all duration-300 group-hover:bg-[#c8a34d]",
                        hamburgerColor
                      )}
                    />
                    <span
                      className={cn(
                        "h-[1px] w-2/3 transition-all duration-300 group-hover:w-full group-hover:bg-[#c8a34d]",
                        hamburgerColor
                      )}
                    />
                    <span
                      className={cn(
                        "h-[1px] w-full transition-all duration-300 group-hover:bg-[#c8a34d]",
                        hamburgerColor
                      )}
                    />
                  </HamburgerMenuButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
