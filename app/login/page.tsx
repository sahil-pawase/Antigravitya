"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Layers,
  Video,
  FileCode2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      const destination = redirectUrl || data.redirectTo || "/dashboard";
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#397CFF]/30">
      <DataMesh3DCanvas />

      <div className="absolute inset-0 bg-cyber-grid bg-[size:35px_35px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[300px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[250px] bg-[#41D8FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg shadow-[#397CFF]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#41D8FF]" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[#41D8FF] transition-colors">
            CAREER TRANSFORMER
          </span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Enterprise Value Proposition (No credentials shown) */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            <FadeIn>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student & Faculty Learning Portal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Transform Your Skills. <br />
                  <span className="shimmer-text">Build Your Career.</span>
                </h1>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Access live cohorts, interactive code sandboxes, graded SQL assignments, and 1-on-1 mentor feedback in your personal dashboard.
                </p>
              </div>

              {/* Portal Highlights Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#081827]/80 border border-[#162942] space-y-2 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-[#397CFF]/15 border border-[#397CFF]/30 flex items-center justify-center text-[#41D8FF]">
                    <Video className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Live & Replay Studio</strong>
                  <span className="text-[11px] text-[#64748B] block">Interactive meetings and exact session recordings</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#081827]/80 border border-[#162942] space-y-2 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Graded Code Labs</strong>
                  <span className="text-[11px] text-[#64748B] block">SQL window queries & real dataset capstones</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#081827]/80 border border-[#162942] space-y-2 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">6 Portfolio Builds</strong>
                  <span className="text-[11px] text-[#64748B] block">Production projects ready for recruiter reviews</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#081827]/80 border border-[#162942] space-y-2 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-bold text-white block">Verified Credentials</strong>
                  <span className="text-[11px] text-[#64748B] block">Tamper-proof verifiable certificates</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Clean & Secure Login Form */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <FadeIn delay={0.15}>
              <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(65, 216, 255, 0.25)">
                <div className="bg-[#081827]/95 border border-[#162942] rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6 backdrop-blur-xl relative overflow-hidden group">
                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#397CFF] via-[#41D8FF] to-[#397CFF]" />

                  {/* Header */}
                  <div className="space-y-1 text-center [transform:translateZ(10px)]">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06101D] border border-[#162942] text-[11px] text-[#41D8FF] mb-2 shadow-inner">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Encrypted Gateway</span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">
                      Sign In
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      Enter your account credentials to access your portal
                    </p>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 [transform:translateZ(20px)] animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-4 [transform:translateZ(20px)]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#CBD5E1] block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF] focus:ring-1 focus:ring-[#41D8FF] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#CBD5E1]">
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-[11px] font-semibold text-[#41D8FF] hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF] focus:ring-1 focus:ring-[#41D8FF] transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-[#94A3B8]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#06101D] border-[#162942] text-[#397CFF] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span>Remember my session</span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      variant="cyan"
                      size="lg"
                      className="w-full font-bold shadow-xl shadow-[#41D8FF]/20 mt-2 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#06101D] border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Credentials...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Register link */}
                  <div className="text-center pt-2 text-xs text-[#94A3B8] border-t border-[#162942] [transform:translateZ(10px)]">
                    Don't have an account yet?{" "}
                    <Link
                      href="/register"
                      className="font-bold text-[#41D8FF] hover:underline inline-flex items-center gap-1"
                    >
                      Enroll & Create Account →
                    </Link>
                  </div>
                </div>
              </TiltCard3D>
            </FadeIn>

            {/* Footer Security Indicator */}
            <div className="text-center text-[11px] text-[#64748B] flex items-center justify-center gap-2 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit TLS Encrypted Authentication Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#040B14] flex items-center justify-center text-white">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
