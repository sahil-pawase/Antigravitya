import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminAssignmentReviewClient } from "@/components/admin/AdminAssignmentReviewClient";

export default async function AdminAssignmentsPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const submissions = await prisma.assignmentSubmission.findMany({
    include: {
      user: { include: { profile: true } },
      assignment: { include: { module: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const assignments = await prisma.assignment.findMany({
    include: {
      module: { include: { course: true } },
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const modules = await prisma.module.findMany({
    include: { course: true },
    orderBy: { orderIndex: "asc" },
  });

  const formattedSubmissions = submissions.map((sub) => ({
    id: sub.id,
    submissionContent: sub.submissionContent,
    fileUrl: sub.fileUrl,
    status: sub.status,
    marksObtained: sub.marksObtained,
    feedback: sub.feedback,
    createdAt: sub.createdAt,
    student: {
      id: sub.user.id,
      email: sub.user.email,
      fullName: sub.user.profile?.fullName || "Student",
    },
    assignment: {
      id: sub.assignment.id,
      title: sub.assignment.title,
      totalMarks: sub.assignment.totalMarks,
      moduleTitle: sub.assignment.module.title,
    },
  }));

  return (
    <AdminAssignmentReviewClient
      initialSubmissions={formattedSubmissions}
      initialAssignments={assignments}
      modules={modules}
    />
  );
}
