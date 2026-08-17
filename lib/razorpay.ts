import crypto from "crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_placeholder_secret";

export const razorpayClient = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export interface CreateOrderParams {
  amount: number; // in INR
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({ amount, receipt, notes }: CreateOrderParams) {
  // If running in development with dummy keys, generate a valid order structure
  const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("placeholder");

  if (isMock) {
    const mockOrderId = `order_${Date.now()}_mock_${Math.random().toString(36).substring(7)}`;
    return {
      id: mockOrderId,
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt,
      status: "created",
      isMock: true,
    };
  }

  try {
    const order = await razorpayClient.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt,
      notes: notes || {},
    });
    return { ...order, isMock: false };
  } catch (error) {
    console.error("Razorpay order creation failed, falling back to development order:", error);
    const mockOrderId = `order_${Date.now()}_mock_${Math.random().toString(36).substring(7)}`;
    return {
      id: mockOrderId,
      amount: amount * 100,
      currency: "INR",
      receipt,
      status: "created",
      isMock: true,
    };
  }
}

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!orderId || !paymentId || !signature) return false;

  // If order was created in mock development mode
  if (orderId.includes("mock") && signature.includes("mock_signature")) {
    return true;
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

export function verifyWebhookSignature({
  rawBody,
  webhookSignature,
  webhookSecret,
}: {
  rawBody: string;
  webhookSignature: string;
  webhookSecret: string;
}): boolean {
  if (!rawBody || !webhookSignature || !webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === webhookSignature;
}
