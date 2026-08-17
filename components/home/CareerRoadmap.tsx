"use client";

import React from "react";
import {
  FileSpreadsheet,
  Database,
  FolderGit2,
  Share2,
  Briefcase,
  Trophy,
} from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export function CareerRoadmap() {
  const steps = [
    {
      number: "01",
      title: "Foundation & Business Logic",
      tagline: "Weeks 1 - 3",
      description: "Master business spreadsheets, Kimball dimensional data modeling, data cleansing with Power Query, and essential financial/business KPIs.",
      icon: FileSpreadsheet,
      color: "text-emerald-400",
      glow: "rgba(52, 211, 153, 0.25)",
    },
    {
      number: "02",
      title: "Enterprise Querying & BI Tooling",
      tagline: "Weeks 4 - 8",
      description: "Deep dive into SQL joins, CTEs, and window functions (LEAD/LAG). Build interactive dashboards with Power BI DAX and Tableau Level of Detail (LOD) calculations.",
      icon: Database,
      color: "text-sky-400",
      glow: "rgba(56, 189, 248, 0.25)",
    },
    {
      number: "03",
      title: "Python EDA & Statistical Inference",
      tagline: "Weeks 9 - 11",
      description: "Wrangle large datasets with Pandas & NumPy. Perform Exploratory Data Analysis (EDA) and run rigorous A/B test hypothesis analyses for business decisions.",
      icon: FolderGit2,
      color: "text-amber-400",
      glow: "rgba(251, 191, 36, 0.25)",
    },
    {
      number: "04",
      title: "6 Production Portfolio Builds",
      tagline: "Weeks 12 - 14",
      description: "Develop 6 complete GitHub portfolio projects covering Sales Intelligence, Customer Churn, and Financial Risk Analytics with live interactive links.",
      icon: Share2,
      color: "text-indigo-400",
      glow: "rgba(129, 140, 248, 0.25)",
    },
    {
      number: "05",
      title: "Live Mock Drills & Interview Prep",
      tagline: "Weeks 15 - 16",
      description: "1-on-1 resume optimization, LinkedIn profile review, live SQL technical whiteboarding sessions, and case study presentation drills with senior mentors.",
      icon: Briefcase,
      color: "text-[#41D8FF]",
      glow: "rgba(65, 216, 255, 0.25)",
    },
    {
      number: "06",
      title: "Career Transformation & Applications",
      tagline: "Post-Completion",
      description: "Receive your official tamper-proof verifiable certificate, target high-growth analyst roles, and leverage structured application & recruiter outreach playbooks.",
      icon: Trophy,
      color: "text-[#397CFF]",
      glow: "rgba(57, 124, 255, 0.25)",
    },
  ];

  return (
    <section id="career-roadmap" className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
              Step-by-Step Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              The 6-Stage Career Transformation Journey
            </h2>
            <p className="text-[#94A3B8] text-base">
              A clear, predictable progression from absolute beginner to an interview-ready Data Analyst with a battle-tested portfolio.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.number} delay={idx * 0.08} direction="up">
                <TiltCard3D maxTilt={9} scale={1.03} glowColor={step.glow}>
                  <div className="relative rounded-2xl bg-[#081827]/90 border border-[#162942] p-7 space-y-4 hover:border-[#397CFF]/60 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-xl h-full">
                    {/* Step Top Bar */}
                    <div className="flex items-center justify-between [transform:translateZ(15px)]">
                      <span className="text-3xl font-extrabold text-[#162942] group-hover:text-[#397CFF]/50 transition-colors">
                        {step.number}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-xs font-semibold group-hover:border-[#41D8FF]/40 transition-colors">
                        {step.tagline}
                      </span>
                    </div>

                    <div className="space-y-2 [transform:translateZ(10px)]">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-[#0C1A2B] group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Icon className={`w-5 h-5 ${step.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#162942]/60 flex items-center justify-between text-xs text-[#64748B] [transform:translateZ(5px)]">
                      <span>Stage {idx + 1} of 6</span>
                      <span className="text-[#397CFF] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Milestone Complete →
                      </span>
                    </div>
                  </div>
                </TiltCard3D>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
