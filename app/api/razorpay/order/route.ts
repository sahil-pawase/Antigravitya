import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in or register to proceed to checkout" }, { status: 401 });
    }

    const { courseId, tierPrice } = await request.json();

    // Look up course by ID or slug, or fallback to flagship published course
    let course = null;
    if (courseId && courseId !== "default") {
      course = await prisma.course.findFirst({
        where: {
          OR: [{ id: courseId }, { slug: courseId }],
        },
      });
    }

    if (!course) {
      course = await prisma.course.findFirst({
        where: { isPublished: true },
      });
    }

    if (!course) {
      return NextResponse.json({ error: "Selected course not found" }, { status: 404 });
    }

    // Check if user already has an active enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment && existingEnrollment.status === "ACTIVE") {
      return NextResponse.json(
        { error: "You are already enrolled in this program", alreadyEnrolled: true },
        { status: 409 }
      );
    }

    // Determine final tuition amount (validated against tier pricing or course currentPrice)
    const validTierPrices = [14999, 24999, 49999, course.currentPrice];
    const finalAmount = tierPrice && validTierPrices.includes(Number(tierPrice)) ? Number(tierPrice) : course.currentPrice;

    const receipt = `rcpt_${Date.now()}_${session.id.substring(0, 6)}`;

    // Create server-side order with Razorpay
    const order = await createRazorpayOrder({
      amount: finalAmount,
      receipt,
      notes: {
        userId: session.id,
        courseId: course.id,
        courseTitle: course.title,
      },
    });

    // Record pending payment in database
    await prisma.payment.create({
      data: {
        userId: session.id,
        courseId: course.id,
        razorpayOrderId: order.id,
        amount: finalAmount,
        currency: "INR",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
      course: {
        id: course.id,
        title: course.title,
        price: finalAmount,
      },
      user: {
        name: session.fullName,
        email: session.email,
      },
      isMock: order.isMock,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    return NextResponse.json({ error: "Failed to initialize payment gateway" }, { status: 500 });
  }
}
