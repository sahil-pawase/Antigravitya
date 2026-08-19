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
} from "lucide-react";

export function LiveCallNotificationBanner() {
  const pathname = usePathname();
  const [liveState, setLiveState] = useState<{
    isLive: boolean;
    title: string;
    instructor: string;
    instructorTitle: string;
    viewers: number;
  } | null>(null);

  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPlayedChime, setHasPlayedChime] = useState(false);
  const prevIsLiveRef = useRef<boolean>(false);

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
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Zoom-like 3-note melodic incoming call chime (E5 -> G#5 -> B5)
      playTone(659.25, 0.0, 0.4);
      playTone(830.61, 0.25, 0.4);
      playTone(987.77, 0.5, 0.7);
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
        setLiveState({
          isLive: state.isLive,
          title: state.title || "Live Mentorship Session",
          instructor: state.instructor || "Lead Analytics Instructor",
          instructorTitle: state.instructorTitle || "Lead Analytics Architect",
          viewers: state.viewers || 74,
        });

        // If newly went live, ring chime and un-dismiss
        if (state.isLive && !prevIsLiveRef.current) {
          setIsDismissed(false);
          playIncomingCallChime();
        }

        prevIsLiveRef.current = state.isLive;
      }
    } catch (e) {
      // Quiet fail
    }
  };

  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 4000);

    // Cross-tab broadcast listener
    try {
      const channel = new BroadcastChannel("career_transformer_zoom_room");
      channel.onmessage = (event) => {
        if (event.data?.type === "STREAM_STARTED") {
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
  }, []);

  // Do not show floating notification banner if already inside the live room page
  if (pathname === "/dashboard/live" || pathname === "/admin/live") {
    return null;
  }

  // If no live stream is active or user closed it
  if (!liveState?.isLive || isDismissed) {
    return null;
  }

  return (
    <>
      {/* 1. Global Top Floating Alert Header */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-bounce-short">
        <div className="p-3 sm:p-3.5 px-4 sm:px-5 rounded-2xl bg-[#06101D]/95 backdrop-blur-xl border border-rose-500/50 shadow-2xl shadow-rose-950/80 flex items-center justify-between gap-3 text-xs ring-2 ring-rose-500/30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Animated Ringing Radar Icon */}
            <div className="relative flex-shrink-0">
              <span className="absolute -inset-1 rounded-xl bg-rose-500/30 animate-ping" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE CALL STARTED
                </span>
                <span className="text-[10px] text-rose-300 font-mono hidden sm:inline">
                  Hosted by {liveState.instructor}
                </span>
              </div>
              <p className="text-white font-bold text-xs truncate max-w-xs sm:max-w-md">
                {liveState.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Join Call Button */}
            <Link
              href="/dashboard/live"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/40 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-white animate-bounce" />
              <span>Join Call 🚀</span>
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
          className="p-3.5 px-4 rounded-2xl bg-[#081827]/95 backdrop-blur-xl border border-rose-500/40 shadow-2xl shadow-rose-950/80 flex items-center gap-3 text-xs text-white hover:border-rose-400 hover:scale-105 transition-all group cursor-pointer"
        >
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center text-white">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider block">
              🔴 Live Meeting Active
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
