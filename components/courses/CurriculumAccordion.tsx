"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  PlayCircle,
  FileText,
  Clock,
  Sparkles,
  Layers,
  FolderGit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LessonItem {
  id: string;
  title: string;
  summary?: string | null;
  durationMinutes: number;
  isFreePreview: boolean;
  orderIndex: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
}

export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  skillsLearned?: string | null;
  lessons: LessonItem[];
  assignments?: AssignmentItem[];
}

export function CurriculumAccordion({ modules }: { modules: ModuleItem[] }) {
  const [openModuleIds, setOpenModuleIds] = useState<string[]>([modules[0]?.id || ""]);

  const toggleModule = (id: string) => {
    setOpenModuleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalHours = Math.round(
    modules.reduce(
      (acc, m) => acc + m.lessons.reduce((lacc, l) => lacc + l.durationMinutes, 0),
      0
    ) / 60
  );

  return (
    <div className="space-y-6">
      {/* Curriculum Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 rounded-xl bg-[#081827]/90 border border-[#162942] text-xs text-[#94A3B8] backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[#64748B] block text-[11px] uppercase font-bold">Modules</span>
            <span className="text-sm font-bold text-[#FFFFFF]">{modules.length} Core Modules</span>
          </div>
          <div className="w-px h-8 bg-[#162942]" />
          <div>
            <span className="text-[#64748B] block text-[11px] uppercase font-bold">Total Lessons</span>
            <span className="text-sm font-bold text-[#FFFFFF]">{totalLessons} Guided Lessons</span>
          </div>
          <div className="w-px h-8 bg-[#162942]" />
          <div>
            <span className="text-[#64748B] block text-[11px] uppercase font-bold">Content Length</span>
            <span className="text-sm font-bold text-[#FFFFFF]">~{totalHours}+ Hours of Lab Sessions</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (openModuleIds.length === modules.length) {
              setOpenModuleIds([]);
            } else {
              setOpenModuleIds(modules.map((m) => m.id));
            }
          }}
          className="text-xs text-[#41D8FF] hover:text-white transition-colors font-semibold cursor-pointer py-1 px-2 rounded-lg bg-[#0C1A2B] border border-[#162942] hover:border-[#41D8FF]/40"
        >
          {openModuleIds.length === modules.length ? "Collapse All Modules" : "Expand All Modules"}
        </button>
      </div>

      {/* Accordion Module List */}
      <div className="space-y-4">
        {modules.map((m, index) => {
          const isOpen = openModuleIds.includes(m.id);
          const moduleDurationMin = m.lessons.reduce((acc, l) => acc + l.durationMinutes, 0);

          return (
            <div
              key={m.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[#081827] border-[#397CFF]/50 shadow-xl shadow-[#397CFF]/5"
                  : "bg-[#081827]/70 border-[#162942] hover:border-[#1E3A5F]"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleModule(m.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-[11px] font-bold group-hover:border-[#41D8FF]/40 transition-colors">
                      Module 0{index + 1}
                    </span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {moduleDurationMin} Mins
                    </span>
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="text-xs text-[#64748B]">
                      {m.lessons.length} Lessons
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#FFFFFF] tracking-tight group-hover:text-[#41D8FF] transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-2">
                    {m.description}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-[#0C1A2B] text-[#94A3B8] group-hover:text-[#41D8FF] flex-shrink-0 mt-1 transition-colors border border-[#162942]">
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#41D8FF]" : ""}`}
                  />
                </div>
              </button>

              {/* Collapsible Content with Framer Motion */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#162942] bg-[#06101D]/80 p-5 sm:p-6 space-y-4">
                      {m.skillsLearned && (
                        <div className="p-3 rounded-lg bg-[#0C1A2B] border border-[#162942] text-xs text-[#94A3B8] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#41D8FF] flex-shrink-0 animate-pulse" />
                          <span>
                            <strong className="text-[#F5F8FC]">Competencies:</strong> {m.skillsLearned}
                          </span>
                        </div>
                      )}

                      {/* Lessons list */}
                      <div className="space-y-2.5">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748B] block">
                          Lessons & Code Labs
                        </span>
                        {m.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#081827] border border-[#162942] hover:border-[#397CFF]/50 hover:bg-[#0C1A2B] text-xs transition-all duration-200 group/lesson"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-6 h-6 rounded-md bg-[#0C1A2B] text-[#94A3B8] group-hover/lesson:text-[#41D8FF] flex items-center justify-center text-[10px] font-bold flex-shrink-0 border border-[#162942]">
                                {lIdx + 1}
                              </div>
                              <PlayCircle className="w-4 h-4 text-[#397CFF] group-hover/lesson:scale-110 transition-transform flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-medium text-[#F5F8FC] block truncate group-hover/lesson:text-white">
                                  {lesson.title}
                                </span>
                                {lesson.summary && (
                                  <span className="text-[11px] text-[#64748B] block truncate">
                                    {lesson.summary}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {lesson.isFreePreview && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold pulse-badge">
                                  Free Preview
                                </span>
                              )}
                              <span className="text-[#64748B] text-[11px]">
                                {lesson.durationMinutes}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Assignment card if present */}
                      {m.assignments && m.assignments.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748B] block mb-2">
                            Module Evaluation & Capstone Assignment
                          </span>
                          {m.assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="p-3.5 rounded-lg bg-[#0C1A2B]/80 border border-[#397CFF]/30 space-y-1.5 hover:border-[#397CFF]/60 transition-colors shadow-sm"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-[#41D8FF] font-semibold">
                                  <FileText className="w-4 h-4" />
                                  <span>{assignment.title}</span>
                                </div>
                                <span className="text-[11px] text-[#94A3B8] font-medium">
                                  Total Score: {assignment.totalMarks} Marks
                                </span>
                              </div>
                              <p className="text-xs text-[#94A3B8] leading-relaxed">
                                {assignment.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
