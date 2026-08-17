import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StudentProjectsClient } from "@/components/dashboard/StudentProjectsClient";

export default async function StudentProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const projects = await prisma.project.findMany({
    orderBy: { orderIndex: "asc" },
  });

  const submissions = await prisma.projectSubmission.findMany({
    where: { userId: session.id },
  });

  const submissionMap = new Map(submissions.map((s) => [s.projectId, s]));

  const projectsWithSubmissions = projects.map((p) => ({
    ...p,
    submission: submissionMap.get(p.id) || null,
  }));

  return <StudentProjectsClient projects={projectsWithSubmissions} />;
}
