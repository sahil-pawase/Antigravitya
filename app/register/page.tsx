"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/Button";
import { Input, Select, Textarea } from "@/ui/Input";
import { GraduationCap, AlertCircle, ShieldCheck } from "lucide-react";
import { TiltCard3D } from "@/components/3d/TiltCard3D";
import { FadeIn } from "@/components/motion/MotionWrapper";
import { DataMesh3DCanvas } from "@/components/3d/DataMesh3DCanvas";
import { DEPARTMENT_OPTIONS } from "@/lib/departments";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    department: "COMP_ENG",
    education: "B.Tech / B.E. (Engineering)",
    college: "",
    gradYear: "2024",
    experienceLevel: "Fresher / Looking for 1st Job",
    city: "",
    careerGoal: "Become a Full-Time Data Analyst / BI Engineer",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
        }
        throw new Error(data.error || "Failed to create account");
      }

      // Registration & session created
      router.push(data.redirectTo || redirectUrl);
      router.refresh();
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

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#397CFF]/30">
      {/* 3D WebGL Canvas */}
      <DataMesh3DCanvas />

      {/* Cyber Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#397CFF]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 px-4 relative z-10">
        <FadeIn>
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-lg shadow-[#397CFF]/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#41D8FF]" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#FFFFFF]">
              CAREER TRANSFORMER
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mt-4">
            Create Your Student Account
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Join the structured Data Analytics career program. Build real GitHub portfolios and receive 1-on-1 code reviews.
          </p>
        </FadeIn>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 relative z-10">
        <FadeIn delay={0.1}>
          <TiltCard3D maxTilt={4} scale={1.01} glowColor="rgba(65, 216, 255, 0.25)">
            <div className="bg-[#081827]/95 border border-[#162942] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-xl group">
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4 [transform:translateZ(10px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Aarav Patel"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={fieldErrors.fullName?.[0]}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="e.g. aarav@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={fieldErrors.email?.[0]}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile / WhatsApp Number *"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={fieldErrors.phone?.[0]}
                    required
                  />
                  <Input
                    label="Password (min 8 chars, 1 capital, 1 num) *"
                    type="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={fieldErrors.password?.[0]}
                    required
                  />
                </div>

                {/* Department / Branch Selection */}
                <div className="space-y-1.5">
                  <Select
                    label="Academic Department / Branch *"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    options={DEPARTMENT_OPTIONS}
                  />
                  <p className="text-[11px] text-[#64748B]">
                    Live mentor classes will be tailored and notified according to your department.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Highest Qualification *"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    options={[
                      { value: "B.Tech / B.E. (Engineering)", label: "B.Tech / B.E. (Engineering)" },
                      { value: "B.Com / BBA / MBA", label: "B.Com / BBA / MBA (Commerce/Business)" },
                      { value: "B.Sc / M.Sc", label: "B.Sc / M.Sc (Science/Statistics/Math)" },
                      { value: "BCA / MCA", label: "BCA / MCA (Computer Applications)" },
                      { value: "Other Degree", label: "Other Graduate Degree" },
                    ]}
                  />
                  <Input
                    label="College / University"
                    placeholder="e.g. Delhi University / VTU"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Graduation Year"
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    options={[
                      { value: "2026", label: "2026 (Upcoming)" },
                      { value: "2025", label: "2025 (Final Year)" },
                      { value: "2024", label: "2024 (Recent)" },
                      { value: "2023", label: "2023" },
                      { value: "2022", label: "2022" },
                      { value: "2021 or earlier", label: "2021 or earlier" },
                    ]}
                  />
                  <Select
                    label="Experience Level *"
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    options={[
                      { value: "Fresher / Looking for 1st Job", label: "Fresher (0 Years)" },
                      { value: "1-2 Years (Junior / Switching)", label: "1-2 Years Experience" },
                      { value: "3-5 Years (Mid-level Switcher)", label: "3-5 Years Experience" },
                      { value: "5+ Years (Senior Professional)", label: "5+ Years Experience" },
                    ]}
                  />
                  <Input
                    label="Current City *"
                    placeholder="e.g. Bengaluru, Pune"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    error={fieldErrors.city?.[0]}
                    required
                  />
                </div>

                <Textarea
                  label="Target Career Goal or Dream Job *"
                  placeholder="e.g. Transitioning from sales to a Data Analyst role in a product company..."
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  error={fieldErrors.careerGoal?.[0]}
                  rows={2}
                  required
                />

                <Button
                  type="submit"
                  variant="cyan"
                  size="lg"
                  className="w-full justify-center font-bold text-base mt-2 shadow-lg shadow-[#41D8FF]/20"
                  isLoading={isLoading}
                >
                  Create Account & Access Dashboard →
                </Button>
              </form>

              <div className="pt-4 border-t border-[#162942] text-center text-xs text-[#94A3B8] [transform:translateZ(5px)]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#41D8FF] font-semibold hover:underline">
                  Log In to Portal
                </Link>
              </div>
            </div>
          </TiltCard3D>
        </FadeIn>

        <div className="flex items-center justify-center gap-2 text-xs text-[#64748B] mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Your information is protected with industry-standard bcrypt encryption</span>
        </div>
      </div>
    </div>
  );
}
