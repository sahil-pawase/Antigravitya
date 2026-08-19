import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface LiveClassState {
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
}

declare global {
  var __liveClassState: LiveClassState | undefined;
}

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
    viewers: 74,
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
      { id: "msg-2", sender: "Neha Gupta", text: "Sir, when should we use DENSE_RANK() instead of RANK() in SQL?", time: "10:05 AM" },
      { id: "msg-3", sender: "Rohan Verma", text: "The stream resolution is crystal clear! Ready for window functions.", time: "10:07 AM" },
      { id: "msg-4", sender: "Sahil Pawase (Instructor)", text: "Great question Neha! DENSE_RANK() does not skip rank positions on duplicate ties. Let me demonstrate now.", time: "10:08 AM", isInstructor: true },
    ],
    pinnedNotice: "📢 Class Assignment 2 on Window Functions will be released at 11:30 AM today!",
  };
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  const state = global.__liveClassState!;

  return NextResponse.json({
    success: true,
    state,
    user: session ? { id: session.id, fullName: session.fullName, role: session.role } : null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  const { action } = body;
  const state = global.__liveClassState!;

  // 1. Admin Actions
  if (["START_STREAM", "STOP_STREAM", "END_AND_ARCHIVE", "UPDATE_DETAILS", "UPDATE_DATASET", "CREATE_POLL", "END_POLL", "PIN_NOTICE"].includes(action)) {
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
    } else if (action === "STOP_STREAM" || action === "END_AND_ARCHIVE") {
      state.isLive = false;

      // Automatically archive ended live class into recorded classes catalog!
      if (global.__recordedClassesState) {
        const alreadyExists = global.__recordedClassesState.some((r) => r.title === state.title && r.isLiveRecording);
        if (!alreadyExists) {
          global.__recordedClassesState.unshift({
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
    }

    return NextResponse.json({ success: true, state });
  }

  // 2. Chat Message
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

  // 3. Poll Vote
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

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
