import * as React from "react";
import { cn } from "@/lib/utils";

export interface SimpleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ className, title, subtitle, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300",
        className
      )} 
      {...props}
    >
      {title && (
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      )}
      {subtitle && (
        <p className="text-gray-300 text-sm mb-4">{subtitle}</p>
      )}
      <div className="text-gray-200">
        {children}
      </div>
    </div>
  )
);

SimpleCard.displayName = "SimpleCard";