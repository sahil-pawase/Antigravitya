import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { BookOpen, Layers, Clock, CheckCircle2, FileSpreadsheet, Plus } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default async function AdminCoursesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: { lessons: true },
      },
      enrollments: true,
      projects: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Courses & Curriculum Manager</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage modules, lesson videos, downloadable assets, and cohort pricing.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {courses.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-[#081827] border border-[#162942] p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162942] pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm">Flagship Program</Badge>
                  <span className="text-xs text-[#64748B] font-mono">Slug: /{c.slug}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{c.title}</h2>
                <p className="text-xs text-[#94A3B8]">{c.tagline}</p>
              </div>

              <div className="text-right space-y-1">
                <span className="text-xs text-[#64748B] uppercase font-bold block">Current Tuition:</span>
                <span className="text-2xl font-extrabold text-white">{formatINR(c.currentPrice)}</span>
                <span className="text-xs text-[#64748B] line-through block">{formatINR(c.originalPrice)}</span>
              </div>
            </div>

            {/* Modules list */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#64748B]">
                Curriculum Modules ({c.modules.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {c.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#41D8FF]">Module 0{idx + 1}</span>
                      <span className="text-[10px] text-[#64748B]">{m.lessons.length} Lessons</span>
                    </div>
                    <h4 className="font-semibold text-white truncate">{m.title.replace(/^Module \d+: /, "")}</h4>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-1">{m.skillsLearned}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#162942] flex items-center justify-between text-xs text-[#64748B]">
              <span>Enrolled Students: <strong className="text-white">{c.enrollments.length}</strong></span>
              <span>Portfolio Projects: <strong className="text-white">{c.projects.length}</strong></span>
              <span className="text-emerald-400 font-semibold">Status: Published & Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
