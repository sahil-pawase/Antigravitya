import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { EnrollmentCheckoutButton } from "@/components/checkout/EnrollmentCheckoutButton";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { formatINR } from "@/lib/utils";
import {
  Clock,
  Layers,
  Sparkles,
  CheckCircle,
  FileCheck,
  Shield,
  HelpCircle,
  Award,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
  });

  if (!course) {
    return { title: "Course Not Found | Career Transformer" };
  }

  return {
    title: `${course.title} | Career Transformer`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
          },
          assignments: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
      projects: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const discountPercent = Math.round(
    ((course.originalPrice - course.currentPrice) / course.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-between selection:bg-[#397CFF]/30 relative overflow-hidden">
      {/* 3D WebGL Particle Canvas */}
      <DataMesh3DCanvas />

      {/* Cyber Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <main>
          {/* Course Hero */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-[#081827]/80 to-[#040B14]/80 border-b border-[#162942] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Header */}
                <div className="lg:col-span-7 space-y-6">
                  <FadeIn>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#397CFF]/15 text-[#41D8FF] border border-[#397CFF]/30 text-xs font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Flagship Career Cohort
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#0C1A2B] text-[#94A3B8] border border-[#162942] text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#0C1A2B] text-[#94A3B8] border border-[#162942] text-xs font-medium flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> {course.level}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight mt-3">
                      {course.title}
                    </h1>

                    <p className="text-lg text-[#41D8FF] font-medium mt-2">
                      {course.tagline}
                    </p>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mt-2">
                      {course.description}
                    </p>

                    {/* Skills Pills */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#64748B] block">
                        Core Technologies Mastered:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.split(",").map((skill) => (
                          <span
                            key={skill.trim()}
                            className="px-3 py-1 rounded-lg bg-[#0C1A2B] text-[#F5F8FC] border border-[#162942] text-xs font-semibold hover:border-[#41D8FF]/40 hover:text-white transition-colors"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>

                {/* Right Pricing & Checkout Box */}
                <div className="lg:col-span-5">
                  <FadeIn delay={0.2}>
                    <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(65, 216, 255, 0.3)">
                      <div className="rounded-2xl bg-[#081827]/95 border-2 border-[#397CFF]/50 p-6 sm:p-8 space-y-6 shadow-2xl shadow-[#397CFF]/15 backdrop-blur-xl group">
                        <div className="flex items-center justify-between [transform:translateZ(15px)]">
                          <span className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider">
                            Enrollment Tuition
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                            Save {discountPercent}%
                          </span>
                        </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-extrabold text-[#FFFFFF]">
                          {formatINR(course.currentPrice)}
                        </span>
                        <span className="text-base text-[#64748B] line-through font-medium">
                          {formatINR(course.originalPrice)}
                        </span>
                      </div>
                      <p className="text-xs text-[#41D8FF] font-medium">
                        No-Cost EMI available from ₹2,083 / month
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 pt-2 border-t border-[#162942] text-xs text-[#F5F8FC]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Lifetime Access to all 6 Modules & Lab Datasets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>6 GitHub Portfolio Projects with Line-by-Line Code Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Live Weekly Mentor Q&A and Whiteboard SQL Drills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>1-on-1 Resume Polish & Technical Mock Interviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Official Tamper-Proof Verifiable Certificate</span>
                      </div>
                    </div>

                    {/* Integrated Server Checkout Button */}
                    <EnrollmentCheckoutButton
                      courseId={course.id}
                      courseTitle={course.title}
                      price={course.currentPrice}
                    />

                    <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>7-Day 100% Satisfaction Refund Guarantee</span>
                    </div>
                  </div>
                </TiltCard3D>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

          {/* Who is this for & Prerequisites */}
          <section className="py-16 bg-[#06101D] border-b border-[#162942]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-[#081827] border border-[#162942] p-8 space-y-4">
                  <div className="flex items-center gap-3 text-[#41D8FF]">
                    <BookOpen className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-white">Who Is This Program For?</h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {course.whoIsThisFor}
                  </p>
                  <ul className="space-y-2 pt-2 text-xs text-[#F5F8FC]">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#41D8FF]" />
                      <span>College students (B.Tech, B.Com, B.Sc, BBA, BCA) aiming for analyst roles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#41D8FF]" />
                      <span>Fresh graduates seeking their first high-growth technical position</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#41D8FF]" />
                      <span>Working professionals in non-tech, operations, or sales switching to Analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#081827] border border-[#162942] p-8 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <FileCheck className="w-6 h-6" />
                    <h3 className="text-xl font-bold text-white">Prerequisites</h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {course.prerequisites}
                  </p>
                  <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-[#94A3B8] space-y-1">
                    <strong className="text-white block">Zero Coding Experience Required:</strong>
                    We begin with fundamental spreadsheet principles and progressively guide you into writing SQL, building Power BI models, and scripting in Python.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Curriculum Accordion */}
          <section className="py-20 bg-[#040B14] border-b border-[#162942]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#397CFF] font-bold">
                  In-Depth Syllabus Breakdown
                </span>
                <h2 className="text-3xl font-extrabold text-[#FFFFFF]">
                  6 Modules. 20+ Code Labs.
                </h2>
              </div>

              <CurriculumAccordion modules={course.modules} />
            </div>
          </section>

          {/* 6 Portfolio Projects */}
          {course.projects.length > 0 && (
            <ProjectShowcase projects={course.projects} />
          )}
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
