"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Input, Select, Textarea } from "@/ui/Input";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface LeadFormProps {
  onSuccess?: () => void;
  source?: string;
  buttonText?: string;
}

export function LeadForm({
  onSuccess,
  source = "WEBSITE_HERO",
  buttonText = "Book Your Free 1-on-1 Demo Session",
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "B.Tech / B.E.",
    currentStatus: "College Student (Final/Pre-final Year)",
    interestedCourse: "Data Analytics Career Program",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit demo request");
      }

      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Demo Session Booked!</h3>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
          Our Senior Analytics Academic Advisor will reach out via Phone & WhatsApp within 2 hours with your personalized curriculum walkthrough and session schedule.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="e.g. rahul@gmail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="WhatsApp Phone Number *"
          type="tel"
          placeholder="e.g. 9876543210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <Select
          label="Highest Education *"
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          options={[
            { value: "B.Tech / B.E.", label: "B.Tech / B.E. (Engineering)" },
            { value: "B.Com / BBA / MBA", label: "B.Com / BBA / MBA (Commerce/Management)" },
            { value: "B.Sc / M.Sc (Math/Stats/Physics)", label: "B.Sc / M.Sc (Math/Stats/Science)" },
            { value: "BCA / MCA", label: "BCA / MCA (Computer Applications)" },
            { value: "Working Professional", label: "Other Graduate / Working Professional" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Current Profile Status *"
          value={formData.currentStatus}
          onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
          options={[
            { value: "College Student (Final/Pre-final Year)", label: "College Student (Final/Pre-final Year)" },
            { value: "Fresh Graduate (Looking for 1st Job)", label: "Fresh Graduate (Looking for 1st Job)" },
            { value: "Working Professional (Non-Tech/Tech)", label: "Working Professional (Career Switcher)" },
            { value: "Career Gap / Restart", label: "Career Gap / Restarting Career" },
          ]}
        />
        <Select
          label="Program of Interest"
          value={formData.interestedCourse}
          onChange={(e) => setFormData({ ...formData, interestedCourse: e.target.value })}
          options={[
            { value: "Data Analytics Career Program", label: "Data Analytics Career Program (16 Weeks)" },
          ]}
        />
      </div>

      <Textarea
        label="Questions or Career Goals (Optional)"
        placeholder="Tell us about your background, tools you know, or questions about the curriculum..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={2}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
        {buttonText}
      </Button>

      <p className="text-xs text-center text-[#64748B] mt-2">
        🔒 Zero spam policy. We respect your privacy. 100% free career evaluation with an analytics mentor.
      </p>
    </form>
  );
}
