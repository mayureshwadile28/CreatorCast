"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles, User, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerNavProps {
  user: any;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
}

export function CustomerNav({ user, isAdmin, logoutAction }: CustomerNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${targetId}`);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-7 text-xs tracking-wider uppercase font-medium">
        <a
          href="/#roster"
          onClick={(e) => handleNavClick(e, "roster")}
          className="text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Creators
        </a>
        <a
          href="/#impact"
          onClick={(e) => handleNavClick(e, "impact")}
          className="text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Impact
        </a>
        <a
          href="/#press"
          onClick={(e) => handleNavClick(e, "press")}
          className="text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Press
        </a>

        {/* Customer Inquiries Link */}
        {user && (
          <Link
            href="/my-bookings"
            className="text-zinc-300 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <span>My Bookings</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>
        )}

        {/* Staff Portal Link (Admin only) */}
        {isAdmin && (
          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-full text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all text-[11px] font-mono tracking-wider inline-flex items-center gap-1.5"
          >
            <Shield className="w-3 h-3" />
            <span>Staff Portal</span>
          </Link>
        )}

        {/* Auth CTA */}
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono text-zinc-400 hidden lg:inline-block truncate max-w-[140px]">
              {user.email?.split("@")[0]}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 border border-white/15 hover:border-white/40 text-zinc-300 hover:text-white transition-all text-[11px] font-mono tracking-wider uppercase rounded-full cursor-pointer hover:bg-white/5"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-heading font-semibold text-xs tracking-wider uppercase rounded-full shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Hamburger Action */}
      <div className="flex md:hidden items-center space-x-2.5">
        {user ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3 py-1.5 border border-white/20 text-zinc-300 text-[11px] font-mono tracking-wider uppercase rounded-full hover:bg-white/5"
            >
              Sign Out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 bg-indigo-600 text-white text-[11px] font-heading font-semibold tracking-wider uppercase rounded-full shadow"
          >
            Sign In
          </Link>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 top-20 z-40 bg-[#0a0d14]/98 backdrop-blur-2xl border-b border-white/10 p-5 md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-1 text-sm tracking-wider uppercase font-heading font-semibold">
              <a
                href="/#roster"
                onClick={(e) => handleNavClick(e, "roster")}
                className="text-zinc-200 hover:text-white py-3.5 px-3 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>Creators Roster</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </a>
              <a
                href="/#impact"
                onClick={(e) => handleNavClick(e, "impact")}
                className="text-zinc-200 hover:text-white py-3.5 px-3 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>Agency Impact</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </a>
              <a
                href="/#press"
                onClick={(e) => handleNavClick(e, "press")}
                className="text-zinc-200 hover:text-white py-3.5 px-3 rounded-xl hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>Press & Media</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </a>

              {user && (
                <Link
                  href="/my-bookings"
                  onClick={closeMobile}
                  className="text-emerald-300 hover:text-emerald-200 py-3.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>My Bookings</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className="text-indigo-300 hover:text-indigo-200 py-3.5 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Staff Portal</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
