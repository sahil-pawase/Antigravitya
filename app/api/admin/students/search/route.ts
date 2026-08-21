import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const department = searchParams.get("department");

    const whereClause: any = {
      role: "STUDENT",
      status: "ACTIVE",
    };

    if (department && department !== "ALL") {
      whereClause.profile = {
        departmentId: department,
      };
    }

    if (q) {
      whereClause.OR = [
        { email: { contains: q, mode: "insensitive" } },
        { profile: { fullName: { contains: q, mode: "insensitive" } } },
        { profile: { city: { contains: q, mode: "insensitive" } } },
        { profile: { college: { contains: q, mode: "insensitive" } } },
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            fullName: true,
            department: true,
            departmentId: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const formatted = students.map((s) => ({
      id: s.id,
      email: s.email,
      name: s.profile?.fullName || "Student",
      department: s.profile?.department || "Computer Engineering",
      departmentId: s.profile?.departmentId || "COMP_ENG",
      phone: s.profile?.phone || null,
      avatarUrl: s.profile?.avatarUrl || null,
    }));

    return NextResponse.json({
      success: true,
      students: formatted,
      totalCount: formatted.length,
    });
  } catch (err: any) {
    console.error("GET /api/admin/students/search error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to search students" },
      { status: 500 }
    );
  }
}
