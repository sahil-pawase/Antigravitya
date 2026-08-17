"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md bg-[#081827] border border-[#162942] rounded-2xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            An unexpected application error occurred. Our team has been notified.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => reset()}
          className="gap-2 font-bold w-full justify-center"
        >
          <RefreshCw className="w-4 h-4" /> Reload & Try Again
        </Button>
      </div>
    </div>
  );
}
