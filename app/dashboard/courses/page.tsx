import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { BookOpen, PlayCircle, Clock, Sparkles } from "lucide-react";

export default async function StudentCoursesListPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      },
    },
  });

  const completedCount = await prisma.lessonProgress.count({
    where: { userId: session.id, isCompleted: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Enrolled Programs</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Access your course curriculum, interactive video lessons, and datasets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrollments.map((enr) => {
          const c = enr.course;
          const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

          return (
            <div
              key={enr.id}
              className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-5 flex flex-col justify-between hover:border-[#397CFF]/50 transition-colors shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="cyan" size="sm">Active Cohort</Badge>
                  <span className="text-xs text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{c.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                  {c.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-[#94A3B8]">
                    <span>Curriculum Progress</span>
                    <span className="text-[#41D8FF] font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#06101D] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <Link href={`/dashboard/courses/${c.id}`} className="block w-full">
                <Button variant="primary" size="md" className="w-full justify-center gap-2 font-bold">
                  <PlayCircle className="w-4 h-4" /> Open Learning Studio
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
