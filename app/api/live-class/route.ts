import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface LiveParticipant {
  id: string;
  name: string;
  email?: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  avatar: string;
  joinedAt: string;
  lastPing: number;
  isCameraOn: boolean;
  isMicOn: boolean;
  isHandRaised: boolean;
  isSpeaking?: boolean;
}

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  cohort: string;
  status: "ONLINE_IN_CALL" | "LEFT_CALL" | "ABSENT_NOT_JOINED";
  avatar: string;
}

export interface LiveAttendanceCheck {
  id: string;
  isActive: boolean;
  promptTitle: string;
  startedAt: string;
  totalPresentCount: number;
  markedStudents: Record<string, { studentId: string; studentName: string; markedAt: string }>;
}

export interface LivePingNotification {
  id: string;
  targetStudentId?: string | null;
  targetStudentName?: string | null;
  targetStudentEmail?: string | null;
  instructorName: string;
  streamTitle: string;
  message: string;
  timestamp: string;
  expiresAt: number;
}

export interface LiveClassState {
  isLive: boolean;
  title: string;
  instructor: string;
  instructorTitle: string;
  avatar: string;
  category: string;
  description: string;
  datasetName: string;
  datasetUrl: string;
  startedAt: string | null;
  viewers: number;
  activeAttendanceCheck: LiveAttendanceCheck | null;
  activePings: LivePingNotification[];
  activePoll: {
    id: string;
    question: string;
    options: PollOption[];
    isActive: boolean;
    totalVotes: number;
    userVotes: Record<string, string>;
  } | null;
  chatMessages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    isInstructor?: boolean;
    isPinned?: boolean;
    userId?: string;
  }>;
  pinnedNotice: string | null;
  participants: LiveParticipant[];
  enrolledStudents: EnrolledStudent[];
}

declare global {
  var __liveClassState: LiveClassState | undefined;
}

