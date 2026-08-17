"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { formatINR } from "@/lib/utils";
import { ShieldCheck, Lock } from "lucide-react";
import { PaymentGatewayModal } from "./PaymentGatewayModal";

interface CheckoutButtonProps {
  courseId: string;
  courseTitle: string;
  price: number;
  originalPrice?: number;
  className?: string;
  buttonText?: string;
  tierName?: string;
}

export function EnrollmentCheckoutButton({
  courseId,
  courseTitle,
  price,
  originalPrice = 45000,
  className = "",
  buttonText,
  tierName = "Flagship Career Cohort",
}: CheckoutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-2 w-full">
      <Button
        variant="cyan"
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className={`w-full font-bold shadow-xl shadow-[#41D8FF]/20 text-[#06101D] text-base hover:scale-[1.02] active:scale-[0.98] transition-transform ${className}`}
      >
        <Lock className="w-4 h-4 mr-2" />
        {buttonText || `Enroll Now — ${formatINR(price)}`}
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Server-Verified 256-bit Encrypted Checkout Portal</span>
      </div>

      <PaymentGatewayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        tierName={tierName}
        price={price}
        originalPrice={originalPrice}
      />
    </div>
  );
}
