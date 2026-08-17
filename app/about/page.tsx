import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import {
  GraduationCap,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export const metadata: Metadata = {
  title: "About Career Transformer | Mission, Philosophy & Leadership",
  description:
    "Learn about Career Transformer's mission to bridge the gap between academic education and real-world Data Analytics career readiness through structured portfolio building.",
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Aditi Sharma",
      role: "Program Director & Co-Founder",
      education: "B.Tech Computer Science & MBA",
      bio: "10+ years leading analytics transformations and educational curriculum design across enterprise tech companies.",
      avatar: "AS",
      glow: "rgba(65, 216, 255, 0.25)",
    },
    {
      name: "Rohan Verma",
      role: "Lead Analytics Mentor & Curriculum Architect",
      education: "M.S. in Data Analytics",
      bio: "8+ years solving enterprise data warehousing, BI storytelling, and SQL optimization challenges. Mentored over 1,500+ aspiring analysts.",
      avatar: "RV",
      glow: "rgba(57, 124, 255, 0.25)",
    },
  ];

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-between selection:bg-[#397CFF]/30 relative overflow-hidden">
      {/* 3D WebGL Particle Canvas */}
      <DataMesh3DCanvas />

      {/* Cyber Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <main className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
            {/* 1. Hero / Mission Header */}
            <FadeIn>
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Our Story & Mission</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FFFFFF] tracking-tight">
                  Transforming Ambition into <br />
                  <span className="shimmer-text">
                    Measurable Technical Competence.
                  </span>
                </h1>

                <p className="text-lg text-[#94A3B8] leading-relaxed max-w-3xl mx-auto">
                  Career Transformer was founded with one clear conviction: aspiring Data Analysts do not fail because they lack intelligence; they fail because standard courses teach superficial syntax rather than real business data problem solving.
                </p>
              </div>
            </FadeIn>

            {/* 2. The Problem We Solve */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <FadeIn direction="left" className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-[#397CFF] font-bold">
                  The Industry Reality
                </span>
                <h2 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
                  The Gap Between "Watching Tutorials" and "Doing The Job"
                </h2>
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  Every year, thousands of students finish 50-hour video courses only to be rejected in the very first technical interview. Why? Because watching someone else write SQL is fundamentally different from cleaning 250,000 messy rows yourself.
                </p>
                <div className="space-y-3 pt-2 text-sm text-[#F5F8FC]">
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#081827]/60 border border-[#162942]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Real companies work with messy multi-table schemas, not tidy single-sheet CSVs.</span>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#081827]/60 border border-[#162942]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Hiring managers look for public GitHub repositories and interactive BI dashboards, not generic participation certificates.</span>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#081827]/60 border border-[#162942]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Mentorship must be qualitative and individualized — catching subtle data modeling errors that automated graders miss.</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(57, 124, 255, 0.25)">
                  <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-6 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 text-amber-400 [transform:translateZ(15px)]">
                      <Shield className="w-6 h-6 flex-shrink-0" />
                      <h3 className="text-lg font-bold text-white">Our 3 Core Commitments</h3>
                    </div>
                    <div className="space-y-4 text-xs sm:text-sm text-[#94A3B8] [transform:translateZ(10px)]">
                      <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] hover:border-[#41D8FF]/40 transition-colors">
                        <strong className="text-[#41D8FF] block mb-1">1. Zero Fake Placement Promises</strong>
                        We never sell illusionary "100% job guarantees". We guarantee world-class curriculum, rigorous code reviews, and structured interview preparation.
                      </div>
                      <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] hover:border-[#397CFF]/40 transition-colors">
                        <strong className="text-[#397CFF] block mb-1">2. 100% Portfolio-First Pedagogy</strong>
                        Every concept learned culminates in a GitHub repository with documentation, query files, and interactive dashboard links.
                      </div>
                      <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] hover:border-emerald-500/40 transition-colors">
                        <strong className="text-emerald-400 block mb-1">3. Transparent Academic Mentorship</strong>
                        Taught and reviewed only by experienced practitioners with proven enterprise analytics track records.
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </FadeIn>
            </div>

            {/* 3. Leadership & Academic Mentors */}
            <div className="space-y-8 pt-8 border-t border-[#162942]">
              <FadeIn>
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
                    Leadership & Faculty
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#FFFFFF]">
                    Guided by Industry Practitioners
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    Transparent leadership with real academic credentials and deep enterprise experience.
                  </p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {leadership.map((leader, idx) => (
                  <FadeIn key={leader.name} delay={idx * 0.15} direction="up">
                    <TiltCard3D maxTilt={8} scale={1.03} glowColor={leader.glow}>
                      <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-5 flex flex-col justify-between backdrop-blur-md shadow-xl h-full group">
                        <div className="space-y-4 [transform:translateZ(15px)]">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                              <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center text-base font-extrabold text-white">
                                {leader.avatar}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">{leader.name}</h3>
                              <p className="text-xs text-[#41D8FF] font-medium">{leader.role}</p>
                              <p className="text-[11px] text-[#64748B]">{leader.education}</p>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed [transform:translateZ(5px)]">
                            {leader.bio}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#162942]/60 text-xs text-[#64748B]">
                          Verified Faculty Member • Career Transformer
                        </div>
                      </div>
                    </TiltCard3D>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* 4. Bottom CTA banner */}
            <FadeIn delay={0.2}>
              <div className="rounded-2xl bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border border-[#397CFF]/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF]">
                  Start Your Career Transformation Today
                </h3>
                <p className="text-sm text-[#94A3B8] max-w-2xl mx-auto">
                  Join our next cohort of high-intent learners mastering Excel, SQL, Power BI, Tableau, Python, and Statistics.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/courses/data-analytics">
                    <Button variant="cyan" size="lg" className="font-bold shadow-lg shadow-[#41D8FF]/20">
                      Explore Flagship Program
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" size="lg">
                      Contact Admissions Team
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
