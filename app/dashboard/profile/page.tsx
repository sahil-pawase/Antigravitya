import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/ui/Button";
import { Input, Select, Textarea } from "@/ui/Input";
import { User, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export default async function StudentProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { profile: true },
  });

  const p = user?.profile;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Student Profile</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your contact details, educational background, and career aspirations.
        </p>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-[#162942] pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 flex-shrink-0">
            <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
              {session.fullName.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{p?.fullName || session.fullName}</h2>
            <p className="text-xs text-[#41D8FF] font-medium">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#0C1A2B] text-[#94A3B8] text-[10px] uppercase font-mono">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" defaultValue={p?.fullName || ""} readOnly />
          <Input label="Email Address" defaultValue={user?.email || ""} readOnly />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Academic Department / Branch" defaultValue={p?.department || "Computer Engineering"} readOnly />
          <Input label="Phone / WhatsApp" defaultValue={p?.phone || ""} readOnly />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Highest Qualification" defaultValue={p?.education || ""} readOnly />
          <Input label="College / University" defaultValue={p?.college || "Delhi University / Tier 1-2"} readOnly />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Target Career Goal
          </label>
          <div className="p-3.5 rounded-lg bg-[#06101D] border border-[#162942] text-xs text-[#F5F8FC]">
            {p?.careerGoal || "Become a Full-Time Data Analyst"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] flex items-center justify-between text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#397CFF]" />
            <span>Account Status: <strong className="text-emerald-400">ACTIVE & VERIFIED</strong></span>
          </div>
          <span className="text-[11px] text-[#64748B]">Member since 2025</span>
        </div>
      </div>
    </div>
  );
}
