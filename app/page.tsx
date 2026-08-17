import React from "react";
import { prisma } from "@/lib/db";
import { AnnouncementBar } from "@/components/navbar/AnnouncementBar";
import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { FeaturedProgramCard } from "@/components/courses/FeaturedProgramCard";
import { WhyCareerTransformer } from "@/components/home/WhyCareerTransformer";
import { SkillsGrid } from "@/components/home/SkillsGrid";
import { CurriculumAccordion } from "@/components/courses/CurriculumAccordion";
import { CareerRoadmap } from "@/components/home/CareerRoadmap";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialGrid } from "@/components/testimonials/TestimonialGrid";
import { PricingSection } from "@/components/pricing/PricingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { LeadGenerationSection } from "@/components/home/LeadGenerationSection";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { Footer } from "@/components/footer/Footer";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // 1. Fetch Course with Modules and Lessons
  const course = await prisma.course.findFirst({
    where: { slug: "data-analytics" },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              title: true,
              summary: true,
              durationMinutes: true,
              isFreePreview: true,
              orderIndex: true,
            },
          },
          assignments: {
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              totalMarks: true,
            },
          },
        },
      },
      projects: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  // 2. Fetch Verified Testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // 3. Fetch FAQs
  const faqs = await prisma.fAQ.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col justify-between selection:bg-[#397CFF]/30">
      <div>
        <AnnouncementBar />
        <Navbar />

        <main>
          {/* 1. High-Impact Hero */}
          <Hero />

          {/* 2. Featured Program Card */}
          {course && (
            <section className="py-12 bg-[#06101D]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FeaturedProgramCard course={course} />
              </div>
            </section>
          )}

          {/* 3. Why Career Transformer (4 Pillars) */}
          <WhyCareerTransformer />

          {/* 4. Skills & Competencies Grid */}
          <SkillsGrid />

          {/* 5. In-Depth Curriculum Breakdown */}
          {course && (
            <section id="curriculum" className="py-20 bg-[#06101D] border-t border-[#162942]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs uppercase tracking-widest text-[#41D8FF] font-bold">
                    Comprehensive Syllabus
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                    From Basics to Advanced Analytics
                  </h2>
                  <p className="text-[#94A3B8] text-base">
                    Every module is structured with conceptual clarity, live code labs, datasets, and capstone assignments.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <CurriculumAccordion modules={course.modules} />
                </div>
              </div>
            </section>
          )}

          {/* 6. 6-Stage Career Roadmap */}
          <CareerRoadmap />

          {/* 7. Real Portfolio Projects Showcase */}
          {course && course.projects.length > 0 && (
            <ProjectShowcase projects={course.projects} />
          )}

          {/* 8. Why Choose Us Comparison */}
          <WhyChooseUs />

          {/* 9. Verified Student Reviews */}
          {testimonials.length > 0 && (
            <TestimonialGrid testimonials={testimonials} />
          )}

          {/* 10. Pricing & EMI Plans */}
          {course && (
            <PricingSection
              currentPrice={course.currentPrice}
              originalPrice={course.originalPrice}
              courseId={course.id}
            />
          )}

          {/* 11. Frequently Asked Questions */}
          {faqs.length > 0 && <FaqSection faqs={faqs} />}

          {/* 12. Lead Generation "Book Free Demo" Section */}
          <LeadGenerationSection />
        </main>
      </div>

      {/* Floating Contextual WhatsApp CTA */}
      <WhatsAppButton />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
