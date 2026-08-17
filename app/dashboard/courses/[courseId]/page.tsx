import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { CoursePlayerClient } from "@/components/dashboard/CoursePlayerClient";

interface CoursePlayerPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
            include: {
              resources: true,
            },
          },
          assignments: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // Fetch student completed lessons
  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      userId: session.id,
      isCompleted: true,
    },
    select: { lessonId: true },
  });

  const completedLessonIds = progressRecords.map((p) => p.lessonId);

  return (
    <CoursePlayerClient
      course={{
        id: course.id,
        title: course.title,
        tagline: course.tagline,
        modules: course.modules,
        completedLessonIds,
      }}
    />
  );
}
