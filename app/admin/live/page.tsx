"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Video,
  Users,
  Play,
  Square,
  Sparkles,
  Download,
  Plus,
  Send,
  HelpCircle,
  Pin,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Shield,
  Settings,
  Clock,
  Eye,
  Film,
  Mic,
  MicOff,
  VideoOff,
  BellRing,
  UserCheck,
  UserX,
  Volume2,
  VolumeX,
  Hand,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Input, Textarea } from "@/ui/Input";
import { Modal } from "@/ui/Modal";
import { ZoomLiveRoom } from "@/components/live/ZoomLiveRoom";

export default function AdminLiveStudioPage() {
  const [liveState, setLiveState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Stream Details State
  const [streamTitle, setStreamTitle] = useState("Mastering Real-Time SQL Queries & Window Functions");
  const [streamDesc, setStreamDesc] = useState("Live coding session on LEAD/LAG, ROW_NUMBER(), DENSE_RANK(), and partitioning high-volume e-commerce datasets.");
  const [instructorName, setInstructorName] = useState("Sahil Pawase");
  const [datasetName, setDatasetName] = useState("swiggy_orders_dataset.csv");

  // Create Poll State
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", "", ""]);

  // Pin Notice State
  const [noticeText, setNoticeText] = useState("");

  // Instructor Chat Input
  const [chatInput, setChatInput] = useState("");

  // Student Attendance Filter & Search
  const [studentFilter, setStudentFilter] = useState<"ALL" | "ONLINE" | "ABSENT" | "HAND_RAISED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLiveState = async () => {
    try {
      const res = await fetch("/api/live-class");
      const data = await res.json();
      if (data.success && data.state) {
        setLiveState(data.state);
        setStreamTitle(data.state.title);
        setStreamDesc(data.state.description);
        setInstructorName(data.state.instructor);
        setDatasetName(data.state.datasetName);
        setNoticeText(data.state.pinnedNotice || "");
      }
    } catch (err) {
      console.error("Error fetching live state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: string, extraData: any = {}) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/live-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extraData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setLiveState(data.state);
      setSuccessMsg(
        action === "END_AND_ARCHIVE"
          ? "🎉 Live stream ended and automatically published to Student Recorded Classes!"
          : action === "PING_ABSENT"
          ? "🔔 Urgent call reminder broadcasted to all absent students!"
          : "Classroom updated in real-time!"
      );
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to execute action");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEndAndArchive = () => {
    if (confirm("End live stream now and automatically publish the recording + chapters to the Recorded Classes catalog for students?")) {
      handleAction("END_AND_ARCHIVE");
    }
  };

  const handleToggleStream = () => {
    if (liveState?.isLive) {
      handleEndAndArchive();
    } else {
      handleAction("START_STREAM", {
        title: streamTitle,
        description: streamDesc,
        datasetName,
        instructor: instructorName,
      });
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction("UPDATE_DETAILS", {
      title: streamTitle,
      description: streamDesc,
      instructor: instructorName,
    });
    handleAction("UPDATE_DATASET", {
      datasetName,
    });
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = pollOptions.filter((o) => o.trim().length > 0);
    if (!pollQuestion.trim() || filteredOptions.length < 2) {
      alert("Please enter a question and at least 2 options.");
      return;
    }

    handleAction("CREATE_POLL", {
      question: pollQuestion.trim(),
      options: filteredOptions,
    });

    setIsPollModalOpen(false);
    setPollQuestion("");
    setPollOptions(["", "", "", ""]);
  };

  const handleSendInstructorChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    handleAction("SEND_CHAT", { text: chatInput.trim() });
    setChatInput("");
  };

  const handlePinNotice = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction("PIN_NOTICE", { notice: noticeText.trim() });
  };

  // Student Attendance Filtering
  const enrolledStudents: any[] = liveState?.enrolledStudents || [];
  const participants: any[] = liveState?.participants || [];

  const findParticipant = (student: any) => {
    return participants.find(
      (p: any) =>
        p &&
        (p.id === student.id ||
          (p.email && student.email && p.email.toLowerCase() === student.email.toLowerCase()) ||
          (p.name && student.name && p.name.toLowerCase() === student.name.toLowerCase()))
    );
  };

  const filteredStudents = enrolledStudents.filter((student: any) => {
    const participant: any = findParticipant(student);
    const isOnline = !!participant || student.status === "ONLINE_IN_CALL";

    if (studentFilter === "ONLINE" && !isOnline) return false;
    if (studentFilter === "ABSENT" && isOnline) return false;
    if (studentFilter === "HAND_RAISED" && (!participant || !participant.isHandRaised)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.cohort && student.cohort.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const onlineCount = Math.max(participants.length, enrolledStudents.filter((s: any) => s.status === "ONLINE_IN_CALL").length);
  const totalCount = enrolledStudents.length;
  const absentCount = Math.max(0, totalCount - onlineCount);
  const attendancePct = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
  const handsRaisedCount = participants.filter((p: any) => p && p.isHandRaised).length;

  return (
    <div className="space-y-6">
      {/* 1. Zoom WebRTC Live Room Viewport */}
      <ZoomLiveRoom
        mode="instructor"
        streamTitle={streamTitle}
        instructorName={instructorName}
        instructorTitle="Lead Analytics Architect & Director"
        viewersCount={onlineCount}
        datasetName={datasetName}
        onDownloadDataset={() => alert("Downloading active exercise dataset: " + datasetName)}
        onOpenPoll={() => setIsPollModalOpen(true)}
      />

      {/* Stream Action Banner */}
      <div className="p-4 px-6 rounded-2xl bg-[#081827] border border-[#162942] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Automated Class Recording & Live Telemetry</h4>
            <p className="text-[11px] text-[#94A3B8]">
              When you finish the class, this stream is instantly added to the Recorded Masterclasses catalog with live student attendance records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {liveState?.isLive ? (
            <button
              type="button"
              onClick={handleEndAndArchive}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>End Stream & Publish to Recorded 🎥</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleStream}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#06101D] font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Live Broadcast 🔴</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Real-Time Student Call Attendance & Live Roster Section */}
      <div className="p-6 rounded-3xl bg-[#081827] border border-[#162942] space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#162942] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#41D8FF]" />
              <h3 className="text-base font-extrabold text-white">Live Student Call Attendance & Telemetry</h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Monitor connected students, track active video/audio feeds, and ping absent candidates in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleAction("PING_ABSENT")}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Ping All Absent Students 🔔</span>
          </button>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#06101D] border border-[#162942] space-y-1">
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Total Enrolled Cohort</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">{totalCount}</span>
              <span className="text-xs text-[#94A3B8]">Students</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#06101D] border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Joined In Call Now</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">{onlineCount}</span>
              <span className="text-xs text-emerald-300 font-bold">({attendancePct}% Attendance)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#06101D] border border-rose-500/20 space-y-1">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Absent / Not Joined</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-400 font-mono">{absentCount}</span>
              <span className="text-xs text-rose-300">Pending</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#06101D] border border-amber-500/30 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Live Hands Raised</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400 font-mono">{handsRaisedCount}</span>
              <span className="text-xs text-amber-300 font-bold">Seeking to Speak</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#06101D] p-1 rounded-2xl border border-[#162942]">
            <button
              type="button"
              onClick={() => setStudentFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                studentFilter === "ALL" ? "bg-[#397CFF] text-white" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              All Cohort ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStudentFilter("ONLINE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                studentFilter === "ONLINE" ? "bg-emerald-600 text-white" : "text-[#94A3B8] hover:text-emerald-400"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>In Call Now ({onlineCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStudentFilter("ABSENT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                studentFilter === "ABSENT" ? "bg-rose-600 text-white" : "text-[#94A3B8] hover:text-rose-400"
              }`}
            >
              Absent ({absentCount})
            </button>
            <button
              type="button"
              onClick={() => setStudentFilter("HAND_RAISED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                studentFilter === "HAND_RAISED" ? "bg-amber-600 text-white" : "text-[#94A3B8] hover:text-amber-400"
              }`}
            >
              ✋ Hand Raised ({handsRaisedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name or email..."
              className="w-full pl-9 pr-3 py-2 bg-[#06101D] border border-[#162942] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF]"
            />
          </div>
        </div>

        {/* Student Attendance Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#162942]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#06101D] border-b border-[#162942] text-[#64748B] font-semibold">
                <th className="p-3.5 pl-4">Candidate Profile</th>
                <th className="p-3.5">Assigned Cohort</th>
                <th className="p-3.5">Call Presence Status</th>
                <th className="p-3.5">Media Telemetry</th>
                <th className="p-3.5 pr-4 text-right">Instructor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942] bg-[#081827]">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: any) => {
                  const participant = findParticipant(student);
                  const isOnline = !!participant || student.status === "ONLINE_IN_CALL";

                  return (
                    <tr key={student.id} className="hover:bg-[#0c223a]/50 transition-colors">
                      {/* Profile */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-9 h-9 rounded-xl border border-[#162942] bg-[#06101D]"
                          />
                          <div>
                            <span className="font-bold text-white block">{student.name}</span>
                            <span className="text-[10px] text-[#64748B] font-mono">{student.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Cohort */}
                      <td className="p-3.5 text-[#CBD5E1] font-medium">
                        {student.cohort}
                      </td>

                      {/* Presence Status */}
                      <td className="p-3.5">
                        {isOnline ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>IN CALL ({participant.joinedAt})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-[11px]">
                            <UserX className="w-3.5 h-3.5" />
                            <span>NOT JOINED</span>
                          </div>
                        )}
                      </td>

                      {/* Media Feeds */}
                      <td className="p-3.5">
                        {isOnline ? (
                          <div className="flex items-center gap-2">
                            {/* Camera Status */}
                            <span
                              className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                                participant.isCameraOn
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-[#06101D] text-[#64748B] border border-[#162942]"
                              }`}
                              title={participant.isCameraOn ? "Webcam Video is Active" : "Webcam Video is Off"}
                            >
                              <Video className="w-3 h-3" />
                              <span className="hidden sm:inline">{participant.isCameraOn ? "Cam ON" : "Off"}</span>
                            </span>

                            {/* Mic Status */}
                            <span
                              className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                                participant.isMicOn
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                                  : "bg-[#06101D] text-[#64748B] border border-[#162942]"
                              }`}
                              title={participant.isMicOn ? "Microphone is Unmuted (Speaking)" : "Microphone is Muted"}
                            >
                              <Mic className="w-3 h-3" />
                              <span className="hidden sm:inline">{participant.isMicOn ? "Mic ON" : "Muted"}</span>
                            </span>

                            {/* Hand Raised */}
                            {participant.isHandRaised && (
                              <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 animate-bounce">
                                <span>✋ Hand Up</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#64748B] font-mono">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        {isOnline ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {participant.isMicOn && (
                              <button
                                type="button"
                                onClick={() => handleAction("MUTE_STUDENT", { studentId: student.id })}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition-colors cursor-pointer"
                                title="Mute Student Microphone"
                              >
                                Mute Mic 🔇
                              </button>
                            )}

                            {participant.isHandRaised && (
                              <button
                                type="button"
                                onClick={() => handleAction("LOWER_HAND", { studentId: student.id })}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                                title="Lower Hand"
                              >
                                Lower Hand ✋
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleAction("DISMISS_STUDENT", { studentId: student.id })}
                              className="px-2.5 py-1 rounded-lg bg-[#06101D] hover:bg-rose-950/40 border border-[#162942] hover:border-rose-500/30 text-[#94A3B8] hover:text-rose-300 text-[11px] transition-colors cursor-pointer"
                              title="Disconnect Student"
                            >
                              Dismiss
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAction("PING_ABSENT")}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Send Call Ping 🔔
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748B] text-xs">
                    No candidates match the selected filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Studio Configuration & Live Moderation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stream Settings & Poll Creator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Session Configuration */}
          <div className="p-6 rounded-3xl bg-[#081827] border border-[#162942] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#162942] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Settings className="w-4 h-4 text-[#41D8FF]" />
                <span>Live Lecture Metadata & Dataset Attacher</span>
              </div>
              <span className="text-[11px] text-[#64748B]">Updates live across all student tabs</span>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#CBD5E1] font-semibold">Live Lecture Title *</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g. Mastering Real-Time SQL Queries & Window Functions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#CBD5E1] font-semibold">Lead Instructor Name</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#CBD5E1] font-semibold">Attached Practice Dataset</label>
                  <div className="relative">
                    <Download className="w-4 h-4 text-[#41D8FF] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      placeholder="e.g. swiggy_orders_dataset.csv"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#CBD5E1] font-semibold">Session Agenda & Description</label>
                <textarea
                  value={streamDesc}
                  onChange={(e) => setStreamDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#06101D] border border-[#162942] text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="cyan" size="sm" type="submit" disabled={isUpdating} className="font-bold">
                  Broadcast Metadata Changes 🚀
                </Button>
              </div>
            </form>
          </div>

          {/* Interactive Poll Controller */}
          <div className="p-6 rounded-3xl bg-[#081827] border border-[#162942] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#162942] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Live Interactive Poll Broadcaster</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPollModalOpen(true)}
                className="text-xs font-bold border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Create New Poll
              </Button>
            </div>

            {liveState?.activePoll && liveState.activePoll.isActive ? (
              <div className="p-4 rounded-2xl bg-[#06101D] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    Live Active Poll ({liveState.activePoll.totalVotes} Votes Received)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAction("END_POLL")}
                    className="text-xs text-rose-400 hover:underline font-semibold cursor-pointer"
                  >
                    Close Poll
                  </button>
                </div>

                <p className="text-xs font-bold text-white">{liveState.activePoll.question}</p>

                <div className="space-y-2 pt-1">
                  {liveState.activePoll.options.map((opt: any) => {
                    const pct = liveState.activePoll.totalVotes > 0
                      ? Math.round((opt.votes / liveState.activePoll.totalVotes) * 100)
                      : 0;

                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex justify-between text-xs text-[#94A3B8]">
                          <span>{opt.text}</span>
                          <span className="font-mono text-amber-300 font-bold">{opt.votes} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#081827] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-[#64748B] text-xs bg-[#06101D] rounded-2xl border border-[#162942]">
                No active poll broadcasting right now. Click <strong>+ Create New Poll</strong> to engage students.
              </div>
            )}
          </div>

          {/* Classroom Pinned Notice */}
          <div className="p-6 rounded-3xl bg-[#081827] border border-[#162942] space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#162942] pb-3">
              <Pin className="w-4 h-4 text-purple-400" />
              <span>Broadcast Classroom Announcement</span>
            </div>

            <form onSubmit={handlePinNotice} className="flex gap-2">
              <input
                type="text"
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                placeholder="e.g. 📢 Assignment 2 on Window Functions will be released at 11:30 AM!"
                className="flex-1 px-3.5 py-2 bg-[#06101D] border border-[#162942] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-400"
              />
              <Button variant="primary" size="sm" type="submit" className="font-bold">
                Pin Announcement
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Student Q&A Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-[#081827] border border-[#162942] shadow-2xl flex flex-col h-[650px] overflow-hidden">
            <div className="p-4 px-5 border-b border-[#162942] flex items-center justify-between bg-[#06101D]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Student Q&A Feed</span>
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">
                {liveState?.chatMessages?.length || 0} Messages
              </span>
            </div>

            {/* Chat List */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {liveState?.chatMessages?.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.isInstructor
                      ? "bg-rose-950/40 border border-rose-500/40 text-rose-100 ml-3"
                      : "bg-[#06101D] border border-[#162942] text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${m.isInstructor ? "text-rose-400 font-mono" : "text-[#41D8FF]"}`}>
                      {m.sender}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">{m.time}</span>
                  </div>
                  <p className="text-[#CBD5E1]">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Instructor Reply Box */}
            <form onSubmit={handleSendInstructorChat} className="p-3 border-t border-[#162942] bg-[#06101D] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Broadcast reply to all students as Instructor..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#081827] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Create Live Poll */}
      {isPollModalOpen && (
        <Modal
          isOpen={isPollModalOpen}
          onClose={() => setIsPollModalOpen(false)}
          title="Create & Broadcast Live Interactive Poll"
          description="Ask all connected students a multiple-choice question in real-time."
          maxWidth="md"
        >
          <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#CBD5E1]">Question Title *</label>
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which window function retains duplicate ties without skipping numbers?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#06101D] border border-[#162942] text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-[#CBD5E1]">Answer Choices (At least 2 required) *</label>
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...pollOptions];
                    updated[idx] = e.target.value;
                    setPollOptions(updated);
                  }}
                  placeholder={`Option ${idx + 1} (e.g. ${idx === 0 ? "DENSE_RANK()" : idx === 1 ? "RANK()" : "ROW_NUMBER()"} )`}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#06101D] border border-[#162942] text-white text-xs focus:outline-none focus:border-amber-400"
                />
              ))}
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsPollModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="cyan" size="sm" type="submit" className="font-bold">
                Launch Live Poll 📊
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
