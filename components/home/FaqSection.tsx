"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { WhatsAppButton } from "@/whatsapp/WhatsAppButton";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion/MotionWrapper";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<string[]>([faqs[0]?.id || ""]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-[#040B14] border-t border-[#162942] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Doubts? We Have Answers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[#94A3B8] text-base">
              Everything you need to know about the curriculum, projects, mentorship, and career preparation.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <FadeIn key={faq.id} delay={idx * 0.05} direction="up">
                <div
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-[#081827] border-[#397CFF]/50 shadow-xl shadow-[#397CFF]/5"
                      : "bg-[#081827]/80 border-[#162942] hover:border-[#1E3A5F]"
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer group select-none"
                  >
                    <span className="text-base font-semibold text-[#FFFFFF] tracking-tight group-hover:text-[#41D8FF] transition-colors">
                      {faq.question}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#0C1A2B] group-hover:bg-[#112338] transition-colors flex-shrink-0 border border-[#162942]">
                      <ChevronDown
                        className={`w-4 h-4 text-[#94A3B8] transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#41D8FF]" : "group-hover:text-white"
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-sm text-[#94A3B8] leading-relaxed border-t border-[#162942]/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Unanswered questions block */}
        <FadeIn delay={0.3}>
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#081827]/90 border border-[#162942] hover:border-[#397CFF]/40 text-center space-y-3 shadow-xl backdrop-blur-md transition-colors">
            <h4 className="text-base font-bold text-[#FFFFFF]">Have a question not listed here?</h4>
            <p className="text-xs text-[#94A3B8]">
              Connect directly with an academic advisor on WhatsApp or schedule a free 1-on-1 career consultation.
            </p>
            <div className="pt-2 flex items-center justify-center">
              <WhatsAppButton variant="inline" message="Hi Career Transformer, I have a few specific questions about the Data Analytics Career Program." />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
