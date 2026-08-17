import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, CheckCircle2, ExternalLink, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminCertificatesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const certificates = await prisma.certificate.findMany({
    include: {
      user: { include: { profile: true } },
      course: true,
    },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Issued Certificates & Ledger</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Audit cryptographic credentials issued to graduating students.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Recipient Student</th>
                <th className="p-4">Course Title</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4 text-right">Public Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {certificates.map((c) => (
                <tr key={c.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#41D8FF]">
                    {c.certificateId}
                  </td>

                  <td className="p-4 space-y-0.5">
                    <span className="font-bold text-white block">
                      {c.user.profile?.fullName || "Student"}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] block">{c.user.email}</span>
                  </td>

                  <td className="p-4 font-medium text-white">{c.course.title}</td>

                  <td className="p-4 font-bold text-emerald-400">{c.grade || "Distinction"}</td>

                  <td className="p-4 text-[#94A3B8] whitespace-nowrap">{formatDate(c.issueDate)}</td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/verify/${c.certificateId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#41D8FF] hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Credential</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
