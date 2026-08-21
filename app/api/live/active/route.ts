import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeDepartment } from "@/lib/departments";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { isLive: false, liveSession: null, error: "Authentication required" },
        { status: 401 }
      );
    }

    // 1. Fetch user's verified department and profile from Database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { profile: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return NextResponse.json({ isLive: false, liveSession: null }, { status: 403 });
    }

    const userDeptInfo = normalizeDepartment(user.profile?.departmentId || user.profile?.department);
    const userDeptId = userDeptInfo.departmentId;

    // 2. If student: Find active LIVE session and check if the student is targeted
    if (user.role === "STUDENT") {
      const activeSessions = await prisma.liveSession.findMany({
        where: {
          status: "LIVE",
        },
        orderBy: { startedAt: "desc" },
        take: 5,
      });

      // Find the session that targets this student
      let matchedSession: any = null;

      for (const s of activeSessions) {
        if (s.targetType === "ALL") {
          matchedSession = s;
          break;
        } else if (s.targetType === "DEPARTMENT" || s.targetType === "DEPARTMENTS") {
          if (s.targetDepartmentIds.includes(userDeptId)) {
            matchedSession = s;
            break;
          }
        } else if (s.targetType === "STUDENTS") {
          if (s.targetStudentIds.includes(user.id)) {
            matchedSession = s;
            break;
          }
        }
      }

      if (!matchedSession) {
        return NextResponse.json({
          isLive: false,
          liveSession: null,
          userDepartment: userDeptInfo.departmentName,
          userDepartmentId: userDeptInfo.departmentId,
        });
      }

      // Check notification record for this student
      const notification = await prisma.notification.findUnique({
        where: {
          studentId_liveSessionId: {
            studentId: user.id,
            liveSessionId: matchedSession.id,
          },
        },
      });

      return NextResponse.json({
        isLive: true,
        liveSession: {
          id: matchedSession.id,
          hostId: matchedSession.hostId,
          hostName: matchedSession.hostName,
          department: matchedSession.department,
          departmentId: matchedSession.departmentId,
          title: matchedSession.title,
          description: matchedSession.description,
          targetType: matchedSession.targetType,
          targetLabel: matchedSession.targetLabel || matchedSession.department,
          sessionType: matchedSession.sessionType,
          status: matchedSession.status,
          startedAt: matchedSession.startedAt,
          datasetName: matchedSession.datasetName,
          datasetUrl: matchedSession.datasetUrl,
          viewers: matchedSession.viewers,
        },
        notification: notification
          ? {
              id: notification.id,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              read: notification.read,
              dismissed: notification.dismissed,
              createdAt: notification.createdAt,
            }
          : null,
        isDismissed: notification?.dismissed ?? false,
        userDepartment: userDeptInfo.departmentName,
        userDepartmentId: userDeptInfo.departmentId,
      });
    }

    // 3. If Instructor or Admin: Return active live session for management studio
    const activeSession = await prisma.liveSession.findFirst({
      where: {
        status: "LIVE",
        ...(session.role === "INSTRUCTOR" ? { hostId: user.id } : {}),
      },
      orderBy: { startedAt: "desc" },
    });

    if (!activeSession) {
      return NextResponse.json({
        isLive: false,
        liveSession: null,
        userDepartment: userDeptInfo.departmentName,
        userDepartmentId: userDeptInfo.departmentId,
      });
    }

    // Count students notified
    const notifiedCount = await prisma.notification.count({
      where: { liveSessionId: activeSession.id },
    });

    return NextResponse.json({
      isLive: true,
      liveSession: {
        id: activeSession.id,
        hostId: activeSession.hostId,
        hostName: activeSession.hostName,
        department: activeSession.department,
        departmentId: activeSession.departmentId,
        title: activeSession.title,
        description: activeSession.description,
        targetType: activeSession.targetType,
        targetDepartmentIds: activeSession.targetDepartmentIds,
        targetStudentIds: activeSession.targetStudentIds,
        targetLabel: activeSession.targetLabel || activeSession.department,
        sessionType: activeSession.sessionType,
        status: activeSession.status,
        startedAt: activeSession.startedAt,
        datasetName: activeSession.datasetName,
        datasetUrl: activeSession.datasetUrl,
        viewers: activeSession.viewers,
      },
      studentsNotified: notifiedCount,
      userDepartment: userDeptInfo.departmentName,
      userDepartmentId: userDeptInfo.departmentId,
    });
  } catch (err: any) {
    console.error("GET /api/live/active error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
