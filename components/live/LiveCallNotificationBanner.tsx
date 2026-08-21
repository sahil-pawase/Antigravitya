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
  Send,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Clock,
  Hand,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

interface ActiveLiveSessionData {
  id: string;
  hostId: string;
  hostName: string;
  department: string;
  departmentId: string;
  title: string;
  description?: string | null;
  targetType?: string;
  targetLabel?: string;
  sessionType?: "LIVE_NOW" | "INVITATION_REQUEST";
  status: string;
  startedAt: string;
  datasetName?: string | null;
  datasetUrl?: string | null;
  viewers?: number;
}

export function LiveCallNotificationBanner() {
  const pathname = usePathname();
  const [liveSession, setLiveSession] = useState<ActiveLiveSessionData | null>(null);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [markedAttendanceTime, setMarkedAttendanceTime] = useState<string | null>(null);
  const [activeAttendanceCheck, setActiveAttendanceCheck] = useState<any>(null);

  const prevSessionIdRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play pleasant chime
  const playIncomingCallChime = (isInvite: boolean = false) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      if (isInvite) {
        // Subtle chime for invitation (C5 -> G5)
        playTone(523.25, 0.0, 0.4);
        playTone(783.99, 0.25, 0.6);
      } else {
        // Melodic pattern for live call (E5 -> G#5 -> B5 -> E6)
        playTone(659.25, 0.0, 0.35);
        playTone(830.61, 0.18, 0.35);
        playTone(987.77, 0.36, 0.45);
        playTone(1318.51, 0.55, 0.7);
      }
    } catch (e) {
      console.warn("Chime playback error:", e);
    }
  };

  const checkDepartmentLiveStatus = async () => {
    try {
      const res = await fetch("/api/live/active");
      if (!res.ok) return;
      const data = await res.json();

      setUserDepartment(data.userDepartment || null);

      if (data.isLive && data.liveSession) {
        const session = data.liveSession;

        if (session.id !== prevSessionIdRef.current) {
          prevSessionIdRef.current = session.id;
          if (!data.isDismissed) {
            setIsDismissed(false);
            playIncomingCallChime(session.sessionType === "INVITATION_REQUEST");
          } else {
            setIsDismissed(true);
          }
        }

        setLiveSession(session);
      } else {
        setLiveSession(null);
        prevSessionIdRef.current = null;
      }

      // Check attendance
      try {
        const lcRes = await fetch("/api/live-class");
        const lcData = await lcRes.json();
        if (lcData.success && lcData.state?.activeAttendanceCheck) {
          setActiveAttendanceCheck(lcData.state.activeAttendanceCheck);
        } else {
          setActiveAttendanceCheck(null);
        }
      } catch (e) {}
    } catch (e) {}
  };

  useEffect(() => {
    checkDepartmentLiveStatus();
    const interval = setInterval(checkDepartmentLiveStatus, 2500);

    try {
      const channel = new BroadcastChannel("career_transformer_zoom_room");
      channel.onmessage = (event) => {
        const type = event.data?.type;
        if (
          type === "STREAM_STARTED" ||
          type === "STREAM_UPDATED" ||
          type === "INSTRUCTOR_PING" ||
          type === "ATTENDANCE_CHECK_TRIGGERED" ||
          type === "ATTENDANCE_CHECK_CLOSED"
        ) {
          checkDepartmentLiveStatus();
        }
      };
      return () => {
        clearInterval(interval);
        channel.close();
      };
    } catch (e) {
      return () => clearInterval(interval);
    }
  }, []);

  const handleDismiss = async () => {
    setIsDismissed(true);
    if (liveSession?.id) {
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            liveSessionId: liveSession.id,
            action: "DISMISS",
          }),
        });
      } catch (e) {}
    }
  };

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
      }
    } catch (e) {
      console.warn("Failed to mark attendance", e);
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  if (pathname === "/dashboard/live" || pathname === "/admin/live") {
    return null;
  }

  if (!liveSession) {
    return null;
  }

  const isAttendanceActive = !!activeAttendanceCheck?.isActive;
  const isInvite = liveSession.sessionType === "INVITATION_REQUEST";
  const targetLabel = liveSession.targetLabel || liveSession.department;

  return (
    <>
      {/* 1. Global Call-Style Floating Alert Header */}
      {!isDismissed && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-bounce-short">
          <div
            className={`p-3.5 sm:p-4 px-4 sm:px-5 rounded-2xl bg-[#06101D]/95 backdrop-blur-xl border ${
              isAttendanceActive && !markedAttendanceTime
                ? "border-emerald-400/90 shadow-2xl shadow-emerald-950/90 ring-2 ring-emerald-400/50"
                : isInvite
                ? "border-cyan-400/80 shadow-2xl shadow-cyan-950/90 ring-2 ring-cyan-400/40"
                : "border-rose-500/60 shadow-2xl shadow-rose-950/90 ring-2 ring-rose-500/40"
            } flex items-center justify-between gap-3 text-xs`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Ringing / Beacon Icon */}
              <div className="relative flex-shrink-0">
                <span
                  className={`absolute -inset-1 rounded-xl ${
                    isAttendanceActive && !markedAttendanceTime
                      ? "bg-emerald-400/40"
                      : isInvite
                      ? "bg-cyan-400/40"
                      : "bg-rose-500/40"
                  } animate-ping`}
                />
                <div
                  className={`relative w-11 h-11 rounded-xl bg-gradient-to-tr ${
                    isAttendanceActive && !markedAttendanceTime
                      ? "from-emerald-500 to-teal-600 shadow-emerald-600/40"
                      : isInvite
                      ? "from-cyan-500 to-blue-600 shadow-cyan-600/40"
                      : "from-rose-600 to-pink-600 shadow-rose-600/50"
                  } flex items-center justify-center text-white shadow-lg`}
                >
                  {isInvite ? (
                    <Send className="w-5 h-5" />
                  ) : (
                    <Radio className="w-5 h-5 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {isInvite ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-black font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                      📢 LIVE SESSION INVITATION
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      🔴 LIVE SESSION
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-full bg-[#0C1A2B] text-amber-300 border border-[#162942] text-[10px] font-bold">
                    🎯 {targetLabel}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono hidden sm:inline">
                    Host: {liveSession.hostName}
                  </span>
                </div>
                <p className="text-white font-extrabold text-xs truncate max-w-xs sm:max-w-md">
                  {isInvite
                    ? `${liveSession.hostName} wants to start a live session: "${liveSession.title}"`
                    : `${liveSession.hostName} has started a live session: "${liveSession.title}"`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mark Attendance Shortcut */}
              {isAttendanceActive && !markedAttendanceTime && (
                <button
                  type="button"
                  onClick={handleMarkAttendance}
                  disabled={isMarkingAttendance}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs shadow-lg shadow-emerald-500/40 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer animate-pulse"
                >
                  <Hand className="w-3.5 h-3.5 fill-black" />
                  <span>{isMarkingAttendance ? "Marking..." : "Mark Present ✋"}</span>
                </button>
              )}

              {/* JOIN / ACCEPT Button */}
              <Link
                href="/dashboard/live"
                className={`px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer ${
                  isInvite
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-600/40"
                    : "bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 shadow-rose-600/40"
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 fill-white animate-bounce" />
                <span>{isInvite ? "ACCEPT / JOIN 🚀" : "JOIN LIVE 🚀"}</span>
              </Link>

              {/* Sound Ringtone Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isMuted) playIncomingCallChime(isInvite);
                }}
                className="p-2 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute Ringtone" : "Mute Ringtone"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* DISMISS / IGNORE Button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="p-2 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title={isInvite ? "Ignore Invitation" : "Dismiss Notification"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Bottom Right Live Call Widget (When dismissed or minimized) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/dashboard/live"
          className="p-3.5 px-4 rounded-2xl bg-[#081827]/95 backdrop-blur-xl border border-rose-500/50 shadow-2xl shadow-rose-950/80 ring-1 ring-rose-500/30 flex items-center gap-3 text-xs text-white hover:scale-105 transition-all group cursor-pointer"
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider block">
              🔴 Live Session ({targetLabel})
            </span>
            <span className="font-bold text-xs text-white block max-w-[160px] truncate">
              {liveSession.title}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </>
  );
}
