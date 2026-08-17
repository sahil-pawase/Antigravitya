"use client";

import React from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { TiltCard3D } from "@/components/3d/TiltCard3D";

export function WhyChooseUs() {
  const comparisons = [
    {
      feature: "Curriculum Focus",
      traditional: "Isolated theoretical syntax and toy 20-row CSV examples.",
      transformer: "Production-grade messy datasets, multi-table schemas, and enterprise business metrics.",
    },
    {
      feature: "Outcome Proof",
      traditional: "Generic PDF completion certificate without portfolio links.",
      transformer: "6 Live GitHub project repositories, interactive Power BI/Tableau links, and public verified credential.",
    },
    {
      feature: "Mentor Support",
      traditional: "Automated multiple-choice quizzes with zero code review.",
      transformer: "Line-by-line manual code evaluation with qualitative scoring, feedback, and 1-on-1 calls.",
    },
    {
      feature: "Career Preparation",
      traditional: "Generic resume templates sent via automated email blast.",
      transformer: "Technical SQL whiteboarding drills, case study interview simulations, and recruiter messaging frameworks.",
    },
    {
      feature: "Transparency Pledge",
      traditional: "Inflated 100% placement guarantees and unverified marketing testimonials.",
      transformer: "Zero fake statistics. 100% genuine hands-on technical rigor and honest mentorship.",
    },
  ];

  return (
    <section className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
              Transparent Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              Why High-Intent Learners Choose Us
            </h2>
            <p className="text-[#94A3B8] text-base">
              See how Career Transformer differs from traditional video portals and superficial coaching courses.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <TiltCard3D maxTilt={4} scale={1.01} glowColor="rgba(57, 124, 255, 0.2)">
            <div className="overflow-hidden rounded-2xl border border-[#162942] bg-[#081827]/90 backdrop-blur-md shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#162942] bg-[#0C1A2B] p-4 sm:p-5 font-bold text-xs uppercase tracking-wider">
                <div className="md:col-span-4 text-[#94A3B8]">Key Factor</div>
                <div className="md:col-span-4 text-red-400/80 hidden md:block">Generic Tutorial Portals</div>
                <div className="md:col-span-4 text-[#41D8FF] hidden md:flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#41D8FF]" />
                  <span>Career Transformer Standard</span>
                </div>
              </div>

              <div className="divide-y divide-[#162942]">
                {comparisons.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-1 md:grid-cols-12 p-5 sm:p-6 gap-4 items-center hover:bg-[#0C1A2B]/60 transition-all duration-200 group"
                  >
                    <div className="md:col-span-4">
                      <span className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">{row.feature}</span>
                    </div>

                    <div className="md:col-span-4 space-y-1">
                      <span className="md:hidden text-[11px] uppercase font-bold text-red-400 block">
                        Generic Courses:
                      </span>
                      <div className="flex items-start gap-2 text-xs text-[#94A3B8]">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </div>

                    <div className="md:col-span-4 space-y-1 bg-[#06101D]/70 md:bg-transparent p-3.5 md:p-0 rounded-lg border border-[#162942] md:border-none group-hover:border-[#397CFF]/40 transition-colors">
                      <span className="md:hidden text-[11px] uppercase font-bold text-[#41D8FF] block">
                        Career Transformer:
                      </span>
                      <div className="flex items-start gap-2 text-xs text-[#F5F8FC] font-medium">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{row.transformer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard3D>
        </FadeIn>
      </div>
    </section>
  );
}
