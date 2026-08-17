"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"logging_out" | "success">("logging_out");

  useEffect(() => {
    async function performLogout() {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Logout request error:", err);
      } finally {
        setStatus("success");
        const timer = setTimeout(() => {
          router.push("/login?logout=success");
          router.refresh();
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-[#397CFF]/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#397CFF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#41D8FF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#081827]/90 border border-[#162942] rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center space-y-6"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#397CFF] via-[#41D8FF] to-[#397CFF]" />

        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg shadow-[#397CFF]/25">
              <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#41D8FF]" />
              </div>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              CAREER <span className="text-[#41D8FF]">TRANSFORMER</span>
            </span>
          </Link>
        </div>

        {/* Status Graphic */}
        <div className="py-2 flex justify-center">
          {status === "logging_out" ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#0C1A2B] border border-[#162942] flex items-center justify-center text-[#41D8FF] shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#41D8FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#397CFF]" />
              </span>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner"
            >
              <CheckCircle2 className="w-8 h-8" />
            </motion.div>
          )}
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">
            {status === "logging_out"
              ? "Signing Out..."
              : "Logged Out Successfully"}
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
            {status === "logging_out"
              ? "Safely invalidating your active session and clearing authentication keys..."
              : "Your session has been securely ended. Redirecting you to the login screen..."}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="cyan"
            size="md"
            className="w-full"
            onClick={() => router.push("/login?logout=success")}
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
