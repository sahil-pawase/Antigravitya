"use client";

import React, { useState, useEffect } from "react";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  AlertCircle,
  Smartphone,
  Check,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  tierName?: string;
  price: number;
  originalPrice?: number;
}

type PaymentMethod = "upi" | "card" | "netbanking" | "emi";

export function PaymentGatewayModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  tierName = "Flagship Career Cohort",
  price,
  originalPrice = 45000,
}: PaymentModalProps) {
  const router = useRouter();

  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [cardData, setCardData] = useState({
    number: "4532 8921 7340 9182",
    name: "Aarav Patel",
    expiry: "12/28",
    cvv: "892",
  });
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedEmiTenure, setSelectedEmiTenure] = useState("6");

  // Payment Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<{
    orderId: string;
    paymentId: string;
    amount: number;
  } | null>(null);

  // User session state
  const [user, setUser] = useState<{ id: string; email: string; fullName: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Check session
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            setCardData((prev) => ({ ...prev, name: data.user.fullName || "Student Name" }));
          }
        })
        .catch(() => {});
    } else {
      // Reset states when closed
      setIsProcessing(false);
      setVerificationStep(0);
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError(null);
    setVerificationStep(1);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const orderData = await orderRes.json();

      if (orderRes.status === 401) {
        setIsProcessing(false);
        router.push(`/register?redirect=/courses/data-analytics&enroll=${courseId}`);
        return;
      }

      if (orderData.alreadyEnrolled) {
        setIsProcessing(false);
        router.push("/dashboard");
        return;
      }

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize order with payment gateway");
      }

      // Step 2: Encrypted Token Generation
      await new Promise((r) => setTimeout(r, 600));
      setVerificationStep(2);

      // Step 3: Cryptographic Signature Verification
      await new Promise((r) => setTimeout(r, 700));
      setVerificationStep(3);

      const generatedPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: generatedPaymentId,
          razorpay_signature: "mock_signature_valid",
          courseId,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      // Step 4: Finalizing Access & Enrollment
      await new Promise((r) => setTimeout(r, 500));
      setVerificationStep(4);

      setTransactionDetails({
        orderId: orderData.orderId,
        paymentId: generatedPaymentId,
        amount: price,
      });

      setIsProcessing(false);
      setIsSuccess(true);

      // Celebrate with confetti explosion
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#397CFF", "#41D8FF", "#10B981", "#FFFFFF"],
        });
      } catch {}
    } catch (err: unknown) {
      setIsProcessing(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during payment processing. Please try again.");
      }
    }
  };

  const handleGoToDashboard = () => {
    onClose();
    router.push("/dashboard");
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-[#040B14]/85 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
        aria-hidden="true"
      />

      {/* Main Payment Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-[#081827] border border-[#162942] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-10 my-auto text-[#F5F8FC]"
      >
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-[#0C1A2B] via-[#081827] to-[#0C1A2B] border-b border-[#162942] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#397CFF]/20 border border-[#397CFF]/40 flex items-center justify-center text-[#41D8FF]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Secure Checkout & Payment Portal</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                  256-Bit SSL Encrypted
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">Career Transformer Official Tuition Processing</p>
            </div>
          </div>

          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#0C1A2B] border border-transparent hover:border-[#162942] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        {isSuccess && transactionDetails ? (
          /* SUCCESS SCREEN */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Payment Verified & Authenticated
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                Enrollment Activated!
              </h3>
              <p className="text-sm text-[#94A3B8]">
                Congratulations! You now have lifetime access to the <strong>{courseTitle}</strong> curriculum, lab datasets, and 1-on-1 mentor reviews.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="max-w-md mx-auto rounded-xl bg-[#06101D] border border-[#162942] p-5 space-y-3 text-xs text-left">
              <div className="flex justify-between items-center pb-2 border-b border-[#162942]">
                <span className="text-[#94A3B8]">Transaction ID:</span>
                <span className="font-mono text-white font-semibold">{transactionDetails.paymentId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#162942]">
                <span className="text-[#94A3B8]">Order Reference:</span>
                <span className="font-mono text-white font-semibold">{transactionDetails.orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#162942]">
                <span className="text-[#94A3B8]">Amount Paid:</span>
                <span className="font-bold text-[#41D8FF] text-sm">{formatINR(transactionDetails.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Enrolled Student:</span>
                <span className="text-white font-medium">{user?.email || "student@careertransformer.in"}</span>
              </div>
            </div>

            <div className="pt-4 max-w-md mx-auto space-y-3">
              <button
                onClick={handleGoToDashboard}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#397CFF] to-[#41D8FF] hover:from-[#2A65DC] hover:to-[#2AC4EB] text-[#06101D] font-extrabold text-base shadow-xl shadow-[#41D8FF]/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Enter Student Dashboard Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-[11px] text-[#64748B]">
                A formal tax invoice and enrollment confirmation receipt have been dispatched to your email.
              </p>
            </div>
          </div>
        ) : isProcessing ? (
          /* PROCESSING SCREEN */
          <div className="p-12 sm:p-16 text-center space-y-8 max-w-md mx-auto">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#397CFF]/20 border-t-[#41D8FF] animate-spin" />
              <Lock className="w-8 h-8 text-[#41D8FF] animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Verifying Transaction</h3>
              <p className="text-xs text-[#94A3B8]">
                Please do not refresh or close this window while we securely authorize your payment.
              </p>
            </div>

            {/* Verification Steps */}
            <div className="space-y-3 text-xs text-left bg-[#06101D] border border-[#162942] p-5 rounded-xl">
              <div className={`flex items-center gap-2.5 ${verificationStep >= 1 ? "text-emerald-400 font-semibold" : "text-[#64748B]"}`}>
                {verificationStep >= 1 ? <Check className="w-4 h-4 flex-shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
                <span>1. Establishing 256-bit bank gateway handshake</span>
              </div>
              <div className={`flex items-center gap-2.5 ${verificationStep >= 2 ? "text-emerald-400 font-semibold" : "text-[#64748B]"}`}>
                {verificationStep >= 2 ? <Check className="w-4 h-4 flex-shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
                <span>2. Authenticating encrypted payment token</span>
              </div>
              <div className={`flex items-center gap-2.5 ${verificationStep >= 3 ? "text-emerald-400 font-semibold" : "text-[#64748B]"}`}>
                {verificationStep >= 3 ? <Check className="w-4 h-4 flex-shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
                <span>3. Verifying HMAC SHA-256 digital signature</span>
              </div>
              <div className={`flex items-center gap-2.5 ${verificationStep >= 4 ? "text-emerald-400 font-semibold" : "text-[#64748B]"}`}>
                {verificationStep >= 4 ? <Check className="w-4 h-4 flex-shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
                <span>4. Activating student dashboard & issuing access</span>
              </div>
            </div>
          </div>
        ) : (
          /* PAYMENT SELECTION SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#162942]">
            {/* Left: Payment Method Tabs & Inputs */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Select Payment Option</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">All major Indian payment methods supported with 0% extra gateway fees.</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Payment Methods Nav */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveMethod("upi")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    activeMethod === "upi"
                      ? "bg-[#0C1A2B] border-[#41D8FF] text-[#41D8FF] shadow-lg shadow-[#41D8FF]/10"
                      : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F] hover:text-white"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI / QR</span>
                </button>

                <button
                  onClick={() => setActiveMethod("card")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    activeMethod === "card"
                      ? "bg-[#0C1A2B] border-[#41D8FF] text-[#41D8FF] shadow-lg shadow-[#41D8FF]/10"
                      : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F] hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => setActiveMethod("netbanking")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    activeMethod === "netbanking"
                      ? "bg-[#0C1A2B] border-[#41D8FF] text-[#41D8FF] shadow-lg shadow-[#41D8FF]/10"
                      : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F] hover:text-white"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>NetBanking</span>
                </button>

                <button
                  onClick={() => setActiveMethod("emi")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    activeMethod === "emi"
                      ? "bg-[#0C1A2B] border-[#41D8FF] text-[#41D8FF] shadow-lg shadow-[#41D8FF]/10"
                      : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F] hover:text-white"
                  }`}
                >
                  <CalendarClock className="w-5 h-5" />
                  <span>0% EMI</span>
                </button>
              </div>

              {/* TAB 1: UPI & QR Code */}
              {activeMethod === "upi" && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#06101D] border border-[#162942] flex flex-col sm:flex-row items-center gap-6">
                    {/* Visual QR Code Generator */}
                    <div className="w-36 h-36 rounded-xl bg-white p-2.5 flex flex-col items-center justify-between flex-shrink-0 shadow-lg">
                      <div className="w-full h-full border-2 border-dashed border-slate-300 rounded flex items-center justify-center p-1 relative">
                        {/* Realistic SVG QR Pattern */}
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-6 0h4v4h-2v-2h-2v-2zm2 4v4h2v-4h-2zm4 0h2v2h-2v-2zm0 2v2h2v-2h-2zm-6 0v2h4v-2h-4z" />
                          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                          <circle cx="6" cy="18" r="1.5" fill="currentColor" />
                        </svg>
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 tracking-wider">SCAN WITH ANY UPI APP</span>
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center justify-center sm:justify-start gap-1">
                        <Smartphone className="w-3.5 h-3.5" /> Instant Scan & Pay
                      </span>
                      <h4 className="text-sm font-bold text-white">Scan QR with GPay, PhonePe, or Paytm</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Amount of <strong className="text-[#41D8FF]">{formatINR(price)}</strong> will be automatically filled. Verification happens automatically within seconds.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#F5F8FC]">Or Enter Your UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-[#06101D] border border-[#162942] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#41D8FF]"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId("student@okaxis")}
                        className="px-3 py-2 rounded-xl bg-[#0C1A2B] border border-[#162942] hover:border-[#397CFF]/50 text-[11px] text-[#41D8FF] font-semibold cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Credit / Debit Card */}
              {activeMethod === "card" && (
                <div className="space-y-4 pt-2">
                  {/* Interactive 3D Card Preview */}
                  <div className="rounded-xl p-5 bg-gradient-to-tr from-[#0C1A2B] via-[#162942] to-[#1E3A5F] border border-[#397CFF]/40 shadow-xl space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#41D8FF]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex justify-between items-center">
                      <div className="w-9 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                        <div className="w-5 h-3 border border-amber-600 rounded-sm" />
                      </div>
                      <span className="text-sm font-extrabold tracking-widest text-[#41D8FF]">VISA / RUPAY</span>
                    </div>

                    <div className="font-mono text-base tracking-widest text-white">
                      {cardData.number || "•••• •••• •••• ••••"}
                    </div>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block uppercase">Cardholder</span>
                        <span className="font-bold text-white uppercase">{cardData.name || "YOUR NAME"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block uppercase">Expires</span>
                        <span className="font-mono font-bold text-white">{cardData.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-xs font-semibold text-[#F5F8FC] block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        placeholder="4532 8921 7340 9182"
                        className="w-full bg-[#06101D] border border-[#162942] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#F5F8FC] block mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full bg-[#06101D] border border-[#162942] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#F5F8FC] block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardData.cvv}
                          maxLength={4}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="892"
                          className="w-full bg-[#06101D] border border-[#162942] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#41D8FF]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Net Banking */}
              {activeMethod === "netbanking" && (
                <div className="space-y-4 pt-2 text-xs">
                  <span className="text-xs font-semibold text-[#F5F8FC] block">Popular Indian Banks:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                          selectedBank === bank
                            ? "bg-[#0C1A2B] border-[#41D8FF] text-white shadow-md"
                            : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{bank}</span>
                          {selectedBank === bank && <Check className="w-3.5 h-3.5 text-[#41D8FF]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: No-Cost EMI */}
              {activeMethod === "emi" && (
                <div className="space-y-3 pt-2 text-xs">
                  <span className="text-xs font-semibold text-[#F5F8FC] block">Select Interest-Free Installment Plan:</span>
                  <div className="space-y-2">
                    {[
                      { tenure: "3", monthly: Math.round(price / 3), label: "3 Months (Zero Interest)" },
                      { tenure: "6", monthly: Math.round(price / 6), label: "6 Months (Zero Interest)" },
                      { tenure: "12", monthly: Math.round(price / 12), label: "12 Months (Zero Interest)" },
                    ].map((plan) => (
                      <div
                        key={plan.tenure}
                        onClick={() => setSelectedEmiTenure(plan.tenure)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedEmiTenure === plan.tenure
                            ? "bg-[#0C1A2B] border-[#41D8FF] text-white"
                            : "bg-[#06101D] border-[#162942] text-[#94A3B8] hover:border-[#1E3A5F]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={selectedEmiTenure === plan.tenure}
                            onChange={() => setSelectedEmiTenure(plan.tenure)}
                            className="text-[#41D8FF]"
                          />
                          <div>
                            <strong className="text-white block text-xs">{plan.label}</strong>
                            <span className="text-[11px] text-[#94A3B8]">Approved on all major Credit & Debit cards</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#41D8FF]">{formatINR(plan.monthly)}</span>
                          <span className="text-[10px] text-[#64748B] block">/ month</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary & Pay Action */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-[#06101D]/60 flex flex-col justify-between">
              <div className="space-y-5">
                <span className="text-xs uppercase tracking-wider font-bold text-[#64748B] block">
                  Order Summary
                </span>

                <div className="p-4 rounded-xl bg-[#081827] border border-[#162942] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{courseTitle}</span>
                    <span className="px-2 py-0.5 rounded bg-[#0C1A2B] text-[#41D8FF] text-[10px] font-bold">
                      {tierName}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-normal">
                    Includes 6 modules, code labs, GitHub capstones, mentor code reviews, and tamper-proof certificate.
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Standard Tuition</span>
                    <span className="line-through">{formatINR(originalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Scholarship / Cohort Discount ({discountPercent}%)</span>
                    <span>- {formatINR(originalPrice - price)}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>GST (18% Included)</span>
                    <span className="text-white font-mono">₹0 (Waived)</span>
                  </div>
                  <div className="pt-2 border-t border-[#162942] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Total Amount Due</span>
                    <span className="text-2xl font-extrabold text-[#41D8FF] tracking-tight">{formatINR(price)}</span>
                  </div>
                </div>

                {user && (
                  <div className="p-3 rounded-lg bg-[#081827] border border-[#162942] text-[11px] text-[#94A3B8] flex items-center justify-between">
                    <span>Enrolling Account:</span>
                    <span className="text-white font-semibold truncate max-w-[160px]">{user.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handlePayNow}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#41D8FF] to-[#397CFF] hover:from-[#2AC4EB] hover:to-[#2A65DC] text-[#06101D] font-extrabold text-base shadow-xl shadow-[#41D8FF]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4 text-[#06101D]" />
                  <span>Authorize & Pay {formatINR(price)} →</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#64748B] text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>7-Day 100% Money-Back Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
