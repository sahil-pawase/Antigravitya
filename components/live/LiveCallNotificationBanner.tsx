"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Radio,
  Video,
  PhoneCall,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Users,
  ChevronRight,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Clock,
  Hand,
} from "lucide-react";

export function LiveCallNotificationBanner() {
  const pathname = usePathname();
  const [liveState, setLiveState] = useState<{
    isLive: boolean;
    title: string;
    instructor: string;
    instructorTitle: string;
    viewers: number;
    activeAttendanceCheck?: {
      id: string;
      isActive: boolean;
      promptTitle: string;
      startedAt: string;
      totalPresentCount: number;
      markedStudents?: Record<string, any>;
    } | null;
    activePings?: Array<{
      id: string;
      targetStudentId?: string | null;
      targetStudentName?: string | null;
      targetStudentEmail?: string | null;
      instructorName: string;
      streamTitle: string;
      message: string;
      timestamp: string;
      expiresAt: number;
    }>;
  } | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [markedAttendanceTime, setMarkedAttendanceTime] = useState<string | null>(null);

  const prevIsLiveRef = useRef<boolean>(false);
  const prevPingIdRef = useRef<string | null>(null);
  const prevAttendanceIdRef = useRef<string | null>(null);

  // Play pleasant incoming live call chime using Web Audio API
  const playIncomingCallChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Zoom-like 3-note melodic incoming call chime (E5 -> G#5 -> B5)
      playTone(659.25, 0.0, 0.4);
      playTone(830.61, 0.22, 0.4);
      playTone(987.77, 0.45, 0.7);
    } catch (e) {
      console.warn("Chime playback error:", e);
    }
  };

  const checkLiveStatus = async () => {
    try {
      const res = await fetch("/api/live-class");
      const data = await res.json();
      if (data.success && data.state) {
        const state = data.state;
        let userId = currentUserId;
        let userName = currentUserName;

        if (data.user) {
          userId = data.user.id;
          userName = data.user.fullName;
          setCurrentUserId(userId);
          setCurrentUserName(userName);
        }

        setLiveState({
          isLive: state.isLive,
          title: state.title || "Live Mentorship Session",
          instructor: state.instructor || "Lead Analytics Instructor",
          instructorTitle: state.instructorTitle || "Lead Analytics Architect",
          viewers: state.viewers || 74,
          activeAttendanceCheck: state.activeAttendanceCheck || null,
          activePings: state.activePings || [],
        });

        // 1. Check if Attendance Check is currently active
        const att = state.activeAttendanceCheck;
        if (att && att.isActive) {
          const markedList = Object.values(att.markedStudents || {});
          const isMarked = markedList.some(
            (m: any) =>
              (userId && m.studentId === userId) ||
              (userName && m.studentName?.toLowerCase() === userName.toLowerCase()) ||
              (userName && userName.toLowerCase().includes(m.studentName?.toLowerCase() || "___"))
          );

          if (isMarked) {
            const rec: any = markedList.find(
              (m: any) =>
                (userId && m.studentId === userId) ||
                (userName && m.studentName?.toLowerCase() === userName.toLowerCase())
            );
            setMarkedAttendanceTime(rec?.markedAt || "Present");
          } else {
            setMarkedAttendanceTime(null);
          }

          // Trigger attention sound and un-dismiss if new attendance check
          if (att.id !== prevAttendanceIdRef.current) {
            setIsDismissed(false);
            playIncomingCallChime();
            prevAttendanceIdRef.current = att.id;
          }
        } else {
          setMarkedAttendanceTime(null);
        }

        // 2. If newly went live, ring chime and un-dismiss
        if (state.isLive && !prevIsLiveRef.current) {
          setIsDismissed(false);
          playIncomingCallChime();
        }

        // 3. Check if there's a new ping targeted to this student or broadcast
        const latestPing = (state.activePings || [])[0];
        if (latestPing && latestPing.id !== prevPingIdRef.current) {
          const isTargeted =
            !latestPing.targetStudentId ||
            latestPing.targetStudentId === userId ||
            (userName && latestPing.targetStudentName?.toLowerCase().includes(userName.toLowerCase())) ||
            (userName && userName.toLowerCase().includes(latestPing.targetStudentName?.toLowerCase() || ""));

          if (isTargeted) {
            setIsDismissed(false);
            playIncomingCallChime();
          }
          prevPingIdRef.current = latestPing.id;
        }

        prevIsLiveRef.current = state.isLive;
      }
    } catch (e) {
      // Quiet fail
    }
  };

  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 2500);

    // Cross-tab broadcast listener
    try {
      const channel = new BroadcastChannel("career_transformer_zoom_room");
      channel.onmessage = (event) => {
        const type = event.data?.type;
        if (
          type === "STREAM_STARTED" ||
          type === "INSTRUCTOR_PING" ||
          type === "ATTENDANCE_CHECK_TRIGGERED" ||
          type === "ATTENDANCE_CHECK_CLOSED" ||
          type === "STREAM_UPDATED"
        ) {
          checkLiveStatus();
        }
      };
      return () => {
        clearInterval(interval);
        channel.close();
      };
    } catch (e) {
      return () => clearInterval(interval);
    }
  }, [currentUserId, currentUserName]);

  // Handle student marking attendance directly from banner
  const handleMarkAttendance = async () => {
    setIsMarkingAttendance(true);
    try {
      const res = await fetch("/api/live-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ATTENDANCE" }),
      });
      const data = await res.json();
      if (data.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMarkedAttendanceTime(timeStr);
        // Broadcast across tabs
        try {
          const channel = new BroadcastChannel("career_transformer_zoom_room");
          channel.postMessage({ type: "STREAM_UPDATED" });
          channel.close();
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Failed to mark attendance", e);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  // Do not show floating notification banner if already inside the live room page
  if (pathname === "/dashboard/live" || pathname === "/admin/live") {
    return null;
  }

  // If no live stream is active or user closed it
  if (!liveState?.isLive || isDismissed) {
    return null;
  }

  const isAttendanceActive = !!liveState.activeAttendanceCheck?.isActive;
  const latestActivePing = (liveState.activePings || [])[0];
  const hasActivePing = !!latestActivePing;

  return (
    <>
      {/* 1. Global Top Floating Alert Header */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-bounce-short">
        <div
          className={`p-3.5 sm:p-4 px-4 sm:px-5 rounded-2xl bg-[#06101D]/95 backdrop-blur-xl border ${
            isAttendanceActive && !markedAttendanceTime
              ? "border-emerald-400/90 shadow-2xl shadow-emerald-950/90 ring-2 ring-emerald-400/50"
              : hasActivePing
              ? "border-amber-400/80 shadow-2xl shadow-amber-950/90 ring-2 ring-amber-400/50"
              : "border-rose-500/50 shadow-2xl shadow-rose-950/80 ring-2 ring-rose-500/30"
          } flex items-center justify-between gap-3 text-xs`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated Ringing Radar Icon */}
            <div className="relative flex-shrink-0">
              <span
                className={`absolute -inset-1 rounded-xl ${
                  isAttendanceActive && !markedAttendanceTime
                    ? "bg-emerald-400/40"
                    : hasActivePing
                    ? "bg-amber-400/40"
                    : "bg-rose-500/30"
                } animate-ping`}
              />
              <div
                className={`relative w-10 h-10 rounded-xl bg-gradient-to-tr ${
                  isAttendanceActive && !markedAttendanceTime
                    ? "from-emerald-500 to-teal-600 shadow-emerald-600/40"
                    : hasActivePing
                    ? "from-amber-500 to-orange-600 shadow-amber-600/40"
                    : "from-rose-600 to-pink-600 shadow-rose-600/40"
                } flex items-center justify-center text-white shadow-lg`}
              >
                {isAttendanceActive ? (
                  <CheckCircle2 className="w-5 h-5 animate-pulse" />
                ) : (
                  <Radio className="w-5 h-5 animate-pulse" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    isAttendanceActive && !markedAttendanceTime
                      ? "bg-emerald-400 text-black font-black"
                      : isAttendanceActive && markedAttendanceTime
                      ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold"
                      : hasActivePing
                      ? "bg-amber-400 text-black font-extrabold"
                      : "bg-rose-500 text-white font-extrabold"
                  } text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {isAttendanceActive && !markedAttendanceTime
                    ? "📋 ATTENDANCE CHECK REQUESTED"
                    : isAttendanceActive && markedAttendanceTime
                    ? `✅ ATTENDANCE VERIFIED (${markedAttendanceTime})`
                    : hasActivePing
                    ? "🔔 INSTRUCTOR CALL PING"
                    : "🔴 LIVE CALL STARTED"}
                </span>
                <span className="text-[10px] text-amber-200 font-mono hidden sm:inline">
                  Instructor {liveState.instructor}
                </span>
              </div>
              <p className="text-white font-bold text-xs truncate max-w-xs sm:max-w-md">
                {isAttendanceActive && !markedAttendanceTime
                  ? `📢 ${liveState.instructor} is taking live attendance! Click "Mark Present" now.`
                  : isAttendanceActive && markedAttendanceTime
                  ? `You are verified present in "${liveState.title}".`
                  : hasActivePing
                  ? latestActivePing.message
                  : liveState.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick 1-Click Mark Present Button if Attendance Active */}
            {isAttendanceActive && !markedAttendanceTime ? (
              <button
                type="button"
                onClick={handleMarkAttendance}
                disabled={isMarkingAttendance}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs shadow-lg shadow-emerald-500/40 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer animate-pulse"
              >
                <Hand className="w-3.5 h-3.5 fill-black" />
                <span>{isMarkingAttendance ? "Marking..." : "Mark Present ✋"}</span>
              </button>
            ) : null}

            {/* Join Call Button */}
            <Link
              href="/dashboard/live"
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${
                isAttendanceActive && !markedAttendanceTime
                  ? "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/40"
                  : hasActivePing
                  ? "from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-amber-500/40"
                  : "from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-600/40"
              } font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer`}
            >
              <PhoneCall
                className={`w-3.5 h-3.5 ${
                  hasActivePing && !isAttendanceActive ? "fill-black" : "fill-white"
                } animate-bounce`}
              />
              <span>{isAttendanceActive && !markedAttendanceTime ? "Join & View 🚀" : "Join Call Now 🚀"}</span>
            </Link>

            {/* Sound Chime Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) playIncomingCallChime();
              }}
              className="p-2 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute Ringtone" : "Mute Ringtone"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-2 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title="Minimize Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Floating Bottom Right Live Call Widget (When dismissed or minimized) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/dashboard/live"
          className={`p-3.5 px-4 rounded-2xl bg-[#081827]/95 backdrop-blur-xl border ${
            isAttendanceActive && !markedAttendanceTime
              ? "border-emerald-400/80 shadow-emerald-950/80 ring-1 ring-emerald-400/40"
              : hasActivePing
              ? "border-amber-400/60 shadow-amber-950/80"
              : "border-rose-500/40 shadow-rose-950/80"
          } shadow-2xl flex items-center gap-3 text-xs text-white hover:scale-105 transition-all group cursor-pointer`}
        >
          <div className="relative">
            <span
              className={`absolute -inset-1 rounded-full ${
                isAttendanceActive && !markedAttendanceTime
                  ? "bg-emerald-400/40"
                  : hasActivePing
                  ? "bg-amber-400/40"
                  : "bg-rose-500/40"
              } animate-ping`}
            />
            <div
              className={`relative w-8 h-8 rounded-xl bg-gradient-to-tr ${
                isAttendanceActive && !markedAttendanceTime
                  ? "from-emerald-500 to-teal-600"
                  : hasActivePing
                  ? "from-amber-500 to-orange-600"
                  : "from-rose-600 to-pink-600"
              } flex items-center justify-center text-white`}
            >
              {isAttendanceActive ? <CheckCircle2 className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-left">
            <span
              className={`text-[10px] ${
                isAttendanceActive && !markedAttendanceTime
                  ? "text-emerald-400 font-black"
                  : hasActivePing
                  ? "text-amber-400 font-extrabold"
                  : "text-rose-400 font-extrabold"
              } uppercase tracking-wider block`}
            >
              {isAttendanceActive && !markedAttendanceTime
                ? "📋 Attendance Check Active"
                : hasActivePing
                ? "🔔 Instructor Pinged You"
                : "🔴 Live Meeting Active"}
            </span>
            <span className="font-bold text-xs text-white block max-w-[140px] truncate">
              {liveState.title}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </>
  );
}
