import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assignmentSubmissionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = assignmentSubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { assignmentId, submissionContent, fileUrl } = validated.data;

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
        status: "SUBMITTED",
      },
      create: {
        assignmentId,
        userId: session.id,
        submissionContent,
        fileUrl: fileUrl || null,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}
