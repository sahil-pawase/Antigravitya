import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminStudentsClient } from "@/components/admin/AdminStudentsClient";

export default async function AdminStudentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      profile: true,
      enrollments: true,
      lessonProgress: { where: { isCompleted: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const studentsList = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    profile: u.profile,
    enrollmentsCount: u.enrollments.length,
    completedLessonsCount: u.lessonProgress.length,
  }));

  return <AdminStudentsClient initialStudents={studentsList} />;
}
