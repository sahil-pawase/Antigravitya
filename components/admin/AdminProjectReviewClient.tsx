"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { Input, Textarea } from "@/ui/Input";
import { Modal } from "@/ui/Modal";
import {
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface SubmissionReviewItem {
  id: string;
  githubUrl: string;
  liveDemoUrl?: string | null;
  notes?: string | null;
  status: "PENDING" | "SUBMITTED" | "REVIEWED" | "REJECTED";
  score?: number | null;
  feedback?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | string | null;
  createdAt: Date | string;
  student: {
    id: string;
    email: string;
    fullName: string;
  };
  project: {
    id: string;
    title: string;
    category: string;
    orderIndex: number;
  };
}

export function AdminProjectReviewClient({
  initialSubmissions,
}: {
  initialSubmissions: SubmissionReviewItem[];
}) {
  const [submissions, setSubmissions] =
    useState<SubmissionReviewItem[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<SubmissionReviewItem | null>(null);
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"REVIEWED" | "REJECTED">("REVIEWED");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openReviewModal = (sub: SubmissionReviewItem) => {
    setSelectedSub(sub);
    setScore(sub.score || 90);
    setFeedback(sub.feedback || "");
    setStatus(sub.status === "REJECTED" ? "REJECTED" : "REVIEWED");
    setError(null);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/projects/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSub.id,
          score: Number(score),
          feedback,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setSubmissions((prev) =>
        prev.map((s) => (s.id === selectedSub.id ? { ...s, score, feedback, status } : s))
      );
      setSelectedSub(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to grade project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Project Evaluation & Grading Queue
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Review student GitHub repositories, inspect SQL data models, and provide qualitative mentor feedback.
        </p>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Project Title</th>
                <th className="p-4">Repository & Live Links</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Evaluation Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                  <td className="p-4 space-y-0.5">
                    <span className="font-bold text-white block text-sm">
                      {sub.student.fullName}
                    </span>
                    <span className="text-[#94A3B8] text-[11px] block">
                      {sub.student.email}
                    </span>
                  </td>

                  <td className="p-4 space-y-1">
                    <span className="text-white font-semibold block">
                      0{sub.project.orderIndex}. {sub.project.title}
                    </span>
                    <span className="text-[10px] text-[#41D8FF] bg-[#0C1A2B] px-2 py-0.5 rounded border border-[#162942]">
                      {sub.project.category}
                    </span>
                  </td>

                  <td className="p-4 space-y-1">
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#397CFF] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" /> View GitHub Repo →
                    </a>
                    {sub.liveDemoUrl && (
                      <a
                        href={sub.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-medium text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" /> Live Dashboard
                      </a>
                    )}
                  </td>

                  <td className="p-4 text-[#94A3B8] whitespace-nowrap">
                    {formatDate(sub.createdAt)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        sub.status === "REVIEWED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : sub.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {sub.score !== null && sub.score !== undefined ? `${sub.score}/100` : "—"}
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openReviewModal(sub)}
                      className="font-bold text-xs"
                    >
                      {sub.status === "REVIEWED" ? "Update Score" : "Grade & Review"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Grade: ${selectedSub.project.title}`}
          description={`Evaluating student submission by ${selectedSub.student.fullName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-2 text-xs">
              <span className="font-bold text-[#41D8FF]">Repository Links:</span>
              <a
                href={selectedSub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#397CFF] hover:underline block truncate font-mono"
              >
                {selectedSub.githubUrl}
              </a>
              {selectedSub.notes && (
                <p className="text-[#94A3B8] italic pt-1 border-t border-[#162942]">
                  Student notes: "{selectedSub.notes}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Score (out of 100) *"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
                  Review Decision *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "REVIEWED" | "REJECTED")}
                  className="w-full rounded-lg bg-[#06101D] border border-[#162942] px-3.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="REVIEWED">APPROVED (Passed)</option>
                  <option value="REJECTED">REJECTED (Needs Rework)</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Line-by-Line Qualitative Mentor Feedback *"
              placeholder="Detail strengths in SQL data modeling, DAX efficiency, and specific areas for visual optimization..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              required
            />

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full justify-center font-bold"
              isLoading={isLoading}
            >
              Submit Grade & Feedback to Student Portal →
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
