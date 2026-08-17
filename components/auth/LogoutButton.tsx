"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  label?: string;
  variant?: "sidebar" | "navbar" | "danger" | "ghost";
  iconOnly?: boolean;
}

export function LogoutButton({
  className,
  label = "Log Out",
  variant = "sidebar",
  iconOnly = false,
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      // Force a clean hard refresh and navigation to /login?logout=success
      window.location.href = "/login?logout=success";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/login?logout=success";
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        title={label}
        aria-label={label}
        className={cn(
          "p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer disabled:opacity-50",
          className
        )}
      >
        {isLoggingOut ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      type="button"
      className={cn(
        "w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/30 transition-all duration-200 cursor-pointer disabled:opacity-50 group shadow-sm",
        className
      )}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
