"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { formatINR } from "@/lib/utils";
import { Check, Shield } from "lucide-react";
import { BookDemoModal } from "@/leads/BookDemoModal";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { PaymentGatewayModal } from "@/components/checkout/PaymentGatewayModal";

interface PricingSectionProps {
  currentPrice?: number;
  originalPrice?: number;
  courseId?: string;
}

export function PricingSection({
  currentPrice = 24999,
  originalPrice = 45000,
  courseId = "data-analytics",
}: PricingSectionProps) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<{
    name: string;
    price: number;
    originalPrice: number;
  } | null>(null);

  const tiers = [
    {
      name: "Self-Paced Learning",
      tagline: "For independent learners wanting full curriculum access",
      price: 14999,
      originalPrice: 28000,
      isFeatured: false,
      buttonText: "Enroll in Self-Paced",
      buttonVariant: "secondary" as const,
      glow: "rgba(57, 124, 255, 0.15)",
      features: [
        "Full access to all 6 curriculum modules",
        "20+ Hands-on lab exercises and datasets",
        "Downloadable cheatsheets, SQL & Python scripts",
        "Access to student peer discussion forum",
        "Self-evaluation project guidelines",
        "Verifiable completion certificate",
      ],
      notIncluded: [
        "1-on-1 Line-by-line mentor code reviews",
        "Live weekly mentor doubt clearing calls",
        "Personalized resume & LinkedIn optimization",
        "Technical mock interview drills",
      ],
    },
    {
      name: "Career Cohort (Flagship)",
      tagline: "Our most popular track with live mentorship & portfolio reviews",
      price: currentPrice,
      originalPrice: originalPrice,
      isFeatured: true,
      badge: "MOST POPULAR",
      buttonText: "Join Next Cohort (Enroll Now)",
      buttonVariant: "cyan" as const,
      glow: "rgba(65, 216, 255, 0.35)",
      features: [
        "Everything in Self-Paced Learning",
        "1-on-1 line-by-line mentor review on all 6 projects",
        "Weekly live mentor Q&A and doubt resolution",
        "Graded assignment scoring with qualitative feedback",
        "1-on-1 Resume & LinkedIn profile optimization",
        "Live SQL & Case Study mock technical interviews",
        "Job application strategy & recruiter outreach playbooks",
        "Priority instructor support channel",
      ],
    },
    {
      name: "1-on-1 Career Accelerator",
      tagline: "Dedicated personal mentorship for fast-track career switchers",
      price: 49999,
      originalPrice: 85000,
      isFeatured: false,
      buttonText: "Apply for 1-on-1 Mentorship",
      buttonVariant: "secondary" as const,
      glow: "rgba(57, 124, 255, 0.15)",
      features: [
        "Everything in Career Cohort",
        "Dedicated personal senior analytics mentor",
        "Weekly 1-on-1 private video strategy calls",
        "Direct WhatsApp/Slack mentor access",
        "Custom capstone project tailored to your target domain (Fintech, E-commerce, Healthcare)",
        "3 Full technical & behavioral mock interview simulations",
        "Executive portfolio presentation coaching",
      ],
    },
  ];

  return (
    <>
      <section id="pricing" className="py-20 bg-[#06101D] border-t border-[#162942] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
                Transparent Tuition & Plans
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                Invest in Practical Skills That Pay Off
              </h2>
              <p className="text-[#94A3B8] text-base">
                Zero hidden fees. Full lifetime access. Flexible No-Cost EMI installment options available for all major Indian banks and UPI.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier, idx) => (
              <FadeIn key={tier.name} delay={idx * 0.1} direction="up" className="h-full">
                <TiltCard3D
                  maxTilt={tier.isFeatured ? 6 : 4}
                  scale={tier.isFeatured ? 1.03 : 1.01}
                  glowColor={tier.glow}
                  className="h-full"
                >
                  <div
                    className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative backdrop-blur-md h-full ${
                      tier.isFeatured
                        ? "bg-gradient-to-b from-[#0C1A2B] via-[#081827] to-[#06101D] border-2 border-[#397CFF] shadow-2xl shadow-[#397CFF]/20"
                        : "bg-[#081827]/90 border border-[#162942] hover:border-[#1E3A5F] shadow-xl"
                    }`}
                  >
                    {tier.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] text-[11px] font-extrabold tracking-wider shadow-lg shadow-[#41D8FF]/30 [transform:translateZ(20px)]">
                        {tier.badge}
                      </div>
                    )}

                    <div className="space-y-6 [transform:translateZ(10px)]">
                      <div>
                        <h3 className="text-xl font-bold text-[#FFFFFF] group-hover:text-white">{tier.name}</h3>
                        <p className="text-xs text-[#94A3B8] mt-1">{tier.tagline}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-extrabold text-[#FFFFFF]">
                            {formatINR(tier.price)}
                          </span>
                          <span className="text-sm text-[#64748B] line-through font-medium">
                            {formatINR(tier.originalPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-[#41D8FF] font-medium">
                          EMI starting at {formatINR(Math.round(tier.price / 12))} / month (12 mos)
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#162942] space-y-3">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748B] block">
                          Included in this track:
                        </span>
                        <ul className="space-y-2.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-xs text-[#F5F8FC]">
                              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {tier.notIncluded && (
                          <ul className="space-y-2 pt-2 border-t border-[#162942]/60">
                            {tier.notIncluded.map((nf) => (
                              <li key={nf} className="flex items-start gap-2 text-xs text-[#64748B] opacity-70">
                                <span className="text-xs font-bold text-red-400/80 mr-1">✕</span>
                                <span>{nf}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 space-y-3 [transform:translateZ(15px)]">
                      <Button
                        variant={tier.buttonVariant}
                        size="lg"
                        onClick={() =>
                          setSelectedTierForPayment({
                            name: tier.name,
                            price: tier.price,
                            originalPrice: tier.originalPrice,
                          })
                        }
                        className="w-full justify-center font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                      >
                        {tier.buttonText}
                      </Button>

                      <button
                        onClick={() => setIsDemoOpen(true)}
                        className="w-full text-center text-xs text-[#94A3B8] hover:text-[#41D8FF] transition-colors cursor-pointer py-1"
                      >
                        Have questions? Talk to an advisor
                      </button>
                    </div>
                  </div>
                </TiltCard3D>
              </FadeIn>
            ))}
          </div>

          {/* Guarantee pill */}
          <FadeIn delay={0.3}>
            <div className="mt-12 p-4 rounded-xl bg-[#081827] border border-[#162942] max-w-2xl mx-auto flex items-center justify-center gap-3 text-xs text-[#94A3B8] text-center shadow-lg hover:border-emerald-500/40 transition-colors">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>7-Day No-Questions-Asked Refund Guarantee:</strong> If the curriculum and learning methodology don't meet your expectations within the first 7 days, get a full 100% refund.
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      <BookDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} source="PRICING_ADVISOR_LINK" />

      {selectedTierForPayment && (
        <PaymentGatewayModal
          isOpen={!!selectedTierForPayment}
          onClose={() => setSelectedTierForPayment(null)}
          courseId={courseId}
          courseTitle="Data Analytics Career Program"
          tierName={selectedTierForPayment.name}
          price={selectedTierForPayment.price}
          originalPrice={selectedTierForPayment.originalPrice}
        />
      )}
    </>
  );
}
