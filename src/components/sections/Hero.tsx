"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, animate } from "framer-motion";
import type { Variants } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { SliderNavButton } from "@/components/ui/Button";

const slides = [
  {
    id: 1,
    image: "/images/aftaza-transaction-architecture-hero.jpg",
    headline: "Structured Real Estate Transaction Systems.",
    subheadline: "Governance-driven commercialization and capital alignment across Ethiopia’s evolving property ecosystem.",
    primaryCta: { text: "Structure Engagement", href: "/contact" },
    secondaryCta: { text: "Our Methodology", href: "/methodology" },
    tabLabel: "Institutional",
  },
  {
    id: 2,
    image: "/images/aftaza-developer-commercialization-system.jpg",
    headline: "Structured Real Estate Project Commercialization.",
    subheadline: "Governed demand systems designed to stabilize revenue, protect pricing integrity, and accelerate capital recovery.",
    primaryCta: { text: "For Developers", href: "/developer" },
    secondaryCta: { text: "View Framework", href: "/developer-framework" },
    tabLabel: "Developer",
  },
  {
    id: 3,
    image: "/images/aftaza-buyer-capital-protection.jpg",
    headline: "Governed Property Acquisition Pathway.",
    subheadline: "Structured due diligence, documentation oversight, and capital protection frameworks for disciplined buyers.",
    primaryCta: { text: "Buyer Advisory", href: "/buyer" },
    secondaryCta: { text: "Start Review", href: "/buyer-review" },
    tabLabel: "Buyer",
  },
  {
    id: 4,
    image: "/images/aftaza-investor-transaction-governance.jpg",
    headline: "Structured Real Estate Capital Deployment.",
    subheadline: "Risk-screened, governance-aligned real estate opportunities engineered for performance clarity and stability.",
    primaryCta: { text: "For Investors", href: "/investor" },
    secondaryCta: { text: "Capital Framework", href: "/investor-framework" },
    tabLabel: "Investor",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const slideDuration = 6000; // 6 seconds
  const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

  useEffect(() => {
    if (!isPaused) {
      startAutoPlay(progress);
    } else {
      if (animationRef.current) animationRef.current.stop();
    }

    return () => {
      if (animationRef.current) animationRef.current.stop();
    };
  }, [currentSlide, isPaused, progress]);

  const startAutoPlay = (fromProgress: number) => {
    if (animationRef.current) animationRef.current.stop();

    const remainingDuration = (slideDuration * (1 - fromProgress)) / 1000;

    const controls = animate(fromProgress, 1, {
      duration: remainingDuration,
      ease: "linear",
      onUpdate: (latest) => setProgress(latest),
      onComplete: () => {
        setProgress(0);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      },
    });
    animationRef.current = controls;
  };

  const handleManualNav = (index: number) => {
    if (index === currentSlide) return;
    if (animationRef.current) animationRef.current.stop();
    setProgress(0);
    setCurrentSlide(index);
  };

  const textVariants: Variants = {
    initial: { opacity: 0, y: 30, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easing } },
    exit: { opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.4 } },
  };

  return (
    <section
      className="relative h-screen w-full flex items-center overflow-hidden bg-[#09111f]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#09111f]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src={slides[currentSlide].image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09111f] via-[#09111f]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09111f] via-[#09111f]/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content - Perfectly centered */}
      <div className="container-x relative z-10 w-full">
        <div className="max-w-[800px] mx-auto md:mx-0"> {/* Center on mobile, left-aligned on desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div className="mb-4 md:mb-6" variants={textVariants}>
                <Badge>Addis Ababa, Ethiopia</Badge>
              </motion.div>
              
              <motion.h1 
                className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-4 md:mb-6 font-display" 
                variants={textVariants}
              >
                {slides[currentSlide].headline}
              </motion.h1>

              <motion.p 
                className="text-slate-400 text-base md:text-lg lg:text-xl max-w-xl mb-6 md:mb-8 leading-relaxed font-body" 
                variants={textVariants}
              >
                {slides[currentSlide].subheadline}
              </motion.p>

              <motion.div className="flex flex-wrap gap-3 md:gap-4" variants={textVariants}>
                <Link href={slides[currentSlide].primaryCta.href} className="btn-primary">
                  {slides[currentSlide].primaryCta.text}
                </Link>
                <Link href={slides[currentSlide].secondaryCta.href} className="btn-outline">
                  {slides[currentSlide].secondaryCta.text}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MODERN PAGINATION SYSTEM */}
      <div className="absolute bottom-8 md:bottom-12 left-0 w-full z-20">
        <div className="container-x flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          
          {/* Left Side: Editorial Numbering */}
          <div className="flex items-center gap-4 md:gap-6 group/nav">
            <div className="flex items-baseline gap-2 md:gap-3">
              <div className="overflow-hidden h-[40px] md:h-[48px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentSlide}
                    initial={{ y: 40 }}
                    animate={{ y: 0 }}
                    exit={{ y: -40 }}
                    transition={{ duration: 0.6, ease: easing }}
                    className="text-4xl md:text-5xl font-bold text-[#c8a34d] font-display"
                  >
                    {String(currentSlide + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-slate-600 text-lg md:text-xl font-light">/</span>
              <span className="text-slate-500 text-xs md:text-sm tracking-widest font-medium">
                {String(slides.length).padStart(2, '0')}
              </span>
            </div>
            
            <div className="h-8 md:h-10 w-[1px] bg-white/10" />
            
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] text-[#c8a34d] font-bold mb-0.5 md:mb-1">
                Strategy
              </span>
              <span className="text-white text-xs md:text-sm font-semibold tracking-wide uppercase">
                {slides[currentSlide].tabLabel}
              </span>
            </div>

            {/* Pause Indicator */}
            {isPaused && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="ml-2 md:ml-4 px-1.5 md:px-2 py-0.5 md:py-1 rounded bg-[#c8a34d]/10 border border-[#c8a34d]/20 text-[8px] md:text-[9px] text-[#c8a34d] font-bold uppercase tracking-tighter"
              >
                Paused
              </motion.div>
            )}
          </div>

          {/* Right Side: Visual Progress Tracks */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
            {slides.map((_, idx) => (
              <SliderNavButton
                key={idx}
                onClick={() => handleManualNav(idx)}
                className="relative group flex-1 md:flex-none py-2 md:py-4"
              >
                <div className="flex flex-col gap-1 md:gap-3">
                  <span className={`text-[8px] md:text-[10px] font-bold transition-colors duration-300 ${idx === currentSlide ? 'text-[#c8a34d]' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  
                  <div className="relative w-full md:w-20 h-[2px] bg-white/10 transition-all duration-300 group-hover:bg-white/20">
                    {idx === currentSlide && (
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-[#c8a34d] shadow-[0_0_10px_rgba(200,163,77,0.4)]"
                        style={{ width: `${progress * 100}%` }}
                        transition={{ ease: "linear" }}
                      />
                    )}
                  </div>
                </div>
              </SliderNavButton>
            ))}
          </div>

        </div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-[#09111f] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
