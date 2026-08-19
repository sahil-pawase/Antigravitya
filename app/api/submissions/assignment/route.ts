import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, submissionContent, fileUrl, marksObtained, feedback, status } = body;

    if (!assignmentId || !submissionContent) {
      return NextResponse.json({ error: "Assignment ID and submission content are required." }, { status: 400 });
    }

    const finalStatus = status || (marksObtained !== undefined && marksObtained !== null ? "REVIEWED" : "SUBMITTED");

    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId: session.id,
        },
      },
      update: {
        submissionContent,
        fileUrl: fileUrl || null,
        status: finalStatus,
        marksObtained: marksObtained !== undefined ? Number(marksObtained) : undefined,
        feedback: feedback || undefined,
        reviewedAt: finalStatus === "REVIEWED" ? new Date() : undefined,
      },
      create: {
        assignmentId,
        userId: session.id,
        submissionContent,
        fileUrl: fileUrl || null,
        status: finalStatus,
        marksObtained: marksObtained !== undefined ? Number(marksObtained) : null,
        feedback: feedback || null,
        reviewedAt: finalStatus === "REVIEWED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Assignment assessment saved successfully",
      submission,
    });
  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}
