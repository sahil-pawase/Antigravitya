"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cyan";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#06101D] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer hover:scale-[1.02] active:scale-[0.97] active:translate-y-0.5 overflow-hidden group";

    const variantStyles = {
      primary:
        "bg-[#397CFF] hover:bg-[#2A65DC] text-white shadow-lg shadow-[#397CFF]/25 hover:shadow-[#397CFF]/40 focus:ring-[#397CFF] border border-[#397CFF]/40",
      cyan:
        "bg-[#41D8FF] hover:bg-[#2AC4EB] text-[#06101D] font-bold shadow-lg shadow-[#41D8FF]/25 hover:shadow-[#41D8FF]/40 focus:ring-[#41D8FF] border border-[#41D8FF]/50",
      secondary:
        "bg-[#0C1A2B] hover:bg-[#112338] text-[#F5F8FC] border border-[#162942] hover:border-[#397CFF]/50 focus:ring-[#1E3A5F] shadow-sm hover:shadow-md",
      outline:
        "bg-transparent hover:bg-[#0C1A2B]/80 text-[#F5F8FC] border border-[#162942] hover:border-[#397CFF]/70 focus:ring-[#397CFF] hover:shadow-md hover:shadow-[#397CFF]/10",
      ghost:
        "bg-transparent hover:bg-[#0C1A2B] text-[#94A3B8] hover:text-[#F5F8FC] focus:ring-[#1E3A5F]",
      danger:
        "bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg shadow-[#EF4444]/20 hover:shadow-[#EF4444]/40 focus:ring-[#EF4444]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-4.5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {/* Subtle shine sweep on hover for primary/cyan buttons */}
        {(variant === "primary" || variant === "cyan") && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />
        )}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
