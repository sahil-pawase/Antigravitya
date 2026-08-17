import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "cyan" | "outline" | "purple";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "sm", children, ...props }: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded-full border select-none";

  const variants = {
    default: "bg-[#0C1A2B] text-[#94A3B8] border-[#162942]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    cyan: "bg-[#41D8FF]/10 text-[#41D8FF] border-[#41D8FF]/20",
    purple: "bg-[#397CFF]/10 text-[#397CFF] border-[#397CFF]/25",
    outline: "bg-transparent text-[#94A3B8] border-[#162942]",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
