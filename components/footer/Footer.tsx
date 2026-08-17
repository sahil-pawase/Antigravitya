import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Shield, CheckCircle, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#040B14] border-t border-[#162942] text-[#94A3B8] text-sm mt-20 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#397CFF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-md shadow-[#397CFF]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#41D8FF]" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors">
                CAREER TRANSFORMER
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-[#94A3B8] max-w-sm">
              Transform Your Skills. Build Your Career. A structured, hands-on career transformation platform for Data Analytics, Business Intelligence, and Data Engineering.
            </p>

            <div className="p-3.5 rounded-xl bg-[#081827] border border-[#162942] hover:border-[#397CFF]/40 space-y-2 max-w-sm transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#41D8FF]">
                <Shield className="w-4 h-4" />
                <span>Our Transparency Commitment</span>
              </div>
              <p className="text-xs text-[#64748B] leading-normal">
                We believe in authentic project-driven learning. We do not advertise fake placement guarantees or inflated statistics. Real skills, real portfolios, real careers.
              </p>
            </div>
          </div>

          {/* Programs Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Flagship Programs</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/courses/data-analytics"
                  className="hover:text-[#41D8FF] transition-colors inline-flex items-center gap-1 group text-sm"
                >
                  <span>Data Analytics Career Program</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#41D8FF]" />
                </Link>
              </li>
              <li>
                <span className="text-xs text-[#64748B]">Core Modules:</span>
                <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-[#94A3B8]">
                  <span>• Advanced Excel</span>
                  <span>• Analytics SQL</span>
                  <span>• Power BI & DAX</span>
                  <span>• Tableau Visuals</span>
                  <span>• Python EDA</span>
                  <span>• Business Stats</span>
                </div>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#41D8FF] transition-colors text-sm block">
                  Portfolio Projects Gallery
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#41D8FF] transition-colors text-sm block">
                  Course Fee & EMI Options
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#41D8FF] transition-colors block">
                  About Us & Mission
                </Link>
              </li>
              <li>
                <Link href="/#career-roadmap" className="hover:text-[#41D8FF] transition-colors block">
                  Career Roadmap
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-[#41D8FF] transition-colors block">
                  Verified Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#41D8FF] transition-colors block">
                  Contact Admissions
                </Link>
              </li>
              <li>
                <Link href="/verify/CT-DA-2025-001" className="hover:text-[#41D8FF] transition-colors block">
                  Certificate Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">Connect & Portals</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-xs hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#397CFF] flex-shrink-0" />
                <span>admissions@careertransformer.in</span>
              </li>
              <li className="flex items-center gap-2 text-xs hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#41D8FF] flex-shrink-0" />
                <span>+91 98765 43210 (Admissions)</span>
              </li>
              <li className="flex items-start gap-2 text-xs hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span>Bengaluru & Pan-India Virtual Cohorts</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-[#162942] flex flex-col gap-2 text-xs">
              <Link href="/login" className="text-[#397CFF] hover:text-[#41D8FF] font-semibold flex items-center gap-1 transition-colors">
                <CheckCircle className="w-3.5 h-3.5" /> Student Learning Portal
              </Link>
              <Link href="/login" className="text-[#64748B] hover:text-[#94A3B8] text-[11px] flex items-center gap-1 transition-colors">
                <Shield className="w-3 h-3" /> Instructor & Admin Access
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#162942] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Career Transformer Education Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/about" className="hover:text-[#94A3B8] transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-[#94A3B8] transition-colors">Terms of Service</Link>
            <Link href="/pricing" className="hover:text-[#94A3B8] transition-colors">Refund Policy</Link>
            <Link href="/verify/CT-DA-2025-001" className="hover:text-[#94A3B8] transition-colors">Verify Credential</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
