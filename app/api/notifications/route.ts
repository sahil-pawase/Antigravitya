import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { studentId: session.id },
      include: {
        liveSession: {
          select: {
            id: true,
            title: true,
            hostName: true,
            department: true,
            departmentId: true,
            targetType: true,
            targetLabel: true,
            sessionType: true,
            status: true,
            startedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { notificationId, liveSessionId, action, token } = body;

    // 1. Register Push Notification Token (FCM / Browser Push)
    if (action === "REGISTER_TOKEN" && token) {
      await prisma.user.update({
        where: { id: session.id },
        data: { notificationToken: token },
      });
      return NextResponse.json({ success: true, message: "Push token registered" });
    }

    // 2. Mark All Read
    if (action === "MARK_ALL_READ") {
      await prisma.notification.updateMany({
        where: { studentId: session.id },
        data: { read: true },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    // 3. Dismiss or Read Single Notification
    if (action === "DISMISS" || action === "READ") {
      if (notificationId) {
        await prisma.notification.updateMany({
          where: {
            id: notificationId,
            studentId: session.id,
          },
          data: {
            read: true,
            ...(action === "DISMISS" ? { dismissed: true } : {}),
          },
        });
      } else if (liveSessionId) {
        await prisma.notification.updateMany({
          where: {
            liveSessionId,
            studentId: session.id,
          },
          data: {
            read: true,
            ...(action === "DISMISS" ? { dismissed: true } : {}),
          },
        });
      }

      return NextResponse.json({ success: true, message: `Notification ${action.toLowerCase()}ed` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/notifications error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process notification action" },
      { status: 500 }
    );
  }
}
