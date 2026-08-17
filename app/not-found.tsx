import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 mx-auto">
          <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-[#41D8FF]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-white">404</h1>
          <h2 className="text-xl font-bold text-white">Page Not Found</h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            The page or curriculum module you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="cyan" size="md" className="gap-2 font-bold">
              <ArrowLeft className="w-4 h-4" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
