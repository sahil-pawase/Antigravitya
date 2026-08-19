"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  Users,
  MessageSquare,
  HelpCircle,
  Maximize2,
  Minimize2,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Grid,
  Square,
  Play,
  Share2,
  Download,
  AlertCircle,
  CheckCircle2,
  Camera,
  Film,
} from "lucide-react";
import { Button } from "@/ui/Button";

interface ZoomLiveRoomProps {
  mode: "instructor" | "student";
  streamTitle: string;
  instructorName: string;
  instructorTitle?: string;
  viewersCount?: number;
  datasetName?: string;
  onDownloadDataset?: () => void;
  onOpenPoll?: () => void;
  onToggleChat?: () => void;
}

export function ZoomLiveRoom({
  mode = "student",
  streamTitle,
  instructorName,
  instructorTitle = "Lead Analytics Architect",
  viewersCount = 74,
  datasetName = "swiggy_orders_dataset.csv",
  onDownloadDataset,
  onOpenPoll,
  onToggleChat,
}: ZoomLiveRoomProps) {
  // Device & Stream States
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMutedSpeaker, setIsMutedSpeaker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"speaker" | "gallery">("speaker");
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(1340); // 22 mins
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [handRaiseNotice, setHandRaiseNotice] = useState<string | null>(null);

  // Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const roomContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // BroadcastChannel for cross-tab sync
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Callback ref to guarantee stream is attached whenever video element mounts
  const setLocalVideo = (el: HTMLVideoElement | null) => {
    localVideoRef.current = el;
    if (el && mediaStreamRef.current) {
      if (el.srcObject !== mediaStreamRef.current) {
        el.srcObject = mediaStreamRef.current;
        el.play().catch((e) => console.warn("Video play error:", e));
      }
    }
  };

  const setScreenVideo = (el: HTMLVideoElement | null) => {
    screenVideoRef.current = el;
    if (el && screenStreamRef.current) {
      if (el.srcObject !== screenStreamRef.current) {
        el.srcObject = screenStreamRef.current;
        el.play().catch((e) => console.warn("Screen video play error:", e));
      }
    }
  };

  const sendReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: 10 + Math.random() * 80,
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "REACTION",
        emoji,
      });
    }
  };

  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    if (next) {
      setHandRaiseNotice("✋ You raised your hand! The instructor will invite you to speak.");
      setTimeout(() => setHandRaiseNotice(null), 4000);
    }
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "HAND_RAISE",
        isRaised: next,
        studentName: mode === "student" ? "Student" : instructorName,
      });
    }
  };

  // Dynamic connected participants state
  const [liveParticipants, setLiveParticipants] = useState<any[]>([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel("career_transformer_zoom_room");
      channelRef.current.onmessage = (event) => {
        const { type, data, emoji, isRaised, studentName } = event.data || {};
        if (type === "INSTRUCTOR_STREAM_STATE" && mode === "student") {
          if (data?.isCameraOn !== undefined) setIsCameraOn(data.isCameraOn);
          if (data?.isScreenSharing !== undefined) setIsScreenSharing(data.isScreenSharing);
          if (data?.isMicOn !== undefined) setIsMicOn(data.isMicOn);
        } else if (type === "REACTION" && emoji) {
          const newReaction = {
            id: Date.now() + Math.random(),
            emoji,
            left: 10 + Math.random() * 80,
          };
          setReactions((prev) => [...prev, newReaction]);
          setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
          }, 2500);
        } else if (type === "HAND_RAISE" && mode === "instructor" && isRaised) {
          setHandRaiseNotice(`✋ ${studentName || "A student"} raised their hand to ask a question!`);
          setTimeout(() => setHandRaiseNotice(null), 5000);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported");
    }

    // Register Call Presence via API
    const joinCallApi = async () => {
      try {
        const res = await fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "JOIN_CALL",
            isCameraOn,
            isMicOn,
            isHandRaised,
          }),
        });
        const data = await res.json();
        if (data.success && data.state?.participants) {
          setLiveParticipants(data.state.participants);
        }
      } catch (e) {
        console.warn("Join call API error:", e);
      }
    };

    joinCallApi();

    // Heartbeat & Telemetry Sync Loop
    const heartbeatInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "HEARTBEAT",
            isCameraOn,
            isMicOn,
            isHandRaised,
            isSpeaking: isMicOn && audioLevel > 15,
          }),
        });
        const data = await res.json();
        if (data.success && data.state?.participants) {
          setLiveParticipants(data.state.participants);
        }
      } catch (e) {
        // Quiet heartbeat error
      }
    }, 4000);

    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeatInterval);
      stopMediaTracks();

      // Notify server of leave
      try {
        fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "LEAVE_CALL" }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}

      if (channelRef.current) channelRef.current.close();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode, isCameraOn, isMicOn, isHandRaised, audioLevel]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // 1. Toggle Camera (Webcam)
  const toggleCamera = async () => {
    setPermissionError(null);

    if (isCameraOn) {
      if (mediaStreamRef.current) {
        const videoTracks = mediaStreamRef.current.getVideoTracks();
        videoTracks.forEach((t) => {
          t.stop();
          mediaStreamRef.current?.removeTrack(t);
        });
      }
      setIsCameraOn(false);
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      broadcastState({ isCameraOn: false });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: isMicOn,
        });

        mediaStreamRef.current = stream;
        setIsCameraOn(true);
        broadcastState({ isCameraOn: true });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }

        if (isMicOn) {
          setupAudioAnalyser(stream);
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setPermissionError("Camera access denied or webcam in use by another application.");
      }
    }
  };

  // 2. Toggle Microphone
  const toggleMic = async () => {
    setPermissionError(null);

    if (isMicOn) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((t) => {
          t.enabled = false;
          t.stop();
        });
      }
      setIsMicOn(false);
      setAudioLevel(0);
      broadcastState({ isMicOn: false });
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (mediaStreamRef.current) {
          audioStream.getAudioTracks().forEach((t) => mediaStreamRef.current?.addTrack(t));
        } else {
          mediaStreamRef.current = audioStream;
        }

        setIsMicOn(true);
        setupAudioAnalyser(audioStream);
        broadcastState({ isMicOn: true });
      } catch (err: any) {
        console.error("Microphone access error:", err);
        setPermissionError("Microphone access denied. Please allow microphone permissions.");
      }
    }
  };

  // 3. Toggle Screen Share
  const toggleScreenShare = async () => {
    setPermissionError(null);

    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      broadcastState({ isScreenSharing: false });
    } else {
      try {
        const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = displayStream;
        setIsScreenSharing(true);
        broadcastState({ isScreenSharing: true });

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = displayStream;
          screenVideoRef.current.play().catch(() => {});
        }

        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          broadcastState({ isScreenSharing: false });
        };
      } catch (err: any) {
        console.error("Screen share error:", err);
        setPermissionError("Screen sharing was cancelled or not permitted.");
      }
    }
  };

  const setupAudioAnalyser = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn("Audio visualizer skipped", e);
    }
  };

  const broadcastState = (data: any) => {
    if (channelRef.current && mode === "instructor") {
      channelRef.current.postMessage({
        type: "INSTRUCTOR_STREAM_STATE",
        data,
      });
    }
  };

  const toggleFullscreen = () => {
    if (!roomContainerRef.current) return;
    if (!document.fullscreenElement) {
      roomContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const defaultParticipants = [
    { id: "inst-1", name: instructorName, role: "Host / Lead Architect", isSpeaking: isMicOn && audioLevel > 15, isSelf: mode === "instructor", isCameraOn, isMicOn, isHandRaised: false },
    { id: "stu-1", name: "Neha Gupta", role: "Student", isSpeaking: false, isSelf: false, isCameraOn: true, isMicOn: false, isHandRaised: false },
    { id: "stu-2", name: "Rohan Verma", role: "Student", isSpeaking: false, isSelf: false, isCameraOn: false, isMicOn: false, isHandRaised: true },
    { id: "stu-3", name: "Priya Sharma", role: "Student", isSpeaking: false, isSelf: false, isCameraOn: true, isMicOn: true, isHandRaised: false },
    { id: "stu-4", name: "Aarav Patel", role: "Teaching Assistant", isSpeaking: false, isSelf: false, isCameraOn: false, isMicOn: false, isHandRaised: false },
    { id: "stu-5", name: "Ananya Roy", role: "Student", isSpeaking: false, isSelf: false, isCameraOn: false, isMicOn: false, isHandRaised: false },
  ];

  const participants = liveParticipants.length > 0
    ? [
        { id: "inst-1", name: instructorName, role: "Host / Lead Architect", isSpeaking: isMicOn && audioLevel > 15, isSelf: mode === "instructor", isCameraOn, isMicOn, isHandRaised: false },
        ...liveParticipants.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role === "INSTRUCTOR" ? "Instructor" : "Student",
          isSpeaking: p.isSpeaking || false,
          isSelf: mode === "student" && p.role === "STUDENT",
          isCameraOn: p.isCameraOn,
          isMicOn: p.isMicOn,
          isHandRaised: p.isHandRaised,
        })),
      ]
    : defaultParticipants;

  return (
    <div
      ref={roomContainerRef}
      className="rounded-3xl bg-[#040911] border border-[#162942] overflow-hidden shadow-2xl relative flex flex-col justify-between select-none"
    >
      {/* 1. Top Zoom Header Bar */}
      <div className="p-3.5 px-5 bg-[#06101D]/90 backdrop-blur-md border-b border-[#162942] flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-extrabold text-xs tracking-wider text-rose-400 uppercase">
              LIVE MEETING ROOM
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>REC {formatTime(recordingSeconds)}</span>
          </div>

          <span className="text-xs text-white font-bold truncate max-w-xs sm:max-w-md">
            {streamTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout switcher */}
          <div className="flex items-center bg-[#081827] rounded-xl p-0.5 border border-[#162942]">
            <button
              type="button"
              onClick={() => setLayoutMode("speaker")}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                layoutMode === "speaker" ? "bg-[#397CFF] text-white" : "text-[#94A3B8] hover:text-white"
              }`}
              title="Speaker Spotlight View"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Speaker</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("gallery")}
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                layoutMode === "gallery" ? "bg-[#397CFF] text-white" : "text-[#94A3B8] hover:text-white"
              }`}
              title="Gallery Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Gallery</span>
            </button>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Device Status Live Diagnostic Bar */}
      <div className="p-2.5 px-5 bg-[#06101D] border-b border-[#162942] flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-3">
          {/* Camera Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
            isCameraOn
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isCameraOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            <Camera className="w-3.5 h-3.5" />
            <span>{isCameraOn ? "CAMERA: ON (1080p HD)" : "CAMERA: OFF"}</span>
          </div>

          {/* Microphone Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
            isMicOn
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20"
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMicOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
            {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
            <span>{isMicOn ? `MIC: ACTIVE (${audioLevel > 10 ? "Speaking" : "Quiet"})` : "MIC: MUTED"}</span>
          </div>

          {/* Screen Share Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
            isScreenSharing
              ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
              : "bg-slate-800/40 text-slate-400 border-slate-700/40"
          }`}>
            <Monitor className="w-3.5 h-3.5" />
            <span>{isScreenSharing ? "SCREEN: SHARING" : "SCREEN: OFF"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
          <span>Dolby Audio: Active</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Latency: 14ms</span>
        </div>
      </div>

      {/* Permission alert if error */}
      {permissionError && (
        <div className="p-3 px-5 bg-amber-500/10 border-b border-amber-500/30 text-amber-300 text-xs flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{permissionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setPermissionError(null)}
            className="text-[11px] underline hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Main Video Canvas Viewport */}
      <div className="aspect-video w-full bg-slate-950 relative flex items-center justify-center overflow-hidden">
        {/* VIEW 1: Screen Share is Active */}
        {isScreenSharing ? (
          <div className="w-full h-full relative flex items-center justify-center bg-black">
            <video
              ref={setScreenVideo}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Floating Instructor Camera PIP */}
            <div className="absolute bottom-4 right-4 w-48 sm:w-60 aspect-video rounded-2xl bg-[#081827] border-2 border-[#41D8FF]/60 shadow-2xl overflow-hidden z-20">
              <video
                ref={setLocalVideo}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
              />
              {!isCameraOn && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#06101D] text-center p-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center font-bold text-xs text-white mb-1 shadow-md">
                    {instructorName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] text-white font-bold">{instructorName}</span>
                  <span className="text-[8px] text-[#64748B]">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
                {instructorName}
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              <span>Screen Sharing Active (1080p 60fps)</span>
            </div>
          </div>
        ) : layoutMode === "gallery" ? (
          /* VIEW 2: Gallery Grid View (3x2 Matrix) */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 w-full h-full">
            {participants.map((p, idx) => (
              <div
                key={idx}
                className={`rounded-2xl bg-[#081827] border flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                  p.isSpeaking
                    ? "border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40"
                    : "border-[#162942]"
                }`}
              >
                {p.isSelf ? (
                  <>
                    <video
                      ref={setLocalVideo}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
                    />
                    {!isCameraOn && (
                      <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg">
                          <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center font-extrabold text-sm sm:text-base text-white">
                            {p.name.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-[#64748B] block">{p.role}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg">
                      <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center font-extrabold text-sm sm:text-base text-white">
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-[#64748B] block">{p.role}</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white">
                  {p.isSpeaking ? (
                    <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                  ) : (
                    <MicOff className="w-3 h-3 text-rose-400" />
                  )}
                  <span>{p.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VIEW 3: Speaker Spotlight View (Default) */
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Always mounted video element for zero lag and perfect stream binding */}
            <video
              ref={setLocalVideo}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
            />

            {/* Fallback Animated Host Card when Camera is Off */}
            {!isCameraOn && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-[#06101D] via-slate-950 to-[#081827] space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-1 shadow-2xl shadow-[#397CFF]/30">
                    <div className="w-full h-full bg-[#06101D] rounded-[22px] flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl">
                      {instructorName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  {isMicOn && audioLevel > 15 && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#06101D] flex items-center justify-center animate-bounce">
                      <Mic className="w-3.5 h-3.5 text-[#06101D]" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                    {instructorName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#41D8FF] font-medium font-mono">
                    {instructorTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    LIVE 1080P HD STREAM CONNECTED
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
                    Dolby Voice HD
                  </span>
                </div>
              </div>
            )}

            {/* Top Left Speaker Badge with Camera Status Icon */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#162942] text-xs text-white font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${isCameraOn ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
              <span>{instructorName} (Host)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isCameraOn ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                {isCameraOn ? "📹 Cam ON" : "🚫 Cam OFF"}
              </span>
            </div>

            {/* Top Right Live Attendance */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#162942] text-xs text-white font-mono">
              <Users className="w-3.5 h-3.5 text-[#41D8FF]" />
              <span>{viewersCount} watching</span>
            </div>
          </div>
        )}

        {/* Live Microphone Decibel VU Meter */}
        {isMicOn && (
          <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-2 z-20">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-end gap-0.5 h-3 w-12">
              {[20, 40, 60, 80, 100].map((threshold, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-full transition-all duration-75 ${
                    audioLevel >= threshold
                      ? "bg-emerald-400 h-full"
                      : "bg-slate-700 h-1"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">LIVE MIC</span>
          </div>
        )}

        {/* Hand Raise Banner Notice */}
        {handRaiseNotice && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-amber-400 text-[#06101D] font-extrabold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs z-40 animate-bounce">
            <span>{handRaiseNotice}</span>
          </div>
        )}

        {/* Floating Live Reactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {reactions.map((r) => (
            <span
              key={r.id}
              style={{ left: `${r.left}%` }}
              className="absolute bottom-6 text-3xl animate-bounce drop-shadow-lg"
            >
              {r.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Floating Zoom Control Bar (Bottom) */}
      <div className="p-4 px-6 bg-[#06101D] border-t border-[#162942] flex flex-wrap items-center justify-between gap-4 z-20">
        {/* Left: Audio & Video Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Microphone Toggle Button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isMicOn
                ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 hover:bg-emerald-500/30 shadow-emerald-500/20"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
            }`}
            title={isMicOn ? "Mute Microphone (Currently ON)" : "Unmute Microphone (Currently OFF)"}
          >
            {isMicOn ? (
              <>
                <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>🟢 Mic ON</span>
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 text-rose-400" />
                <span>🔴 Unmute Mic</span>
              </>
            )}
          </button>

          {/* Camera Toggle Button */}
          <button
            type="button"
            onClick={toggleCamera}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isCameraOn
                ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 hover:bg-emerald-500/30 shadow-emerald-500/20"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
            }`}
            title={isCameraOn ? "Stop Camera Video (Currently ON)" : "Start Camera Video (Currently OFF)"}
          >
            {isCameraOn ? (
              <>
                <VideoIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>🟢 Camera ON</span>
              </>
            ) : (
              <>
                <VideoOff className="w-4 h-4 text-rose-400" />
                <span>🔴 Start Camera</span>
              </>
            )}
          </button>

          {/* Screen Share Toggle */}
          <button
            type="button"
            onClick={toggleScreenShare}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isScreenSharing
                ? "bg-emerald-500 text-[#06101D] font-extrabold shadow-emerald-500/30"
                : "bg-[#081827] text-[#CBD5E1] border border-[#162942] hover:border-[#397CFF]/50 hover:text-white"
            }`}
            title="Share Screen (Desktop / Application / Chrome Tab)"
          >
            {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4 text-[#41D8FF]" />}
            <span className="hidden md:inline">{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
          </button>

          {/* Hand Raise Button */}
          <button
            type="button"
            onClick={toggleHandRaise}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
              isHandRaised
                ? "bg-amber-400 text-[#06101D] font-extrabold shadow-amber-400/30 scale-105"
                : "bg-[#081827] text-[#CBD5E1] border border-[#162942] hover:border-amber-400/50 hover:text-white"
            }`}
            title="Raise Hand to speak"
          >
            <span className="text-sm">✋</span>
            <span className="hidden sm:inline">{isHandRaised ? "Hand Raised" : "Raise Hand"}</span>
          </button>

          {/* Live Reactions Bar */}
          <div className="hidden sm:flex items-center gap-1 bg-[#081827] border border-[#162942] rounded-xl p-1">
            {["👏", "🔥", "💡", "❤️", "🎉"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => sendReaction(emoji)}
                className="p-1 hover:scale-125 transition-transform text-sm cursor-pointer"
                title={`Send ${emoji} reaction`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Interactive Class Tools */}
        <div className="flex items-center gap-2">
          {/* Participants In Call Button */}
          <button
            type="button"
            onClick={() => setIsParticipantsModalOpen(!isParticipantsModalOpen)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isParticipantsModalOpen
                ? "bg-[#397CFF] border-[#397CFF] text-white shadow-lg"
                : "bg-[#081827] border-[#162942] text-[#CBD5E1] hover:text-white"
            }`}
            title="View All Participants In Call"
          >
            <Users className="w-4 h-4 text-[#41D8FF]" />
            <span className="hidden sm:inline">Participants ({participants.length})</span>
          </button>

          {onDownloadDataset && (
            <button
              type="button"
              onClick={onDownloadDataset}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] font-bold text-xs flex items-center gap-1.5 shadow-lg hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Dataset ({datasetName})</span>
            </button>
          )}

          {onOpenPoll && (
            <button
              type="button"
              onClick={onOpenPoll}
              className="px-3 py-2 rounded-xl bg-[#081827] border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Live Poll</span>
            </button>
          )}

          {onToggleChat && (
            <button
              type="button"
              onClick={onToggleChat}
              className="px-3 py-2 rounded-xl bg-[#081827] border border-[#162942] text-[#CBD5E1] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Q&A Chat</span>
            </button>
          )}
        </div>

        {/* Right: Speaker Volume / End */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMutedSpeaker(!isMutedSpeaker)}
            className="p-2 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            title={isMutedSpeaker ? "Unmute Classroom Sound" : "Mute Sound"}
          >
            {isMutedSpeaker ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {mode === "instructor" && (
            <button
              type="button"
              onClick={() => {
                if (confirm("End live meeting for all students?")) {
                  stopMediaTracks();
                  setIsCameraOn(false);
                  setIsMicOn(false);
                  setIsScreenSharing(false);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Live Participants Drawer */}
      {isParticipantsModalOpen && (
        <div className="p-4 bg-[#06101D] border-t border-[#162942] z-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#41D8FF]" />
              <span className="text-xs font-bold text-white">Connected Call Participants ({participants.length} Active)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsParticipantsModalOpen(false)}
              className="text-[#94A3B8] hover:text-white text-xs cursor-pointer font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto">
            {participants.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-[#081827] border border-[#162942] flex items-center justify-between gap-2 shadow-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block truncate">{p.name} {p.isSelf ? "(You)" : ""}</span>
                    <span className="text-[10px] text-[#64748B] block">{p.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {p.isHandRaised && (
                    <span className="text-xs animate-bounce" title="Hand Raised">✋</span>
                  )}
                  <span className={`p-1 rounded ${p.isCameraOn ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`} title={p.isCameraOn ? "Camera Active" : "Camera Off"}>
                    <VideoIcon className="w-3 h-3" />
                  </span>
                  <span className={`p-1 rounded ${p.isMicOn ? "bg-emerald-500/20 text-emerald-300 animate-pulse" : "bg-slate-800 text-slate-500"}`} title={p.isMicOn ? "Microphone Unmuted" : "Microphone Muted"}>
                    <Mic className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
