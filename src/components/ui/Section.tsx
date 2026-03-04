import * as React from "react";
import { cn } from "@/lib/utils";

// use generic HTMLElement to avoid DOM lib issues in some tsconfigs
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  border?: boolean;
}

export default function Section({ 
  children, 
  className, 
  id, 
  dark = false,
  border = false,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      data-header-text={dark ? "dark" : "light"}
      className={cn(
        "section-y relative overflow-hidden", // Inherits: padding-top/bottom: var(--section-y)
        dark ? "bg-brand-navy text-white" : "bg-white text-brand-dark",
        border && "border-b border-white/5",
        className
      )}
      {...props}
    >
      {/* Optional Noise Overlay for Dark Sections */}
      {dark && <div className="absolute inset-0 noise-overlay pointer-events-none opacity-20" />}
      
      {children}
    </section>
  );
}

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
  size?: "section" | "hero";
}

export const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ as = "h2", tone = "light", size = "section", className, ...props }, ref) => {
    const Comp = as;
    const normalizedClassName =
      typeof className === "string"
        ? className
            .replace(/\buppercase\b/g, "")
            .replace(/\b(?:sm:|md:|lg:|xl:|2xl:)?!text-[^\s]+\b/g, "")
            .trim()
        : className;

    return (
      <Comp
        ref={ref}
        className={cn(
          "font-display tracking-tight",
          size === "hero"
            ? "text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1]"
            : "text-4xl md:text-5xl font-extrabold leading-[1.15]",
          tone === "dark" ? "text-white" : "text-brand-dark",
          normalizedClassName,
          "normal-case"
        )}
        {...props}
      />
    );
  }
);

SectionTitle.displayName = "SectionTitle";

export interface TitleAccentProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TitleAccent = React.forwardRef<HTMLSpanElement, TitleAccentProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-brand-gold font-bold", className)} {...props} />
));

TitleAccent.displayName = "TitleAccent";
