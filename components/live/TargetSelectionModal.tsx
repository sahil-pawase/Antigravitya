"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Radio,
  Users,
  Building2,
  GraduationCap,
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { DEPARTMENT_OPTIONS, normalizeDepartment } from "@/lib/departments";

export type TargetType = "DEPARTMENT" | "STUDENTS" | "DEPARTMENTS" | "ALL";

interface StudentOption {
  id: string;
  name: string;
  email: string;
  department: string;
  departmentId: string;
  phone?: string | null;
}

interface TargetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    datasetName: string;
    targetType: TargetType;
    targetDepartmentIds: string[];
    targetStudentIds: string[];
    sessionType: "LIVE_NOW" | "INVITATION_REQUEST";
  }) => Promise<void>;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultDataset?: string;
  hostDepartment?: string;
  isSubmitting?: boolean;
}

export function TargetSelectionModal({
  isOpen,
  onClose,
  onSubmit,
  defaultTitle = "Mastering Real-Time SQL Queries & Window Functions",
  defaultDescription = "Live coding session on LEAD/LAG, ROW_NUMBER(), DENSE_RANK(), and partitioning high-volume e-commerce datasets.",
  defaultDataset = "swiggy_orders_dataset.csv",
  hostDepartment = "Computer Engineering",
  isSubmitting = false,
}: TargetSelectionModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [datasetName, setDatasetName] = useState(defaultDataset);
  const [targetType, setTargetType] = useState<TargetType>("DEPARTMENT");

  // Specific Department state
  const [selectedSingleDept, setSelectedSingleDept] = useState("COMP_ENG");

  // Multiple Departments state
  const [selectedMultipleDepts, setSelectedMultipleDepts] = useState<string[]>([
    "COMP_ENG",
    "IT",
  ]);

  // Specific Students state
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentList, setStudentList] = useState<StudentOption[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentDeptFilter, setStudentDeptFilter] = useState("ALL");

  useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
      setDescription(defaultDescription);
      setDatasetName(defaultDataset);
      fetchStudents("");
    }
  }, [isOpen, defaultTitle, defaultDescription, defaultDataset]);

  const fetchStudents = async (query: string, dept: string = studentDeptFilter) => {
    setIsLoadingStudents(true);
    try {
      const url = `/api/admin/students/search?q=${encodeURIComponent(query)}&department=${encodeURIComponent(dept)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudentList(data.students || []);
      }
    } catch (e) {
      console.warn("Failed to fetch students:", e);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStudentSearchQuery(val);
    fetchStudents(val, studentDeptFilter);
  };

  const handleDeptFilterChange = (dept: string) => {
    setStudentDeptFilter(dept);
    fetchStudents(studentSearchQuery, dept);
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const toggleMultipleDept = (deptId: string) => {
    setSelectedMultipleDepts((prev) =>
      prev.includes(deptId) ? prev.filter((d) => d !== deptId) : [...prev, deptId]
    );
  };

  const handleSelectAllMultipleDepts = () => {
    if (selectedMultipleDepts.length === DEPARTMENT_OPTIONS.length) {
      setSelectedMultipleDepts([]);
    } else {
      setSelectedMultipleDepts(DEPARTMENT_OPTIONS.map((d) => d.value));
    }
  };

  const handleSubmit = async (sessionType: "LIVE_NOW" | "INVITATION_REQUEST") => {
    if (!title.trim()) {
      alert("Please enter a title for the live session.");
      return;
    }

    if (targetType === "STUDENTS" && selectedStudentIds.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (targetType === "DEPARTMENTS" && selectedMultipleDepts.length === 0) {
      alert("Please select at least one department.");
      return;
    }

    let targetDeptIds: string[] = [];
    let targetStuIds: string[] = [];

    if (targetType === "DEPARTMENT") {
      targetDeptIds = [selectedSingleDept];
    } else if (targetType === "DEPARTMENTS") {
      targetDeptIds = selectedMultipleDepts;
    } else if (targetType === "STUDENTS") {
      targetStuIds = selectedStudentIds;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      datasetName: datasetName.trim(),
      targetType,
      targetDepartmentIds: targetDeptIds,
      targetStudentIds: targetStuIds,
      sessionType,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#081827] border border-[#162942] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#162942] bg-[#0C1A2B]/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                Start Live Broadcast / Invite
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Select session details and targeted student audience.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#162942] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {/* Live Session Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Live Session Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java OOP & Design Patterns Masterclass"
              className="w-full px-4 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              Session Description / Agenda (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of topics covered..."
              className="w-full px-4 py-2 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none resize-none"
            />
          </div>

          {/* Dataset Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
              Exercise Dataset File
            </label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="e.g. swiggy_orders_dataset.csv"
              className="w-full px-4 py-2 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none"
            />
          </div>

          {/* Target Audience Selector */}
          <div className="space-y-3 pt-2 border-t border-[#162942]">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#41D8FF]" />
                Notify / Invite Target Audience
              </h4>
              <p className="text-[11px] text-[#94A3B8]">
                Notifications and live call alerts will be dispatched ONLY to the selected targets.
              </p>
            </div>

            {/* Target Type Radio Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Specific Department */}
              <button
                type="button"
                onClick={() => setTargetType("DEPARTMENT")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  targetType === "DEPARTMENT"
                    ? "bg-[#397CFF]/15 border-[#397CFF] ring-1 ring-[#397CFF] text-white"
                    : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40"
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${targetType === "DEPARTMENT" ? "text-[#41D8FF]" : "text-[#64748B]"}`} />
                <div>
                  <span className="font-extrabold text-xs block text-white">Specific Dept</span>
                  <span className="text-[10px] text-[#64748B] block">Single branch</span>
                </div>
              </button>

              {/* 2. Specific Students */}
              <button
                type="button"
                onClick={() => setTargetType("STUDENTS")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  targetType === "STUDENTS"
                    ? "bg-[#397CFF]/15 border-[#397CFF] ring-1 ring-[#397CFF] text-white"
                    : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40"
                }`}
              >
                <Users className={`w-5 h-5 ${targetType === "STUDENTS" ? "text-[#41D8FF]" : "text-[#64748B]"}`} />
                <div>
                  <span className="font-extrabold text-xs block text-white">Specific Students</span>
                  <span className="text-[10px] text-[#64748B] block">Selected learners</span>
                </div>
              </button>

              {/* 3. Multiple Departments */}
              <button
                type="button"
                onClick={() => setTargetType("DEPARTMENTS")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  targetType === "DEPARTMENTS"
                    ? "bg-[#397CFF]/15 border-[#397CFF] ring-1 ring-[#397CFF] text-white"
                    : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40"
                }`}
              >
                <Building2 className={`w-5 h-5 ${targetType === "DEPARTMENTS" ? "text-[#41D8FF]" : "text-[#64748B]"}`} />
                <div>
                  <span className="font-extrabold text-xs block text-white">Multi-Dept</span>
                  <span className="text-[10px] text-[#64748B] block">Multiple branches</span>
                </div>
              </button>

              {/* 4. Everyone */}
              <button
                type="button"
                onClick={() => setTargetType("ALL")}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  targetType === "ALL"
                    ? "bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 text-white"
                    : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-amber-500/40"
                }`}
              >
                <Globe className={`w-5 h-5 ${targetType === "ALL" ? "text-amber-400" : "text-[#64748B]"}`} />
                <div>
                  <span className="font-extrabold text-xs block text-white">Everyone</span>
                  <span className="text-[10px] text-[#64748B] block">All cohorts</span>
                </div>
              </button>
            </div>

            {/* Target Options Sub-Panels */}
            <div className="p-4 rounded-2xl bg-[#06101D] border border-[#162942] space-y-3">
              {/* Option A: Specific Department Single Dropdown */}
              {targetType === "DEPARTMENT" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
                    Choose Department
                  </label>
                  <select
                    value={selectedSingleDept}
                    onChange={(e) => setSelectedSingleDept(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#081827] border border-[#162942] text-xs text-white focus:border-[#397CFF] focus:outline-none"
                  >
                    {DEPARTMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#64748B]">
                    Only students registered under this academic branch will receive live call alerts.
                  </p>
                </div>
              )}

              {/* Option B: Specific Students Searchable Box */}
              {targetType === "STUDENTS" && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      Selected Students ({selectedStudentIds.length})
                    </span>
                    {selectedStudentIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedStudentIds([])}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search student by name or email..."
                        value={studentSearchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#081827] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none"
                      />
                    </div>
                    <select
                      value={studentDeptFilter}
                      onChange={(e) => handleDeptFilterChange(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#081827] border border-[#162942] text-xs text-[#94A3B8] focus:border-[#397CFF] focus:outline-none"
                    >
                      <option value="ALL">All Depts</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                    {isLoadingStudents ? (
                      <div className="py-6 text-center text-[#64748B] flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#397CFF]" />
                        <span>Searching student records...</span>
                      </div>
                    ) : studentList.length === 0 ? (
                      <div className="py-4 text-center text-[#64748B]">
                        No students found matching query.
                      </div>
                    ) : (
                      studentList.map((stu) => {
                        const isSelected = selectedStudentIds.includes(stu.id);
                        return (
                          <div
                            key={stu.id}
                            onClick={() => toggleStudentSelection(stu.id)}
                            className={`p-2.5 px-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[#397CFF]/20 border-[#397CFF] text-white"
                                : "bg-[#081827] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40 hover:bg-[#0C1A2B]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="rounded text-[#397CFF] focus:ring-0 cursor-pointer"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-white block truncate">
                                  {stu.name}
                                </span>
                                <span className="text-[10px] text-[#64748B] block truncate">
                                  {stu.email}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#0C1A2B] text-amber-300 border border-[#162942] text-[10px] font-bold flex-shrink-0">
                              {stu.department}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Option C: Multiple Departments Checkbox Grid */}
              {targetType === "DEPARTMENTS" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Selected Departments ({selectedMultipleDepts.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllMultipleDepts}
                      className="text-[11px] text-[#41D8FF] hover:underline cursor-pointer"
                    >
                      {selectedMultipleDepts.length === DEPARTMENT_OPTIONS.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEPARTMENT_OPTIONS.map((dept) => {
                      const isChecked = selectedMultipleDepts.includes(dept.value);
                      return (
                        <div
                          key={dept.value}
                          onClick={() => toggleMultipleDept(dept.value)}
                          className={`p-2.5 px-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                            isChecked
                              ? "bg-[#397CFF]/20 border-[#397CFF] text-white"
                              : "bg-[#081827] border-[#162942] text-[#94A3B8] hover:border-[#397CFF]/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-[#397CFF] focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-white truncate">
                            {dept.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Option D: Everyone */}
              {targetType === "ALL" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Platform-Wide Broadcast Permission Active</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    All registered and active learners across every engineering department and career cohort will receive this live session alert.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="p-4 px-6 border-t border-[#162942] bg-[#0C1A2B]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            {/* Send Live Request / Invitation */}
            <button
              type="button"
              onClick={() => handleSubmit("INVITATION_REQUEST")}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-[#0C1A2B] border border-cyan-500/40 text-[#41D8FF] hover:bg-cyan-500/10 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
            >
              <Send className="w-3.5 h-3.5 text-[#41D8FF]" />
              <span>Send Live Request 📢</span>
            </button>

            {/* Start Live Now */}
            <button
              type="button"
              onClick={() => handleSubmit("LIVE_NOW")}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 hover:from-rose-400 hover:to-red-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/30 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>START LIVE NOW 🔴</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
