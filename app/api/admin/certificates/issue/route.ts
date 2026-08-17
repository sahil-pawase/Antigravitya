import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, courseId, grade } = await request.json();
    if (!userId || !courseId) {
      return NextResponse.json({ error: "User ID and Course ID are required" }, { status: 400 });
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const certificateId = `CT-DA-${new Date().getFullYear()}-${randomSuffix}`;

    const cert = await prisma.certificate.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        certificateId,
        issueDate: new Date(),
        verificationUrl: `/verify/${certificateId}`,
        status: "ISSUED",
        grade: grade || "Distinction",
      },
      create: {
        certificateId,
        userId,
        courseId,
        issueDate: new Date(),
        verificationUrl: `/verify/${certificateId}`,
        status: "ISSUED",
        grade: grade || "Distinction",
      },
    });

    return NextResponse.json({ success: true, certificate: cert });
  } catch (error) {
    console.error("Issue certificate error:", error);
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}
