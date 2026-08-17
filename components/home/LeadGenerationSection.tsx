"use client";

import React from "react";
import { LeadForm } from "@/leads/LeadForm";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export function LeadGenerationSection() {
  return (
    <section className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
      {/* 3D WebGL Background Mesh */}
      <DataMesh3DCanvas className="w-full h-full absolute inset-0 pointer-events-none opacity-30 z-0" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <FadeIn className="lg:col-span-5 space-y-6" direction="left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Admissions Counseling</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight">
              Ready to Transform <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#41D8FF] to-[#397CFF]">
                Your Career?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Speak with a Senior Data Analytics Mentor. We will walk you through the real project repositories, evaluate your background, and help you map out your career transformation roadmap.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081827]/60 border border-[#162942]/60 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#F5F8FC]">
                  <strong className="text-white block text-sm">30-Minute 1-on-1 Walkthrough</strong>
                  Explore real datasets, project dashboards, and the student learning portal.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081827]/60 border border-[#162942]/60 backdrop-blur-sm hover:border-[#41D8FF]/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#41D8FF] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#F5F8FC]">
                  <strong className="text-white block text-sm">Skill Gap Analysis</strong>
                  Understand exactly what tools (SQL, Power BI, Python) you need for your target role.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#081827]/60 border border-[#162942]/60 backdrop-blur-sm hover:border-[#397CFF]/40 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#397CFF] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#F5F8FC]">
                  <strong className="text-white block text-sm">Zero Obligation & Zero Spam</strong>
                  We pride ourselves on honest educational guidance, not pushy sales tactics.
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right form card with 3D Tilt */}
          <FadeIn className="lg:col-span-7" direction="right" delay={0.2}>
            <TiltCard3D maxTilt={5} scale={1.01} glowColor="rgba(65, 216, 255, 0.25)">
              <div className="rounded-2xl bg-[#081827]/95 border border-[#162942] p-6 sm:p-10 shadow-2xl backdrop-blur-xl group">
                <div className="mb-6 [transform:translateZ(10px)]">
                  <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">
                    Book Your Free 1-on-1 Demo
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Fill in your details below and our academic team will confirm your session slot.
                  </p>
                </div>

                <div className="[transform:translateZ(5px)]">
                  <LeadForm source="HOMEPAGE_BOTTOM_SECTION" buttonText="Confirm Free Demo Booking →" />
                </div>
              </div>
            </TiltCard3D>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
