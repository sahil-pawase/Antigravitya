"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  PlayCircle,
  Play,
  Pause,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Search,
  Download,
  X,
  Star,
  Award,
  Radio,
  Calendar,
  Layers,
  Terminal,
  Code2,
  FileText,
  HelpCircle,
  Check,
  ArrowRight,
  Tv,
  MessageSquare,
  Users,
  Pin,
  Mic,
  Monitor,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/ui/Button";

export interface LectureStep {
  stepNumber: number;
  title: string;
  duration: string;
  summary: string;
  codeSnippet: string;
}

export interface RecordedMasterclass {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  avatar: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  completedPercentage: number;
  thumbnailGradient: string;
  description: string;
  youtubeId: string;
  datasetName: string;
  datasetSize: string;
  isLiveRecording?: boolean;
  recordedDate?: string;
  lectureSteps: LectureStep[];
  instructorNotes: string[];
}

export default function RecordedClassesPage() {
  const [masterclasses, setMasterclasses] = useState<RecordedMasterclass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeCourseModal, setActiveCourseModal] = useState<RecordedMasterclass | null>(null);

  // Classroom Player Views: 'live-replay' | 'lecture-video' | 'sandbox'
  const [viewMode, setViewMode] = useState<"live-replay" | "lecture-video" | "sandbox">("live-replay");
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [executedOutput, setExecutedOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Live Stream Simulation Ticker
  const [replayTimer, setRecordingTimer] = useState(1340); // 22:20
  const [isReplayPlaying, setIsReplayPlaying] = useState(true);
  const [liveState, setLiveState] = useState<any>(null);

  const fetchRecordedClasses = async () => {
    try {
      const res = await fetch("/api/recorded-classes");
      const data = await res.json();
      if (data.success && data.masterclasses) {
        setMasterclasses(data.masterclasses);
      }
    } catch (err) {
      console.error("Failed to fetch recorded classes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLiveState = async () => {
    try {
      const res = await fetch("/api/live-class");
      const data = await res.json();
      if (data.success && data.state) {
        setLiveState(data.state);
      }
    } catch (err) {
      console.error("Failed to fetch live state:", err);
    }
  };

  useEffect(() => {
    fetchRecordedClasses();
    fetchLiveState();
  }, []);

  useEffect(() => {
    if (activeCourseModal) {
      setActiveStepIdx(0);
      setViewMode(activeCourseModal.isLiveRecording ? "live-replay" : "lecture-video");
      setExecutedOutput(null);
      setRecordingTimer(1340);
      setIsReplayPlaying(true);
    }
  }, [activeCourseModal]);

  useEffect(() => {
    let interval: any = null;
    if (isReplayPlaying && activeCourseModal) {
      interval = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReplayPlaying, activeCourseModal]);

  const filtered = masterclasses.filter((c) => {
    const matchCat = selectedCat === "all" || c.category === selectedCat;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleDone = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatReplayTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return m + ":" + s;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunCode = (code: string) => {
    setIsExecuting(true);
    setExecutedOutput(null);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutedOutput(
        "✅ PostgreSQL Query executed in 14.2ms\n" +
        "--------------------------------------------------\n" +
        "| customer_id | order_id | order_amount | rank |\n" +
        "|-------------|----------|--------------|------|\n" +
        "| CUST_8921   | ORD_1092 | ₹ 1,450.00   | 1    |\n" +
        "| CUST_4412   | ORD_1098 | ₹ 1,280.00   | 2    |\n" +
        "| CUST_3301   | ORD_1104 | ₹ 890.00     | 3    |\n" +
        "| CUST_9021   | ORD_1110 | ₹ 740.00     | 4    |\n" +
        "--------------------------------------------------\n" +
        "4 rows returned (Filter applied: Top Percentile)"
      );
    }, 450);
  };

  const handleDownloadDataset = (name: string) => {
    const dummyContent =
      "order_id,customer_name,order_value,status,delivery_time_mins,city,category\n" +
      "1001,Aarav Patel,640,Delivered,24,Bengaluru,Food\n" +
      "1002,Neha Gupta,1280,Delivered,31,Mumbai,Groceries\n" +
      "1003,Rohan Verma,450,Cancelled,18,Pune,Dining\n" +
      "1004,Priya Sharma,890,Delivered,29,Hyderabad,Food\n" +
      "1005,Ananya Roy,1540,Delivered,35,Delhi,Electronics";
    const blob = new Blob([dummyContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultLiveChatMessages = [
    { id: "1", sender: "Sahil Pawase (Instructor)", text: "Welcome everyone! Please ensure you download swiggy_orders_dataset.csv from below.", time: "10:02 AM", isInstructor: true },
    { id: "2", sender: "Neha Gupta", text: "Sir, when should we use DENSE_RANK() instead of RANK() in SQL?", time: "10:05 AM" },
    { id: "3", sender: "Rohan Verma", text: "The stream resolution is crystal clear! Ready for window functions.", time: "10:07 AM" },
    { id: "4", sender: "Sahil Pawase (Instructor)", text: "Great question Neha! DENSE_RANK() does not skip rank positions on duplicate ties. Let me demonstrate now.", time: "10:08 AM", isInstructor: true },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border border-[#162942] shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#397CFF]/15 text-[#41D8FF] border border-[#397CFF]/30 text-xs font-bold flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> EXACT LIVE CLASS REPLAY & RECORDED ACADEMY
            </span>
            <span className="text-xs text-[#64748B]">Full Live Stream Replay • Synchronized Classroom Chat • Live Polls</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recorded Masterclasses & Live Replay Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Watch exactly what happened during the live classes: full instructor screen broadcast, live student Q&A chat, polls, and downloadable datasets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#06101D] border border-[#162942] text-xs font-mono text-white flex items-center gap-2 shadow-inner">
            <BookOpen className="w-4 h-4 text-[#41D8FF]" />
            <span><strong className="text-white">{masterclasses.length}</strong> Recorded Sessions</span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#081827] border border-[#162942] shadow-lg">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Topics" },
            { id: "sql", label: "SQL & Relational DBs" },
            { id: "powerbi", label: "Power BI & DAX" },
            { id: "python", label: "Python & Pandas" },
            { id: "eda", label: "EDA & Statistics" },
            { id: "excel", label: "Advanced Excel" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat.id
                  ? "bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] font-bold shadow-md"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#06101D]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search masterclasses & instructors..."
            className="w-full pl-9 pr-4 py-2 bg-[#06101D] border border-[#162942] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF]"
          />
        </div>
      </div>

      {/* 3. Masterclass Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => {
          const isDone = completed[c.id] || c.completedPercentage === 100;

          return (
            <div
              key={c.id}
              className="rounded-2xl bg-[#081827] border border-[#162942] p-5 space-y-4 shadow-xl hover:border-[#41D8FF]/40 transition-all hover:scale-[1.01] flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Video Card Thumbnail */}
                <div className={`h-44 rounded-xl bg-gradient-to-br ${c.thumbnailGradient} p-3.5 flex flex-col justify-between relative overflow-hidden border`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[#06101D]/80 text-[#41D8FF] font-mono border border-white/10">
                      {c.duration}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      ★ {c.rating}
                    </span>
                  </div>

                  {/* Play Overlay Button */}
                  <div
                    onClick={() => setActiveCourseModal(c)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 group-hover:bg-black/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#41D8FF] text-[#06101D] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  <div className="z-10 text-[10px] text-[#CBD5E1] flex items-center justify-between font-mono">
                    {c.isLiveRecording ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                        <Radio className="w-3 h-3 text-rose-400 animate-pulse" /> LIVE COHORT RECORDING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#06101D]/70">{c.level}</span>
                    )}

                    {isDone && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {c.isLiveRecording && (
                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Recorded Live {c.recordedDate || "Today"}
                    </div>
                  )}
                  <h3 className="font-bold text-sm text-white leading-snug line-clamp-2">
                    {c.title}
                  </h3>
                </div>

                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#06101D] border border-[#162942]">
                  <img src={c.avatar} alt={c.instructor} className="w-7 h-7 rounded-full bg-white/10" />
                  <div>
                    <div className="text-xs font-semibold text-white">{c.instructor}</div>
                    <div className="text-[10px] text-[#64748B]">{c.instructorTitle}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#94A3B8]">
                    <span>Watch Progress</span>
                    <span className="font-mono text-[#41D8FF]">{isDone ? "100%" : `${c.completedPercentage}%`}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#06101D] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isDone ? "bg-emerald-400" : "bg-gradient-to-r from-[#397CFF] to-[#41D8FF]"}`}
                      style={{ width: isDone ? "100%" : `${c.completedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#162942] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCourseModal(c)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#397CFF]/20 to-[#41D8FF]/20 hover:from-[#397CFF]/30 hover:to-[#41D8FF]/30 border border-[#41D8FF]/40 text-[#41D8FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{c.isLiveRecording ? "Replay Live Class" : "Watch Masterclass"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleDone(c.id)}
                  className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                    isDone ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-[#06101D] border-[#162942] text-[#64748B] hover:text-white"
                  }`}
                  title={isDone ? "Marked as Done" : "Mark as Done"}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. EXACT LIVE CLASSROOM REPLAY & VIDEO STUDIO MODAL */}
      {activeCourseModal && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setActiveCourseModal(null); }}
        >
          <div className="bg-[#081827] border border-[#41D8FF]/40 rounded-3xl w-full max-w-7xl max-h-[96vh] shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar with Mode Switchers */}
            <div className="p-3.5 px-6 border-b border-[#162942] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#06101D]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono border border-rose-500/30">
                      LIVE RECORDED BROADCAST REPLAY
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">1080p HD • {activeCourseModal.duration}</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                    {activeCourseModal.title}
                  </h2>
                </div>
              </div>

              {/* View Switcher: Live Replay vs HD Video Lecture vs Sandbox */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#081827] p-1 rounded-xl border border-[#162942]">
                  <button
                    type="button"
                    onClick={() => setViewMode("live-replay")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "live-replay" ? "bg-rose-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Live Room Replay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("lecture-video")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "lecture-video" ? "bg-[#397CFF] text-white shadow-md" : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>HD Lecture Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("sandbox")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "sandbox" ? "bg-emerald-600 text-white shadow-md" : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>SQL Sandbox</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCourseModal(null)}
                  className="text-[#94A3B8] hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              {/* Left 8 Cols: Live Stream Canvas Viewport */}
              <div className="lg:col-span-8 p-5 space-y-4 border-r border-[#162942] flex flex-col justify-between">
                <div className="space-y-4">
                  {/* VIEW 1: EXACT LIVE MEETING ROOM REPLAY */}
                  {viewMode === "live-replay" && (
                    <div className="aspect-video w-full rounded-2xl bg-black border border-[#162942] overflow-hidden shadow-2xl relative flex flex-col justify-between select-none">
                      {/* Top Replay Overlay */}
                      <div className="p-3 px-4 bg-[#06101D]/90 backdrop-blur-md border-b border-[#162942] flex items-center justify-between z-20 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                            REPLAY REC {formatReplayTime(replayTimer)}
                          </span>
                          <span className="text-white font-bold truncate max-w-sm">
                            {activeCourseModal.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#94A3B8] font-mono text-[11px]">
                          <Users className="w-3.5 h-3.5 text-[#41D8FF]" />
                          <span>74 students were present</span>
                        </div>
                      </div>

                      {/* Main Live Shared IDE & Code Demonstration Screen */}
                      <div className="flex-1 bg-[#030712] p-5 font-mono text-xs overflow-y-auto flex flex-col justify-between relative">
                        {/* Instructor Shared Screen */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-[#64748B] border-b border-white/10 pb-1.5">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <Monitor className="w-3.5 h-3.5" /> Instructor Screen Share: PostgreSQL 16 Analytics Studio
                            </span>
                            <span className="text-[#41D8FF]">swiggy_orders_master.sql</span>
                          </div>

                          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                            <span className="text-[#64748B]">-- Live Cohort Lab: Multi-Level Window Partitioning & LEAD/LAG</span>
                            {"\n"}
                            <span className="text-[#41D8FF]">WITH</span> customer_order_metrics <span className="text-[#41D8FF]">AS</span> ({"\n"}
                            {"    "}<span className="text-[#41D8FF]">SELECT</span> customer_id, order_id, order_amount, order_timestamp,{"\n"}
                            {"           "}<span className="text-amber-400">ROW_NUMBER</span>() <span className="text-[#41D8FF]">OVER</span>(<span className="text-[#41D8FF]">PARTITION BY</span> customer_id <span className="text-[#41D8FF]">ORDER BY</span> order_timestamp) <span className="text-[#41D8FF]">AS</span> order_seq,{"\n"}
                            {"           "}<span className="text-amber-400">DENSE_RANK</span>() <span className="text-[#41D8FF]">OVER</span>(<span className="text-[#41D8FF]">ORDER BY</span> order_amount <span className="text-[#41D8FF]">DESC</span>) <span className="text-[#41D8FF]">AS</span> revenue_rank,{"\n"}
                            {"           "}<span className="text-amber-400">LAG</span>(order_timestamp, 1) <span className="text-[#41D8FF]">OVER</span>(<span className="text-[#41D8FF]">PARTITION BY</span> customer_id <span className="text-[#41D8FF]">ORDER BY</span> order_timestamp) <span className="text-[#41D8FF]">AS</span> prev_order_time{"\n"}
                            {"    "}<span className="text-[#41D8FF]">FROM</span> swiggy_orders_master{"\n"}
                            ){"\n"}
                            <span className="text-[#41D8FF]">SELECT</span> customer_id, order_id, order_amount, order_seq, revenue_rank{"\n"}
                            <span className="text-[#41D8FF]">FROM</span> customer_order_metrics{"\n"}
                            <span className="text-[#41D8FF]">WHERE</span> order_seq &lt;= 3{"\n"}
                            <span className="text-[#41D8FF]">ORDER BY</span> customer_id, order_seq;
                          </div>
                        </div>

                        {/* Live Query Results Table */}
                        <div className="p-3 rounded-xl bg-[#06101D] border border-emerald-500/30 space-y-1 mt-2">
                          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                            <span>▶ Execution Output: 100 Rows Returned in 18ms</span>
                            <span className="text-[#64748B]">Indexed on (customer_id, order_timestamp)</span>
                          </div>
                          <div className="text-[10px] text-slate-300 font-mono">
                            | CUST_8921 | ORD_1092 | ₹ 1,450.00 | Seq: 1 | Rank: 1 |
                          </div>
                        </div>

                        {/* Floating Instructor Camera PIP (Bottom Right) */}
                        <div className="absolute bottom-4 right-4 w-44 sm:w-52 aspect-video rounded-2xl bg-[#081827] border-2 border-[#41D8FF]/60 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-2 z-20">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center font-extrabold text-white text-xs mb-1 shadow-lg">
                            {activeCourseModal.instructor.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-white">{activeCourseModal.instructor}</span>
                          <span className="text-[9px] text-[#41D8FF] font-mono">Speaking • Dolby HD</span>
                          <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[8px] bg-black/70 px-1.5 py-0.5 rounded text-white font-mono">
                            <Mic className="w-2.5 h-2.5 text-emerald-400" /> Host
                          </div>
                        </div>
                      </div>

                      {/* Bottom Replay Control Bar */}
                      <div className="p-3 px-4 bg-[#06101D] border-t border-[#162942] flex items-center justify-between text-xs z-20">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsReplayPlaying(!isReplayPlaying)}
                            className="p-1 text-[#41D8FF] hover:text-white transition-colors cursor-pointer"
                          >
                            {isReplayPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                          <span className="font-mono text-white text-xs">
                            {formatReplayTime(replayTimer)} / {activeCourseModal.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            100% Exact Live Session Stream
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: HD YOUTUBE / LECTURE VIDEO */}
                  {viewMode === "lecture-video" && (
                    <div className="aspect-video w-full rounded-2xl bg-black border border-[#162942] overflow-hidden shadow-2xl relative">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeCourseModal.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        title={activeCourseModal.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}

                  {/* VIEW 3: LIVE SQL QUERY SANDBOX */}
                  {viewMode === "sandbox" && (
                    <div className="p-4 rounded-2xl bg-[#040810] border border-[#162942] space-y-3">
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-[#162942]">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[#41D8FF]" /> Live Interactive SQL Editor
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">Connected to swiggy_orders_master</span>
                      </div>

                      <textarea
                        defaultValue={activeCourseModal.lectureSteps[activeStepIdx]?.codeSnippet || "-- Enter SQL query here"}
                        rows={8}
                        className="w-full bg-transparent text-xs text-emerald-300 font-mono focus:outline-none resize-none"
                      />

                      <div className="flex justify-between items-center pt-1 border-t border-white/5">
                        <span className="text-[10px] text-[#64748B]">Press Run to test live output</span>
                        <button
                          type="button"
                          onClick={() => handleRunCode(activeCourseModal.lectureSteps[activeStepIdx]?.codeSnippet || "")}
                          disabled={isExecuting}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#06101D] font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isExecuting ? "Executing..." : "Execute Query 🚀"}</span>
                        </button>
                      </div>

                      {executedOutput && (
                        <div className="p-3 rounded-2xl bg-[#06101D] border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-400 font-mono">Execution Results:</span>
                          <pre className="text-[10px] text-slate-200 font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
                            {executedOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Instructor Bio & Dataset Download */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#06101D] border border-[#162942]">
                    <div className="flex items-center gap-2.5">
                      <img src={activeCourseModal.avatar} alt={activeCourseModal.instructor} className="w-9 h-9 rounded-full bg-white/10" />
                      <div>
                        <div className="text-xs font-bold text-white">{activeCourseModal.instructor}</div>
                        <div className="text-[11px] text-[#64748B]">{activeCourseModal.instructorTitle}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadDataset(activeCourseModal.datasetName)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Dataset ({activeCourseModal.datasetSize})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Live Synchronized Chat & Interactive Poll Replay */}
              <div className="lg:col-span-4 p-4 space-y-4 bg-[#06101D]/80 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Pinned Classroom Announcement */}
                  <div className="p-3 rounded-2xl bg-[#081827] border border-purple-500/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                      <Pin className="w-3.5 h-3.5 text-purple-400" />
                      <span>Classroom Announcement</span>
                    </div>
                    <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
                      {liveState?.pinnedNotice || "📢 Class Assignment 2 on Window Functions will be released at 11:30 AM today!"}
                    </p>
                  </div>

                  {/* Synchronized Live Interactive Poll Replay */}
                  <div className="p-4 rounded-2xl bg-[#081827] border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Live Poll Asked in Class
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">55 Votes</span>
                    </div>

                    <p className="text-xs font-bold text-white">
                      When calculating running totals in SQL, which clause is required inside OVER()?
                    </p>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold flex justify-between">
                        <span>A. ORDER BY (Correct)</span>
                        <span className="font-mono">87% (48 votes)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#06101D] border border-[#162942] text-slate-400 flex justify-between">
                        <span>B. GROUP BY</span>
                        <span className="font-mono">7% (4 votes)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#06101D] border border-[#162942] text-slate-400 flex justify-between">
                        <span>C. HAVING</span>
                        <span className="font-mono">4% (2 votes)</span>
                      </div>
                    </div>
                  </div>

                  {/* Synchronized Live Student Q&A Chat Feed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white pb-1 border-b border-[#162942]">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-rose-400" /> Live Classroom Q&A Chat Replay
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B]">Real Cohort Discussion</span>
                    </div>

                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {(liveState?.chatMessages || defaultLiveChatMessages).map((m: any) => (
                        <div
                          key={m.id}
                          className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                            m.isInstructor
                              ? "bg-rose-950/40 border border-rose-500/40 text-rose-100 ml-2"
                              : "bg-[#081827] border border-[#162942] text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`font-bold ${m.isInstructor ? "text-rose-400 font-mono" : "text-[#41D8FF]"}`}>
                              {m.sender}
                            </span>
                            <span className="text-[9px] text-[#64748B] font-mono">{m.time}</span>
                          </div>
                          <p className="text-[#CBD5E1] text-[11px]">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mark as Complete */}
                <div className="pt-3 border-t border-[#162942]">
                  <button
                    type="button"
                    onClick={() => toggleDone(activeCourseModal.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      completed[activeCourseModal.id]
                        ? "bg-emerald-500 text-[#06101D]"
                        : "bg-gradient-to-r from-[#397CFF] to-[#41D8FF] text-[#06101D]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completed[activeCourseModal.id] ? "✓ Masterclass Completed" : "Mark Masterclass as Done"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
