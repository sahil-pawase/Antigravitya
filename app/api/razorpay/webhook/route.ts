import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_placeholder";

    // Validate webhook signature if secret is active
    if (signature && webhookSecret && !webhookSecret.includes("placeholder")) {
      const isValid = verifyWebhookSignature({
        rawBody,
        webhookSignature: signature,
        webhookSecret,
      });

      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const paymentRecord = await prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });

        if (paymentRecord && paymentRecord.status !== "SUCCESS") {
          const updatedPayment = await prisma.payment.update({
            where: { id: paymentRecord.id },
            data: {
              razorpayPaymentId: paymentId,
              status: "SUCCESS",
            },
          });

          await prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: paymentRecord.userId,
                courseId: paymentRecord.courseId,
              },
            },
            update: {
              status: "ACTIVE",
              paymentId: updatedPayment.id,
            },
            create: {
              userId: paymentRecord.userId,
              courseId: paymentRecord.courseId,
              paymentId: updatedPayment.id,
              status: "ACTIVE",
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
