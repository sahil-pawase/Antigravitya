import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { GraduationCap, CheckCircle2, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminEnrollmentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { include: { profile: true } },
      course: true,
      payment: true,
    },
    orderBy: { enrolledAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Cohort Enrollments</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Student cohort rosters, active course entitlements, and access verification.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Course Enrolled</th>
                <th className="p-4">Enrolled Date</th>
                <th className="p-4">Payment Reference</th>
                <th className="p-4">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                  <td className="p-4 space-y-0.5">
                    <span className="font-bold text-white block text-sm">
                      {enr.user.profile?.fullName || "Student"}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] block">{enr.user.email}</span>
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {enr.course.title}
                  </td>

                  <td className="p-4 text-[#94A3B8] whitespace-nowrap">
                    {formatDate(enr.enrolledAt)}
                  </td>

                  <td className="p-4 font-mono text-[11px] text-[#41D8FF]">
                    {enr.payment ? enr.payment.razorpayOrderId : "Manual / Granted"}
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {enr.status}
                    </span>
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
