"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { Search, ShieldAlert, CheckCircle2, User, BookOpen, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface StudentRecord {
  id: string;
  email: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  createdAt: Date | string;
  profile?: {
    fullName: string;
    phone?: string | null;
    department?: string | null;
    departmentId?: string | null;
    education?: string | null;
    college?: string | null;
    city?: string | null;
    careerGoal?: string | null;
  } | null;
  enrollmentsCount: number;
  completedLessonsCount: number;
}

export function AdminStudentsClient({ initialStudents }: { initialStudents: StudentRecord[] }) {
  const [students, setStudents] = useState<StudentRecord[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleStatus = async (studentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUpdatingId(studentId);

    try {
      const res = await fetch("/api/admin/students/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, status: nextStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, status: nextStatus as StudentRecord["status"] } : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.profile?.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.profile?.department || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.profile?.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Directory & Accounts</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            View enrolled learners, inspect department-wise distribution, and manage account access status.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#081827] border border-[#162942]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, email, department, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#06101D] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Student & Contact</th>
                <th className="p-4">Academic Department</th>
                <th className="p-4">Education & City</th>
                <th className="p-4">Career Goal</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                  <td className="p-4 space-y-1">
                    <span className="font-bold text-white text-sm block">
                      {s.profile?.fullName || "Student"}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] block">{s.email}</span>
                    <span className="text-[#41D8FF] text-[10px] font-mono block">
                      {s.profile?.phone || "No phone"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#0C1A2B] text-amber-300 border border-[#162942] text-[11px] font-bold inline-block">
                      🎓 {s.profile?.department || "Computer Engineering"}
                    </span>
                  </td>

                  <td className="p-4 space-y-1">
                    <span className="text-white font-medium block">
                      {s.profile?.education || "Graduate"}
                    </span>
                    <span className="text-[11px] text-[#64748B] block">
                      {s.profile?.college || "University"} • {s.profile?.city || "India"}
                    </span>
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="text-[#94A3B8] text-[11px] line-clamp-2">
                      {s.profile?.careerGoal || "Data Analyst"}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="text-[#41D8FF] font-bold block">
                        {s.completedLessonsCount} Lessons Done
                      </span>
                      <span className="text-[10px] text-[#64748B] block">
                        {s.enrollmentsCount} Active Program
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-[#94A3B8] whitespace-nowrap">
                    {formatDate(s.createdAt)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant={s.status === "ACTIVE" ? "danger" : "secondary"}
                      size="sm"
                      onClick={() => toggleStatus(s.id, s.status)}
                      disabled={updatingId === s.id}
                      className="text-xs"
                    >
                      {s.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                    </Button>
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
