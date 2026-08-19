import { NextRequest, NextResponse } from "next/server";

interface SignalMessage {
  id: string;
  from: string;
  to?: string;
  type: "OFFER" | "ANSWER" | "ICE_CANDIDATE" | "MEDIA_STATE";
  payload: any;
  timestamp: number;
}

declare global {
  var __webrtcSignals: SignalMessage[] | undefined;
}

if (!global.__webrtcSignals) {
  global.__webrtcSignals = [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const since = parseInt(searchParams.get("since") || "0", 10);

  const now = Date.now();
  // Filter out signals older than 30 seconds
  global.__webrtcSignals = (global.__webrtcSignals || []).filter((s) => now - s.timestamp < 30000);

  const relevant = global.__webrtcSignals.filter((s) => {
    if (s.from === clientId) return false;
    if (s.timestamp <= since) return false;
    if (s.to && s.to !== clientId && s.to !== "ALL") return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    signals: relevant,
    serverTime: now,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, to, type, payload } = body;

    if (!from || !type || !payload) {
      return NextResponse.json({ error: "Missing required signal fields" }, { status: 400 });
    }

    const newSignal: SignalMessage = {
      id: "sig-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      from,
      to: to || "ALL",
      type,
      payload,
      timestamp: Date.now(),
    };

    if (!global.__webrtcSignals) global.__webrtcSignals = [];
    global.__webrtcSignals.push(newSignal);

    // Keep max 100 recent signals
    if (global.__webrtcSignals.length > 100) {
      global.__webrtcSignals = global.__webrtcSignals.slice(-100);
    }

    return NextResponse.json({ success: true, signalId: newSignal.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Signaling error" }, { status: 500 });
  }
}
