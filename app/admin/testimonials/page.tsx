import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Star, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/ui/Button";

export default async function AdminTestimonialsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Verified Testimonials Manager</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage authentic student reviews and alumni career transformation testimonials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl bg-[#081827] border border-[#162942] p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Student
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F5F8FC] leading-relaxed italic">
              "{t.review}"
            </p>

            <div className="pt-3 border-t border-[#162942] flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white">{t.authorName}</h4>
                <p className="text-[#94A3B8] text-[11px]">
                  {t.role} • {t.company}
                </p>
              </div>
              <span className="text-[#41D8FF] font-medium text-[11px]">{t.batch}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
