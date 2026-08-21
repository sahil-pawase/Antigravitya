"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Radio,
  Send,
  CheckCheck,
  X,
  ChevronRight,
  Sparkles,
  Clock,
  Hand,
  CheckCircle2,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string | null;
  read: boolean;
  dismissed: boolean;
  createdAt: string;
  liveSession?: {
    id: string;
    title: string;
    hostName: string;
    department: string;
    targetLabel?: string | null;
    sessionType?: string | null;
    status: string;
    startedAt: string;
  } | null;
}

export function StudentNotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    try {
      const channel = new BroadcastChannel("career_transformer_zoom_room");
      channel.onmessage = (event) => {
        if (
          event.data?.type === "STREAM_STARTED" ||
          event.data?.type === "STREAM_UPDATED" ||
          event.data?.type === "INSTRUCTOR_PING"
        ) {
          fetchNotifications();
        }
      };
      return () => {
        clearInterval(interval);
        document.removeEventListener("mousedown", handleClickOutside);
        channel.close();
      };
    } catch (e) {
      return () => {
        clearInterval(interval);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_READ" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const handleItemClick = async (notif: NotificationItem) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: notif.id, action: "READ" }),
      });
    } catch (e) {}
    setIsOpen(false);
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-[#081827] border border-[#162942] text-[#94A3B8] hover:text-white hover:border-[#397CFF]/50 transition-all cursor-pointer shadow-md group"
        title="Notifications"
      >
        <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#040B14] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#081827]/95 backdrop-blur-xl border border-[#162942] shadow-2xl z-50 overflow-hidden animate-fadeIn text-xs">
          {/* Header */}
          <div className="p-3.5 px-4 bg-[#0C1A2B] border-b border-[#162942] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-[#41D8FF] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-[#162942]/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-[#64748B] space-y-1">
                <Bell className="w-6 h-6 mx-auto opacity-40 text-[#94A3B8]" />
                <p className="text-xs text-[#94A3B8]">No notifications yet.</p>
                <p className="text-[10px] text-[#64748B]">
                  Live class invites and mentor updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isLive = notif.type === "LIVE_SESSION_CALL";
                const isInvite = notif.type === "LIVE_SESSION_INVITATION";

                return (
                  <Link
                    key={notif.id}
                    href={notif.actionUrl || "/dashboard/live"}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 px-4 flex items-start gap-3 hover:bg-[#0C1A2B]/80 transition-colors group cursor-pointer ${
                      !notif.read ? "bg-[#397CFF]/5" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isLive
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : isInvite
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-[#0C1A2B] text-[#41D8FF] border border-[#162942]"
                      }`}
                    >
                      {isLive ? (
                        <Radio className="w-4 h-4 animate-pulse" />
                      ) : isInvite ? (
                        <Send className="w-3.5 h-3.5" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`font-black text-[11px] truncate ${
                            isLive ? "text-rose-400" : isInvite ? "text-cyan-400" : "text-white"
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-[#64748B] flex-shrink-0 font-mono">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>

                      <p className="text-white text-[11px] leading-tight line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.liveSession?.targetLabel && (
                        <span className="inline-block text-[9px] font-bold text-amber-300 bg-[#0C1A2B] px-2 py-0.5 rounded border border-[#162942]">
                          🎯 {notif.liveSession.targetLabel}
                        </span>
                      )}
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#41D8FF] flex-shrink-0 mt-2" />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 text-center bg-[#0C1A2B]/60 border-t border-[#162942]">
            <Link
              href="/dashboard/live"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-[#41D8FF] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Go to Live Classroom</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
