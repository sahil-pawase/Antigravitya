import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { FolderGit2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";

export const metadata: Metadata = {
  title: "Data Analytics Portfolio Projects | Career Transformer",
  description:
    "Explore the 6 real-world enterprise portfolio projects built by Career Transformer students using SQL, Power BI, Tableau, Python, and Excel.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-between selection:bg-[#397CFF]/30 relative overflow-hidden">
      {/* 3D WebGL Particle Canvas */}
      <DataMesh3DCanvas />

      {/* Cyber Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <main className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
            {/* Header */}
            <FadeIn>
              <div className="text-center max-w-4xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Production Portfolio Blueprints</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
                  Enterprise Portfolio <span className="shimmer-text">Projects</span>
                </h1>
                <p className="text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
                  Recruiters don't hire people who only know definitions; they hire people who have built verifiable solutions to real business problems.
                </p>
              </div>
            </FadeIn>

            {/* Grid of Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((p, idx) => (
                <FadeIn key={p.id} delay={idx * 0.1} direction="up">
                  <TiltCard3D maxTilt={7} scale={1.02} glowColor="rgba(65, 216, 255, 0.25)" className="h-full">
                    <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-6 flex flex-col justify-between hover:border-[#397CFF]/50 transition-all duration-300 shadow-xl backdrop-blur-md h-full group">
                      <div className="space-y-4 [transform:translateZ(15px)]">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-lg bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-xs font-bold group-hover:border-[#41D8FF]/40 transition-colors">
                            {p.category}
                          </span>
                          <span className="text-xs text-[#64748B] font-mono">
                            Capstone Project 0{p.orderIndex}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors leading-snug">
                          {p.title}
                        </h2>

                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                          {p.description}
                        </p>

                        <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] space-y-2 [transform:translateZ(10px)]">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                            Project Blueprint & Implementation Steps:
                          </span>
                          <p className="text-xs text-[#F5F8FC] whitespace-pre-line leading-relaxed">
                            {p.instructions}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-[#162942] [transform:translateZ(15px)]">
                        <div className="flex flex-wrap gap-2">
                          {p.skills.split(",").map((s) => (
                            <span
                              key={s.trim()}
                              className="px-2.5 py-1 rounded-md bg-[#0C1A2B] text-[#F5F8FC] border border-[#162942] hover:border-[#397CFF]/50 hover:bg-[#112338] transition-colors text-xs font-medium"
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>

                        <Link href="/courses/data-analytics" className="block w-full">
                          <Button variant="primary" size="md" className="w-full justify-center text-xs font-semibold shadow-lg shadow-[#397CFF]/20">
                            Build This In Next Cohort →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TiltCard3D>
                </FadeIn>
              ))}
            </div>
          </div>
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
