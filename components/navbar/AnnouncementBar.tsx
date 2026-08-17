import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border-b border-[#162942] py-2 px-4 text-xs font-medium text-[#F5F8FC] text-center flex items-center justify-center gap-2 relative overflow-hidden group">
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#397CFF]/20 text-[#41D8FF] border border-[#397CFF]/40 text-[11px] font-semibold pulse-badge">
        <Sparkles className="w-3 h-3 text-[#41D8FF]" /> Admissions Open
      </span>
      <span className="hidden sm:inline text-[#94A3B8]">
        Next Data Analytics Career Cohort Starts Soon —
      </span>
      <Link
        href="/courses/data-analytics"
        className="text-[#41D8FF] hover:text-white inline-flex items-center gap-1 font-semibold transition-colors group-hover:underline"
      >
        <span>Explore Curriculum & Projects</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
