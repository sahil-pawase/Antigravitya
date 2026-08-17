import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendEmail, generateEnrollmentEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required payment parameters" }, { status: 400 });
    }

    // 1. Verify cryptographic signature server-side
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      // Record failed payment attempt
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: "FAILED",
          errorMessage: "Invalid HMAC SHA256 payment signature",
        },
      });

      return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
    }

    // 2. Lookup existing pending payment
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { course: true, user: { include: { profile: true } } },
    });

    if (!payment) {
      return NextResponse.json({ error: "Order record not found" }, { status: 404 });
    }

    // 3. Mark payment as SUCCESS in database
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "SUCCESS",
      },
    });

    // 4. Create or update student Enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      },
      update: {
        status: "ACTIVE",
        paymentId: updatedPayment.id,
      },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        paymentId: updatedPayment.id,
        status: "ACTIVE",
      },
    });

    // 5. Send transaction confirmation email
    const studentName = payment.user.profile?.fullName || session.fullName;
    await sendEmail({
      to: payment.user.email,
      subject: `Enrollment Confirmed: ${payment.course.title} — Career Transformer`,
      html: generateEnrollmentEmail(studentName, payment.course.title, payment.amount),
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Course enrollment activated!",
      enrollmentId: enrollment.id,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Internal payment processing error" }, { status: 500 });
  }
}
