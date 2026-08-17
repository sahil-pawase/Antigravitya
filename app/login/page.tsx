"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/Button";
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  LineChart,
  UserCheck,
} from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { Login3DScene } from "@/components/3d/Login3DScene";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<"student" | "alumni" | "admin">("student");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const isLoggedOut = searchParams.get("logout") === "success";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      // Successful login
      router.push(data.redirectTo || redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (role: "student" | "alumni" | "admin") => {
    setActiveRole(role);
    if (role === "student") {
      setEmail("student@careertransformer.in");
      setPassword("StudentPassword123!");
    } else if (role === "alumni") {
      setEmail("alumni@careertransformer.in");
      setPassword("StudentPassword123!");
    } else if (role === "admin") {
      setEmail("pawasesahil2004@gmail.com");
      setPassword("Ram@123");
    }
  };

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-center py-8 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#397CFF]/30">
      {/* 3D WebGL Three.js Particle & Cyber Orbit Background */}
      <Login3DScene />

      {/* Cyber Grid & Ambient Radial Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#397CFF]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#41D8FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: 3D Feature Showcase & Brand Elevation */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <FadeIn>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-xl shadow-[#397CFF]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-[#41D8FF] group-hover:text-white transition-colors" />
                  </div>
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  CAREER <span className="text-[#41D8FF]">TRANSFORMER</span>
                </span>
              </Link>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF] shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Student Learning & Career Portal</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Enter Your Practical <br />
                  <span className="bg-gradient-to-r from-[#41D8FF] via-[#397CFF] to-[#80E5FF] bg-clip-text text-transparent">
                    Analytics Workbench
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#94A3B8] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Continue your SQL queries, Power BI data models, Python pipelines, and 1-on-1 mentor code reviews with lifetime access.
                </p>
              </div>
            </FadeIn>

            {/* 3D Floating Feature Pillars */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#081827]/80 border border-[#162942] hover:border-[#397CFF]/50 transition-all duration-300 shadow-lg backdrop-blur-md text-left group">
                  <div className="w-8 h-8 rounded-lg bg-[#397CFF]/15 border border-[#397CFF]/30 flex items-center justify-center text-[#41D8FF] mb-2 group-hover:scale-110 transition-transform">
                    <Database className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">SQL & Python Labs</strong>
                  <span className="text-[11px] text-[#64748B]">Real business datasets</span>
                </div>

                <div className="p-4 rounded-xl bg-[#081827]/80 border border-[#162942] hover:border-[#41D8FF]/50 transition-all duration-300 shadow-lg backdrop-blur-md text-left group">
                  <div className="w-8 h-8 rounded-lg bg-[#41D8FF]/15 border border-[#41D8FF]/30 flex items-center justify-center text-[#41D8FF] mb-2 group-hover:scale-110 transition-transform">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">6 Portfolio Capstones</strong>
                  <span className="text-[11px] text-[#64748B]">Line-by-line review</span>
                </div>

                <div className="p-4 rounded-xl bg-[#081827]/80 border border-[#162942] hover:border-emerald-500/50 transition-all duration-300 shadow-lg backdrop-blur-md text-left group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Power BI & Tableau</strong>
                  <span className="text-[11px] text-[#64748B]">Executive dashboards</span>
                </div>
              </div>
            </FadeIn>

            {/* Testimonial Snippet */}
            <FadeIn delay={0.3}>
              <div className="hidden sm:flex items-center gap-4 p-4 rounded-xl bg-[#06101D]/70 border border-[#162942] backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center text-[#06101D] font-bold text-sm">
                  AP
                </div>
                <div className="text-left text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    {"★★★★★"}
                  </div>
                  <p className="text-[#94A3B8] italic mt-0.5">
                    "The feedback on my SQL portfolio projects helped me crack my first Data Analyst role at a product startup within 60 days."
                  </p>
                  <span className="text-[11px] font-semibold text-white mt-0.5 block">
                    — Aarav Patel, Data Analyst at Swiggy
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: 3D Perspective Glassmorphism Login Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <FadeIn delay={0.15}>
              <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(65, 216, 255, 0.3)">
                <div className="bg-[#081827]/90 border border-[#162942] rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden group">
                  {/* Subtle Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#397CFF] via-[#41D8FF] to-[#397CFF]" />

                  {/* Header */}
                  <div className="space-y-1 text-center [transform:translateZ(10px)]">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">
                      Welcome Back
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Sign in with your email and password to access your dashboard
                    </p>
                  </div>

                  {/* 1-Click Interactive Role Switcher */}
                  <div className="p-3 rounded-2xl bg-[#06101D] border border-[#162942] space-y-2 [transform:translateZ(15px)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#41D8FF] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#41D8FF] animate-pulse" /> 1-Click Instant Demo Login:
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => handleDemoFill("student")}
                        className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-center font-medium flex items-center justify-center gap-1.5 ${
                          activeRole === "student" && email === "student@careertransformer.in"
                            ? "bg-[#0C1A2B] border-[#41D8FF] text-[#41D8FF] shadow-md shadow-[#41D8FF]/10 font-bold"
                            : "bg-[#081827] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40 hover:text-white"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Student</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoFill("alumni")}
                        className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-center font-medium flex items-center justify-center gap-1.5 ${
                          activeRole === "alumni" && email === "alumni@careertransformer.in"
                            ? "bg-[#0C1A2B] border-emerald-400 text-emerald-400 shadow-md shadow-emerald-400/10 font-bold"
                            : "bg-[#081827] border-[#162942] text-[#94A3B8] hover:border-emerald-500/40 hover:text-white"
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Alumni</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoFill("admin")}
                        className={`px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer text-center font-medium flex items-center justify-center gap-1.5 ${
                          activeRole === "admin" && (email === "pawasesahil2004@gmail.com" || email === "admin@careertransformer.in")
                            ? "bg-[#0C1A2B] border-amber-400 text-amber-400 shadow-md shadow-amber-400/10 font-bold"
                            : "bg-[#081827] border-[#162942] text-[#94A3B8] hover:border-amber-500/40 hover:text-white"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </button>
                    </div>
                  </div>

                  {isLoggedOut && !error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-400 [transform:translateZ(10px)]"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                      <span>You have been safely signed out of your account.</span>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs sm:text-sm text-red-400 [transform:translateZ(10px)]"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4 [transform:translateZ(10px)]">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#F5F8FC] block">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-[#06101D] border border-[#162942] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF] transition-colors shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#F5F8FC] block">
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#41D8FF] hover:underline font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full bg-[#06101D] border border-[#162942] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF] transition-colors shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#41D8FF] transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#94A3B8]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-[#06101D] border-[#162942] text-[#397CFF] focus:ring-0 focus:ring-offset-0"
                        />
                        <span>Remember my session</span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="cyan"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full justify-center font-bold shadow-xl shadow-[#41D8FF]/20 text-[#06101D] text-base hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        <span>Sign In to Portal</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>

                  {/* Footer & Registration Link */}
                  <div className="pt-4 border-t border-[#162942] text-center text-xs text-[#94A3B8] [transform:translateZ(5px)]">
                    Don't have an account yet?{" "}
                    <Link href="/register" className="text-[#41D8FF] font-bold hover:underline">
                      Enroll & Create Account →
                    </Link>
                  </div>
                </div>
              </TiltCard3D>
            </FadeIn>

            {/* Encryption Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#64748B] mt-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-bit TLS Encrypted Authentication Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
