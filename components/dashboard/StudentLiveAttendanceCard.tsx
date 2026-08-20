"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Hand,
  Users,
  ChevronRight,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/ui/Button";

interface StudentLiveAttendanceCardProps {
  currentUserId?: string;
  currentUserName?: string;
}

export function StudentLiveAttendanceCard({
  currentUserId,
  currentUserName,
}: StudentLiveAttendanceCardProps) {
  const [liveState, setLiveState] = useState<any>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [markedTime, setMarkedTime] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      const res = await fetch("/api/live-class");
      const data = await res.json();
      if (data.success && data.state) {
        setLiveState(data.state);

        const att = data.state.activeAttendanceCheck;
        if (att && att.isActive) {
          const markedList = Object.values(att.markedStudents || {});
          const isMarked = markedList.some(
            (m: any) =>
              (currentUserId && m.studentId === currentUserId) ||
              (currentUserName && m.studentName?.toLowerCase() === currentUserName.toLowerCase()) ||
              (currentUserName && currentUserName.toLowerCase().includes(m.studentName?.toLowerCase() || "___"))
          );

          if (isMarked) {
            const rec: any = markedList.find(
              (m: any) =>
                (currentUserId && m.studentId === currentUserId) ||
                (currentUserName && m.studentName?.toLowerCase() === currentUserName.toLowerCase())
            );
            setMarkedTime(rec?.markedAt || "Present");
          } else {
            setMarkedTime(null);
          }
        } else {
          setMarkedTime(null);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 2500);

    try {
      const channel = new BroadcastChannel("career_transformer_zoom_room");
      channel.onmessage = (event) => {
        if (
          event.data?.type === "STREAM_STARTED" ||
          event.data?.type === "ATTENDANCE_CHECK_TRIGGERED" ||
          event.data?.type === "ATTENDANCE_CHECK_CLOSED" ||
          event.data?.type === "INSTRUCTOR_PING" ||
          event.data?.type === "STREAM_UPDATED"
        ) {
          fetchState();
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

  const handleMarkAttendance = async () => {
    setIsMarking(true);
    try {
      const res = await fetch("/api/live-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ATTENDANCE" }),
      });
      const data = await res.json();
      if (data.success) {
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMarkedTime(timeStr);
        try {
          const channel = new BroadcastChannel("career_transformer_zoom_room");
          channel.postMessage({ type: "STREAM_UPDATED" });
          channel.close();
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Failed to mark attendance:", e);
    } finally {
      setIsMarking(false);
    }
  };

  if (!liveState?.isLive && !liveState?.activeAttendanceCheck?.isActive) {
    return null;
  }

  const isAttendanceActive = !!liveState?.activeAttendanceCheck?.isActive;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-2xl ${
        isAttendanceActive && !markedTime
          ? "bg-gradient-to-r from-[#061e16] via-[#081827] to-[#061e16] border-emerald-500/50 ring-2 ring-emerald-400/40 shadow-emerald-950/60"
          : isAttendanceActive && markedTime
          ? "bg-gradient-to-r from-[#061e16]/80 via-[#081827] to-[#081827] border-emerald-500/30 shadow-lg"
          : "bg-gradient-to-r from-[#1a0814] via-[#081827] to-[#081827] border-rose-500/30 shadow-rose-950/40"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isAttendanceActive ? (
              <span
                className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                  markedTime
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-emerald-400 text-black shadow-lg shadow-emerald-500/30 animate-pulse"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {markedTime ? `ATTENDANCE VERIFIED (${markedTime})` : "📋 LIVE ATTENDANCE REQUEST ACTIVE"}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                STREAMING LIVE NOW
              </span>
            )}

            <span className="text-xs text-[#94A3B8] font-mono flex items-center gap-1">
              <Users className="w-3 h-3 text-[#41D8FF]" />
              {liveState.viewers || 1} Connected in Class
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {liveState.title || "Live Cohort Interactive Masterclass"}
          </h2>

          <p className="text-xs sm:text-sm text-[#94A3B8]">
            {isAttendanceActive && !markedTime
              ? `📢 Instructor ${liveState.instructor || "Sahil Pawase"} has opened the attendance verification window for your cohort. Please mark your attendance now.`
              : isAttendanceActive && markedTime
              ? `✅ Great job! Your attendance was verified and recorded at ${markedTime} by Instructor ${liveState.instructor || "Sahil Pawase"}.`
              : `Instructor ${liveState.instructor || "Sahil Pawase"} is conducting the live interactive lecture. Click to join the Zoom WebRTC classroom.`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          {isAttendanceActive && !markedTime && (
            <Button
              type="button"
              onClick={handleMarkAttendance}
              disabled={isMarking}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all cursor-pointer animate-pulse"
            >
              <Hand className="w-4 h-4 mr-1.5 fill-black" />
              {isMarking ? "Marking..." : "Mark Present ✋"}
            </Button>
          )}

          {isAttendanceActive && markedTime && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Marked Present ({markedTime})</span>
            </div>
          )}

          <Link href="/dashboard/live">
            <Button
              variant="cyan"
              size="lg"
              className="font-extrabold shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 mr-1.5" />
              Join Live Class 🚀
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
