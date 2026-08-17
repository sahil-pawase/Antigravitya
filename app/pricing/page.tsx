import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PricingSection } from "@/components/pricing/PricingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";
import { FadeIn } from "@/components/motion/MotionWrapper";

export const metadata: Metadata = {
  title: "Tuition & Plans | Career Transformer",
  description:
    "Explore transparent tuition, No-Cost EMI installment plans, and refund guarantee terms for the Career Transformer Data Analytics Career Program.",
};

const defaultPaymentFaqs = [
  {
    id: "faq_pay_1",
    question: "What payment methods are supported for enrollment?",
    answer:
      "We accept all major Indian payment methods with zero additional transaction fees: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards (Visa, MasterCard, RuPay), Debit Cards, Net Banking across 50+ banks, and 0% No-Cost EMI options.",
    category: "PAYMENT",
    orderIndex: 1,
  },
  {
    id: "faq_pay_2",
    question: "How does the 0% No-Cost EMI installment option work?",
    answer:
      "You can split your tuition across 3, 6, or 12 months with zero interest. For example, the Flagship Cohort (₹24,999) can be paid at ~₹2,083/month over 12 months with no hidden costs.",
    category: "PAYMENT",
    orderIndex: 2,
  },
  {
    id: "faq_pay_3",
    question: "Is there a money-back refund guarantee?",
    answer:
      "Yes! We offer a 7-Day 100% No-Questions-Asked Satisfaction Guarantee. If you feel the curriculum, mentorship, or learning platform does not fit your goals within the first 7 days, email us for a full refund.",
    category: "PAYMENT",
    orderIndex: 3,
  },
  {
    id: "faq_pay_4",
    question: "Are there any hidden fees or extra charges for software and datasets?",
    answer:
      "None. All database instances, cloud datasets, software licenses (Power BI Desktop, Python libraries, SQL Workbench), portfolio templates, and completion certificates are 100% included in the tuition.",
    category: "PAYMENT",
    orderIndex: 4,
  },
];

export default async function PricingPage() {
  let course = null;
  let paymentFaqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
    orderIndex: number;
  }> = [];

  try {
    course = await prisma.course.findFirst({
      where: { slug: "data-analytics" },
    });

    paymentFaqs = await prisma.fAQ.findMany({
      where: {
        category: { in: ["PAYMENT", "ADMISSIONS", "GENERAL"] },
      },
      orderBy: { orderIndex: "asc" },
    });
  } catch (error) {
    console.error("PricingPage database lookup fallback:", error);
  }

  const finalFaqs = paymentFaqs.length > 0 ? paymentFaqs : defaultPaymentFaqs;

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-between relative overflow-hidden">
      {/* 3D WebGL Particle Mesh Canvas Background */}
      <DataMesh3DCanvas />

      {/* Cyber Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />

        <main className="py-12">
          <PricingSection
            currentPrice={course?.currentPrice ?? 24999}
            originalPrice={course?.originalPrice ?? 45000}
            courseId={course?.id ?? "data-analytics"}
          />

          <FaqSection faqs={finalFaqs} />
        </main>
      </div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
