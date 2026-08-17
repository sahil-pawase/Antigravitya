import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, courseId, status } = await request.json();
    if (!userId || !courseId) {
      return NextResponse.json({ error: "User ID and Course ID are required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: status || "ACTIVE",
      },
      create: {
        userId,
        courseId,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Manual enrollment error:", error);
    return NextResponse.json({ error: "Failed to manage enrollment" }, { status: 500 });
  }
}
