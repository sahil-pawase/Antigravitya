import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import {
  BookOpen,
  FolderGit2,
  FileText,
  Award,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
  Video,
  Users,
  Calendar,
} from "lucide-react";

import { StudentLiveAttendanceCard } from "@/components/dashboard/StudentLiveAttendanceCard";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  // Fetch student enrollments and course progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { orderIndex: "asc" },
            include: {
              lessons: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
          projects: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  const activeEnrollment = enrollments[0];
  const course = activeEnrollment?.course;

  const totalLessons = course
    ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    : 0;

  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: session.id,
      isCompleted: true,
    },
    include: { lesson: true },
  });

  const completedCount = completedProgress.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));

  let nextLesson = null;
  if (course) {
    for (const m of course.modules) {
      for (const l of m.lessons) {
        if (!completedLessonIds.has(l.id)) {
          nextLesson = { lesson: l, module: m };
          break;
        }
      }
      if (nextLesson) break;
    }
  }

  const projectSubmissions = await prisma.projectSubmission.findMany({
    where: { userId: session.id },
    include: { project: true },
  });

  const certificate = await prisma.certificate.findFirst({
    where: { userId: session.id },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border border-[#162942] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#397CFF]/15 text-[#41D8FF] border border-[#397CFF]/30 text-xs font-semibold">
              <Sparkles className="w-3 h-3 inline mr-1" /> Student Learning Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#0C1A2B] text-amber-300 border border-[#162942] text-[11px] font-bold">
              🎓 {session.department || "Computer Engineering"}
            </span>
            <span className="text-xs text-[#64748B] font-mono">ID: {session.id.substring(0, 8)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Track your analytics progress, join live classes for {session.department || "your department"}, watch recorded masterclasses, and submit portfolio capstones.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/dashboard/live">
            <Button variant="outline" size="md" className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10 font-bold">
              <Radio className="w-4 h-4 mr-1.5 text-rose-400" /> Live Stream
            </Button>
          </Link>
          <Link href="/dashboard/recorded">
            <Button variant="cyan" size="md" className="font-bold">
              <Video className="w-4 h-4 mr-1.5" /> Recorded Classes
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Attendance / Live Stream Alert Widget */}
      <StudentLiveAttendanceCard
        currentUserId={session.id}
        currentUserName={session.fullName}
        department={session.department || "Computer Engineering"}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Course Progress</span>
            <BookOpen className="w-4 h-4 text-[#41D8FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {progressPercent}%
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            {completedCount} of {totalLessons} lessons finished
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Live Stream</span>
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            Live Now
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Window Functions in SQL (74 online)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Portfolio Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#397CFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {projectSubmissions.length} / 6
          </div>
          <p className="text-[11px] text-emerald-400">
            {projectSubmissions.filter((p) => p.status === "REVIEWED").length} Approved by Mentor
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Certificate Status</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white truncate">
            {certificate ? "Issued & Verified" : "In Progress"}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            {certificate ? (
              <Link href={"/verify/" + certificate.certificateId} className="text-[#41D8FF] hover:underline font-semibold">
                View Credential →
              </Link>
            ) : (
              "Complete all labs & projects"
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#081827] border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-[#081827] to-[#06101D] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                STREAMING LIVE NOW
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">74 attending</span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              Mastering Real-Time SQL Queries & Window Functions
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Join the live mentorship session with Sahil Pawase covering LEAD, LAG, DENSE_RANK(), and partitioning query logic.
            </p>
          </div>

          <div className="pt-3 border-t border-[#162942] flex items-center justify-between">
            <span className="text-xs text-[#CBD5E1]">Sahil Pawase (Lead Architect)</span>
            <Link href="/dashboard/live">
              <Button variant="outline" size="sm" className="border-rose-500 text-rose-300 hover:bg-rose-500/20 font-bold gap-1">
                <Radio className="w-3.5 h-3.5" /> Enter Classroom
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#081827] border border-[#41D8FF]/30 bg-gradient-to-br from-[#0C1A2B] via-[#081827] to-[#06101D] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#397CFF]/20 text-[#41D8FF] border border-[#41D8FF]/40 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> FEATURED MASTERCLASS
              </span>
              <span className="text-xs text-amber-400 font-bold">★ 4.9 (140 reviews)</span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              Power BI Executive Dashboard Studio: End-to-End Build
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Full 52-minute masterclass building executive KPI cards, star schemas, dynamic DAX measures, and drill-through pages.
            </p>
          </div>

          <div className="pt-3 border-t border-[#162942] flex items-center justify-between">
            <span className="text-xs text-[#CBD5E1]">52 mins • 3 Chapters</span>
            <Link href="/dashboard/recorded">
              <Button variant="cyan" size="sm" className="font-bold gap-1">
                <PlayCircle className="w-3.5 h-3.5" /> Watch Masterclass
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {course && (
        <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162942] pb-6">
            <div>
              <Badge variant="cyan" size="sm">Enrolled Curriculum</Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {course.title}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">{course.tagline}</p>
            </div>
            <Link href={"/dashboard/courses/" + course.id}>
              <Button variant="primary" size="sm" className="gap-1.5 flex-shrink-0">
                <BookOpen className="w-4 h-4" /> Open Course Player
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#94A3B8] font-medium">
              <span>Overall Curriculum Completion</span>
              <span className="text-[#41D8FF] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#06101D] border border-[#162942] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF] transition-all duration-500"
                style={{ width: progressPercent + "%" }}
              />
            </div>
          </div>

          {nextLesson && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#06101D] border border-[#162942] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#41D8FF]">
                  Next Recommended Lesson:
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {nextLesson.lesson.title}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {nextLesson.module.title} • {nextLesson.lesson.durationMinutes} Mins
                </p>
              </div>
              <Link href={"/dashboard/courses/" + course.id}>
                <Button variant="cyan" size="sm" className="gap-1 font-semibold flex-shrink-0">
                  <PlayCircle className="w-4 h-4" /> Resume Lab
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
