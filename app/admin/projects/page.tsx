import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminProjectReviewClient } from "@/components/admin/AdminProjectReviewClient";

export default async function AdminProjectsReviewPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const submissions = await prisma.projectSubmission.findMany({
    include: {
      user: {
        include: { profile: true },
      },
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedSubmissions = submissions.map((sub) => ({
    id: sub.id,
    githubUrl: sub.githubUrl,
    liveDemoUrl: sub.liveDemoUrl,
    notes: sub.notes,
    status: sub.status,
    score: sub.score,
    feedback: sub.feedback,
    reviewedBy: sub.reviewedBy,
    reviewedAt: sub.reviewedAt,
    createdAt: sub.createdAt,
    student: {
      id: sub.user.id,
      email: sub.user.email,
      fullName: sub.user.profile?.fullName || "Student",
    },
    project: {
      id: sub.project.id,
      title: sub.project.title,
      category: sub.project.category,
      orderIndex: sub.project.orderIndex,
    },
  }));

  return <AdminProjectReviewClient initialSubmissions={formattedSubmissions} />;
}
