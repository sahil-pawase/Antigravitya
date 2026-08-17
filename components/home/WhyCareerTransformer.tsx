"use client";

import React from "react";
import { Laptop, FolderGit2, Compass, Users, CheckCircle } from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export function WhyCareerTransformer() {
  const pillars = [
    {
      title: "Learn by Doing on Real Data",
      description:
        "Forget passive video watching. You work on messy multi-table datasets: retail supply chains, telecom churn logs, and multi-currency financials. Solve real business problems from Day 1.",
      icon: Laptop,
      color: "text-[#41D8FF]",
      bg: "bg-[#41D8FF]/10",
      glow: "rgba(65, 216, 255, 0.2)",
      points: ["Real enterprise datasets", "Hands-on coding labs", "Active debugging practice"],
    },
    {
      title: "Build a High-Impact Portfolio",
      description:
        "Graduates don't leave with just certificates; they leave with 6 production-grade GitHub projects, interactive Power BI & Tableau dashboards, and clean executive summaries that prove competence.",
      icon: FolderGit2,
      color: "text-[#397CFF]",
      bg: "bg-[#397CFF]/10",
      glow: "rgba(57, 124, 255, 0.2)",
      points: ["Public GitHub repositories", "Interactive live BI links", "Executive business writeups"],
    },
    {
      title: "Personalized Mentor Guidance",
      description:
        "Every single SQL query, DAX measure, and Python script you submit receives detailed, line-by-line review from experienced data practitioners who work in analytics daily.",
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      glow: "rgba(52, 211, 153, 0.2)",
      points: ["Line-by-line code reviews", "Weekly live doubt clearances", "Direct mentor feedback"],
    },
    {
      title: "Career & Interview Preparation",
      description:
        "Technical skills are only half the battle. We prepare you for the recruiter screen, SQL live whiteboarding tests, data modeling case studies, and behavioral interview questions.",
      icon: Compass,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      glow: "rgba(251, 191, 36, 0.2)",
      points: ["SQL & Python mock drills", "Resume & LinkedIn optimization", "Case study presentation prep"],
    },
  ];

  return (
    <section className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
              The Career Transformer Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              Not just another course. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#41D8FF] to-[#397CFF]">
                A structured career transformation.
              </span>
            </h2>
            <p className="text-[#94A3B8] text-base leading-relaxed">
              Most online tutorials teach isolated syntax without teaching how business data really works. Here is how we bridge the gap between learning tools and landing analyst roles.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={idx * 0.1} direction="up">
                <TiltCard3D maxTilt={8} scale={1.02} glowColor={pillar.glow}>
                  <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-5 hover:border-[#397CFF]/50 transition-all duration-300 group backdrop-blur-md h-full flex flex-col justify-between shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl ${pillar.bg} group-hover:scale-110 [transform:translateZ(20px)] transition-transform duration-300 shadow-md`}>
                          <Icon className={`w-6 h-6 ${pillar.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-white transition-colors [transform:translateZ(10px)]">
                          {pillar.title}
                        </h3>
                      </div>

                      <p className="text-sm text-[#94A3B8] leading-relaxed [transform:translateZ(5px)]">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#162942]/60 space-y-2.5 [transform:translateZ(10px)]">
                      {pillar.points.map((pt) => (
                        <div key={pt} className="flex items-center gap-2 text-xs font-medium text-[#F5F8FC] group-hover:text-white transition-colors">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
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