const DEFAULT_ENROLLED_STUDENTS: EnrolledStudent[] = [
  { id: "stu-sahil", name: "Sahil Bhimashankar Pawase", email: "pawasesahil2@gmail.com", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil" },
  { id: "stu-1", name: "Neha Gupta", email: "neha.gupta@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha" },
  { id: "stu-2", name: "Rohan Verma", email: "rohan.verma@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  { id: "stu-3", name: "Priya Sharma", email: "priya.s@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: "stu-4", name: "Aarav Patel", email: "aarav.p@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" },
  { id: "stu-5", name: "Ananya Roy", email: "ananya.roy@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
  { id: "stu-6", name: "Vikram Malhotra", email: "vikram.m@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
  { id: "stu-7", name: "Sneha Reddy", email: "sneha.reddy@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  { id: "stu-8", name: "Kunal Joshi", email: "kunal.j@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kunal" },
  { id: "stu-9", name: "Divya Kapoor", email: "divya.k@careertransformer.in", cohort: "Cohort 14 (Data Analytics)", status: "ABSENT_NOT_JOINED", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Divya" },
];

const DEFAULT_PARTICIPANTS: LiveParticipant[] = [];

function getSafeLiveClassState(): LiveClassState {
  if (!global.__liveClassState) {
    global.__liveClassState = {
      isLive: true,
      title: "Mastering Real-Time SQL Queries & Window Functions",
      instructor: "Sahil Pawase",
      instructorTitle: "Lead Analytics Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil",
      category: "SQL & Analytics",
      description: "Live coding session on LEAD/LAG, ROW_NUMBER(), DENSE_RANK(), and partitioning high-volume e-commerce datasets.",
      datasetName: "swiggy_orders_dataset.csv",
      datasetUrl: "#",
      startedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      viewers: 1,
      activePoll: {
        id: "poll-1",
        question: "When calculating running totals in SQL, which clause is required inside OVER()?",
        options: [
          { id: "opt-1", text: "ORDER BY", votes: 48 },
          { id: "opt-2", text: "GROUP BY", votes: 4 },
          { id: "opt-3", text: "HAVING", votes: 2 },
          { id: "opt-4", text: "DISTINCT", votes: 1 },
        ],
        isActive: true,
        totalVotes: 55,
        userVotes: {},
      },
      chatMessages: [
        { id: "msg-1", sender: "Sahil Pawase (Instructor)", text: "Welcome everyone! Please ensure you have downloaded swiggy_orders_dataset.csv from below.", time: "10:02 AM", isInstructor: true },
      ],
      pinnedNotice: "📢 Class Assignment 2 on Window Functions will be released at 11:30 AM today!",
      activeAttendanceCheck: null,
      activePings: [],
      participants: [],
      enrolledStudents: DEFAULT_ENROLLED_STUDENTS,
    };
  }

  if (global.__liveClassState.activeAttendanceCheck === undefined) {
    global.__liveClassState.activeAttendanceCheck = null;
  }
  if (!Array.isArray(global.__liveClassState.activePings)) {
    global.__liveClassState.activePings = [];
  }

  // Filter out expired pings (older than 10 mins)
  const now = Date.now();
  global.__liveClassState.activePings = global.__liveClassState.activePings.filter(
    (p) => p && p.expiresAt > now
  );

  // Guard against missing properties from previous hot-reloads
  if (!Array.isArray(global.__liveClassState.participants)) {
    global.__liveClassState.participants = [];
  }
  if (!Array.isArray(global.__liveClassState.enrolledStudents)) {
    global.__liveClassState.enrolledStudents = DEFAULT_ENROLLED_STUDENTS;
  }
  if (!Array.isArray(global.__liveClassState.chatMessages)) {
    global.__liveClassState.chatMessages = [];
  }

  // De-duplicate participants and filter out stale sessions older than 20 seconds
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  const activeCleanParticipants: LiveParticipant[] = [];

  for (const p of global.__liveClassState.participants) {
    if (!p || !p.id) continue;
    // Active ONLY if pinged within last 45 seconds
    if (now - p.lastPing > 45000) continue;
    if (seenIds.has(p.id)) continue;
    if (p.email && seenEmails.has(p.email)) continue;

    seenIds.add(p.id);
    if (p.email) seenEmails.add(p.email);
    activeCleanParticipants.push(p);
  }

  global.__liveClassState.participants = activeCleanParticipants;
  return global.__liveClassState;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const state = getSafeLiveClassState();

    // Refresh enrolled students active status dynamically based on current real participants & attendance
    const activeEmails = new Set(state.participants.map((p) => p.email?.toLowerCase()).filter(Boolean));
    const activeNames = new Set(state.participants.map((p) => p.name.toLowerCase()));
    const activeIds = new Set(state.participants.map((p) => p.id));
    const markedStudentsMap = state.activeAttendanceCheck?.markedStudents || {};

    state.enrolledStudents = state.enrolledStudents.map((s) => {
      // Robust matching: by ID, email, exact name, or partial name
      const attendanceRecord = markedStudentsMap[s.id] ||
        Object.values(markedStudentsMap).find((m: any) => (
          m.studentId === s.id ||
          (m.email && s.email && m.email.toLowerCase() === s.email.toLowerCase()) ||
          m.studentName?.toLowerCase() === s.name.toLowerCase() ||
          s.name.toLowerCase().includes(m.studentName?.toLowerCase() || "___") ||
          (m.studentName && m.studentName.toLowerCase().includes(s.name.toLowerCase()))
        ));

      const isMarked = !!attendanceRecord;

      // Online ONLY if currently active in live participants
      const isOnline = activeIds.has(s.id) ||
        (s.email && activeEmails.has(s.email.toLowerCase())) ||
        (s.name && activeNames.has(s.name.toLowerCase())) ||
        Array.from(activeNames).some((an) => an.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(an));

      let status: "ONLINE_IN_CALL" | "LEFT_CALL" | "ABSENT_NOT_JOINED" = "ABSENT_NOT_JOINED";
      if (isOnline) {
        status = "ONLINE_IN_CALL";
      } else if (isMarked) {
        status = "LEFT_CALL";
      }

      return {
        ...s,
        status,
        isAttendanceMarked: isMarked,
        attendanceMarkedAt: attendanceRecord?.markedAt || (isMarked ? "Marked Present" : null),
      };
    });

    state.viewers = Math.max(state.participants.length, 1);

    return NextResponse.json({
      success: true,
      state,
      user: session ? { id: session.id, fullName: session.fullName, role: session.role } : null,
    });
  } catch (err: any) {
    console.error("GET /api/live-class error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { action } = body;
    const state = getSafeLiveClassState();

    // 1. Admin Actions
    if (["START_STREAM", "STOP_STREAM", "END_AND_ARCHIVE", "UPDATE_DETAILS", "UPDATE_DATASET", "CREATE_POLL", "END_POLL", "PIN_NOTICE", "MUTE_STUDENT", "LOWER_HAND", "DISMISS_STUDENT", "PING_ABSENT", "PING_STUDENT", "TRIGGER_ATTENDANCE", "CLOSE_ATTENDANCE"].includes(action)) {
      if (!session || (session.role !== "ADMIN" && session.role !== "INSTRUCTOR")) {
        return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 403 });
      }

      if (action === "START_STREAM") {
        state.isLive = true;
        state.startedAt = new Date().toISOString();
        if (body.title) state.title = body.title;
        if (body.description) state.description = body.description;
        if (body.datasetName) state.datasetName = body.datasetName;
        if (body.instructor) state.instructor = body.instructor;
      } else if (action === "TRIGGER_ATTENDANCE") {
        state.activeAttendanceCheck = {
          id: "att-" + Date.now(),
          isActive: true,
          promptTitle: body.title || "Live Lecture Attendance Verification",
          startedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          totalPresentCount: 0,
          markedStudents: {},
        };
        state.pinnedNotice = `📋 ATTENDANCE CHECK OPEN: Please click "Mark Present" now to verify your live attendance!`;
      } else if (action === "CLOSE_ATTENDANCE") {
        if (state.activeAttendanceCheck) {
          state.activeAttendanceCheck.isActive = false;
        }
      } else if (action === "STOP_STREAM" || action === "END_AND_ARCHIVE") {
        state.isLive = false;

        // Automatically archive ended live class into recorded classes catalog!
        if ((global as any).__recordedClassesState) {
          const recordedState: any[] = (global as any).__recordedClassesState;
          const alreadyExists = recordedState.some((r) => r.title === state.title && r.isLiveRecording);
          if (!alreadyExists) {
            recordedState.unshift({
              id: "rec-live-" + Date.now(),
              title: `[LIVE COHORT RECORDING] ${state.title}`,
              instructor: state.instructor,
              instructorTitle: state.instructorTitle,
              avatar: state.avatar,
              category: "sql",
              level: "Intermediate",
              duration: "55 mins",
              rating: 5.0,
              completedPercentage: 0,
              thumbnailGradient: "from-rose-950/50 via-[#081827] to-[#06101D] border-rose-500/40",
              description: state.description || "Full recorded masterclass from live cohort interactive session.",
              youtubeId: "HXV3zeRR3h4",
              datasetName: state.datasetName,
              datasetSize: "4.2 MB",
              isLiveRecording: true,
              recordedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              lectureSteps: [
                {
                  stepNumber: 1,
                  title: "Live Problem Statement & Relational Architecture",
                  duration: "15 mins",
                  summary: "Instructor introduces the real-time orders dataset and table partition strategy.",
                  codeSnippet: "SELECT * FROM orders LIMIT 20;",
                },
                {
                  stepNumber: 2,
                  title: "Live Window Function Analytics & Query Writing",
                  duration: "25 mins",
                  summary: "Step-by-step query construction using LEAD/LAG and ROW_NUMBER() over customer partitions.",
                  codeSnippet: "SELECT customer_id, order_amount, DENSE_RANK() OVER(ORDER BY order_amount DESC) FROM orders;",
                },
                {
                  stepNumber: 3,
                  title: "Live Student Q&A & Interview Case Study",
                  duration: "15 mins",
                  summary: "Live interactive discussion answering student queries and solving tech case studies.",
                  codeSnippet: "-- Capstone Assignment: Find the top 3 customers per city by revenue",
                },
              ],
              instructorNotes: [
                "Review the attached dataset and test the sample queries in the sandbox before submitting assignments.",
              ],
            });
          }
        }
      } else if (action === "UPDATE_DETAILS") {
        if (body.title) state.title = body.title;
        if (body.description) state.description = body.description;
        if (body.instructor) state.instructor = body.instructor;
        if (body.instructorTitle) state.instructorTitle = body.instructorTitle;
        if (body.category) state.category = body.category;
      } else if (action === "UPDATE_DATASET") {
        state.datasetName = body.datasetName || "dataset.csv";
        state.datasetUrl = body.datasetUrl || "#";
      } else if (action === "CREATE_POLL") {
        const { question, options } = body;
        state.activePoll = {
          id: "poll-" + Date.now(),
          question,
          options: options.map((opt: string, idx: number) => ({
            id: "opt-" + idx,
            text: opt,
            votes: 0,
          })),
          isActive: true,
          totalVotes: 0,
          userVotes: {},
        };
      } else if (action === "END_POLL") {
        if (state.activePoll) {
          state.activePoll.isActive = false;
        }
      } else if (action === "PIN_NOTICE") {
        state.pinnedNotice = body.notice || null;
      } else if (action === "MUTE_STUDENT") {
        const p = state.participants.find((x) => x.id === body.studentId);
        if (p) p.isMicOn = false;
      } else if (action === "LOWER_HAND") {
        const p = state.participants.find((x) => x.id === body.studentId);
        if (p) p.isHandRaised = false;
      } else if (action === "DISMISS_STUDENT") {
        state.participants = state.participants.filter((x) => x.id !== body.studentId);
      } else if (action === "PING_ABSENT" || action === "PING_STUDENT") {
        const targetId = body.studentId || null;
        const targetName = body.studentName || null;
        const targetEmail = body.studentEmail || null;

        const pingMsg = targetName && targetName !== "all absent students"
          ? `📢 Instructor ${state.instructor} is waiting for you in "${state.title}"! Please join the live class now.`
          : `🔔 Live Class Alert: "${state.title}" is in session with instructor ${state.instructor}. Please join the live classroom immediately!`;

        const newPing: LivePingNotification = {
          id: "ping-" + Date.now(),
          targetStudentId: targetId,
          targetStudentName: targetName,
          targetStudentEmail: targetEmail,
          instructorName: state.instructor || "Sahil Pawase",
          streamTitle: state.title || "Live Masterclass",
          message: pingMsg,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          expiresAt: Date.now() + 1000 * 60 * 10, // 10 mins
        };

        state.activePings = [newPing, ...(state.activePings || [])].slice(0, 15);
        state.pinnedNotice = pingMsg;
      }

      return NextResponse.json({ success: true, state });
    }

    // 2. Student Join / Leave / Heartbeat
    if (action === "JOIN_CALL") {
      const userId = session?.id || "guest-" + Date.now();
      const fullName = session?.fullName || body.name || "Student " + Math.floor(Math.random() * 100);
      const role = (session?.role as any) || "STUDENT";

      const existingIdx = state.participants.findIndex((p) => p.id === userId);
      const participantData: LiveParticipant = {
        id: userId,
        name: fullName,
        email: session?.email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lastPing: Date.now(),
        isCameraOn: !!body.isCameraOn,
        isMicOn: !!body.isMicOn,
        isHandRaised: !!body.isHandRaised,
      };

      if (existingIdx >= 0) {
        state.participants[existingIdx] = participantData;
      } else {
        state.participants.push(participantData);
      }

      // Also ensure student is in enrolledStudents list and marked ONLINE_IN_CALL
      if (role === "STUDENT") {
        const studentEmail = session?.email || body.email;
        const enrolledIdx = state.enrolledStudents.findIndex(
          (s) => s.id === userId || (studentEmail && s.email.toLowerCase() === studentEmail.toLowerCase()) || s.name.toLowerCase() === fullName.toLowerCase()
        );
        if (enrolledIdx >= 0) {
          state.enrolledStudents[enrolledIdx].status = "ONLINE_IN_CALL";
        } else {
          state.enrolledStudents.unshift({
            id: userId,
            name: fullName,
            email: studentEmail || `${fullName.toLowerCase().replace(/\s+/g, ".")}@careertransformer.in`,
            cohort: "Cohort 14 (Data Analytics)",
            status: "ONLINE_IN_CALL",
            avatar: participantData.avatar,
          });
        }
      }

      state.viewers = Math.max(state.participants.length, 1);
      return NextResponse.json({ success: true, state, participant: participantData });
    }

    if (action === "LEAVE_CALL") {
      const userId = session?.id || body.userId;
      const userEmail = session?.email || body.email;
      const userName = session?.fullName || body.name;

      state.participants = state.participants.filter((p) => {
        if (userId && p.id === userId) return false;
        if (userEmail && p.email?.toLowerCase() === userEmail.toLowerCase()) return false;
        if (userName && p.name?.toLowerCase() === userName.toLowerCase()) return false;
        return true;
      });

      state.viewers = Math.max(state.participants.length, 1);
      return NextResponse.json({ success: true, state });
    }

    if (action === "HEARTBEAT") {
      const userId = session?.id || body.userId;
      const fullName = session?.fullName || body.name;
      const role = (session?.role as any) || "STUDENT";
      let p = state.participants.find((x) => x.id === userId);
      if (p) {
        p.lastPing = Date.now();
        if (body.isCameraOn !== undefined) p.isCameraOn = body.isCameraOn;
        if (body.isMicOn !== undefined) p.isMicOn = body.isMicOn;
        if (body.isHandRaised !== undefined) p.isHandRaised = body.isHandRaised;
        if (body.isSpeaking !== undefined) p.isSpeaking = body.isSpeaking;
      } else if (userId) {
        state.participants.push({
          id: userId,
          name: fullName || "Student",
          email: session?.email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || "Student")}`,
          joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          lastPing: Date.now(),
          isCameraOn: !!body.isCameraOn,
          isMicOn: !!body.isMicOn,
          isHandRaised: !!body.isHandRaised,
        });
      }

      // Update enrolled student status to ONLINE_IN_CALL
      if (role === "STUDENT" && userId) {
        const studentEmail = session?.email || body.email;
        const enrolled = state.enrolledStudents.find(
          (s) => s.id === userId || (studentEmail && s.email.toLowerCase() === studentEmail.toLowerCase()) || (fullName && s.name.toLowerCase() === fullName.toLowerCase())
        );
        if (enrolled) {
          enrolled.status = "ONLINE_IN_CALL";
        }
      }

      return NextResponse.json({ success: true, state });
    }

    // 3. Chat Message
    if (action === "SEND_CHAT") {
      if (!session) {
        return NextResponse.json({ error: "Please log in to send chat messages." }, { status: 401 });
      }

      const isInstructor = session.role === "ADMIN" || session.role === "INSTRUCTOR";
      const newMsg = {
        id: "msg-" + Date.now(),
        sender: isInstructor ? `${session.fullName} (Instructor)` : session.fullName,
        text: body.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isInstructor,
        userId: session.id,
      };

      state.chatMessages.push(newMsg);
      if (state.chatMessages.length > 50) {
        state.chatMessages.shift();
      }

      return NextResponse.json({ success: true, message: newMsg, state });
    }

    // 4. Poll Vote
    if (action === "VOTE_POLL") {
      if (!session) {
        return NextResponse.json({ error: "Please log in to vote." }, { status: 401 });
      }

      if (!state.activePoll || !state.activePoll.isActive) {
        return NextResponse.json({ error: "No active poll available." }, { status: 400 });
      }

      const { optionId } = body;
      const prevVote = state.activePoll.userVotes[session.id];

      if (prevVote) {
        const prevOpt = state.activePoll.options.find((o) => o.id === prevVote);
        if (prevOpt && prevOpt.votes > 0) {
          prevOpt.votes--;
          state.activePoll.totalVotes--;
        }
      }

      const targetOpt = state.activePoll.options.find((o) => o.id === optionId);
      if (targetOpt) {
        targetOpt.votes++;
        state.activePoll.totalVotes++;
        state.activePoll.userVotes[session.id] = optionId;
      }

      return NextResponse.json({ success: true, state });
    }

    // 5. Student Mark Attendance
    if (action === "MARK_ATTENDANCE") {
      if (!state.activeAttendanceCheck || !state.activeAttendanceCheck.isActive) {
        return NextResponse.json({ error: "Attendance verification is currently closed by the instructor." }, { status: 400 });
      }

      const studentId = session?.id || body.studentId || "stu-" + Date.now();
      const studentName = session?.fullName || body.studentName || "Student";
      const markedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (!state.activeAttendanceCheck.markedStudents) {
        state.activeAttendanceCheck.markedStudents = {};
      }

      state.activeAttendanceCheck.markedStudents[studentId] = {
        studentId,
        studentName,
        markedAt: markedTime,
      };
      state.activeAttendanceCheck.totalPresentCount = Object.keys(state.activeAttendanceCheck.markedStudents).length;

      // Update in live participants
      const p = state.participants.find((x) => x.id === studentId || x.email === session?.email || x.name.toLowerCase() === studentName.toLowerCase());
      if (p) {
        (p as any).isAttendanceMarked = true;
        (p as any).attendanceMarkedAt = markedTime;
      }

      return NextResponse.json({
        success: true,
        state,
        markedRecord: state.activeAttendanceCheck.markedStudents[studentId],
      });
    }

    // 6. Dismiss Ping Notification
    if (action === "DISMISS_PING") {
      const pingId = body.pingId;
      if (pingId) {
        state.activePings = (state.activePings || []).filter((p) => p.id !== pingId);
      }
      return NextResponse.json({ success: true, state });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("POST /api/live-class error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
