"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { Input, Textarea } from "@/ui/Input";
import { Modal } from "@/ui/Modal";
import { FileText, CheckCircle2, Clock, UploadCloud, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface AssignmentWithSubmission {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  moduleTitle: string;
  submission?: {
    id: string;
    submissionContent: string;
    fileUrl?: string | null;
    status: "PENDING" | "SUBMITTED" | "REVIEWED" | "REJECTED";
    marksObtained?: number | null;
    feedback?: string | null;
    reviewedAt?: Date | string | null;
    createdAt: Date | string;
  } | null;
}

export function StudentAssignmentsClient({
  assignments,
}: {
  assignments: AssignmentWithSubmission[];
}) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentWithSubmission | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const openModal = (a: AssignmentWithSubmission) => {
    setSelectedAssignment(a);
    setSubmissionContent(a.submission?.submissionContent || "");
    setFileUrl(a.submission?.fileUrl || "");
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submissions/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          submissionContent,
          fileUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit assignment");
      }

      setSuccessMsg("Assignment submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during submission.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Module Capstone Assignments
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Complete practical evaluations at the end of each module to test your analytical mastery.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((a) => {
          const sub = a.submission;

          return (
            <div
              key={a.id}
              className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 hover:border-[#397CFF]/50 transition-colors shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#41D8FF] uppercase tracking-wider block">
                    {a.moduleTitle}
                  </span>
                  <h3 className="text-lg font-bold text-white">{a.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8] font-semibold">
                    Max Marks: {a.totalMarks}
                  </span>
                  {sub ? (
                    sub.status === "REVIEWED" ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Graded ({sub.marksObtained}/{a.totalMarks})
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <Clock className="w-3.5 h-3.5" /> Submitted
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" size="sm">
                      Pending Submission
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {a.description}
              </p>

              {sub && (
                <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Your Submission:</span>
                    <span className="text-[10px] text-[#64748B]">{formatDate(sub.createdAt)}</span>
                  </div>
                  <p className="text-[#F5F8FC] whitespace-pre-line text-xs">
                    {sub.submissionContent}
                  </p>
                  {sub.feedback && (
                    <div className="pt-2 border-t border-[#162942] text-emerald-400">
                      <strong>Instructor Feedback:</strong> {sub.feedback}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button
                  variant={sub ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => openModal(a)}
                  className="font-bold text-xs"
                >
                  {sub ? "Edit Solution" : "Submit Assignment"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={`Submit: ${selectedAssignment.title}`}
          description="Provide your written analysis, SQL queries, or repository link."
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400">
                {successMsg}
              </div>
            )}

            <Textarea
              label="Solution Explanation & Query Results *"
              placeholder="Paste your SQL queries, DAX formulas, or analytical breakdown here..."
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              rows={4}
              required
            />

            <Input
              label="File Link (Google Drive / GitHub / OneDrive - Optional)"
              placeholder="https://drive.google.com/..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full justify-center font-bold"
              isLoading={isLoading}
            >
              Submit Assignment for Review →
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
