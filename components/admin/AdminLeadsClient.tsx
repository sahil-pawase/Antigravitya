"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { Input, Select } from "@/ui/Input";
import {
  MessageSquare,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  currentStatus: string;
  interestedCourse: string;
  message?: string | null;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "ENROLLED" | "LOST";
  adminNotes?: string | null;
  createdAt: Date | string;
}

export function AdminLeadsClient({ initialLeads }: { initialLeads: LeadRecord[] }) {
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch("/api/admin/leads/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: newStatus as LeadRecord["status"] } : l
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admissions Lead CRM</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage inquiries, qualify prospective students, and record admissions counseling notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#081827] border border-[#162942] flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#06101D] border border-[#162942] text-xs text-white placeholder-[#64748B] focus:border-[#397CFF] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#64748B] flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#06101D] border border-[#162942] text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="ENROLLED">ENROLLED</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Candidate Info</th>
                <th className="p-4">Profile & Background</th>
                <th className="p-4">Inquiry / Message</th>
                <th className="p-4">Date</th>
                <th className="p-4">CRM Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {filteredLeads.map((lead) => {
                const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${lead.name}, this is Career Transformer Admissions regarding your Data Analytics Demo request.`
                )}`;

                return (
                  <tr key={lead.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-white block text-sm">{lead.name}</span>
                      <span className="text-[#94A3B8] block text-[11px]">{lead.email}</span>
                      <span className="text-[#41D8FF] block font-mono text-[11px]">📞 {lead.phone}</span>
                    </td>

                    <td className="p-4 space-y-1">
                      <span className="text-white font-medium block">{lead.education}</span>
                      <span className="text-[11px] text-[#64748B] block">{lead.currentStatus}</span>
                      <span className="text-[10px] text-[#397CFF] bg-[#397CFF]/10 px-2 py-0.5 rounded border border-[#397CFF]/20 inline-block mt-0.5">
                        {lead.interestedCourse}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      {lead.message ? (
                        <p className="text-[#94A3B8] italic text-[11px] line-clamp-2">
                          "{lead.message}"
                        </p>
                      ) : (
                        <span className="text-[#64748B] text-[11px]">No specific message</span>
                      )}
                      <span className="text-[10px] text-[#64748B] block mt-1">Source: {lead.source}</span>
                    </td>

                    <td className="p-4 text-[#94A3B8] whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updatingId === lead.id}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                          lead.status === "NEW"
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                            : lead.status === "CONTACTED"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : lead.status === "QUALIFIED"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : lead.status === "ENROLLED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="ENROLLED">ENROLLED</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-bold text-xs border border-[#25D366]/30 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
