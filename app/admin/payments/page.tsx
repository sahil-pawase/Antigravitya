import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const payments = await prisma.payment.findMany({
    include: {
      user: { include: { profile: true } },
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payment Ledger & Transactions</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Audit server-side verified Razorpay orders, transaction signatures, and payment settlement records.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Program Enrolled</th>
                <th className="p-4">Razorpay Order ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#64748B]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <span className="font-bold text-white block">
                        {p.user.profile?.fullName || "Student"}
                      </span>
                      <span className="text-[#94A3B8] text-[11px] block">{p.user.email}</span>
                    </td>

                    <td className="p-4 font-medium text-white">
                      {p.course.title}
                    </td>

                    <td className="p-4 font-mono text-[11px] text-[#41D8FF]">
                      {p.razorpayOrderId}
                    </td>

                    <td className="p-4 font-extrabold text-white text-sm">
                      {formatINR(p.amount)}
                    </td>

                    <td className="p-4 text-[#94A3B8] whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          p.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : p.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
