"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Video,
  Users,
  Clock,
  Sparkles,
  Calendar,
  MessageSquare,
  PlayCircle,
  Download,
  Send,
  HelpCircle,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Pin,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { ZoomLiveRoom } from "@/components/live/ZoomLiveRoom";

export default function LiveClassesPage() {
  const [liveData, setLiveData] = useState<any>(null);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiveSession = async () => {
    try {
      const res = await fetch("/api/live-class");
      const data = await res.json();
      if (data.success && data.state) {
        setLiveData(data.state);
        if (data.user && data.state.activePoll?.userVotes?.[data.user.id]) {
          setUserVote(data.state.activePoll.userVotes[data.user.id]);
        }
      }
    } catch (err) {
      console.error("Error fetching live session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSession();
    const interval = setInterval(fetchLiveSession, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    setIsSendingChat(true);
    try {
      const res = await fetch("/api/live-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SEND_CHAT", text: chatInput.trim() }),
      });
      if (res.ok) {
        setChatInput("");
        fetchLiveSession();
      }
    } catch (err) {
      console.error("Failed to send chat:", err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleVote = async (optionId: string) => {
    setUserVote(optionId);
    try {
      const res = await fetch("/api/live-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VOTE_POLL", optionId }),
      });
      if (res.ok) {
        fetchLiveSession();
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const isLive = liveData?.isLive;

  return (
    <div className="space-y-6">
      {/* Pinned Notice if Admin broadcasts one */}
      {liveData?.pinnedNotice && (
        <div className="p-3.5 px-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2.5 shadow-lg animate-fadeIn">
          <Pin className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="font-semibold">{liveData.pinnedNotice}</span>
        </div>
      )}

      {/* 1. Zoom-style Live Stream Meeting Room */}
      <ZoomLiveRoom
        mode="student"
        streamTitle={liveData?.title || "Mastering Real-Time SQL Queries & Window Functions"}
        instructorName={liveData?.instructor || "Sahil Pawase"}
        instructorTitle={liveData?.instructorTitle || "Lead Analytics Architect"}
        viewersCount={liveData?.viewers || 74}
        datasetName={liveData?.datasetName || "swiggy_orders_dataset.csv"}
        onDownloadDataset={() => alert("Exercise file: " + (liveData?.datasetName || "dataset.csv") + " has been downloaded to your computer.")}
      />

      {/* 2. Interactive Poll & Q&A Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Poll & Session Curriculum Details (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Synchronized Live Instructor Poll */}
          {liveData?.activePoll && liveData.activePoll.isActive && (
            <div className="p-5 rounded-2xl bg-[#081827] border border-amber-500/30 space-y-3 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Live Instructor Poll (Broadcast from Studio)
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {liveData.activePoll.totalVotes} Votes Received
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold">
                <strong>Question:</strong> {liveData.activePoll.question}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {liveData.activePoll.options.map((opt: any) => {
                  const isSelected = userVote === opt.id;
                  const pct = liveData.activePoll.totalVotes > 0
                    ? Math.round((opt.votes / liveData.activePoll.totalVotes) * 100)
                    : 0;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleVote(opt.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-400 text-[#06101D] border-amber-400 font-bold shadow-md scale-[1.02]"
                          : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-amber-400/50 hover:text-white"
                      }`}
                    >
                      <span className="block truncate">{opt.text}</span>
                      {userVote && (
                        <span className="block text-[10px] opacity-90 mt-0.5 font-mono">
                          {pct}% ({opt.votes})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Session Overview Card */}
          <div className="p-6 rounded-2xl bg-[#081827] border border-[#162942] space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white">About this Live Mentorship Session</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {liveData?.description || "In-depth interactive code review covering window functions, CTEs, partition keys, and query performance benchmarks on production e-commerce tables."}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#41D8FF]">
              <span className="px-2.5 py-1 rounded-lg bg-[#06101D] border border-[#162942]">#WindowFunctions</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#06101D] border border-[#162942]">#SQLAnalytics</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#06101D] border border-[#162942]">#ECommerceData</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#06101D] border border-[#162942]">#LiveCodeReview</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat Q&A Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-[#081827] border border-[#162942] shadow-2xl flex flex-col h-[520px] overflow-hidden">
            <div className="p-4 border-b border-[#162942] flex items-center justify-between bg-[#06101D]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-white">Live Classroom Q&A Feed</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Chat List */}
            <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
              {liveData?.chatMessages?.map((m: any) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    m.isInstructor
                      ? "bg-rose-950/40 border border-rose-500/40 text-rose-100 shadow-md"
                      : "bg-[#06101D] border border-[#162942] text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold ${m.isInstructor ? "text-rose-400 font-mono" : "text-[#41D8FF]"}`}>
                      {m.sender}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">{m.time}</span>
                  </div>
                  <p className="text-[#CBD5E1]">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Student Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-[#162942] bg-[#06101D] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask instructor a live question..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#081827] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                disabled={isSendingChat}
                className="p-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
