"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  Download,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

export interface ResourceItem {
  id: string;
  title: string;
  fileUrl: string;
  resourceType: string;
  fileSize?: string | null;
}

export interface LessonData {
  id: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  durationMinutes: number;
  orderIndex: number;
  isFreePreview: boolean;
  resources: ResourceItem[];
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  skillsLearned?: string | null;
  lessons: LessonData[];
  assignments?: AssignmentData[];
}

export interface CoursePlayerData {
  id: string;
  title: string;
  tagline: string;
  modules: ModuleData[];
  completedLessonIds: string[];
}

export function CoursePlayerClient({ course }: { course: CoursePlayerData }) {
  // Find first lesson to select
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );

  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(course.completedLessonIds)
  );

  // Default to first uncompleted lesson, or the very first lesson
  const initialLesson =
    allLessons.find((l) => !completedIds.has(l.id)) || allLessons[0];

  const [currentLessonId, setCurrentLessonId] = useState<string>(
    initialLesson?.id || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const currentLesson =
    allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

  const isCurrentCompleted = completedIds.has(currentLesson?.id);

  const totalLessons = allLessons.length;
  const completedCount = completedIds.size;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleComplete = async (lessonId: string) => {
    setIsUpdating(true);
    const willBeCompleted = !completedIds.has(lessonId);

    try {
      const res = await fetch("/api/progress/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          isCompleted: willBeCompleted,
        }),
      });

      if (!res.ok) throw new Error("Failed to update progress");

      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (willBeCompleted) {
          next.add(lessonId);
          // Trigger subtle celebration confetti if marking complete
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
        } else {
          next.delete(lessonId);
        }
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#081827] border border-[#162942]">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/dashboard"
            className="text-[#94A3B8] hover:text-[#41D8FF] font-medium"
          >
            Student Dashboard
          </Link>
          <span className="text-[#64748B]">/</span>
          <span className="text-white font-semibold truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <span>Curriculum Progress:</span>
            <span className="text-[#41D8FF] font-bold">
              {completedCount}/{totalLessons} ({progressPercent}%)
            </span>
          </div>
          <div className="w-24 sm:w-36 h-2 rounded-full bg-[#06101D] border border-[#162942] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#397CFF] to-[#41D8FF] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Video Player & Lesson Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Video Screen Container */}
          <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-2xl">
            {currentLesson?.videoUrl ? (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-[#06101D] flex flex-col items-center justify-center text-center p-8 space-y-3">
                <PlayCircle className="w-16 h-16 text-[#397CFF]/60" />
                <h3 className="text-lg font-bold text-white">
                  Interactive Lab Session
                </h3>
                <p className="text-xs text-[#94A3B8] max-w-md">
                  Follow the step-by-step documentation, download the exercise
                  datasets, and run the queries below.
                </p>
              </div>
            )}

            {/* Action Bar Under Video */}
            <div className="p-6 border-t border-[#162942] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#081827]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#41D8FF] uppercase tracking-wider block">
                  {currentLesson?.moduleTitle}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentLesson?.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8] pt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {currentLesson?.durationMinutes} Minutes
                  </span>
                  <span>•</span>
                  <span>Lesson 0{currentLesson?.orderIndex}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Button
                  variant={isCurrentCompleted ? "secondary" : "cyan"}
                  size="md"
                  onClick={() => toggleComplete(currentLesson.id)}
                  disabled={isUpdating}
                  className="font-bold gap-2 text-xs sm:text-sm"
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Completed (Click to Undo)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark as Complete</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Lesson Content & Documentation */}
          <div className="rounded-2xl bg-[#081827] border border-[#162942] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#162942] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#397CFF]" />
                <span>Lab Overview & Business Problem</span>
              </h3>
            </div>

            <div className="space-y-4 text-sm text-[#F5F8FC] leading-relaxed">
              <p>{currentLesson?.content || currentLesson?.summary}</p>
            </div>

            {/* Downloadable Resources & Datasets */}
            {currentLesson?.resources && currentLesson.resources.length > 0 && (
              <div className="pt-4 border-t border-[#162942] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Attached Datasets & Code Templates:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.fileUrl}
                      download
                      className="p-3 rounded-xl bg-[#06101D] border border-[#162942] hover:border-[#397CFF] transition-colors flex items-center justify-between gap-3 text-xs group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="p-2 rounded-lg bg-[#0C1A2B] text-[#41D8FF] group-hover:scale-105 transition-transform flex-shrink-0">
                          <Download className="w-3.5 h-3.5" />
                        </span>
                        <div className="truncate">
                          <span className="font-semibold text-white block truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            {res.resourceType} • {res.fileSize || "1.2 MB"}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Nav Prev / Next */}
            <div className="pt-6 border-t border-[#162942] flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="gap-1.5 text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Lesson
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === allLessons.length - 1}
                className="gap-1.5 text-xs font-bold"
              >
                Next Lesson <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Sidebar Accordion Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#081827] border border-[#162942] p-5 space-y-4 shadow-xl max-h-[800px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#162942] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#41D8FF]" />
                <span>Modules & Labs</span>
              </h3>
              <span className="text-xs text-[#94A3B8] font-semibold font-mono">
                {completedCount}/{totalLessons} Done
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((m, mIdx) => {
                const moduleLessons = m.lessons;
                const completedInMod = moduleLessons.filter((l) =>
                  completedIds.has(l.id)
                ).length;

                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        0{mIdx + 1}. {m.title.replace(/^Module \d+: /, "")}
                      </span>
                      <span className="text-[11px] text-[#41D8FF] font-mono font-semibold">
                        {completedInMod}/{moduleLessons.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {moduleLessons.map((l) => {
                        const isDone = completedIds.has(l.id);
                        const isSelected = l.id === currentLessonId;

                        return (
                          <button
                            key={l.id}
                            onClick={() => setCurrentLessonId(l.id)}
                            className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-[#397CFF]/20 text-[#41D8FF] border border-[#397CFF]/50 font-bold"
                                : "text-[#94A3B8] hover:text-[#F5F8FC] hover:bg-[#0C1A2B]"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[#64748B] flex-shrink-0" />
                              )}
                              <span className="truncate">{l.title}</span>
                            </div>
                            <span className="text-[10px] text-[#64748B] flex-shrink-0">
                              {l.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
