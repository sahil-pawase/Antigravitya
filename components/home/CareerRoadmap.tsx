"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Database,
  FolderGit2,
  Share2,
  Briefcase,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Download,
  Sparkles,
  Layers,
  Code2,
  BarChart3,
  GitBranch,
} from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export function CareerRoadmap() {
  const [activeStage, setActiveStage] = useState<number>(0);

  const steps = [
    {
      number: "01",
      stage: "Stage 1",
      title: "Foundation & Business Logic",
      tagline: "Weeks 1 - 3",
      tools: ["Advanced Excel", "Power Query", "Data Modeling", "Business KPIs"],
      description: "Master business spreadsheets, Kimball dimensional data modeling, data cleansing with Power Query, and essential financial/business KPIs.",
      milestoneProject: "E-Commerce Cohort Retention & Gross Margin Financial Model",
      outcomes: [
        "Automate multi-sheet data cleaning with Power Query",
        "Write complex XLOOKUP, INDEX/MATCH, and Dynamic Arrays",
        "Calculate churn rate, Customer Acquisition Cost (CAC), and LTV",
      ],
      icon: FileSpreadsheet,
      color: "text-emerald-400",
      glow: "rgba(52, 211, 153, 0.25)",
      bgGradient: "from-emerald-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-emerald-500/40",
    },
    {
      number: "02",
      stage: "Stage 2",
      title: "Enterprise Querying & BI Tooling",
      tagline: "Weeks 4 - 8",
      tools: ["PostgreSQL 16", "Power BI", "DAX Formulas", "Tableau LOD"],
      description: "Deep dive into SQL joins, multi-layer CTEs, and window functions (LEAD, LAG, DENSE_RANK). Build interactive dashboards with Power BI DAX and responsive cross-filters.",
      milestoneProject: "Swiggy Real-Time Food Delivery Performance & Delay BI Studio",
      outcomes: [
        "Master SQL window aggregates & time-series partitioning",
        "Build Star Schemas & write advanced CALCULATE/Time-Intelligence DAX",
        "Design executive dark-mode dashboards with drill-through tooltips",
      ],
      icon: Database,
      color: "text-sky-400",
      glow: "rgba(56, 189, 248, 0.25)",
      bgGradient: "from-sky-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-sky-500/40",
    },
    {
      number: "03",
      stage: "Stage 3",
      title: "Python EDA & Statistical Inference",
      tagline: "Weeks 9 - 11",
      tools: ["Python 3.12", "Pandas", "NumPy", "Seaborn", "A/B Testing"],
      description: "Wrangle large messy datasets with Pandas & NumPy. Perform Exploratory Data Analysis (EDA), IQR outlier detection, and run rigorous A/B test hypothesis analyses for business decisions.",
      milestoneProject: "Netflix Content Engagement & Churn Prediction Pipeline",
      outcomes: [
        "Handle missing data, regex string normalization, and date parsing",
        "Conduct two-sample t-tests and Chi-Square statistical validation",
        "Build automated CSV/JSON data transformation scripts",
      ],
      icon: FolderGit2,
      color: "text-amber-400",
      glow: "rgba(251, 191, 36, 0.25)",
      bgGradient: "from-amber-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-amber-500/40",
    },
    {
      number: "04",
      stage: "Stage 4",
      title: "6 Production Portfolio Builds",
      tagline: "Weeks 12 - 14",
      tools: ["GitHub Portfolio", "Markdown Documentation", "Live Power BI", "SQL Scripts"],
      description: "Develop 6 complete GitHub portfolio projects covering Sales Intelligence, Customer Churn, and Financial Risk Analytics with live interactive demo links and architecture diagrams.",
      milestoneProject: "Full Production Portfolio Ready for Recruiter Inbound Calls",
      outcomes: [
        "Structure GitHub repositories with executive summaries and findings",
        "Record 2-minute video loom walkthroughs for each project",
        "Document business impact: revenue saved, delivery time reduced",
      ],
      icon: Share2,
      color: "text-indigo-400",
      glow: "rgba(129, 140, 248, 0.25)",
      bgGradient: "from-indigo-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-indigo-500/40",
    },
    {
      number: "05",
      stage: "Stage 5",
      title: "Live Mock Drills & Interview Prep",
      tagline: "Weeks 15 - 16",
      tools: ["1-on-1 Mentorship", "Live SQL Whiteboarding", "Resume ATS Optimization"],
      description: "1-on-1 resume optimization, LinkedIn profile review, live SQL technical whiteboarding sessions, and case study presentation drills with senior industry mentors.",
      milestoneProject: "Passed 3 Rigorous Technical & Business Case Study Mock Rounds",
      outcomes: [
        "Tailor ATS-optimized resumes that pass HR screening filters",
        "Answer live coding case studies under 25-minute interview timers",
        "Present complex data insights confidently to non-technical stakeholders",
      ],
      icon: Briefcase,
      color: "text-[#41D8FF]",
      glow: "rgba(65, 216, 255, 0.25)",
      bgGradient: "from-cyan-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-[#41D8FF]/40",
    },
    {
      number: "06",
      stage: "Stage 6",
      title: "Career Transformation & Applications",
      tagline: "Post-Completion",
      tools: ["Tamper-Proof Certificate", "Recruiter Playbook", "Salary Negotiation"],
      description: "Receive your official tamper-proof verifiable certificate, target high-growth analyst roles, and leverage structured application & recruiter outreach playbooks.",
      milestoneProject: "Official Credential Issued with Verifiable ID & Transcript",
      outcomes: [
        "Verified credential viewable by recruiters on /verify portal",
        "Direct recruiter outreach templates with 40%+ response rates",
        "Confidence to negotiate salary offers across top analytics firms",
      ],
      icon: Trophy,
      color: "text-[#397CFF]",
      glow: "rgba(57, 124, 255, 0.25)",
      bgGradient: "from-blue-950/40 via-[#081827] to-[#06101D]",
      borderGlow: "border-[#397CFF]/40",
    },
  ];

  const handleDownloadBlueprint = () => {
    const blueprintContent = `CAREER TRANSFORMER: 6-STAGE DATA ANALYTICS CAREER BLUEPRINT
============================================================
Duration: 16 Weeks Intensive Cohort
Faculty: Sahil Pawase (Lead Analytics Architect) & Industry Mentors

STAGE 1: Foundation & Business Logic (Weeks 1 - 3)
- Advanced Excel, Power Query, Star Schema Data Modeling
- Project: E-Commerce Cohort Retention & Gross Margin Financial Model

STAGE 2: Enterprise Querying & BI Tooling (Weeks 4 - 8)
- PostgreSQL 16, Window Functions (LEAD/LAG, ROW_NUMBER), Power BI DAX
- Project: Swiggy Real-Time Food Delivery Performance & Delay BI Studio

STAGE 3: Python EDA & Statistical Inference (Weeks 9 - 11)
- Python Pandas, NumPy, Seaborn, A/B Hypothesis Testing
- Project: Netflix Content Engagement & Churn Prediction Pipeline

STAGE 4: 6 Production Portfolio Builds (Weeks 12 - 14)
- GitHub Repositories, Live Dashboards, Business Impact Case Studies

STAGE 5: Live Mock Drills & Interview Prep (Weeks 15 - 16)
- 1-on-1 Resume Optimization, Live SQL Whiteboarding, Recruiter Drills

STAGE 6: Career Transformation & Certification (Post-Completion)
- Verifiable Certificate with QR code verification on /verify

Admissions Email: pawasesahil42@gmail.com
Portal: https://careertransformer.in
============================================================`;

    const blob = new Blob([blueprintContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "career_transformer_program_blueprint.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="career-roadmap" className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#397CFF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#162942] pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-bold text-[#41D8FF]">
                <Layers className="w-3.5 h-3.5" />
                <span>INTERACTIVE PROGRAM PROCESS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                The 6-Stage Career Transformation Journey
              </h2>
              <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
                Click through the milestones below to explore the exact skills, tools, and hands-on projects you will master at each stage.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBlueprint}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#397CFF]/20 hover:opacity-95 transition-all cursor-pointer flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Program Blueprint (.TXT)</span>
            </button>
          </div>
        </FadeIn>

        {/* Stage Navigation Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((st, idx) => {
            const isSelected = activeStage === idx;

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-[#081827] border-[#41D8FF] shadow-lg shadow-[#397CFF]/15 ring-1 ring-[#41D8FF]/40"
                    : "bg-[#081827]/60 border-[#162942] hover:border-slate-700 hover:bg-[#081827]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold font-mono ${isSelected ? "text-[#41D8FF]" : "text-[#64748B]"}`}>
                    Stage {st.number}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{st.tagline}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{st.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep-Dive Spotlight Card */}
        {(() => {
          const current = steps[activeStage];
          const Icon = current.icon;

          return (
            <div className={`rounded-3xl bg-gradient-to-br ${current.bgGradient} border ${current.borderGlow} p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden transition-all duration-300`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#06101D] border border-white/10 shadow-xl flex-shrink-0">
                    <Icon className={`w-8 h-8 ${current.color}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white font-mono text-xs font-bold">
                        {current.stage} • {current.tagline}
                      </span>
                      <span className="text-xs text-[#41D8FF] font-semibold">Active Curriculum Focus</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {current.tools.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-[#06101D] border border-white/10 text-xs font-mono text-[#CBD5E1] shadow-inner">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 cols: Description & Learning Outcomes */}
                <div className="lg:col-span-7 space-y-5">
                  <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                    {current.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#41D8FF] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Core Competencies & Mastery Checklist:
                    </h4>
                    <div className="space-y-2">
                      {current.outcomes.map((out, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#06101D]/70 border border-white/5 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Capstone Milestone Project */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#06101D] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <GitBranch className="w-4 h-4" />
                    <span>Stage Capstone Deliverable</span>
                  </div>

                  <h5 className="text-base font-bold text-white leading-snug">
                    {current.milestoneProject}
                  </h5>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    You will submit this project for 1-on-1 code review by mentors and publish it to your live GitHub portfolio.
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-bold font-mono">100% Practical & Graded</span>
                    <button
                      type="button"
                      onClick={() => setActiveStage((prev) => (prev + 1) % steps.length)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 6 Stage Grid Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStage === idx;

            return (
              <FadeIn key={step.number} delay={idx * 0.05} direction="up">
                <div
                  onClick={() => setActiveStage(idx)}
                  className={`relative rounded-2xl border p-7 space-y-4 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-xl h-full cursor-pointer ${
                    isSelected
                      ? "bg-[#081827] border-[#41D8FF] ring-1 ring-[#41D8FF]/40"
                      : "bg-[#081827]/90 border-[#162942] hover:border-[#397CFF]/60"
                  }`}
                >
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-extrabold transition-colors ${
                      isSelected ? "text-[#41D8FF]" : "text-[#162942] group-hover:text-[#397CFF]/50"
                    }`}>
                      {step.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-xs font-semibold group-hover:border-[#41D8FF]/40 transition-colors">
                      {step.tagline}
                    </span>
                  </div>

                  <div className="space-y-2">
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

                  <div className="pt-3 border-t border-[#162942]/60 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Stage {idx + 1} of 6</span>
                    <span className="text-[#397CFF] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {isSelected ? "Currently Viewing ✓" : "Explore Stage →"}
                    </span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
