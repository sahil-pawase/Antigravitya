"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { LeadForm } from "@/components/leads/LeadForm";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, Copy, Check, ExternalLink } from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailAddress = "pawasesahil42@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-between selection:bg-[#397CFF]/30 relative overflow-hidden">
      <DataMesh3DCanvas />

      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <main className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081827] border border-[#162942] text-xs font-semibold text-[#41D8FF]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Admissions & Support</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
                  We're Here to Help <span className="shimmer-text">Your Journey</span>
                </h1>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  Whether you have questions about prerequisites, the curriculum roadmap, or payment installment options, our mentors are available to assist.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <FadeIn className="lg:col-span-5 space-y-6" direction="left">
                <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(57, 124, 255, 0.25)">
                  <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-6 shadow-xl backdrop-blur-md">
                    <h2 className="text-xl font-bold text-[#FFFFFF] [transform:translateZ(15px)]">Direct Channels</h2>

                    <div className="space-y-4 text-sm [transform:translateZ(10px)]">
                      {/* Admissions Email Item */}
                      <div className="flex items-start gap-4 p-3 rounded-2xl bg-[#06101D] border border-[#162942] hover:border-[#41D8FF]/40 transition-all">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-[#397CFF] flex-shrink-0 shadow-md">
                          <Mail className="w-5 h-5 text-[#41D8FF]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="text-[#F5F8FC] block text-xs font-bold uppercase tracking-wider">
                              Admissions Email
                            </strong>
                            <button
                              type="button"
                              onClick={handleCopyEmail}
                              className="px-2 py-0.5 rounded-lg bg-[#081827] hover:bg-[#0C1A2B] border border-white/10 text-[10px] text-[#41D8FF] flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy email to clipboard"
                            >
                              {copiedEmail ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <a
                            href="mailto:pawasesahil42@gmail.com?subject=Career%20Transformer%20Admissions%20Inquiry"
                            className="text-[#41D8FF] hover:text-white hover:underline text-xs sm:text-sm font-semibold flex items-center gap-1 mt-1 transition-colors"
                          >
                            <span>pawasesahil42@gmail.com</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                          <p className="text-[10px] text-[#64748B] mt-0.5">Click to email or click Copy</p>
                        </div>
                      </div>

                      {/* Phone & WhatsApp */}
                      <div className="flex items-start gap-4 p-3 rounded-2xl bg-[#06101D] border border-[#162942]">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-emerald-400 flex-shrink-0 shadow-md">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-[#F5F8FC] block text-xs font-bold uppercase tracking-wider">
                            Phone & WhatsApp
                          </strong>
                          <a href="tel:+919322840479" className="text-xs sm:text-sm text-emerald-400 font-semibold hover:underline block mt-1">
                            +91 98765 43210
                          </a>
                          <p className="text-[11px] text-[#64748B]">Mon - Sat: 9:30 AM – 7:30 PM IST</p>
                        </div>
                      </div>

                      {/* Headquarters */}
                      <div className="flex items-start gap-4 p-3 rounded-2xl bg-[#06101D] border border-[#162942]">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-amber-400 flex-shrink-0 shadow-md">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-[#F5F8FC] block text-xs font-bold uppercase tracking-wider">
                            Headquarters & Virtual Hub
                          </strong>
                          <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1">
                            Pune deccan
                          </p>
                          <p className="text-[11px] text-[#64748B]">All cohort sessions conducted live online pan-India</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#162942] [transform:translateZ(15px)]">
                      <WhatsAppButton variant="inline" className="w-full justify-center" />
                    </div>
                  </div>
                </TiltCard3D>

                <div className="p-5 rounded-2xl bg-[#081827]/80 border border-[#162942] flex items-center gap-3 text-xs text-[#94A3B8] hover:border-emerald-500/40 transition-colors backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>
                    Direct access to technical faculty. You will speak with mentors who actually teach the curriculum.
                  </span>
                </div>
              </FadeIn>

              <FadeIn className="lg:col-span-7" direction="right" delay={0.2}>
                <TiltCard3D maxTilt={5} scale={1.01} glowColor="rgba(65, 216, 255, 0.25)">
                  <div className="rounded-2xl bg-[#081827]/95 border border-[#162942] p-8 sm:p-10 shadow-2xl space-y-6 backdrop-blur-xl group">
                    <div className="[transform:translateZ(10px)]">
                      <h2 className="text-2xl font-bold text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">Send an Inquiry</h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Fill out the form below and an academic advisor will get back to you with the detailed course catalog and demo link.
                      </p>
                    </div>

                    <div className="[transform:translateZ(5px)]">
                      <LeadForm source="CONTACT_PAGE" buttonText="Submit Inquiry & Request Callback" />
                    </div>
                  </div>
                </TiltCard3D>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
