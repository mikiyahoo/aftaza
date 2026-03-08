"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Badge from "@/components/ui/Badge";

const propertyTypes = ["All", "Apartment", "Villa", "Office", "Land", "Commercial"];
const locations = ["All Locations", "Addis Ababa", "Bole", "Kazanchis", "Ayat", "Jemo"];

export default function Hero() {
  const [propertyType, setPropertyType] = useState("All");
  const [location, setLocation] = useState("All Locations");

  const textVariants: Variants = {
    initial: { opacity: 0, y: 30, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
  };

  const handleSearch = () => {
    // Navigate to properties page with filters
    const params = new URLSearchParams();
    if (propertyType !== "All") params.set("type", propertyType);
    if (location !== "All Locations") params.set("location", location);
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden bg-brand-navy">
      {/* Background - Luxury House Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/property/luxury-house-image.jpg"
          alt="Luxury Property"
          fill
          priority
          className="object-cover object-center"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Gradient Overlays for Text Pop-out */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-brand-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-navy/20 to-brand-navy/60" />
      </div>

      {/* Main Content Layout - Left Content + Right Search/Navigation */}
      <div className="container-x relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial="initial"
              animate="animate"
            >
              <motion.div className="mb-4 md:mb-6" variants={textVariants}>
                <Badge>Addis Ababa, Ethiopia</Badge>
              </motion.div>
              
              <motion.h1 
                className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-4 md:mb-6" 
                variants={textVariants}
              >
                Discover Your Perfect Property
              </motion.h1>

              <motion.p 
                className="text-slate-300 text-base md:text-lg lg:text-xl max-w-xl mb-6 md:mb-8 leading-relaxed" 
                variants={textVariants}
              >
                Explore curated luxury properties across Ethiopia's most prestigious locations. From modern apartments to exclusive villas.
              </motion.p>

              <motion.div className="flex flex-wrap gap-3 md:gap-4" variants={textVariants}>
                <Link href="/properties" className="btn-primary">
                  Browse Properties
                </Link>
                <Link href="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Property Search Filter */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20"
            >
              <h3 className="text-white text-xl font-bold mb-6">Find Your Property</h3>
              
              {/* Property Type Filter */}
              <div className="mb-5">
                <label className="text-slate-300 text-sm font-medium mb-2 block">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        propertyType === type
                          ? 'bg-[#c8a34d] text-brand-navy'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="text-slate-300 text-sm font-medium mb-2 block">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-label="Select location"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#c8a34d] transition-colors cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-brand-navy">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full py-4 bg-[#c8a34d] hover:bg-[#b89342] text-brand-navy font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#c8a34d]/20 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Properties
              </button>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-slate-400 text-xs mb-3">Quick Access</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/properties?type=Apartment" className="text-xs text-[#c8a34d] hover:text-[#d4b35e] transition-colors">
                    Apartments →
                  </Link>
                  <Link href="/properties?type=Villa" className="text-xs text-[#c8a34d] hover:text-[#d4b35e] transition-colors">
                    Villas →
                  </Link>
                  <Link href="/properties?type=Office" className="text-xs text-[#c8a34d] hover:text-[#d4b35e] transition-colors">
                    Offices →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-brand-dark to-transparent z-10 pointer-events-none" />
    </section>
  );
}
