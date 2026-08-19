import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const assignments = await prisma.assignment.findMany({
    include: {
      module: {
        include: { course: true },
      },
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const modules = await prisma.module.findMany({
    include: { course: true },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json({
    success: true,
    assignments,
    modules,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, moduleId, totalMarks, orderIndex } = body;

    if (!title || !description || !moduleId) {
      return NextResponse.json(
        { error: "Title, description, and module are required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        moduleId,
        totalMarks: Number(totalMarks) || 100,
        orderIndex: Number(orderIndex) || 1,
      },
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create assignment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Assignment ID is required" }, { status: 400 });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
