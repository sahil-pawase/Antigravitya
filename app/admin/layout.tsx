import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  FolderGit2,
  FileText,
  CreditCard,
  Award,
  Star,
  Settings,
  GraduationCap,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin&error=admin_required");
  }

  const adminLinks = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Lead CRM", href: "/admin/leads", icon: MessageSquare },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Courses & Content", href: "/admin/courses", icon: BookOpen },
    { label: "Project Grading", href: "/admin/projects", icon: FolderGit2 },
    { label: "Assignments", href: "/admin/assignments", icon: FileText },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
    { label: "Certificates", href: "/admin/certificates", icon: Award },
    { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#040B14] text-[#F5F8FC] flex flex-col md:flex-row">
      {/* Desktop Admin Sidebar */}
      <aside className="w-64 bg-[#081827] border-r border-[#162942] flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 p-5">
        <div className="space-y-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-[#41D8FF] p-0.5">
              <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block leading-none">
                CAREER TRANSFORMER
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Admin Management Suite
              </span>
            </div>
          </Link>

          <nav className="space-y-1 pt-2">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#0C1A2B] border border-transparent hover:border-[#162942] transition-colors"
                >
                  <Icon className="w-4 h-4 text-amber-400/80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#162942] space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#06101D] border border-[#162942]">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {session.fullName}
              </span>
              <span className="text-[10px] text-amber-400 block font-mono uppercase">
                DIRECTOR / ADMIN
              </span>
            </div>
          </div>

          <LogoutButton label="Log Out Admin Session" />
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#081827] border-b border-[#162942] p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm text-white">Admin Portal</span>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link href="/admin" className="text-amber-400 font-semibold">Overview</Link>
          <Link href="/admin/leads" className="text-[#94A3B8]">Leads</Link>
          <Link href="/admin/students" className="text-[#94A3B8]">Students</Link>
          <Link href="/admin/projects" className="text-[#94A3B8]">Grading</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
