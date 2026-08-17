import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { projectReviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validated = projectReviewSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { submissionId, score, feedback, status } = validated.data;

    const submission = await prisma.projectSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        status,
        reviewedBy: `${session.fullName} (${session.role})`,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Project review error:", error);
    return NextResponse.json({ error: "Failed to submit project review" }, { status: 500 });
  }
}
