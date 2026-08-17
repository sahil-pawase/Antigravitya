"use client";

import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";

export interface TestimonialItem {
  id: string;
  authorName: string;
  role: string;
  company: string;
  batch: string;
  review: string;
  rating: number;
  isVerified: boolean;
}

export function TestimonialGrid({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section id="reviews" className="py-20 bg-[#040B14] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Student Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              Hear From Our Alumni
            </h2>
            <p className="text-[#94A3B8] text-base">
              Real feedback from students who transformed their technical skills and built competitive analytics portfolios.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <FadeIn key={t.id} delay={idx * 0.1} direction="up">
              <TiltCard3D maxTilt={8} scale={1.03} glowColor="rgba(65, 216, 255, 0.2)">
                <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-7 space-y-5 hover:border-[#397CFF]/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-md shadow-xl h-full group">
                  <div className="space-y-4 [transform:translateZ(15px)]">
                    {/* Rating stars & verified badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current transition-transform group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }} />
                        ))}
                      </div>
                      {t.isVerified && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Quote className="w-6 h-6 text-[#162942] absolute -top-2 -left-2 -z-10 group-hover:text-[#397CFF]/20 transition-colors" />
                      <p className="text-sm text-[#F5F8FC] leading-relaxed italic relative">
                        "{t.review}"
                      </p>
                    </div>
                  </div>

                  {/* Author info */}
                  <div className="pt-4 border-t border-[#162942]/60 flex items-center gap-3 [transform:translateZ(10px)]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-[#06101D] rounded-full flex items-center justify-center text-xs font-bold text-[#FFFFFF]">
                        {getInitials(t.authorName)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">{t.authorName}</h4>
                      <p className="text-xs text-[#94A3B8]">
                        {t.role} • <span className="text-[#64748B]">{t.company}</span>
                      </p>
                      <p className="text-[11px] text-[#41D8FF] font-medium">{t.batch}</p>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
