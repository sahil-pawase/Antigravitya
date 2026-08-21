import { prisma } from "../lib/db";
import { normalizeDepartment } from "../lib/departments";

async function runDepartmentLiveTests() {
  console.log("============================================================");
  console.log("🧪 STARTING DEPARTMENT-WISE LIVE CALL & NOTIFICATION TEST SUITE");
  console.log("============================================================\n");

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
    const poojaHost = await prisma.user.findUnique({
      where: { email: "pooja.it@careertransformer.in" },
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

    assert(!!rahulHost && !!rahulHost.profile, "Host Rahul exists in DB", `Department: ${rahulHost?.profile?.department} (${rahulHost?.profile?.departmentId})`);
    assert(!!sahilStudent && !!sahilStudent.profile, "Student Sahil exists in DB", `Department: ${sahilStudent?.profile?.department} (${sahilStudent?.profile?.departmentId})`);
    assert(!!amitStudent && !!amitStudent.profile, "Student Amit exists in DB", `Department: ${amitStudent?.profile?.department} (${amitStudent?.profile?.departmentId})`);
    assert(!!priyaStudent && !!priyaStudent.profile, "Student Priya exists in DB", `Department: ${priyaStudent?.profile?.department} (${priyaStudent?.profile?.departmentId})`);
    assert(!!rohitStudent && !!rohitStudent.profile, "Student Rohit exists in DB", `Department: ${rohitStudent?.profile?.department} (${rohitStudent?.profile?.departmentId})`);

    // Clean up previous test sessions
    await prisma.notification.deleteMany({});
    await prisma.liveSession.deleteMany({});

    // ------------------------------------------------------------
    // TEST 1: Host Rahul (Computer Engineering) Starts Live Session
    // ------------------------------------------------------------
    console.log("\n--- TEST 1: Host Rahul (Computer Engineering) Starts Live Session ---");
    const hostDeptInfo = normalizeDepartment(rahulHost!.profile!.departmentId || rahulHost!.profile!.department);
    
    // Create LiveSession
    const liveSession1 = await prisma.liveSession.create({
      data: {
        hostId: rahulHost!.id,
        hostName: rahulHost!.profile!.fullName,
        department: hostDeptInfo.departmentName,
        departmentId: hostDeptInfo.departmentId,
        title: "Mastering Real-Time SQL & Data Structures",
        description: "Advanced live coding for Computer Engineering students.",
        status: "LIVE",
        startedAt: new Date(),
      },
    });

    // Query matching students by departmentId in backend
    const matchingStudents1 = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        profile: {
          departmentId: hostDeptInfo.departmentId,
        },
      },
      include: { profile: true },
    });

    // Create notifications for matching students
    const notifications1 = matchingStudents1.map((s) => ({
      studentId: s.id,
      liveSessionId: liveSession1.id,
      department: hostDeptInfo.departmentName,
      departmentId: hostDeptInfo.departmentId,
      type: "LIVE_SESSION_CALL",
      title: "🔴 LIVE CLASS STARTED",
      message: `${rahulHost!.profile!.fullName} has started a live session for ${hostDeptInfo.departmentName}.`,
    }));

    await prisma.notification.createMany({
      data: notifications1,
      skipDuplicates: true,
    });

    assert(liveSession1.status === "LIVE", "Live session is created with status LIVE", `Session ID: ${liveSession1.id}`);
    assert(liveSession1.departmentId === "COMP_ENG", "Live session departmentId is correctly set from DB", `Dept: ${liveSession1.department}`);
    assert(matchingStudents1.length >= 2, "Found students matching Computer Engineering in DB", `Count: ${matchingStudents1.length}`);

    // ------------------------------------------------------------
    // TEST 2: Verify Exact Department Matching For Rahul's Live Session
    // ------------------------------------------------------------
    console.log("\n--- TEST 2: Department-Wise Routing & Call Notifications ---");

    // Check Sahil (Computer Engineering) -> SHOULD RECEIVE
    const sahilNotification = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: sahilStudent!.id,
          liveSessionId: liveSession1.id,
        },
      },
    });
    assert(!!sahilNotification, "Sahil (Computer Engineering) receives Live Call Notification ✅", `Message: "${sahilNotification?.message}"`);

    // Check Amit (Computer Engineering) -> SHOULD RECEIVE
    const amitNotification = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: amitStudent!.id,
          liveSessionId: liveSession1.id,
        },
      },
    });
    assert(!!amitNotification, "Amit (Computer Engineering) receives Live Call Notification ✅", `Message: "${amitNotification?.message}"`);

    // Check Priya (Mechanical Engineering) -> MUST NOT RECEIVE
    const priyaNotification = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: priyaStudent!.id,
          liveSessionId: liveSession1.id,
        },
      },
    });
    assert(!priyaNotification, "Priya (Mechanical Engineering) does NOT receive notification ❌ (Verified)", "No notification record in DB");

    // Check Rohit (IT) -> MUST NOT RECEIVE
    const rohitNotification = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: rohitStudent!.id,
          liveSessionId: liveSession1.id,
        },
      },
    });
    assert(!rohitNotification, "Rohit (Information Technology) does NOT receive notification ❌ (Verified)", "No notification record in DB");

    // ------------------------------------------------------------
    // TEST 3: Backend Active Live Session Endpoint Emulation
    // ------------------------------------------------------------
    console.log("\n--- TEST 3: Backend Active Live Filtering Emulation ---");
    
    // Function mimicking GET /api/live/active for any student
    async function getActiveLiveForStudent(studentUserId: string) {
      const student = await prisma.user.findUnique({
        where: { id: studentUserId },
        include: { profile: true },
      });
      const deptId = student?.profile?.departmentId;

      const activeSession = await prisma.liveSession.findFirst({
        where: {
          status: "LIVE",
          departmentId: deptId || undefined,
        },
      });

      return {
        isLive: !!activeSession,
        session: activeSession,
        studentDept: student?.profile?.department,
      };
    }

    const sahilActive = await getActiveLiveForStudent(sahilStudent!.id);
    assert(sahilActive.isLive && sahilActive.session?.id === liveSession1.id, "Sahil query returns Active Live Session (isLive = true)");

    const priyaActive = await getActiveLiveForStudent(priyaStudent!.id);
    assert(!priyaActive.isLive && priyaActive.session === null, "Priya query returns No Live Session (isLive = false)");

    const rohitActive = await getActiveLiveForStudent(rohitStudent!.id);
    assert(!rohitActive.isLive && rohitActive.session === null, "Rohit query returns No Live Session (isLive = false)");

    // ------------------------------------------------------------
    // TEST 4: Multi-Host / Multiple Department Live Sessions
    // ------------------------------------------------------------
    console.log("\n--- TEST 4: Multi-Department Live Broadcast ---");
    // Host Pooja (IT) starts a stream
    const poojaDeptInfo = normalizeDepartment(poojaHost!.profile!.departmentId || poojaHost!.profile!.department);
    const liveSession2 = await prisma.liveSession.create({
      data: {
        hostId: poojaHost!.id,
        hostName: poojaHost!.profile!.fullName,
        department: poojaDeptInfo.departmentName,
        departmentId: poojaDeptInfo.departmentId,
        title: "Cloud Infrastructure & Networking Deep-Dive",
        description: "IT cohort live class.",
        status: "LIVE",
        startedAt: new Date(),
      },
    });

    const itStudents = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        profile: { departmentId: poojaDeptInfo.departmentId },
      },
    });

    await prisma.notification.createMany({
      data: itStudents.map((s) => ({
        studentId: s.id,
        liveSessionId: liveSession2.id,
        department: poojaDeptInfo.departmentName,
        departmentId: poojaDeptInfo.departmentId,
        type: "LIVE_SESSION_CALL",
        title: "🔴 LIVE CLASS STARTED",
        message: `${poojaHost!.profile!.fullName} has started a live session for ${poojaDeptInfo.departmentName}.`,
      })),
      skipDuplicates: true,
    });

    const rohitActiveAfterPoojaLive = await getActiveLiveForStudent(rohitStudent!.id);
    assert(
      rohitActiveAfterPoojaLive.isLive && rohitActiveAfterPoojaLive.session?.id === liveSession2.id,
      "Rohit (IT) now receives Pooja's IT Live Session ✅",
      `Session Title: ${rohitActiveAfterPoojaLive.session?.title}`
    );

    const sahilActiveAfterPoojaLive = await getActiveLiveForStudent(sahilStudent!.id);
    assert(
      sahilActiveAfterPoojaLive.isLive && sahilActiveAfterPoojaLive.session?.id === liveSession1.id,
      "Sahil still receives Rahul's CS Live Session (Isolated from IT) ✅"
    );

    // ------------------------------------------------------------
    // TEST 5: Duplicate Prevention via Unique Constraint
    // ------------------------------------------------------------
    console.log("\n--- TEST 5: Duplicate Notification Prevention ---");
    try {
      await prisma.notification.create({
        data: {
          studentId: sahilStudent!.id,
          liveSessionId: liveSession1.id,
          department: "Computer Engineering",
          departmentId: "COMP_ENG",
          type: "LIVE_SESSION_CALL",
          title: "Duplicate Attempt",
          message: "Duplicate notification attempt.",
        },
      });
      assert(false, "Duplicate notification rejected by unique constraint");
    } catch (err: any) {
      assert(true, "Duplicate notification rejected by unique constraint [studentId, liveSessionId] ✅");
    }

    // ------------------------------------------------------------
    // TEST 6: Notification Dismissal & Read Status
    // ------------------------------------------------------------
    console.log("\n--- TEST 6: Notification Dismissal & Read Tracking ---");
    await prisma.notification.updateMany({
      where: {
        studentId: sahilStudent!.id,
        liveSessionId: liveSession1.id,
      },
      data: {
        read: true,
        dismissed: true,
      },
    });

    const updatedSahilNotif = await prisma.notification.findUnique({
      where: {
        studentId_liveSessionId: {
          studentId: sahilStudent!.id,
          liveSessionId: liveSession1.id,
        },
      },
    });
    assert(updatedSahilNotif?.dismissed === true, "Notification marked dismissed: true in DB ✅");
    assert(updatedSahilNotif?.read === true, "Notification marked read: true in DB ✅");

    // ------------------------------------------------------------
    // TEST 7: Host Ends Live Session
    // ------------------------------------------------------------
    console.log("\n--- TEST 7: Host Ends Live Session ---");
    await prisma.liveSession.update({
      where: { id: liveSession1.id },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    const sahilActiveAfterEnd = await getActiveLiveForStudent(sahilStudent!.id);
    assert(!sahilActiveAfterEnd.isLive, "After host ends live, student query returns isLive = false ✅");

    console.log("\n============================================================");
    console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("============================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runDepartmentLiveTests();
