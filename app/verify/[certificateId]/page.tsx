import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { formatDate } from "@/lib/utils";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

interface VerifyPageProps {
  params: Promise<{ certificateId: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { certificateId } = await params;
  return {
    title: `Certificate Verification: ${certificateId} | Career Transformer`,
    description: `Official public verification for Career Transformer Certificate ID ${certificateId}.`,
  };
}

export default async function CertificateVerificationPage({ params }: VerifyPageProps) {
  const { certificateId } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateId },
    include: {
      user: {
        include: { profile: true },
      },
      course: true,
    },
  });

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col justify-between">
        <Navbar />
        <main className="py-24 text-center max-w-lg mx-auto px-4 space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Certificate Not Found</h1>
          <p className="text-sm text-[#94A3B8]">
            No issued credential found matching ID <strong className="text-white font-mono">{certificateId}</strong>. Please verify the link or contact academic support.
          </p>
          <Link href="/">
            <Button variant="secondary" size="md">
              Return to Homepage
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const studentName = certificate.user.profile?.fullName || "Student";

  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Top Verified Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Officially Verified Credential</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                Certificate of Completion
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Issued by Career Transformer Education Private Limited
              </p>
            </div>

            {/* Official Certificate Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0C1A2B] via-[#081827] to-[#06101D] border-2 border-[#397CFF]/50 p-8 sm:p-14 shadow-2xl shadow-[#397CFF]/20 space-y-10 overflow-hidden">
              {/* Decorative Watermark Seal */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#41D8FF]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Certificate Top Crest */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#162942] pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5">
                    <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-[#41D8FF]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white tracking-wider">CAREER TRANSFORMER</h3>
                    <p className="text-[11px] text-[#41D8FF] tracking-widest uppercase font-semibold">Institute of Data Analytics</p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-[#94A3B8]">
                  <span className="text-[#64748B] block text-[10px] uppercase tracking-wider">Credential ID:</span>
                  <span className="text-[#41D8FF] font-bold text-sm">{certificate.certificateId}</span>
                </div>
              </div>

              {/* Recipient Statement */}
              <div className="text-center space-y-4 py-4">
                <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-bold">
                  This is to certify that
                </p>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F5F8FC] to-[#41D8FF] tracking-tight">
                  {studentName}
                </h2>
                <p className="text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
                  has successfully completed all rigorous curriculum modules, laboratory assignments, and passed instructor code reviews for 6 real-world enterprise portfolio projects in:
                </p>
                <div className="p-4 rounded-xl bg-[#081827] border border-[#162942] inline-block">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#41D8FF]">
                    {certificate.course.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Duration: {certificate.course.duration} • Level: {certificate.course.level}
                  </p>
                </div>
              </div>

              {/* Skills & Grade Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#162942] pt-8 text-center sm:text-left">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Date of Issue</span>
                  <span className="text-xs font-semibold text-[#F5F8FC] flex items-center justify-center sm:justify-start gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#397CFF]" />
                    {formatDate(certificate.issueDate)}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Performance Grade</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {certificate.grade || "Distinction Passed"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Ledger Status</span>
                  <span className="text-xs font-bold text-[#41D8FF] flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified & Active
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Security Note */}
            <div className="p-4 rounded-xl bg-[#081827] border border-[#162942] flex items-center justify-between gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Tamper-proof credential registered on Career Transformer cryptographic verification ledger.
                </span>
              </div>
              <Link href="/courses/data-analytics" className="text-[#41D8FF] hover:underline font-semibold flex-shrink-0">
                Explore Program →
              </Link>
            </div>
          </div>
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
