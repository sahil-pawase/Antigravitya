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
  Calendar,
  MessageSquare,
  Users,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

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

  // Total lessons in enrolled course
  const totalLessons = course
    ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    : 0;

  // Completed lessons by this student
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: session.id,
      isCompleted: true,
    },
    include: { lesson: true },
  });

  const completedCount = completedProgress.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Completed lesson IDs set
  const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));

  // Find next uncompleted lesson
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

  // Fetch project submissions for this student
  const projectSubmissions = await prisma.projectSubmission.findMany({
    where: { userId: session.id },
    include: { project: true },
  });

  // Fetch student certificate if issued
  const certificate = await prisma.certificate.findFirst({
    where: { userId: session.id },
  });

  return (
    <div className="space-y-8">
      {/* 1. Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border border-[#162942]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#397CFF]/15 text-[#41D8FF] border border-[#397CFF]/30 text-xs font-semibold">
              <Sparkles className="w-3 h-3 inline mr-1" /> Student Learning Portal
            </span>
            <span className="text-xs text-[#64748B] font-mono">ID: {session.id.substring(0, 8)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {session.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Track your progress, build portfolio projects, and connect with your analytics mentors.
          </p>
        </div>

        {course && (
          <Link href={`/dashboard/courses/${course.id}`}>
            <Button variant="cyan" size="md" className="font-bold flex-shrink-0">
              <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning →
            </Button>
          </Link>
        )}
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2">
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

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2">
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

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Assignments</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            3 Active
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            End-of-module capstone tasks
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#081827] border border-[#162942] space-y-2">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs uppercase font-bold text-[#64748B]">Certificate Status</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white truncate">
            {certificate ? "Issued & Verified" : "In Progress"}
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            {certificate ? (
              <Link href={`/verify/${certificate.certificateId}`} className="text-[#41D8FF] hover:underline font-semibold">
                View Public Credential →
              </Link>
            ) : (
              "Complete all labs & projects"
            )}
          </p>
        </div>
      </div>

      {/* 3. Main Enrolled Course Section & Next Lesson */}
      {course ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Enrolled Course Progression */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162942] pb-6">
                <div>
                  <Badge variant="cyan" size="sm">Active Cohort</Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {course.title}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{course.tagline}</p>
                </div>
                <Link href={`/dashboard/courses/${course.id}`}>
                  <Button variant="primary" size="sm" className="gap-1.5 flex-shrink-0">
                    <BookOpen className="w-4 h-4" /> Open Course Player
                  </Button>
                </Link>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#94A3B8] font-medium">
                  <span>Overall Curriculum Completion</span>
                  <span className="text-[#41D8FF] font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#06101D] border border-[#162942] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Next Up Lesson Card */}
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
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button variant="cyan" size="sm" className="gap-1 font-semibold flex-shrink-0">
                      <PlayCircle className="w-4 h-4" /> Resume Lab
                    </Button>
                  </Link>
                </div>
              )}

              {/* Modules status overview */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#64748B]">
                  Module Breakdown & Completion
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.modules.map((m, idx) => {
                    const modCompleted = m.lessons.filter((l) => completedLessonIds.has(l.id)).length;
                    const isAllDone = modCompleted === m.lessons.length && m.lessons.length > 0;

                    return (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-[#06101D]/70 border border-[#162942] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <span className="font-bold text-white block truncate">
                            0{idx + 1}. {m.title.replace(/^Module \d+: /, "")}
                          </span>
                          <span className="text-[11px] text-[#64748B]">
                            {modCompleted} of {m.lessons.length} lessons done
                          </span>
                        </div>
                        {isAllDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <span className="text-[11px] text-[#94A3B8] font-mono flex-shrink-0">
                            {Math.round((modCompleted / m.lessons.length) * 100)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Sessions & Mentor Hub */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Live Sessions */}
            <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[#41D8FF]">
                <Calendar className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Upcoming Live Cohort Sessions</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-1">
                  <div className="flex items-center justify-between text-[#41D8FF] font-semibold">
                    <span>Live SQL Interview Drills</span>
                    <span className="text-[10px] bg-[#397CFF]/15 px-2 py-0.5 rounded">Saturday, 6 PM IST</span>
                  </div>
                  <p className="text-[#94A3B8]">
                    Live whiteboarding CTEs, Window functions, and real product case studies with Rohan Verma.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Power BI Project Office Hours</span>
                    <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Tuesday, 8 PM IST</span>
                  </div>
                  <p className="text-[#94A3B8]">
                    1-on-1 DAX troubleshooting, Star Schema validation, and custom tooltip design reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Mentor Support Card */}
            <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400">
                <Users className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Need Mentor Assistance?</h3>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Stuck on a tricky SQL query, DAX calculation, or Python dataframe error? Ask your mentor directly.
              </p>
              <Link href="/dashboard/projects" className="block w-full">
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  Submit Project for Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#081827] border border-[#162942] space-y-4">
          <BookOpen className="w-12 h-12 text-[#41D8FF] mx-auto" />
          <h2 className="text-xl font-bold text-white">No Active Course Enrollment Found</h2>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            You haven't enrolled in any program yet. Explore the Data Analytics Career Program to start learning.
          </p>
          <Link href="/courses/data-analytics">
            <Button variant="cyan" size="md">
              Explore Data Analytics Program
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
