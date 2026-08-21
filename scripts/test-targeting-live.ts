import { prisma } from "../lib/db";
import { normalizeDepartment } from "../lib/departments";

async function runTargetingLiveTestSuite() {
  console.log("==================================================================");
  console.log("🧪 STARTING FLEXIBLE LIVE SESSION TARGETING TEST SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   └─ ${details}`);
      failed++;
    }
  }

  try {
    // 0. Fetch seeded users from Database
    const rahulHost = await prisma.user.findUnique({
      where: { email: "instructor@careertransformer.in" },
      include: { profile: true },
    });
    const sahilStudent = await prisma.user.findUnique({
      where: { email: "pawasesahil2@gmail.com" },
      include: { profile: true },
    });
    const amitStudent = await prisma.user.findUnique({
      where: { email: "amit.cs@careertransformer.in" },
      include: { profile: true },
    });
    const priyaStudent = await prisma.user.findUnique({
      where: { email: "priya.mech@careertransformer.in" },
      include: { profile: true },
    });
    const rohitStudent = await prisma.user.findUnique({
      where: { email: "rohit.it@careertransformer.in" },
      include: { profile: true },
    });

    assert(!!rahulHost, "Host Rahul exists in DB");
    assert(!!sahilStudent, "Student Sahil (CS) exists in DB");
    assert(!!amitStudent, "Student Amit (CS) exists in DB");
    assert(!!priyaStudent, "Student Priya (Mech) exists in DB");
    assert(!!rohitStudent, "Student Rohit (IT) exists in DB");

    // Clean up previous test sessions
    await prisma.notification.deleteMany({});
    await prisma.liveSession.deleteMany({});

    // Helper: Simulate GET /api/live/active for a student
    async function checkStudentLiveActive(studentId: string) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: { profile: true },
      });
      const deptId = student?.profile?.departmentId;

      const activeSessions = await prisma.liveSession.findMany({
        where: { status: "LIVE" },
        orderBy: { startedAt: "desc" },
      });

      let matched: any = null;
      for (const s of activeSessions) {
        if (s.targetType === "ALL") {
          matched = s;
          break;
        } else if (s.targetType === "DEPARTMENT" || s.targetType === "DEPARTMENTS") {
          if (deptId && s.targetDepartmentIds.includes(deptId)) {
            matched = s;
            break;
          }
        } else if (s.targetType === "STUDENTS") {
          if (s.targetStudentIds.includes(studentId)) {
            matched = s;
            break;
          }
        }
      }

      return {
        isLive: !!matched,
        session: matched,
      };
    }

    // ------------------------------------------------------------
    // TEST 1: Specific Department Targeting (Computer Engineering)
    // ------------------------------------------------------------
    console.log("\n--- TEST 1: Specific Department Targeting (Computer Engineering) ---");
    const deptInfo = normalizeDepartment("COMP_ENG");
    const session1 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: rahulHost!.profile!.department!,
        departmentId: rahulHost!.profile!.departmentId!,
        title: "Java OOP Masterclass",
        targetType: "DEPARTMENT",
        targetDepartmentIds: [deptInfo.departmentId],
        targetStudentIds: [],
        targetLabel: deptInfo.departmentName,
        sessionType: "LIVE_NOW",
        status: "LIVE",
      },
    });

    const matchingStudents1 = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        profile: { departmentId: deptInfo.departmentId },
      },
    });

    await prisma.notification.createMany({
      data: matchingStudents1.map((s) => ({
        studentId: s.id,
        liveSessionId: session1.id,
        department: deptInfo.departmentName,
        departmentId: deptInfo.departmentId,
        type: "LIVE_SESSION_CALL",
        title: "🔴 LIVE CLASS STARTED",
        message: `${rahulHost!.profile!.fullName} has started a live session for ${deptInfo.departmentName}.`,
      })),
      skipDuplicates: true,
    });

    const sahilResult1 = await checkStudentLiveActive(sahilStudent!.id);
    const amitResult1 = await checkStudentLiveActive(amitStudent!.id);
    const priyaResult1 = await checkStudentLiveActive(priyaStudent!.id);
    const rohitResult1 = await checkStudentLiveActive(rohitStudent!.id);

    assert(sahilResult1.isLive && sahilResult1.session?.id === session1.id, "Sahil (CS) receives session1 (isLive = true) ✅");
    assert(amitResult1.isLive && amitResult1.session?.id === session1.id, "Amit (CS) receives session1 (isLive = true) ✅");
    assert(!priyaResult1.isLive, "Priya (Mech) receives NO session (isLive = false) ❌");
    assert(!rohitResult1.isLive, "Rohit (IT) receives NO session (isLive = false) ❌");

    // Close session 1
    await prisma.liveSession.update({ where: { id: session1.id }, data: { status: "ENDED" } });

    // ------------------------------------------------------------
    // TEST 2: Specific Students Targeting (Sahil & Priya)
    // ------------------------------------------------------------
    console.log("\n--- TEST 2: Specific Students Targeting (Sahil & Priya) ---");
    const targetStudentIds = [sahilStudent!.id, priyaStudent!.id];
    const session2 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: rahulHost!.profile!.department!,
        departmentId: rahulHost!.profile!.departmentId!,
        title: "1-on-1 Portfolio Architecture Review",
        targetType: "STUDENTS",
        targetDepartmentIds: [],
        targetStudentIds,
        targetLabel: "2 Selected Students",
        sessionType: "LIVE_NOW",
        status: "LIVE",
      },
    });

    await prisma.notification.createMany({
      data: targetStudentIds.map((sId) => ({
        studentId: sId,
        liveSessionId: session2.id,
        type: "LIVE_SESSION_CALL",
        title: "🔴 LIVE CLASS STARTED",
        message: `${rahulHost!.profile!.fullName} has started a live session for 2 Selected Students.`,
      })),
      skipDuplicates: true,
    });

    const sahilResult2 = await checkStudentLiveActive(sahilStudent!.id);
    const priyaResult2 = await checkStudentLiveActive(priyaStudent!.id);
    const amitResult2 = await checkStudentLiveActive(amitStudent!.id);
    const rohitResult2 = await checkStudentLiveActive(rohitStudent!.id);

    assert(sahilResult2.isLive && sahilResult2.session?.id === session2.id, "Sahil (Selected) receives session2 (isLive = true) ✅");
    assert(priyaResult2.isLive && priyaResult2.session?.id === session2.id, "Priya (Selected) receives session2 (isLive = true) ✅");
    assert(!amitResult2.isLive, "Amit (Not Selected) receives NO session ❌");
    assert(!rohitResult2.isLive, "Rohit (Not Selected) receives NO session ❌");

    // Close session 2
    await prisma.liveSession.update({ where: { id: session2.id }, data: { status: "ENDED" } });

    // ------------------------------------------------------------
    // TEST 3: Multiple Departments Targeting (CS + IT)
    // ------------------------------------------------------------
    console.log("\n--- TEST 3: Multiple Departments Targeting (CS + IT) ---");
    const multiDeptIds = ["COMP_ENG", "IT"];
    const session3 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: rahulHost!.profile!.department!,
        departmentId: rahulHost!.profile!.departmentId!,
        title: "Distributed Systems & Cloud SQL",
        targetType: "DEPARTMENTS",
        targetDepartmentIds: multiDeptIds,
        targetStudentIds: [],
        targetLabel: "Computer Engineering + Information Technology",
        sessionType: "LIVE_NOW",
        status: "LIVE",
      },
    });

    const matchingStudents3 = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        profile: { departmentId: { in: multiDeptIds } },
      },
    });

    await prisma.notification.createMany({
      data: matchingStudents3.map((s) => ({
        studentId: s.id,
        liveSessionId: session3.id,
        type: "LIVE_SESSION_CALL",
        title: "🔴 LIVE CLASS STARTED",
        message: `${rahulHost!.profile!.fullName} has started a live session for CS + IT.`,
      })),
      skipDuplicates: true,
    });

    const sahilResult3 = await checkStudentLiveActive(sahilStudent!.id);
    const amitResult3 = await checkStudentLiveActive(amitStudent!.id);
    const rohitResult3 = await checkStudentLiveActive(rohitStudent!.id);
    const priyaResult3 = await checkStudentLiveActive(priyaStudent!.id);

    assert(sahilResult3.isLive && sahilResult3.session?.id === session3.id, "Sahil (CS) receives multi-dept session3 ✅");
    assert(amitResult3.isLive && amitResult3.session?.id === session3.id, "Amit (CS) receives multi-dept session3 ✅");
    assert(rohitResult3.isLive && rohitResult3.session?.id === session3.id, "Rohit (IT) receives multi-dept session3 ✅");
    assert(!priyaResult3.isLive, "Priya (Mech) is excluded from CS + IT session3 ❌");

    // Close session 3
    await prisma.liveSession.update({ where: { id: session3.id }, data: { status: "ENDED" } });

    // ------------------------------------------------------------
    // TEST 4: Everyone Targeting (Platform-Wide)
    // ------------------------------------------------------------
    console.log("\n--- TEST 4: Everyone Targeting (Platform-Wide Broadcast) ---");
    const session4 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: rahulHost!.profile!.department!,
        departmentId: rahulHost!.profile!.departmentId!,
        title: "All-Hands Career Acceleration Keynote",
        targetType: "ALL",
        targetDepartmentIds: [],
        targetStudentIds: [],
        targetLabel: "Everyone (All Cohorts)",
        sessionType: "LIVE_NOW",
        status: "LIVE",
      },
    });

    const allStudents = await prisma.user.findMany({
      where: { role: "STUDENT", status: "ACTIVE" },
    });

    await prisma.notification.createMany({
      data: allStudents.map((s) => ({
        studentId: s.id,
        liveSessionId: session4.id,
        type: "LIVE_SESSION_CALL",
        title: "🔴 LIVE CLASS STARTED",
        message: `${rahulHost!.profile!.fullName} has started a live session for Everyone.`,
      })),
      skipDuplicates: true,
    });

    const sahilResult4 = await checkStudentLiveActive(sahilStudent!.id);
    const amitResult4 = await checkStudentLiveActive(amitStudent!.id);
    const priyaResult4 = await checkStudentLiveActive(priyaStudent!.id);
    const rohitResult4 = await checkStudentLiveActive(rohitStudent!.id);

    assert(sahilResult4.isLive && sahilResult4.session?.id === session4.id, "Sahil receives Everyone session ✅");
    assert(amitResult4.isLive && amitResult4.session?.id === session4.id, "Amit receives Everyone session ✅");
    assert(priyaResult4.isLive && priyaResult4.session?.id === session4.id, "Priya receives Everyone session ✅");
    assert(rohitResult4.isLive && rohitResult4.session?.id === session4.id, "Rohit receives Everyone session ✅");

    // Close session 4
    await prisma.liveSession.update({ where: { id: session4.id }, data: { status: "ENDED" } });

    // ------------------------------------------------------------
    // TEST 5: Live Invitation / RSVP Request Mode
    // ------------------------------------------------------------
    console.log("\n--- TEST 5: Live Invitation / RSVP Request Mode ---");
    const session5 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: rahulHost!.profile!.department!,
        departmentId: rahulHost!.profile!.departmentId!,
        title: "Upcoming Capstone Q&A Session",
        targetType: "DEPARTMENT",
        targetDepartmentIds: ["COMP_ENG"],
        targetStudentIds: [],
        targetLabel: "Computer Engineering",
        sessionType: "INVITATION_REQUEST",
        status: "LIVE",
      },
    });

    await prisma.notification.create({
      data: {
        studentId: sahilStudent!.id,
        liveSessionId: session5.id,
        type: "LIVE_SESSION_INVITATION",
        title: "📢 LIVE SESSION INVITATION",
        message: `${rahulHost!.profile!.fullName} wants to start a live session for Computer Engineering.`,
      },
    });

    const notif5 = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: sahilStudent!.id,
          liveSessionId: session5.id,
        },
      },
    });

    assert(notif5?.type === "LIVE_SESSION_INVITATION", "Notification created with type LIVE_SESSION_INVITATION ✅");
    assert(session5.sessionType === "INVITATION_REQUEST", "Session created with sessionType INVITATION_REQUEST ✅");

    // ------------------------------------------------------------
    // TEST 6: Student Notification History
    // ------------------------------------------------------------
    console.log("\n--- TEST 6: Student Notification History & Actions ---");
    const studentHistory = await prisma.notification.findMany({
      where: { studentId: sahilStudent!.id },
      include: { liveSession: true },
      orderBy: { createdAt: "desc" },
    });

    assert(studentHistory.length >= 3, "Sahil has full notification history in DB", `Count: ${studentHistory.length}`);

    // Mark as read
    await prisma.notification.updateMany({
      where: { studentId: sahilStudent!.id },
      data: { read: true },
    });

    const unreadCount = await prisma.notification.count({
      where: { studentId: sahilStudent!.id, read: false },
    });

    assert(unreadCount === 0, "All notifications successfully marked as read ✅");

    console.log("\n==================================================================");
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTargetingLiveTestSuite();
