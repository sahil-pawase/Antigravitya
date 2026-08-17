import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await clearAuthCookie();

    const acceptHeader = request.headers.get("accept") || "";
    const contentType = request.headers.get("content-type") || "";
    const isFetchJson =
      acceptHeader.includes("application/json") ||
      contentType.includes("application/json") ||
      request.headers.get("x-requested-with") === "XMLHttpRequest";

    if (isFetchJson) {
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
        redirectTo: "/login?logout=success",
      });
    }

    // Standard HTML form submission or direct browser action -> 303 redirect to login
    return NextResponse.redirect(new URL("/login?logout=success", request.url), 303);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }
}

export async function GET(request: Request) {
  try {
    await clearAuthCookie();
    return NextResponse.redirect(new URL("/login?logout=success", request.url), 303);
  } catch (error) {
    console.error("Logout GET error:", error);
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }
}
