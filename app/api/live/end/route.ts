import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json(
        { error: "Unauthorized: Only instructors and admins can end a live broadcast." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const liveSessionId = body.liveSessionId;

    // Find and update active live session
    const whereClause: any = {
      status: "LIVE",
    };
    if (liveSessionId) {
      whereClause.id = liveSessionId;
    } else if (session.role === "INSTRUCTOR") {
      whereClause.hostId = session.id;
    }

    const updated = await prisma.liveSession.updateMany({
      where: whereClause,
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    // Update in-memory state
    if (global.__liveClassState) {
      global.__liveClassState.isLive = false;
    }

    return NextResponse.json({
      success: true,
      message: "Live session ended successfully",
      sessionsEnded: updated.count,
    });
  } catch (err: any) {
    console.error("POST /api/live/end error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to end live session" },
      { status: 500 }
    );
  }
}
