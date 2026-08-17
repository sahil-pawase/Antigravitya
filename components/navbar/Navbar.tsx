"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/ui/Button";
import { BookDemoModal } from "@/leads/BookDemoModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  Shield,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string; fullName: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Programs", href: "/courses/data-analytics" },
    { label: "Projects", href: "/projects" },
    { label: "Career Roadmap", href: "/#career-roadmap" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#06101D]/90 backdrop-blur-xl border-b border-[#162942] shadow-xl shadow-black/30"
            : "bg-[#06101D]/75 backdrop-blur-md border-b border-[#162942]/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with 3D hover */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#397CFF] to-[#41D8FF] p-0.5 shadow-md shadow-[#397CFF]/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <div className="w-full h-full bg-[#06101D] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#41D8FF] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#FFFFFF] group-hover:text-[#41D8FF] transition-colors leading-none">
                CAREER TRANSFORMER
              </span>
              <span className="text-[10px] tracking-widest text-[#94A3B8] uppercase font-semibold mt-1">
                Data Analytics Institute
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-[#41D8FF] relative py-1 ${
                    isActive ? "text-[#41D8FF] font-semibold" : "text-[#94A3B8]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#41D8FF] rounded-full shadow-[0_0_8px_#41D8FF]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDemoModalOpen(true)}
              className="border-[#397CFF]/40 text-[#41D8FF] hover:bg-[#397CFF]/10 shadow-sm"
            >
              Book Free Demo
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "ADMIN" ? (
                  <Link href="/admin">
                    <Button variant="secondary" size="sm" className="gap-1.5 border-amber-500/30 text-amber-400">
                      <Shield className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm" className="gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#0C1A2B] border border-[#162942] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-[#F5F8FC]">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDemoModalOpen(true)}
              className="text-xs px-2.5 py-1.5 border-[#397CFF]/40 text-[#41D8FF]"
            >
              Free Demo
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white bg-[#081827] border border-[#162942] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Framer Motion */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="lg:hidden bg-[#081827]/95 backdrop-blur-2xl border-b border-[#162942] px-6 py-6 space-y-4 shadow-2xl overflow-hidden"
            >
              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-medium py-1 transition-colors ${
                      pathname === link.href ? "text-[#41D8FF]" : "text-[#94A3B8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-[#162942] flex flex-col gap-3">
                <Button
                  variant="cyan"
                  size="md"
                  className="w-full justify-center shadow-lg shadow-[#41D8FF]/20"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDemoModalOpen(true);
                  }}
                >
                  Book Free 1-on-1 Demo
                </Button>

                {user ? (
                  <div className="flex flex-col gap-2">
                    {user.role === "ADMIN" ? (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="secondary" size="md" className="w-full text-amber-400 justify-center">
                          <Shield className="w-4 h-4 mr-2" /> Admin Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="primary" size="md" className="w-full justify-center">
                          <LayoutDashboard className="w-4 h-4 mr-2" /> Student Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="md" onClick={handleLogout} className="w-full text-red-400 justify-center">
                      <LogOut className="w-4 h-4 mr-2" /> Log Out ({user.fullName})
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" size="md" className="w-full justify-center">
                        <UserIcon className="w-4 h-4 mr-2" /> Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" size="md" className="w-full justify-center">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Book Demo Modal */}
      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  );
}
