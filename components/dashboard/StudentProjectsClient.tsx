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
  Sparkles,
  Download,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ProjectWithSubmission {
  id: string;
  title: string;
  category: string;
  skills: string;
  description: string;
  instructions: string;
  datasetUrl?: string | null;
  orderIndex: number;
  submission?: {
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
  } | null;
}

export function StudentProjectsClient({
  projects,
}: {
  projects: ProjectWithSubmission[];
}) {
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithSubmission | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const openSubmitModal = (p: ProjectWithSubmission) => {
    setSelectedProject(p);
    setGithubUrl(p.submission?.githubUrl || "");
    setLiveDemoUrl(p.submission?.liveDemoUrl || "");
    setNotes(p.submission?.notes || "");
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submissions/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          githubUrl,
          liveDemoUrl,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project");
      }

      setSuccessMsg("Project submitted successfully for instructor evaluation!");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portfolio Projects Workbench
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Build 6 enterprise-grade projects, submit your GitHub repositories, and receive line-by-line mentor code reviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((p) => {
          const sub = p.submission;

          return (
            <div
              key={p.id}
              className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-5 flex flex-col justify-between hover:border-[#397CFF]/50 transition-colors shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-[#0C1A2B] text-[#41D8FF] border border-[#162942] text-xs font-bold">
                    {p.category}
                  </span>
                  {sub ? (
                    sub.status === "REVIEWED" ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved ({sub.score}/100)
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <Clock className="w-3.5 h-3.5" /> Under Mentor Review
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" size="sm">
                      Not Submitted
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">
                    0{p.orderIndex}. {p.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06101D] border border-[#162942] space-y-1.5 text-xs">
                  <span className="font-bold text-[#64748B] uppercase tracking-wider block text-[10px]">
                    Implementation Blueprint:
                  </span>
                  <p className="text-[#94A3B8] whitespace-pre-line leading-relaxed text-[11px]">
                    {p.instructions}
                  </p>
                </div>

                {/* If submitted: show submission link & mentor feedback */}
                {sub && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#0C1A2B] border border-[#162942] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <a
                          href={sub.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#41D8FF] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <FolderGit2 className="w-3.5 h-3.5" /> View Submitted GitHub Repo →
                        </a>
                        <span className="text-[10px] text-[#64748B]">
                          {formatDate(sub.createdAt)}
                        </span>
                      </div>

                      {sub.liveDemoUrl && (
                        <a
                          href={sub.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-medium text-[11px] block"
                        >
                          <ExternalLink className="w-3 h-3" /> Live BI Dashboard View
                        </a>
                      )}
                    </div>

                    {sub.feedback && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>Mentor Feedback ({sub.score}/100):</span>
                          <span className="text-[10px] text-emerald-300/80">
                            Reviewed by {sub.reviewedBy || "Faculty"}
                          </span>
                        </div>
                        <p className="text-[#F5F8FC] leading-relaxed text-xs">
                          "{sub.feedback}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#162942] flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1">
                  {p.skills.split(",").map((s) => (
                    <span
                      key={s.trim()}
                      className="px-2 py-0.5 rounded bg-[#06101D] text-[#94A3B8] text-[10px] border border-[#162942]"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>

                <Button
                  variant={sub?.status === "REVIEWED" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => openSubmitModal(p)}
                  className="font-bold text-xs flex-shrink-0"
                >
                  {sub ? "Update Submission" : "Submit GitHub Repo"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`Submit Project: ${selectedProject.title}`}
          description="Provide your public GitHub repository URL containing your queries, scripts, and documentation."
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

            <Input
              label="GitHub Repository URL *"
              placeholder="https://github.com/your-username/sales-intelligence-project"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
            />

            <Input
              label="Live Dashboard URL (Power BI / Tableau Public - Optional)"
              placeholder="https://app.powerbi.com/view?r=..."
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
            />

            <Textarea
              label="Implementation Notes & Summary for Mentor"
              placeholder="Explain your data modeling choices, DAX measures or Python EDA conclusions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full justify-center font-bold"
              isLoading={isLoading}
            >
              Submit Project for Evaluation →
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
