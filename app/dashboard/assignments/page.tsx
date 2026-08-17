import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StudentAssignmentsClient } from "@/components/dashboard/StudentAssignmentsClient";

export default async function StudentAssignmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const assignments = await prisma.assignment.findMany({
    include: {
      module: {
        select: { title: true },
      },
    },
    orderBy: { orderIndex: "asc" },
  });

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { userId: session.id },
  });

  const submissionMap = new Map(submissions.map((s) => [s.assignmentId, s]));

  const assignmentsWithSubmissions = assignments.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    totalMarks: a.totalMarks,
    moduleTitle: a.module.title,
    submission: submissionMap.get(a.id) || null,
  }));

  return <StudentAssignmentsClient assignments={assignmentsWithSubmissions} />;
}
