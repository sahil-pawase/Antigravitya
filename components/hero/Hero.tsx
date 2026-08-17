"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { BookDemoModal } from "@/leads/BookDemoModal";
import { Hero3DScene } from "@/components/3d/Hero3DScene";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn, StaggerContainer, StaggerItem, FloatingElement } from "@/components/motion/MotionWrapper";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code2,
  Database,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
  Briefcase,
} from "lucide-react";

export function Hero() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const skillsList = [
    { name: "Advanced Excel", icon: FileSpreadsheet, color: "text-emerald-400", glow: "rgba(52, 211, 153, 0.25)" },
    { name: "SQL for Analytics", icon: Database, color: "text-sky-400", glow: "rgba(56, 189, 248, 0.25)" },
    { name: "Power BI & DAX", icon: BarChart3, color: "text-amber-400", glow: "rgba(251, 191, 36, 0.25)" },
    { name: "Tableau Visuals", icon: PieChart, color: "text-indigo-400", glow: "rgba(129, 140, 248, 0.25)" },
    { name: "Python for Data", icon: Code2, color: "text-blue-400", glow: "rgba(96, 165, 250, 0.25)" },
    { name: "Business Statistics", icon: TrendingUp, color: "text-cyan-400", glow: "rgba(65, 216, 255, 0.25)" },
  ];

  return (
    <>
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-cyber-grid">
        {/* 3D WebGL Background Scene */}
        <Hero3DScene />

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-[#41D8FF]/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Floating 3D Badges (Desktop) */}
        <div className="hidden xl:block absolute top-28 left-8 z-20 pointer-events-auto">
          <FloatingElement duration={5} yOffset={12}>
            <TiltCard3D maxTilt={15} scale={1.05} glowColor="rgba(65, 216, 255, 0.3)">
              <div className="glass-card p-3.5 rounded-xl flex items-center gap-3 border border-[#162942] shadow-2xl bg-[#081827]/90 backdrop-blur-xl">
                <div className="p-2 rounded-lg bg-[#0C1A2B] text-[#41D8FF]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">1,500+ Students</div>
                  <div className="text-[10px] text-[#94A3B8]">Mentored & Placed</div>
                </div>
              </div>
            </TiltCard3D>
          </FloatingElement>
        </div>

        <div className="hidden xl:block absolute top-36 right-8 z-20 pointer-events-auto">
          <FloatingElement duration={6} yOffset={14}>
            <TiltCard3D maxTilt={15} scale={1.05} glowColor="rgba(57, 124, 255, 0.3)">
              <div className="glass-card p-3.5 rounded-xl flex items-center gap-3 border border-[#162942] shadow-2xl bg-[#081827]/90 backdrop-blur-xl">
                <div className="p-2 rounded-lg bg-[#0C1A2B] text-[#397CFF]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">₹8.5 LPA</div>
                  <div className="text-[10px] text-[#94A3B8]">Avg. Graduate CTC</div>
                </div>
              </div>
            </TiltCard3D>
          </FloatingElement>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="text-center max-w-4xl mx-auto space-y-6" staggerChildren={0.12}>
            {/* Top Pill */}
            <StaggerItem>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#081827]/90 backdrop-blur-md border border-[#162942] shadow-inner text-xs font-semibold text-[#41D8FF] hover:border-[#41D8FF]/50 transition-all cursor-default">
                <Sparkles className="w-3.5 h-3.5 text-[#41D8FF] animate-spin" style={{ animationDuration: "8s" }} />
                <span>Structured Data Analytics Career Cohort</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#41D8FF] animate-ping" />
                <span className="text-[#94A3B8] font-normal">16 Weeks • Portfolio First</span>
              </div>
            </StaggerItem>

            {/* Main Headline */}
            <StaggerItem>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.1]">
                Learn the skills. <br />
                <span className="shimmer-text">
                  Build the career.
                </span>
              </h1>
            </StaggerItem>

            {/* Subheadline */}
            <StaggerItem>
              <p className="text-lg sm:text-xl text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
                Master Excel, SQL, Power BI, Tableau, Python, and Applied Statistics through practical real-world projects, live portfolio development, and personalized career mentorship.
              </p>
            </StaggerItem>

            {/* Trust Indicators */}
            <StaggerItem>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm font-medium text-[#F5F8FC]">
                <div className="flex items-center gap-2 bg-[#081827]/60 px-3 py-1.5 rounded-lg border border-[#162942]/60 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Beginner Friendly (Zero Coding Required)</span>
                </div>
                <div className="flex items-center gap-2 bg-[#081827]/60 px-3 py-1.5 rounded-lg border border-[#162942]/60 backdrop-blur-sm hover:border-[#41D8FF]/40 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#41D8FF] flex-shrink-0" />
                  <span>6 Real-World Portfolio Projects</span>
                </div>
                <div className="flex items-center gap-2 bg-[#081827]/60 px-3 py-1.5 rounded-lg border border-[#162942]/60 backdrop-blur-sm hover:border-[#397CFF]/40 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#397CFF] flex-shrink-0" />
                  <span>1-on-1 Mentor Code Reviews</span>
                </div>
              </div>
            </StaggerItem>

            {/* Call To Actions */}
            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Button
                  variant="cyan"
                  size="lg"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="w-full sm:w-auto px-8 shadow-xl shadow-[#41D8FF]/20 text-[#06101D] font-bold"
                >
                  Book Free Demo Session
                </Button>
                <Link href="/courses/data-analytics" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 gap-2 border-[#162942]">
                    <span>Explore Curriculum & Syllabus</span>
                    <ArrowRight className="w-4 h-4 text-[#41D8FF] group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Core Skills Marquee Grid with 3D Tilt */}
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#162942]/60">
            <FadeIn delay={0.3}>
              <p className="text-xs uppercase tracking-widest text-center text-[#64748B] font-bold mb-6">
                Comprehensive Technology Stack Covered In Depth
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {skillsList.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <FadeIn key={skill.name} delay={0.1 * index} direction="up">
                    <TiltCard3D maxTilt={12} scale={1.06} glowColor={skill.glow}>
                      <div className="p-4 rounded-xl bg-[#081827]/85 border border-[#162942] hover:border-[#397CFF]/50 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group backdrop-blur-md shadow-lg h-full">
                        <div className="p-2.5 rounded-lg bg-[#0C1A2B] group-hover:scale-110 [transform:translateZ(20px)] transition-transform duration-300">
                          <IconComponent className={`w-6 h-6 ${skill.color}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#F5F8FC] [transform:translateZ(10px)]">
                          {skill.name}
                        </span>
                      </div>
                    </TiltCard3D>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Book Demo Modal */}
      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} source="HERO_PRIMARY_CTA" />
    </>
  );
}
