import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 text-[#41D8FF] animate-spin" />
      <span className="text-xs text-[#94A3B8] font-medium tracking-wide">
        Loading Career Transformer platform...
      </span>
    </div>
  );
}
