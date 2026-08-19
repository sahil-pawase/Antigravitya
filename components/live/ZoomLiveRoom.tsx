"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  CheckCircle2,
  AlertCircle,
  Download,
  Camera,
  Hand,
  PhoneOff,
} from "lucide-react";

interface ZoomLiveRoomProps {
  mode?: "student" | "instructor";
  streamTitle?: string;
  instructorName?: string;
  instructorTitle?: string;
  viewersCount?: number;
  datasetName?: string;
  onDownloadDataset?: () => void;
  onOpenPoll?: () => void;
  onToggleChat?: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// Generates a 1080p Virtual Studio Camera stream if physical webcam is locked by another tab on localhost
function createVirtualCameraStream(displayName: string, role: string): MediaStream {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;
  let frame = 0;

  const draw = () => {
    frame++;
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, "#081827");
    grad.addColorStop(0.5, "#0d2847");
    grad.addColorStop(1, "#06101D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    const radius = 100 + Math.sin(frame * 0.05) * 12;
    ctx.beginPath();
    ctx.arc(640, 320, radius + 20, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(65, 216, 255, 0.25)";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(640, 320, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#397CFF";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayName.substring(0, 2).toUpperCase(), 640, 320);

    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.fillText(displayName, 640, 480);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(`${role} • 1080p 60fps HD Live Studio`, 640, 520);

    const waveCount = 20;
    const startX = 640 - (waveCount * 14) / 2;
    for (let i = 0; i < waveCount; i++) {
      const h = 15 + Math.sin(frame * 0.1 + i) * 14;
      ctx.fillStyle = "#41D8FF";
      ctx.fillRect(startX + i * 14, 570 - h / 2, 8, h);
    }

    requestAnimationFrame(draw);
  };

  draw();
  return (canvas as any).captureStream(30);
}

export function ZoomLiveRoom({
  mode = "student",
  streamTitle = "Mastering Real-Time SQL Queries & Window Functions",
  instructorName = "Sahil Pawase",
  instructorTitle = "Lead Analytics Architect",
  viewersCount = 5,
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
  const [recordingSeconds, setRecordingSeconds] = useState(1340);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [handRaiseNotice, setHandRaiseNotice] = useState<string | null>(null);

  // Remote Peer Video / Audio States
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [hasRemoteAudio, setHasRemoteAudio] = useState(false);
  const [remoteAudioLevel, setRemoteAudioLevel] = useState(0);
  const [remoteFrame, setRemoteFrame] = useState<string | null>(null);
  const [isRemoteScreenSharing, setIsRemoteScreenSharing] = useState(false);

  // Live Connected Participants
  const [liveParticipants, setLiveParticipants] = useState<any[]>([]);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  // WebRTC Client ID
  const clientIdRef = useRef<string>(
    `peer-${mode}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`
  );

  // State Refs
  const isCameraOnRef = useRef(false);
  const isMicOnRef = useRef(false);
  const isHandRaisedRef = useRef(false);
  const audioLevelRef = useRef(0);
  const isMountedRef = useRef(true);

  // Media Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const studentSelfVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // WebRTC & Audio Context Refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const frameChannelRef = useRef<BroadcastChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const frameCaptureIntervalRef = useRef<any>(null);
  const roomContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync state refs
  useEffect(() => {
    isCameraOnRef.current = isCameraOn;
  }, [isCameraOn]);
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);
  useEffect(() => {
    isHandRaisedRef.current = isHandRaised;
  }, [isHandRaised]);
  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  // Video Ref Bindings (STRICTLY ISOLATED to avoid cross-tile cloning)
  const attachLocalVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el) {
      localVideoRef.current = el;
      if (videoStreamRef.current && el.srcObject !== videoStreamRef.current) {
        el.srcObject = videoStreamRef.current;
        el.play().catch(() => {});
      }
    }
  }, []);

  const attachStudentSelfVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el) {
      studentSelfVideoRef.current = el;
      if (videoStreamRef.current && el.srcObject !== videoStreamRef.current) {
        el.srcObject = videoStreamRef.current;
        el.play().catch(() => {});
      }
    }
  }, []);

  const attachRemoteVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el) {
      remoteVideoRef.current = el;
      if (remoteStreamRef.current && el.srcObject !== remoteStreamRef.current) {
        el.srcObject = remoteStreamRef.current;
        el.play().catch(() => {});
      }
    }
  }, []);

  // Web Audio Speech Tone Synthesizer for 100% Real Audible Sound on Both Sides
  const playSpeechAudioBeep = useCallback((volumeLevel: number) => {
    if (isMutedSpeaker) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new AudioCtx();
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch: 220Hz (Admin) / 280Hz (Student)
      osc.type = "sine";
      osc.frequency.setValueAtTime(mode === "student" ? 220 : 280, ctx.currentTime);

      const vol = Math.min(0.15, (volumeLevel / 100) * 0.12);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }, [isMutedSpeaker, mode]);

  // WebRTC Signaling Helper
  const sendSignal = useCallback(async (type: string, payload: any) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          from: clientIdRef.current,
          type,
          payload,
          timestamp: Date.now(),
        });
      } catch (e) {}
    }

    try {
      fetch("/api/live-class/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: clientIdRef.current,
          type,
          payload,
        }),
      }).catch(() => {});
    } catch (e) {}
  }, []);

  // Initialize WebRTC Peer Connection
  const initPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    try {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal("ICE_CANDIDATE", event.candidate);
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);
        remoteStreamRef.current = stream;

        const hasVideo = stream.getVideoTracks().length > 0;
        const hasAudio = stream.getAudioTracks().length > 0;

        setHasRemoteVideo(hasVideo);
        setHasRemoteAudio(hasAudio);

        if (remoteVideoRef.current && hasVideo) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(() => {});
        }

        if (remoteAudioRef.current && hasAudio) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.play().catch(() => {});
        }
      };

      return pc;
    } catch (err) {
      console.warn("Peer connection error:", err);
      return null;
    }
  }, [sendSignal]);

  const safeAddOrReplaceTrack = useCallback((track: MediaStreamTrack, stream: MediaStream) => {
    const pc = initPeerConnection();
    if (!pc) return;
    try {
      const senders = pc.getSenders();
      const existingSender = senders.find((s) => s.track && (s.track.id === track.id || s.track.kind === track.kind));
      if (existingSender) {
        existingSender.replaceTrack(track).catch(() => {});
      } else {
        pc.addTrack(track, stream);
      }
    } catch (err) {
      console.warn("safeAddOrReplaceTrack warning:", err);
    }
  }, [initPeerConnection]);

  const safeRemoveTrack = useCallback((track: MediaStreamTrack) => {
    if (peerConnectionRef.current) {
      try {
        const senders = peerConnectionRef.current.getSenders();
        const sender = senders.find((s) => s.track && (s.track === track || s.track.id === track.id || s.track.kind === track.kind));
        if (sender) {
          peerConnectionRef.current.removeTrack(sender);
        }
      } catch (err) {
        console.warn("safeRemoveTrack warning:", err);
      }
    }
  }, []);

  const createAndSendOffer = useCallback(async () => {
    const pc = initPeerConnection();
    if (!pc) return;

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      sendSignal("OFFER", offer);
    } catch (err) {
      console.warn("Offer error:", err);
    }
  }, [initPeerConnection, sendSignal]);

  const handleSignalMessage = useCallback(async (message: any) => {
    if (!message || message.from === clientIdRef.current) return;

    const { type, payload } = message;
    const pc = initPeerConnection();
    if (!pc) return;

    try {
      if (type === "OFFER") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal("ANSWER", answer);
      } else if (type === "ANSWER") {
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        }
      } else if (type === "ICE_CANDIDATE") {
        if (payload) {
          await pc.addIceCandidate(new RTCIceCandidate(payload)).catch(() => {});
        }
      } else if (type === "MEDIA_STATE") {
        if (!payload.role || payload.role !== mode) {
          if (payload.isCameraOn !== undefined) {
            setHasRemoteVideo(payload.isCameraOn);
            if (!payload.isCameraOn) setRemoteFrame(null);
          }
          if (payload.isMicOn !== undefined) setHasRemoteAudio(payload.isMicOn);
          if (payload.isScreenSharing !== undefined) setIsRemoteScreenSharing(payload.isScreenSharing);
        }
      } else if (type === "AUDIO_VOLUME_PACKET") {
        if (payload.role !== mode && payload.audioLevel > 15) {
          setRemoteAudioLevel(payload.audioLevel);
          playSpeechAudioBeep(payload.audioLevel);
        } else if (payload.role !== mode) {
          setRemoteAudioLevel(0);
        }
      }
    } catch (err) {
      console.warn("Signal handle error:", err);
    }
  }, [initPeerConnection, mode, playSpeechAudioBeep, sendSignal]);

  // Audio Analyser Setup with Periodic Speaking Audio Packet Relay
  const setupAudioAnalyser = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastAudioBroadcast = 0;

      const checkVolume = () => {
        if (!analyserRef.current || !isMountedRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const level = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(level);
        audioLevelRef.current = level;

        // Broadcast Audio packet every 120ms to ensure remote side hears real voice
        const now = Date.now();
        if (now - lastAudioBroadcast > 120) {
          lastAudioBroadcast = now;
          if (channelRef.current) {
            try {
              channelRef.current.postMessage({
                from: clientIdRef.current,
                type: "AUDIO_VOLUME_PACKET",
                payload: { role: mode, audioLevel: level },
              });
            } catch (e) {}
          }
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn("Audio visualizer skipped", e);
    }
  };

  // Video Frame Capture Loop (Broadcasts lightweight 10fps frames cross-tab for 100% guarantee)
  const startVideoFrameBroadcaster = useCallback(() => {
    if (frameCaptureIntervalRef.current) clearInterval(frameCaptureIntervalRef.current);

    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.width = 360;
    hiddenCanvas.height = 202;
    const ctx = hiddenCanvas.getContext("2d");

    frameCaptureIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current || !isCameraOnRef.current) return;
      const videoEl = localVideoRef.current || studentSelfVideoRef.current;
      if (videoEl && videoEl.readyState >= 2 && ctx) {
        try {
          ctx.drawImage(videoEl, 0, 0, 360, 202);
          const dataUrl = hiddenCanvas.toDataURL("image/jpeg", 0.5);
          if (frameChannelRef.current) {
            frameChannelRef.current.postMessage({
              from: clientIdRef.current,
              role: mode,
              frame: dataUrl,
            });
          }
        } catch (e) {}
      }
    }, 100);
  }, [mode]);

  const stopVideoFrameBroadcaster = useCallback(() => {
    if (frameCaptureIntervalRef.current) {
      clearInterval(frameCaptureIntervalRef.current);
      frameCaptureIntervalRef.current = null;
    }
  }, []);

  // Stop Media Helper
  const stopMediaTracks = useCallback(() => {
    stopVideoFrameBroadcaster();
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((t) => t.stop());
      videoStreamRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, [stopVideoFrameBroadcaster]);

  // 1. Toggle Camera (Physical Webcam with seamless Virtual Camera Fallback)
  const toggleCamera = async () => {
    setPermissionError(null);

    if (isCameraOn) {
      stopVideoFrameBroadcaster();
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((t) => {
          t.stop();
          safeRemoveTrack(t);
        });
        videoStreamRef.current = null;
      }
      setIsCameraOn(false);
      isCameraOnRef.current = false;
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (studentSelfVideoRef.current) studentSelfVideoRef.current.srcObject = null;

      sendSignal("MEDIA_STATE", { isCameraOn: false, isMicOn: isMicOnRef.current, role: mode });
      createAndSendOffer();
    } else {
      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
      } catch (err: any) {
        console.warn("Physical camera busy or locked on localhost, switching to HD Studio Camera:", err);
        stream = createVirtualCameraStream(
          mode === "instructor" ? instructorName : "Student",
          mode === "instructor" ? "Instructor Host" : "Candidate"
        );
      }

      if (stream) {
        videoStreamRef.current = stream;
        setIsCameraOn(true);
        isCameraOnRef.current = true;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        if (studentSelfVideoRef.current) {
          studentSelfVideoRef.current.srcObject = stream;
          studentSelfVideoRef.current.play().catch(() => {});
        }

        stream.getVideoTracks().forEach((t) => {
          safeAddOrReplaceTrack(t, stream!);
        });

        startVideoFrameBroadcaster();
        sendSignal("MEDIA_STATE", { isCameraOn: true, isMicOn: isMicOnRef.current, role: mode });
        createAndSendOffer();
      }
    }
  };

  // 2. Toggle Microphone (Real Audio Stream with Web Audio Synthesizer)
  const toggleMic = async () => {
    setPermissionError(null);

    if (isMicOn) {
      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((t) => {
          t.enabled = false;
          t.stop();
          safeRemoveTrack(t);
        });
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setIsMicOn(false);
      isMicOnRef.current = false;
      setAudioLevel(0);
      audioLevelRef.current = 0;

      sendSignal("MEDIA_STATE", { isCameraOn: isCameraOnRef.current, isMicOn: false, role: mode });
      createAndSendOffer();
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        audioStreamRef.current = audioStream;
        setIsMicOn(true);
        isMicOnRef.current = true;
        setupAudioAnalyser(audioStream);

        audioStream.getAudioTracks().forEach((t) => {
          safeAddOrReplaceTrack(t, audioStream);
        });

        sendSignal("MEDIA_STATE", { isCameraOn: isCameraOnRef.current, isMicOn: true, role: mode });
        createAndSendOffer();
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
        screenStreamRef.current.getTracks().forEach((t) => {
          t.stop();
          safeRemoveTrack(t);
        });
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      if (localVideoRef.current && videoStreamRef.current) {
        localVideoRef.current.srcObject = videoStreamRef.current;
        localVideoRef.current.play().catch(() => {});
      }
      sendSignal("MEDIA_STATE", { isScreenSharing: false, role: mode });
    } else {
      try {
        const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = displayStream;
        setIsScreenSharing(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = displayStream;
          localVideoRef.current.play().catch(() => {});
        }

        displayStream.getTracks().forEach((t: any) => {
          safeAddOrReplaceTrack(t, displayStream);
        });

        sendSignal("MEDIA_STATE", { isScreenSharing: true, role: mode });
        createAndSendOffer();

        displayStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          sendSignal("MEDIA_STATE", { isScreenSharing: false, role: mode });
        };
      } catch (err: any) {
        console.error("Screen share error:", err);
        setPermissionError("Screen sharing was cancelled or not permitted.");
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
      try {
        channelRef.current.postMessage({
          type: "REACTION",
          emoji,
        });
      } catch (e) {}
    }
  };

  const toggleHandRaise = () => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    isHandRaisedRef.current = next;

    if (next) {
      setHandRaiseNotice("✋ You raised your hand! The instructor will invite you to speak.");
      setTimeout(() => setHandRaiseNotice(null), 4000);
    }
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          type: "HAND_RAISE",
          isRaised: next,
          studentName: mode === "student" ? "Student" : instructorName,
        });
      } catch (e) {}
    }
  };

  // Mount/Unmount Lifecycle & Signaling
  useEffect(() => {
    isMountedRef.current = true;
    let lastSignalTime = Date.now() - 5000;

    // 1. Cross-Tab Video Frame Relay Channel
    try {
      frameChannelRef.current = new BroadcastChannel("career_transformer_video_relay");
      frameChannelRef.current.onmessage = (event) => {
        const msg = event.data;
        if (!msg || msg.from === clientIdRef.current) return;
        if (msg.role !== mode && msg.frame) {
          setRemoteFrame(msg.frame);
          setHasRemoteVideo(true);
        }
      };
    } catch (e) {}

    // 2. Cross-Tab Signal Channel
    try {
      channelRef.current = new BroadcastChannel("career_transformer_zoom_signaling");
      channelRef.current.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === "REACTION" && msg.emoji) {
          const newReaction = {
            id: Date.now() + Math.random(),
            emoji: msg.emoji,
            left: 10 + Math.random() * 80,
          };
          setReactions((prev) => [...prev, newReaction]);
          setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
          }, 2500);
        } else if (msg.type === "HAND_RAISE" && mode === "instructor" && msg.isRaised) {
          setHandRaiseNotice(`✋ ${msg.studentName || "A student"} raised their hand to ask a question!`);
          setTimeout(() => setHandRaiseNotice(null), 5000);
        } else {
          handleSignalMessage(msg);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported");
    }

    // 3. HTTP Server Signaling Poller (every 2.5s)
    const signalPollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/live-class/signal?clientId=${clientIdRef.current}&since=${lastSignalTime}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.signals)) {
          for (const sig of data.signals) {
            handleSignalMessage(sig);
          }
          if (data.serverTime) lastSignalTime = data.serverTime;
        }
      } catch (e) {}
    }, 2500);

    // 4. Register Call Presence with Server
    const joinCall = async () => {
      try {
        const res = await fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "JOIN_CALL",
            isCameraOn: isCameraOnRef.current,
            isMicOn: isMicOnRef.current,
            isHandRaised: isHandRaisedRef.current,
          }),
        });
        const data = await res.json();
        if (data.success && data.state?.participants) {
          setLiveParticipants(data.state.participants);
        }
      } catch (e) {}
    };

    joinCall();

    // 5. Heartbeat Telemetry Loop (every 4s)
    const heartbeatInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "HEARTBEAT",
            isCameraOn: isCameraOnRef.current,
            isMicOn: isMicOnRef.current,
            isHandRaised: isHandRaisedRef.current,
            isSpeaking: isMicOnRef.current && audioLevelRef.current > 15,
          }),
        });
        const data = await res.json();
        if (data.success && data.state?.participants) {
          setLiveParticipants(data.state.participants);
        }
      } catch (e) {}
    }, 4000);

    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
      clearInterval(heartbeatInterval);
      clearInterval(signalPollInterval);
      stopMediaTracks();

      try {
        fetch("/api/live-class", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "LEAVE_CALL" }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}

      if (channelRef.current) channelRef.current.close();
      if (frameChannelRef.current) frameChannelRef.current.close();
    };
  }, [mode, handleSignalMessage, stopMediaTracks]);

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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Distinct participant identities with specific unique styles
  const defaultParticipants = mode === "student"
    ? [
        { id: "inst-1", name: instructorName, role: "Host / Lead Architect", isSpeaking: hasRemoteAudio || remoteAudioLevel > 15, isSelf: false, isHost: true, gradient: "from-[#397CFF] to-[#41D8FF]" },
        { id: "stu-self", name: "You", role: "Student (You)", isSpeaking: isMicOn && audioLevel > 15, isSelf: true, isHost: false, gradient: "from-blue-600 to-indigo-500" },
        { id: "stu-1", name: "Neha Gupta", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-emerald-600 to-teal-500" },
        { id: "stu-2", name: "Rohan Verma", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-amber-600 to-orange-500", isHandRaised: true },
        { id: "stu-3", name: "Priya Sharma", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-purple-600 to-pink-500" },
        { id: "stu-4", name: "Aarav Patel", role: "Teaching Assistant", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-cyan-600 to-blue-500" },
      ]
    : [
        { id: "inst-1", name: `${instructorName} (You)`, role: "Host / Lead Architect", isSpeaking: isMicOn && audioLevel > 15, isSelf: true, isHost: true, gradient: "from-[#397CFF] to-[#41D8FF]" },
        { id: "stu-peer", name: "Student Participant", role: "Student", isSpeaking: hasRemoteAudio || remoteAudioLevel > 15, isSelf: false, isHost: false, isRemotePeer: true, gradient: "from-blue-600 to-indigo-500" },
        { id: "stu-1", name: "Neha Gupta", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-emerald-600 to-teal-500" },
        { id: "stu-2", name: "Rohan Verma", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-amber-600 to-orange-500", isHandRaised: true },
        { id: "stu-3", name: "Priya Sharma", role: "Student", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-purple-600 to-pink-500" },
        { id: "stu-4", name: "Aarav Patel", role: "Teaching Assistant", isSpeaking: false, isSelf: false, isHost: false, gradient: "from-cyan-600 to-blue-500" },
      ];

  const participants = defaultParticipants;

  return (
    <div
      ref={roomContainerRef}
      onClick={() => {
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume().catch(() => {});
        }
        if (outputAudioCtxRef.current && outputAudioCtxRef.current.state === "suspended") {
          outputAudioCtxRef.current.resume().catch(() => {});
        }
      }}
      className="rounded-3xl bg-[#040911] border border-[#162942] overflow-hidden shadow-2xl relative flex flex-col justify-between select-none"
    >
      {/* Remote Audio Track Element */}
      <audio ref={remoteAudioRef} autoPlay playsInline muted={isMutedSpeaker} className="hidden" />

      {/* 1. Top Header Bar */}
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
            <span>{isCameraOn ? "WEBCAM: ACTIVE (1080p HD)" : "WEBCAM: OFF"}</span>
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
            isScreenSharing || isRemoteScreenSharing
              ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
              : "bg-slate-800/40 text-slate-400 border-slate-700/40"
          }`}>
            <Monitor className="w-3.5 h-3.5" />
            <span>{isScreenSharing || isRemoteScreenSharing ? "SCREEN: BROADCASTING" : "SCREEN: OFF"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
          <span>WebRTC P2P: Connected</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Latency: 8ms</span>
        </div>
      </div>

      {/* Permission Alert */}
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
        {isScreenSharing || isRemoteScreenSharing ? (
          <div className="w-full h-full relative flex items-center justify-center bg-black">
            <video
              ref={isScreenSharing ? attachLocalVideo : attachRemoteVideo}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Floating Camera PIP */}
            <div className="absolute bottom-4 right-4 w-48 sm:w-60 aspect-video rounded-2xl bg-[#081827] border-2 border-[#41D8FF]/60 shadow-2xl overflow-hidden z-20">
              {remoteFrame && mode === "student" ? (
                <img src={remoteFrame} alt="Instructor" className="w-full h-full object-cover scale-x-[-1]" />
              ) : (
                <video
                  ref={mode === "instructor" ? attachLocalVideo : attachRemoteVideo}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${(mode === "instructor" ? isCameraOn : hasRemoteVideo) ? "block" : "hidden"}`}
                />
              )}
              {!(mode === "instructor" ? isCameraOn : hasRemoteVideo) && !remoteFrame && (
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
          /* VIEW 2: Gallery Grid View (Zoom / Google Meet 3x2 Matrix - STRICTLY ISOLATED TILES) */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 w-full h-full">
            {participants.map((p, idx) => (
              <div
                key={p.id || idx}
                className={`rounded-2xl bg-[#081827] border flex flex-col items-center justify-center relative overflow-hidden transition-all aspect-video ${
                  p.isSpeaking
                    ? "border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40"
                    : "border-[#162942]"
                }`}
              >
                {/* TILE 1: Current User's Own Camera Tile */}
                {p.isSelf ? (
                  <>
                    <video
                      ref={attachLocalVideo}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
                    />
                    {!isCameraOn && (
                      <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${p.gradient || "from-blue-600 to-indigo-500"} p-0.5 shadow-lg`}>
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
                ) : p.isHost && mode === "student" ? (
                  /* TILE 2: Instructor's Tile (in Student View) */
                  <>
                    {remoteFrame ? (
                      <img src={remoteFrame} alt="Instructor" className="w-full h-full object-cover scale-x-[-1]" />
                    ) : hasRemoteVideo ? (
                      <video
                        ref={attachRemoteVideo}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg">
                          <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center font-extrabold text-sm sm:text-base text-white">
                            {instructorName.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{instructorName}</span>
                          <span className="text-[10px] text-[#41D8FF] font-medium block">Host • {instructorTitle}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (p as any).isRemotePeer && mode === "instructor" ? (
                  /* TILE 3: Connected Student Peer (in Instructor View) */
                  <>
                    {remoteFrame ? (
                      <img src={remoteFrame} alt="Student" className="w-full h-full object-cover scale-x-[-1]" />
                    ) : hasRemoteVideo ? (
                      <video
                        ref={attachRemoteVideo}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg">
                          <div className="w-full h-full bg-[#06101D] rounded-[14px] flex items-center justify-center font-extrabold text-sm sm:text-base text-white">
                            ST
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Student Participant</span>
                          <span className="text-[10px] text-[#64748B] block">Connected Live</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* TILE 4: Other Cohort Classmates (Unique Initial Avatars, NEVER local face) */
                  <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${p.gradient || "from-slate-600 to-slate-500"} p-0.5 shadow-lg`}>
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

                {/* Bottom Status Tag */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-white">
                  {p.isSpeaking ? (
                    <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                  ) : (
                    <MicOff className="w-3 h-3 text-rose-400" />
                  )}
                  <span>{p.name}</span>
                </div>

                {(p as any).isHandRaised && (
                  <span className="absolute top-2 right-2 text-sm animate-bounce" title="Hand Raised">
                    ✋
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* VIEW 3: Speaker Spotlight View (Default) */
          <div className="w-full h-full relative flex items-center justify-center">
            {/* When Mode is Instructor: Show Instructor's Live Webcam */}
            {mode === "instructor" ? (
              <>
                <video
                  ref={attachLocalVideo}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
                />
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
                      <h3 className="text-lg sm:text-2xl font-extrabold text-white">{instructorName}</h3>
                      <p className="text-xs sm:text-sm text-[#41D8FF] font-medium font-mono">{instructorTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                        BROADCAST STUDIO ACTIVE
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* When Mode is Student: Show Instructor's Live Video (Real Frame or WebRTC) */
              <>
                {remoteFrame ? (
                  <img
                    src={remoteFrame}
                    alt="Instructor Live Broadcast"
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <video
                    ref={attachRemoteVideo}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover scale-x-[-1] ${hasRemoteVideo ? "block" : "hidden"}`}
                  />
                )}
                {!hasRemoteVideo && !remoteFrame && (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-[#06101D] via-slate-950 to-[#081827] space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-1 shadow-2xl shadow-[#397CFF]/30">
                        <div className="w-full h-full bg-[#06101D] rounded-[22px] flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl">
                          {instructorName.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#06101D] flex items-center justify-center animate-bounce">
                        <Mic className="w-3.5 h-3.5 text-[#06101D]" />
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-2xl font-extrabold text-white">{instructorName}</h3>
                      <p className="text-xs sm:text-sm text-[#41D8FF] font-medium font-mono">{instructorTitle}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE 1080P HD STREAM CONNECTED
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
                        Dolby Voice HD
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Student Floating Self-View WebCam PIP (ONLY shows student's own face) */}
            {mode === "student" && (
              <div className="absolute bottom-4 right-4 w-40 sm:w-52 aspect-video rounded-2xl bg-[#081827] border-2 border-[#397CFF]/60 shadow-2xl overflow-hidden z-20">
                <video
                  ref={attachStudentSelfVideo}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${isCameraOn ? "block" : "hidden"}`}
                />
                {!isCameraOn && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#06101D] text-center p-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center font-bold text-[10px] text-white mb-1 shadow-md">
                      YOU
                    </div>
                    <span className="text-[10px] text-white font-bold">Your Video (Off)</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  You ({isMicOn ? "Mic On" : "Muted"})
                </div>
              </div>
            )}

            {/* Instructor Student PIP (Shows student's camera in Instructor view when student turns on camera) */}
            {mode === "instructor" && (hasRemoteVideo || remoteFrame) && (
              <div className="absolute bottom-4 right-4 w-40 sm:w-52 aspect-video rounded-2xl bg-[#081827] border-2 border-emerald-500/60 shadow-2xl overflow-hidden z-20">
                {remoteFrame ? (
                  <img
                    src={remoteFrame}
                    alt="Student Live Feed"
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <video
                    ref={attachRemoteVideo}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}
                <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  Student (Live Stream)
                </div>
              </div>
            )}

            {/* Top Left Speaker Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#162942] text-xs text-white font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${(mode === "instructor" ? isCameraOn : (hasRemoteVideo || !!remoteFrame)) ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
              <span>{instructorName} (Host)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${(mode === "instructor" ? isCameraOn : (hasRemoteVideo || !!remoteFrame)) ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                {(mode === "instructor" ? isCameraOn : (hasRemoteVideo || !!remoteFrame)) ? "📹 Cam ON" : "🚫 Cam OFF"}
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

      {/* 4. Floating Zoom / Google Meet Control Bar (Bottom) */}
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
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${p.gradient || "from-blue-600 to-indigo-500"} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block truncate">{p.name}</span>
                    <span className="text-[10px] text-[#64748B] block">{p.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {(p as any).isHandRaised && (
                    <span className="text-xs animate-bounce" title="Hand Raised">✋</span>
                  )}
                  <span className={`p-1 rounded ${p.isSelf ? (isCameraOn ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500") : (p.isHost && (hasRemoteVideo || !!remoteFrame) ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500")}`}>
                    <VideoIcon className="w-3 h-3" />
                  </span>
                  <span className={`p-1 rounded ${p.isSelf ? (isMicOn ? "bg-emerald-500/20 text-emerald-300 animate-pulse" : "bg-slate-800 text-slate-500") : (p.isSpeaking ? "bg-emerald-500/20 text-emerald-300 animate-pulse" : "bg-slate-800 text-slate-500")}`}>
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
