"use client";

import React from "react";
import {
  FileSpreadsheet,
  Database,
  BarChart3,
  PieChart,
  Code2,
  TrendingUp,
  Check,
} from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export function SkillsGrid() {
  const skills = [
    {
      title: "Advanced Excel",
      category: "Spreadsheet Analytics",
      description: "Master business modeling, multi-sheet ETL with Power Query, and executive KPI pivot dashboards.",
      icon: FileSpreadsheet,
      color: "text-emerald-400",
      glow: "rgba(52, 211, 153, 0.25)",
      tags: ["XLOOKUP & INDEX-MATCH", "Power Query ETL", "Dynamic Array Formulas", "Financial Modeling", "Interactive Slicers"],
    },
    {
      title: "SQL for Analytics",
      category: "Database Querying",
      description: "Query enterprise data warehouses, write complex joins, CTEs, and master advanced window functions.",
      icon: Database,
      color: "text-sky-400",
      glow: "rgba(56, 189, 248, 0.25)",
      tags: ["Window Functions (LEAD/LAG)", "CTEs & Subqueries", "Complex Multi-Table Joins", "Cohort Retention SQL", "Query Optimization"],
    },
    {
      title: "Power BI & DAX",
      category: "Business Intelligence",
      description: "Design relational star schemas, write advanced DAX calculated measures, and publish secure cloud reports.",
      icon: BarChart3,
      color: "text-amber-400",
      glow: "rgba(251, 191, 36, 0.25)",
      tags: ["Star Schema Modeling", "CALCULATE() & Time Intelligence", "Custom Tooltips & Drillthrough", "Row-Level Security (RLS)", "Power BI Service"],
    },
    {
      title: "Tableau Visuals",
      category: "Visual Data Storytelling",
      description: "Harness visual analytics grammar, Level of Detail (LOD) calculations, and dual-axis interactive dashboards.",
      icon: PieChart,
      color: "text-indigo-400",
      glow: "rgba(129, 140, 248, 0.25)",
      tags: ["FIXED/INCLUDE/EXCLUDE LODs", "Geospatial Polygon Maps", "Calculated Fields & Parameters", "Dual-Axis Visuals", "Executive Story Points"],
    },
    {
      title: "Python for Data Analysis",
      category: "Programming & EDA",
      description: "Automate tabular data cleaning, perform exploratory data analysis (EDA), and build statistical charts with Pandas.",
      icon: Code2,
      color: "text-blue-400",
      glow: "rgba(96, 165, 250, 0.25)",
      tags: ["Pandas DataFrames", "NumPy Numerical Ops", "Seaborn & Matplotlib", "Exploratory Data Analysis", "Automated Scripting"],
    },
    {
      title: "Applied Statistics",
      category: "Business Experimentation",
      description: "Make data-backed decisions using probability distributions, statistical significance, and A/B test analysis.",
      icon: TrendingUp,
      color: "text-cyan-400",
      glow: "rgba(65, 216, 255, 0.25)",
      tags: ["Hypothesis Testing (t/Z/Chi-sq)", "A/B Test Evaluation & MDE", "Central Limit Theorem", "Correlation vs Causation", "Confidence Intervals"],
    },
  ];

  return (
    <section className="py-20 bg-[#040B14] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-[#397CFF] font-bold">
              Industry-Aligned Tooling
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              6 Core Competencies. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#397CFF] to-[#41D8FF]">
                Zero Fluff.
              </span>
            </h2>
            <p className="text-[#94A3B8] text-base">
              Every tool is taught in depth with hands-on labs and real business use cases. No superficial 30-minute overviews.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, idx) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.title} delay={idx * 0.08} direction="up">
                <TiltCard3D maxTilt={10} scale={1.03} glowColor={s.glow}>
                  <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-7 space-y-5 hover:border-[#397CFF]/50 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-xl h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] group-hover:scale-110 [transform:translateZ(20px)] transition-transform duration-300 shadow-md">
                          <Icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider [transform:translateZ(10px)]">
                          {s.category}
                        </span>
                      </div>

                      <div className="[transform:translateZ(15px)]">
                        <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#162942]/60 space-y-2 [transform:translateZ(10px)]">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Key Topics Covered:
                      </span>
                      <div className="space-y-1.5">
                        {s.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2 text-xs text-[#F5F8FC] group-hover:text-white transition-colors">
                            <Check className="w-3.5 h-3.5 text-[#397CFF] flex-shrink-0" />
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>
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
