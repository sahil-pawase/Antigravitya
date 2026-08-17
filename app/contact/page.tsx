import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { LeadForm } from "@/components/leads/LeadForm";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Mail, Phone, MapPin, MessageSquare, ShieldCheck } from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";

export const metadata: Metadata = {
  title: "Contact Admissions & Academic Support | Career Transformer",
  description:
    "Get in touch with Career Transformer admissions advisors, schedule 1-on-1 counseling, or chat directly on WhatsApp.",
};

export default function ContactPage() {
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
              {/* Left Contact Info */}
              <FadeIn className="lg:col-span-5 space-y-6" direction="left">
                <TiltCard3D maxTilt={6} scale={1.02} glowColor="rgba(57, 124, 255, 0.25)">
                  <div className="rounded-2xl bg-[#081827]/90 border border-[#162942] p-8 space-y-6 shadow-xl backdrop-blur-md">
                    <h2 className="text-xl font-bold text-[#FFFFFF] [transform:translateZ(15px)]">Direct Channels</h2>

                    <div className="space-y-4 text-sm [transform:translateZ(10px)]">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-[#397CFF] flex-shrink-0 shadow-md">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-[#F5F8FC] block">Admissions Email</strong>
                          <a
                            href="mailto:admissions@careertransformer.in"
                            className="text-[#41D8FF] hover:underline text-xs sm:text-sm"
                          >
                            admissions@careertransformer.in
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-emerald-400 flex-shrink-0 shadow-md">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-[#F5F8FC] block">Phone & WhatsApp</strong>
                          <p className="text-xs sm:text-sm text-[#94A3B8]">+91 98765 43210</p>
                          <p className="text-[11px] text-[#64748B]">Mon - Sat: 9:30 AM – 7:30 PM IST</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#0C1A2B] text-amber-400 flex-shrink-0 shadow-md">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-[#F5F8FC] block">Headquarters & Virtual Hub</strong>
                          <p className="text-xs sm:text-sm text-[#94A3B8]">
                            Koramangala 5th Block, Bengaluru, Karnataka, India
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

              {/* Right Form */}
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
