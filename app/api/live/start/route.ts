import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeDepartment, DEPARTMENTS } from "@/lib/departments";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    // 1. Host Authorization Verification
    if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
      return NextResponse.json(
        { error: "Unauthorized: Only instructors and admins can start or invite to a live session." },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const title = body.title?.trim() || "Live Mentorship Session";
    const description = body.description?.trim() || "Interactive cohort lecture and real-time review.";
    const datasetName = body.datasetName?.trim() || "department_dataset.csv";
    const category = body.category?.trim() || "Live Lecture";
    const sessionType = body.sessionType === "INVITATION_REQUEST" ? "INVITATION_REQUEST" : "LIVE_NOW";

    // Target Selection Input
    let targetType: "DEPARTMENT" | "STUDENTS" | "DEPARTMENTS" | "ALL" = body.targetType || "DEPARTMENT";
    let targetDepartmentIds: string[] = Array.isArray(body.targetDepartmentIds) ? body.targetDepartmentIds : [];
    let targetStudentIds: string[] = Array.isArray(body.targetStudentIds) ? body.targetStudentIds : [];

    // 2. Fetch Verified Host Record and Department from Database
    const hostUser = await prisma.user.findUnique({
      where: { id: session.id },
      include: { profile: true },
    });

    if (!hostUser || hostUser.status !== "ACTIVE") {
      return NextResponse.json({ error: "Host account is inactive or not found." }, { status: 403 });
    }

    const hostProfile = hostUser.profile;
    const hostName = hostProfile?.fullName || session.fullName || "Instructor";
    const rawHostDept = hostProfile?.department || "Computer Engineering";
    const hostDeptInfo = normalizeDepartment(hostProfile?.departmentId || rawHostDept);

    // Permission Verification for "ALL" (Everyone)
    if (targetType === "ALL") {
      if (session.role !== "ADMIN" && session.role !== "INSTRUCTOR") {
        return NextResponse.json(
          { error: "Permission Denied: You do not have permissions to broadcast to Everyone." },
          { status: 403 }
        );
      }
    }

    // 3. Resolve Target Query & Labels based on Target Type
    let targetLabel = "";
    let matchingStudents: any[] = [];

    if (targetType === "DEPARTMENT") {
      // Single department
      const selectedDeptId = targetDepartmentIds[0] || hostDeptInfo.departmentId;
      const deptInfo = normalizeDepartment(selectedDeptId);
      targetDepartmentIds = [deptInfo.departmentId];
      targetLabel = deptInfo.departmentName;

      matchingStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          status: "ACTIVE",
          profile: {
            departmentId: deptInfo.departmentId,
          },
        },
        include: { profile: true },
      });
    } else if (targetType === "STUDENTS") {
      // Specific students
      if (targetStudentIds.length === 0) {
        return NextResponse.json(
          { error: "Please select at least one student when using Specific Students targeting." },
          { status: 400 }
        );
      }

      matchingStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          status: "ACTIVE",
          id: {
            in: targetStudentIds,
          },
        },
        include: { profile: true },
      });

      targetStudentIds = matchingStudents.map((s) => s.id);
      if (matchingStudents.length === 1) {
        targetLabel = matchingStudents[0].profile?.fullName || matchingStudents[0].email;
      } else {
        targetLabel = `${matchingStudents.length} Selected Students`;
      }
    } else if (targetType === "DEPARTMENTS") {
      // Multiple departments
      if (targetDepartmentIds.length === 0) {
        targetDepartmentIds = [hostDeptInfo.departmentId];
      }

      // Normalize department IDs
      const normalizedDeptIds = targetDepartmentIds.map((d) => normalizeDepartment(d).departmentId);
      targetDepartmentIds = Array.from(new Set(normalizedDeptIds));

      const deptNames = targetDepartmentIds.map((d) => normalizeDepartment(d).departmentName);
      targetLabel = deptNames.join(" + ");

      matchingStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          status: "ACTIVE",
          profile: {
            departmentId: {
              in: targetDepartmentIds,
            },
          },
        },
        include: { profile: true },
      });
    } else if (targetType === "ALL") {
      // Everyone
      targetLabel = "Everyone (All Cohorts)";
      targetDepartmentIds = [];
      targetStudentIds = [];

      matchingStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          status: "ACTIVE",
        },
        include: { profile: true },
      });
    }

    // 4. Close any existing LIVE sessions for this host
    await prisma.liveSession.updateMany({
      where: {
        hostId: hostUser.id,
        status: "LIVE",
      },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    // 5. Create LiveSession record in Database with targeting data
    const liveSession = await prisma.liveSession.create({
      data: {
        hostId: hostUser.id,
        hostName,
        department: hostDeptInfo.departmentName,
        departmentId: hostDeptInfo.departmentId,
        title,
        description,
        targetType,
        targetDepartmentIds,
        targetStudentIds,
        targetLabel,
        sessionType,
        category,
        status: "LIVE",
        startedAt: new Date(),
        datasetName,
        datasetUrl: body.datasetUrl || "#",
      },
    });

    // 6. Batch Create Notifications for the targeted students
    if (matchingStudents.length > 0) {
      const isInvitation = sessionType === "INVITATION_REQUEST";
      const notifTitle = isInvitation ? "📢 LIVE SESSION INVITATION" : "🔴 LIVE CLASS STARTED";
      const notifMessage = isInvitation
        ? `${hostName} wants to start a live session for ${targetLabel}: "${title}"`
        : `${hostName} has started a live session for ${targetLabel}: "${title}"`;

      const notificationData = matchingStudents.map((student) => ({
        studentId: student.id,
        liveSessionId: liveSession.id,
        department: student.profile?.department || hostDeptInfo.departmentName,
        departmentId: student.profile?.departmentId || hostDeptInfo.departmentId,
        type: isInvitation ? "LIVE_SESSION_INVITATION" : "LIVE_SESSION_CALL",
        title: notifTitle,
        message: notifMessage,
        actionUrl: "/dashboard/live",
        read: false,
        dismissed: false,
      }));

      await prisma.notification.createMany({
        data: notificationData,
        skipDuplicates: true,
      });
    }

    // 7. Update in-memory LiveClassState for WebRTC backward-compatibility
    if (global.__liveClassState) {
      global.__liveClassState.isLive = true;
      global.__liveClassState.title = liveSession.title;
      global.__liveClassState.instructor = liveSession.hostName;
      global.__liveClassState.description = liveSession.description || "";
      global.__liveClassState.datasetName = liveSession.datasetName || "dataset.csv";
      global.__liveClassState.startedAt = liveSession.startedAt.toISOString();
      (global.__liveClassState as any).liveSessionId = liveSession.id;
      (global.__liveClassState as any).targetType = liveSession.targetType;
      (global.__liveClassState as any).targetLabel = liveSession.targetLabel;
      (global.__liveClassState as any).targetDepartmentIds = liveSession.targetDepartmentIds;
      (global.__liveClassState as any).targetStudentIds = liveSession.targetStudentIds;
      (global.__liveClassState as any).sessionType = liveSession.sessionType;
    }

    return NextResponse.json({
      success: true,
      liveSessionId: liveSession.id,
      hostId: hostUser.id,
      hostName: liveSession.hostName,
      title: liveSession.title,
      targetType: liveSession.targetType,
      targetDepartmentIds: liveSession.targetDepartmentIds,
      targetStudentIds: liveSession.targetStudentIds,
      targetLabel: liveSession.targetLabel,
      sessionType: liveSession.sessionType,
      status: liveSession.status,
      startedAt: liveSession.startedAt,
      studentsNotified: matchingStudents.length,
      notifiedStudents: matchingStudents.map((s) => ({
        id: s.id,
        name: s.profile?.fullName || "Student",
        email: s.email,
        department: s.profile?.department,
      })),
    });
  } catch (err: any) {
    console.error("POST /api/live/start error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to start live session" },
      { status: 500 }
    );
  }
}
