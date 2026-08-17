import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { projectSubmissionSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = projectSubmissionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { projectId, githubUrl, liveDemoUrl, notes } = validated.data;

    const submission = await prisma.projectSubmission.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId: session.id,
        },
      },
      update: {
        githubUrl,
        liveDemoUrl: liveDemoUrl || null,
        notes: notes || null,
        status: "SUBMITTED",
      },
      create: {
        projectId,
        userId: session.id,
        githubUrl,
        liveDemoUrl: liveDemoUrl || null,
        notes: notes || null,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project submitted for instructor evaluation",
      submission,
    });
  } catch (error) {
    console.error("Project submission error:", error);
    return NextResponse.json({ error: "Failed to submit project" }, { status: 500 });
  }
}
