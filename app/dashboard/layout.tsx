import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  FileText,
  Award,
  User,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  const sidebarLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Courses & Labs", href: "/dashboard/courses", icon: BookOpen },
    { label: "Portfolio Projects", href: "/dashboard/projects", icon: FolderGit2 },
    { label: "Assignments", href: "/dashboard/assignments", icon: FileText },
    { label: "Certificates", href: "/dashboard/certificates", icon: Award },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#06101D] text-[#F5F8FC] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#081827] border-r border-[#162942] flex flex-col justify-between hidden md:flex min-h-screen sticky top-0 p-5">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5">
              <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#41D8FF]" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block leading-none">
                CAREER TRANSFORMER
              </span>
              <span className="text-[10px] text-[#41D8FF] font-semibold uppercase tracking-wider">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F5F8FC] hover:bg-[#0C1A2B] border border-transparent hover:border-[#162942] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#397CFF]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-[#162942] space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#06101D] border border-[#162942]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
              {session.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate">
                {session.fullName}
              </span>
              <span className="text-[10px] text-[#41D8FF] block uppercase font-mono">
                {session.role}
              </span>
            </div>
          </div>

          <LogoutButton label="Log Out" />
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#081827] border-b border-[#162942] p-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#41D8FF]" />
          <span className="font-bold text-sm text-white">Career Transformer</span>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <Link href="/dashboard" className="text-[#41D8FF] font-medium">Dashboard</Link>
          <Link href="/dashboard/courses" className="text-[#94A3B8]">Courses</Link>
          <Link href="/dashboard/projects" className="text-[#94A3B8]">Projects</Link>
          <Link href="/dashboard/profile" className="text-[#94A3B8]">Profile</Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
