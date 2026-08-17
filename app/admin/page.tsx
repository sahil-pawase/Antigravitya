import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import {
  Users,
  MessageSquare,
  CreditCard,
  FolderGit2,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  // Aggregate high-level platform statistics
  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const activeEnrollments = await prisma.enrollment.count({
    where: { status: "ACTIVE" },
  });

  const totalLeads = await prisma.lead.count();
  const newLeadsCount = await prisma.lead.count({ where: { status: "NEW" } });

  const payments = await prisma.payment.findMany({
    where: { status: "SUCCESS" },
  });
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  const pendingProjectReviews = await prisma.projectSubmission.count({
    where: { status: "SUBMITTED" },
  });

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentEnrollments = await prisma.enrollment.findMany({
    orderBy: { enrolledAt: "desc" },
    take: 5,
    include: {
      user: { include: { profile: true } },
      course: true,
      payment: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#081827] border border-[#162942]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              <Sparkles className="w-3 h-3 inline mr-1" /> Executive Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Real-time pipeline metrics, admissions CRM inquiries, and student project evaluation queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/leads">
            <Button variant="cyan" size="sm" className="font-bold">
              Open Lead CRM ({newLeadsCount} New)
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="secondary" size="sm">
              Review Submissions ({pendingProjectReviews})
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Total Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatINR(totalRevenue)}
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold">
            {payments.length} Settled Transactions
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Active Students</span>
            <Users className="w-4 h-4 text-[#41D8FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalStudents}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            {activeEnrollments} Active Cohort Enrollments
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Total Leads / Inquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalLeads}
          </div>
          <p className="text-[11px] text-amber-400">
            {newLeadsCount} Pending Demo Calls
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Pending Project Reviews</span>
            <FolderGit2 className="w-4 h-4 text-[#397CFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {pendingProjectReviews}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Awaiting Instructor Grading
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Leads & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries CRM Preview */}
        <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#162942] pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Admissions Inquiries</h3>
              <p className="text-xs text-[#94A3B8]">Prospects requesting 1-on-1 demo walkthroughs</p>
            </div>
            <Link href="/admin/leads" className="text-xs text-[#41D8FF] hover:underline font-semibold">
              View All CRM →
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{lead.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0C1A2B] text-[#41D8FF] border border-[#162942]">
                    {lead.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                  <span>📞 {lead.phone}</span>
                  <span>🎓 {lead.education}</span>
                </div>
                {lead.message && (
                  <p className="text-[11px] text-[#64748B] italic truncate">
                    "{lead.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#162942] pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Student Enrollments</h3>
              <p className="text-xs text-[#94A3B8]">Active learners joined through verified checkout</p>
            </div>
            <Link href="/admin/enrollments" className="text-xs text-[#41D8FF] hover:underline font-semibold">
              View All ({activeEnrollments}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnrollments.map((enr) => (
              <div
                key={enr.id}
                className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {enr.user.profile?.fullName || "Student"}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {enr.payment ? formatINR(enr.payment.amount) : "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>{enr.course.title}</span>
                  <span className="text-[#64748B]">{formatDate(enr.enrolledAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
