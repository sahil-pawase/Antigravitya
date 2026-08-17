"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: "floating" | "inline";
}

export function WhatsAppButton({
  message = "Hi Career Transformer, I would like to learn more about the Data Analytics Career Program and upcoming cohort admissions.",
  className = "",
  variant = "floating",
}: WhatsAppButtonProps) {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const sanitizedNumber = rawNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;

  if (variant === "inline") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#06101D] font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#25D366]/25 cursor-pointer ${className}`}
      >
        <MessageSquare className="w-4 h-4 fill-current" />
        <span>Chat on WhatsApp</span>
      </a>
    );
  }

  return (
    <aside aria-label="WhatsApp Chat Support">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#06101D] font-bold text-sm shadow-2xl shadow-[#25D366]/40 transition-shadow duration-300 group ${className}`}
        aria-label="Chat on WhatsApp with Admissions"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline tracking-tight font-extrabold">Chat with Academic Advisor</span>
      </motion.a>
    </aside>
  );
}
