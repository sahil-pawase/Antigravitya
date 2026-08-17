"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { Input, Textarea } from "@/ui/Input";
import { Modal } from "@/ui/Modal";
import { FileText, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface AssignmentReviewItem {
  id: string;
  submissionContent: string;
  fileUrl?: string | null;
  status: "PENDING" | "SUBMITTED" | "REVIEWED" | "REJECTED";
  marksObtained?: number | null;
  feedback?: string | null;
  createdAt: Date | string;
  student: {
    id: string;
    email: string;
    fullName: string;
  };
  assignment: {
    id: string;
    title: string;
    totalMarks: number;
    moduleTitle: string;
  };
}

export function AdminAssignmentReviewClient({
  initialSubmissions,
}: {
  initialSubmissions: AssignmentReviewItem[];
}) {
  const [submissions, setSubmissions] =
    useState<AssignmentReviewItem[]>(initialSubmissions);
  const [selectedSub, setSelectedSub] = useState<AssignmentReviewItem | null>(null);
  const [marks, setMarks] = useState<number>(85);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openReviewModal = (sub: AssignmentReviewItem) => {
    setSelectedSub(sub);
    setMarks(sub.marksObtained || 85);
    setFeedback(sub.feedback || "");
    setError(null);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/assignments/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedSub.id,
          marksObtained: Number(marks),
          feedback,
          status: "REVIEWED",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit assignment review");

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSub.id
            ? { ...s, marksObtained: marks, feedback, status: "REVIEWED" }
            : s
        )
      );
      setSelectedSub(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to grade assignment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Assignment Grading Queue
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Review written solutions, SQL queries, and grade end-of-module tasks.
        </p>
      </div>

      <div className="rounded-2xl bg-[#081827] border border-[#162942] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0C1A2B] text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#162942]">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Assignment / Module</th>
                <th className="p-4">Submission Content</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162942]">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64748B]">
                    No assignment submissions in queue.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#0C1A2B]/50 transition-colors">
                    <td className="p-4 space-y-0.5">
                      <span className="font-bold text-white block text-sm">
                        {sub.student.fullName}
                      </span>
                      <span className="text-[#94A3B8] text-[11px] block">{sub.student.email}</span>
                    </td>

                    <td className="p-4 space-y-1">
                      <span className="text-white font-semibold block">{sub.assignment.title}</span>
                      <span className="text-[10px] text-[#41D8FF]">{sub.assignment.moduleTitle}</span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-[#94A3B8] text-[11px] line-clamp-2">
                        {sub.submissionContent}
                      </p>
                      {sub.fileUrl && (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#397CFF] hover:underline text-[10px] flex items-center gap-1 mt-1 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" /> Attached File
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
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-white">
                      {sub.marksObtained !== null && sub.marksObtained !== undefined
                        ? `${sub.marksObtained}/${sub.assignment.totalMarks}`
                        : "—"}
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openReviewModal(sub)}
                        className="font-bold text-xs"
                      >
                        {sub.status === "REVIEWED" ? "Update Marks" : "Grade Submission"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSub && (
        <Modal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={`Grade: ${selectedSub.assignment.title}`}
          description={`Student: ${selectedSub.student.fullName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-2 text-xs">
              <span className="font-bold text-[#41D8FF]">Submitted Solution:</span>
              <p className="text-[#F5F8FC] whitespace-pre-line">{selectedSub.submissionContent}</p>
            </div>

            <Input
              label={`Marks (out of ${selectedSub.assignment.totalMarks}) *`}
              type="number"
              min={0}
              max={selectedSub.assignment.totalMarks}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              required
            />

            <Textarea
              label="Feedback for Student"
              placeholder="Good formulation of SQL query. Suggestions on optimization..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
            />

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full justify-center font-bold"
              isLoading={isLoading}
            >
              Submit Grade →
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
