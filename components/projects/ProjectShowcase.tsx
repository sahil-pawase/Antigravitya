"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import {
  FolderGit2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  skills: string;
  description: string;
  instructions: string;
  datasetUrl?: string | null;
  orderIndex: number;
}

export function ProjectShowcase({ projects }: { projects: ProjectItem[] }) {
  return (
    <section className="py-20 bg-[#040B14] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Real Enterprise Problem Statements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              6 Portfolio Projects You Will <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#397CFF] via-[#41D8FF] to-[#FFFFFF]">
                Build & Showcase
              </span>
            </h2>
            <p className="text-[#94A3B8] text-base">
              Recruiters judge candidates on real GitHub repositories and interactive dashboards. Here are the 6 end-to-end projects you will build and showcase on your resume.
            </p>

            <div className="p-3 rounded-xl bg-[#081827]/80 border border-[#162942] text-xs text-[#94A3B8] max-w-2xl mx-auto backdrop-blur-md">
              <span className="text-[#41D8FF] font-semibold">📌 Transparency Notice:</span> These project blueprints represent the actual datasets, analytical schemas, and dashboard specs assigned to students in the program.
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <FadeIn key={project.id} delay={idx * 0.08} direction="up">
              <TiltCard3D maxTilt={8} scale={1.03} glowColor="rgba(65, 216, 255, 0.2)">
                <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-7 space-y-5 hover:border-[#397CFF]/50 transition-all duration-300 flex flex-col justify-between group backdrop-blur-md shadow-xl h-full">
                  <div className="space-y-4 [transform:translateZ(15px)]">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-xs font-semibold group-hover:border-[#41D8FF]/40 transition-colors">
                        {project.category}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">
                        Project 0{project.orderIndex}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[#162942]/60 [transform:translateZ(10px)]">
                    <div>
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.split(",").map((s) => (
                          <span
                            key={s.trim()}
                            className="px-2 py-0.5 rounded bg-[#06101D] text-[#F5F8FC] border border-[#162942] hover:border-[#397CFF]/50 hover:bg-[#0C1A2B] transition-colors text-[11px] font-medium"
                          >
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link href={`/courses/data-analytics`} className="block w-full">
                      <Button variant="secondary" size="sm" className="w-full justify-between text-xs group-hover:border-[#397CFF]/50">
                        <span>View Project Specification</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#397CFF] group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TiltCard3D>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button variant="outline" size="md" className="gap-2 shadow-lg shadow-[#397CFF]/5">
                <span>Explore Detailed Project Architectures</span>
                <ExternalLink className="w-4 h-4 text-[#41D8FF]" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
