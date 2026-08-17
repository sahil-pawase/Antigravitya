"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5">
            <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#41D8FF]" />
            </div>
          </div>
          <span className="font-extrabold text-2xl text-white">CAREER TRANSFORMER</span>
        </Link>
        <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
        <p className="text-xs text-[#94A3B8]">
          Enter your registered email and we will send you a secure password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#081827] border border-[#162942] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, a recovery link has been sent. Please check your inbox and spam folders.
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="secondary" size="md" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="you@careertransformer.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                Send Recovery Link →
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-[#94A3B8] hover:text-[#41D8FF] inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
