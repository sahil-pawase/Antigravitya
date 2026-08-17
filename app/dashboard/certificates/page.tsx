import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Download,
  Clock,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function StudentCertificatesPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const certificate = await prisma.certificate.findFirst({
    where: { userId: session.id },
    include: { course: true, user: { include: { profile: true } } },
  });

  const totalLessons = await prisma.lesson.count();
  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: session.id, isCompleted: true },
  });

  const completedProjects = await prisma.projectSubmission.count({
    where: { userId: session.id, status: "REVIEWED" },
  });

  const isEligible = completedLessons >= totalLessons && completedProjects >= 6;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Verifiable Career Certificates
        </h1>
        <p className="text-xs text-[#94A3B8]">
          Earn your tamper-proof credential backed by the Career Transformer cryptographic verification ledger.
        </p>
      </div>

      {certificate ? (
        /* Issued Certificate Showcase */
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-b from-[#0C1A2B] to-[#081827] border-2 border-[#397CFF] p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#162942] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5">
                  <div className="w-full h-full bg-[#06101D] rounded-[8px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#41D8FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">CAREER TRANSFORMER</h3>
                  <p className="text-[10px] text-[#41D8FF] font-semibold uppercase tracking-wider">Verified Credential</p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-[10px] text-[#64748B] uppercase block">Certificate ID:</span>
                <span className="text-[#41D8FF] font-bold">{certificate.certificateId}</span>
              </div>
            </div>

            <div className="text-center space-y-3 py-4">
              <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-bold">This certifies that</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {certificate.user.profile?.fullName || session.fullName}
              </h2>
              <p className="text-xs text-[#94A3B8]">has successfully completed all requirements for</p>
              <h3 className="text-xl font-bold text-[#41D8FF]">{certificate.course.title}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#162942] pt-6 text-xs">
              <div>
                <span className="text-[#64748B] block text-[10px] uppercase">Issued Date</span>
                <span className="font-semibold text-white">{formatDate(certificate.issueDate)}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[10px] uppercase">Grade Achieved</span>
                <span className="font-bold text-emerald-400">{certificate.grade || "Distinction"}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#64748B] block text-[10px] uppercase">Public Ledger</span>
                <span className="font-bold text-[#41D8FF] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid & Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#081827] border border-[#162942]">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Public verification link is active and accessible by recruiters.</span>
            </div>
            <Link
              href={`/verify/${certificate.certificateId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="cyan" size="sm" className="gap-1.5 font-bold">
                <ExternalLink className="w-3.5 h-3.5" /> View Public Credential Page
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Requirements In Progress */
        <div className="rounded-2xl bg-[#081827] border border-[#162942] p-8 space-y-6">
          <div className="flex items-center gap-3 text-amber-400">
            <Award className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Certificate Eligibility Criteria</h3>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Career Transformer does not issue automatic participation certificates. To maintain enterprise employer trust, certificates are unlocked only after meeting the criteria below:
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">1. Complete 100% of Guided Lessons</span>
                <span className="text-[#41D8FF] font-bold font-mono">
                  {completedLessons}/{totalLessons} ({Math.round((completedLessons / totalLessons) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#081827] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF]"
                  style={{ width: `${Math.min(100, Math.round((completedLessons / totalLessons) * 100))}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">2. Receive Approval on 6 Portfolio Projects</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {completedProjects}/6 Projects Approved
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#081827] overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.round((completedProjects / 6) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
