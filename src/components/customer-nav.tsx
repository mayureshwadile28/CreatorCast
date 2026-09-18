"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, User, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <nav className="hidden md:flex items-center space-x-6 text-xs tracking-wider uppercase font-medium">
        <a
          href="/#roster"
          onClick={(e) => handleNavClick(e, "roster")}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Talent Roster
        </a>
        <a
          href="/#impact"
          onClick={(e) => handleNavClick(e, "impact")}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Agency Impact
        </a>
        <a
          href="/#press"
          onClick={(e) => handleNavClick(e, "press")}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Press
        </a>

        {/* Customer Inquiries Link */}
        {user && (
          <Link
            href="/my-bookings"
            className="text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs"
          >
            <span>My Inquiries</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </Link>
        )}

        {/* Staff Portal Link (Admin only) */}
        {isAdmin && (
          <Button variant="outline" size="sm" asChild className="h-8 text-xs border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200">
            <Link href="/admin">
              <Shield className="w-3 h-3 text-zinc-400" />
              <span>Staff Desk</span>
            </Link>
          </Button>
        )}

        {/* Auth CTA */}
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-zinc-400 hidden lg:inline-block truncate max-w-[140px]">
              {user.email?.split("@")[0]}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">
                Sign Out
              </Button>
            </form>
          </div>
        ) : (
          <Button size="sm" asChild className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium px-4">
            <Link href="/login">Client Access</Link>
          </Button>
        )}
      </nav>

      {/* Mobile Hamburger Action */}
      <div className="flex md:hidden items-center space-x-2">
        {user ? (
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="text-xs text-zinc-400">
              Sign Out
            </Button>
          </form>
        ) : (
          <Button size="sm" asChild className="h-8 text-xs px-3 bg-white text-zinc-950 hover:bg-zinc-200">
            <Link href="/login">Client Access</Link>
          </Button>
        )}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 sm:top-20 z-40 bg-[#09090b] border-b border-zinc-850 p-6 shadow-2xl flex flex-col space-y-4 md:hidden"
          >
            <div className="flex flex-col space-y-3 text-sm uppercase tracking-wider font-medium">
              <a
                href="/#roster"
                onClick={(e) => handleNavClick(e, "roster")}
                className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 text-zinc-200"
              >
                Talent Roster
              </a>
              <a
                href="/#impact"
                onClick={(e) => handleNavClick(e, "impact")}
                className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              >
                Agency Impact
              </a>
              <a
                href="/#press"
                onClick={(e) => handleNavClick(e, "press")}
                className="py-2.5 px-3 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              >
                Press & Media
              </a>

              {user && (
                <Link
                  href="/my-bookings"
                  onClick={closeMobile}
                  className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-between"
                >
                  <span>My Inquiries</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <span>Staff Desk</span>
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-850">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    {user.email}
                  </span>
                  <form action={logoutAction}>
                    <Button type="submit" variant="outline" size="sm" className="border-zinc-800">
                      Sign Out
                    </Button>
                  </form>
                </div>
              ) : (
                <Button asChild className="w-full bg-white text-zinc-950 hover:bg-zinc-200">
                  <Link href="/login" onClick={closeMobile}>
                    Client Access
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
