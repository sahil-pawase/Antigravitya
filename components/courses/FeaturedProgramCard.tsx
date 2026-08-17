"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { formatINR } from "@/lib/utils";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import {
  Clock,
  Layers,
  Sparkles,
  Award,
  CheckCircle,
  FileSpreadsheet,
  Database,
  BarChart3,
  PieChart,
  Code2,
  TrendingUp,
} from "lucide-react";

interface CourseProps {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  duration: string;
  level: string;
}

export function FeaturedProgramCard({ course }: { course: CourseProps }) {
  const discountPercent = Math.round(((course.originalPrice - course.currentPrice) / course.originalPrice) * 100);

  const modulesList = [
    { name: "Advanced Excel & Power Query", icon: FileSpreadsheet, color: "text-emerald-400" },
    { name: "SQL for Analytics & Warehousing", icon: Database, color: "text-sky-400" },
    { name: "Power BI & DAX Modeling", icon: BarChart3, color: "text-amber-400" },
    { name: "Tableau Visual Discovery", icon: PieChart, color: "text-indigo-400" },
    { name: "Python for Data Analysis (EDA)", icon: Code2, color: "text-blue-400" },
    { name: "Applied Business Statistics", icon: TrendingUp, color: "text-cyan-400" },
  ];

  return (
    <FadeIn duration={0.6}>
      <TiltCard3D maxTilt={4} scale={1.01} glowColor="rgba(57, 124, 255, 0.25)">
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0C1A2B] via-[#081827] to-[#06101D] border border-[#162942] p-6 sm:p-10 shadow-2xl overflow-hidden group">
          {/* Decorative ambient lighting */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#397CFF]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#397CFF]/30 transition-colors duration-500" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#41D8FF]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#41D8FF]/25 transition-colors duration-500" />

          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between relative z-10">
            {/* Left Col: Course Summary & Highlights */}
            <div className="space-y-6 flex-1 [transform:translateZ(15px)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="cyan" size="md">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Flagship Career Cohort
                </Badge>
                <Badge variant="default" size="md">
                  <Clock className="w-3.5 h-3.5 text-[#41D8FF]" /> {course.duration}
                </Badge>
                <Badge variant="default" size="md">
                  <Layers className="w-3.5 h-3.5 text-[#397CFF]" /> {course.level}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight group-hover:text-white transition-colors">
                  {course.title}
                </h2>
                <p className="text-[#41D8FF] font-medium text-base mt-1.5">{course.tagline}</p>
              </div>

              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                {course.description}
              </p>

              {/* Module Pills with 3D Hover Pop */}
              <div className="space-y-3 pt-2">
                <p className="text-xs uppercase tracking-wider text-[#64748B] font-bold">
                  Structured 6-Module Curriculum
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {modulesList.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.name}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#06101D]/80 border border-[#162942] hover:border-[#397CFF]/60 hover:bg-[#0C1A2B] hover:scale-[1.02] transition-all duration-200 text-xs font-medium text-[#F5F8FC] cursor-default shadow-sm"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#0C1A2B] text-[#41D8FF] flex items-center justify-center text-[10px] font-bold flex-shrink-0 border border-[#162942]">
                          0{idx + 1}
                        </span>
                        <Icon className={`w-4 h-4 ${m.color} flex-shrink-0`} />
                        <span className="truncate">{m.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Value points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>6 GitHub Portfolio Projects with Code Reviews</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>1-on-1 Resume & LinkedIn Optimization</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Industry Mentor Mock Interview Sessions</span>
                </div>
                <div className="flex items-center gap-2 hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Verifiable Completion Certificate</span>
                </div>
              </div>
            </div>

            {/* Right Col: Pricing & Enrollment Action Card */}
            <div className="w-full lg:w-96 rounded-xl bg-[#06101D]/90 border border-[#162942] hover:border-[#397CFF]/50 p-6 space-y-6 flex flex-col justify-between shadow-2xl backdrop-blur-md transition-all duration-300 [transform:translateZ(25px)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider">Cohort Tuition</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold pulse-badge">
                    Save {discountPercent}%
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                    {formatINR(course.currentPrice)}
                  </span>
                  <span className="text-base text-[#64748B] line-through font-medium">
                    {formatINR(course.originalPrice)}
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-normal">
                  Includes lifetime access to all 6 modules, code repositories, datasets, assignments, and mentor office hours.
                </p>

                <div className="p-3 rounded-lg bg-[#081827] border border-[#162942] space-y-1.5 text-xs text-[#F5F8FC]">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>No-Cost EMI Options:</span>
                    <span className="text-[#41D8FF] font-semibold">From ₹2,083 / month</span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">Zero interest 3, 6, and 12-month installment plans available via Razorpay.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href={`/courses/${course.slug}`} className="w-full block">
                  <Button variant="cyan" size="lg" className="w-full justify-center font-bold shadow-lg shadow-[#41D8FF]/20">
                    View Full Syllabus & Enroll
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full block text-center">
                  <span className="text-xs text-[#94A3B8] hover:text-[#41D8FF] underline transition-colors cursor-pointer">
                    Compare All Enrollment Tiers
                  </span>
                </Link>
              </div>

              <div className="pt-4 border-t border-[#162942] flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
                <Award className="w-3.5 h-3.5 text-[#397CFF]" />
                <span>7-Day 100% Money-Back Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </TiltCard3D>
    </FadeIn>
  );
}
