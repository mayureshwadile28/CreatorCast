"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerNavProps {
  user: any;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
}

export function CustomerNav({ user, isAdmin, logoutAction }: CustomerNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium">
        <Link
          href="/#roster"
          className="text-zinc-300 hover:text-white transition-colors duration-200"
        >
          The Roster
        </Link>
        <Link
          href="/#impact"
          className="text-zinc-400 hover:text-white transition-colors duration-200"
        >
          Impact
        </Link>
        <Link
          href="/#press"
          className="text-zinc-400 hover:text-white transition-colors duration-200"
        >
          Press
        </Link>

        {/* Customer My Inquiries Link */}
        {user && (
          <Link
            href="/my-bookings"
            className="text-zinc-300 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            <span>My Inquiries</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </Link>
        )}

        {/* Staff Portal Link - Only visible if logged-in user is ADMIN */}
        {isAdmin && (
          <Link
            href="/admin"
            className="px-3 py-1.5 glass-pill text-zinc-300 hover:text-white transition-colors text-[11px] font-mono tracking-widest uppercase rounded-full"
          >
            Staff Portal
          </Link>
        )}

        {/* Auth Action */}
        {user ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 border border-white/15 hover:border-white/40 text-zinc-300 hover:text-white transition-all text-[11px] font-mono tracking-widest uppercase rounded-full cursor-pointer hover:bg-white/5"
            >
              Sign Out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 bg-white text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all rounded-full shadow-md hover:shadow-white/20"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Hamburger Button */}
      <div className="flex md:hidden items-center space-x-3">
        {user ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-3.5 py-1.5 border border-white/20 text-zinc-300 text-[10px] font-mono tracking-wider uppercase rounded-full cursor-pointer hover:bg-white/5 min-h-[36px]"
            >
              Sign Out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-white text-black font-heading font-bold text-[11px] uppercase tracking-wider rounded-full shadow min-h-[36px] flex items-center justify-center"
          >
            Sign In
          </Link>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-full glass-pill text-zinc-300 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-20 z-40 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-2 text-sm uppercase tracking-[0.2em] font-heading font-semibold">
              <Link
                href="/#roster"
                onClick={closeMobile}
                className="text-zinc-300 hover:text-white py-3 min-h-[48px] border-b border-white/5 flex items-center justify-between"
              >
                <span>The Roster</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/#impact"
                onClick={closeMobile}
                className="text-zinc-300 hover:text-white py-3 min-h-[48px] border-b border-white/5 flex items-center justify-between"
              >
                <span>Agency Impact</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </Link>
              <Link
                href="/#press"
                onClick={closeMobile}
                className="text-zinc-300 hover:text-white py-3 min-h-[48px] border-b border-white/5 flex items-center justify-between"
              >
                <span>Press & Media</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </Link>

              {user && (
                <Link
                  href="/my-bookings"
                  onClick={closeMobile}
                  className="text-zinc-200 hover:text-white py-3 min-h-[48px] border-b border-white/5 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>My Inquiries & Live Status</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className="text-amber-400 hover:text-amber-300 py-3 min-h-[48px] border-b border-white/5 flex items-center justify-between"
                >
                  <span>Staff Operations Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-500" />
                </Link>
              )}

              <div className="pt-4">
                {user ? (
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      onClick={closeMobile}
                      className="w-full py-3 text-center border border-white/20 text-zinc-300 text-xs font-mono uppercase tracking-widest rounded-xl hover:bg-white/5"
                    >
                      Sign Out ({user.email})
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="block w-full py-3.5 text-center bg-white text-black font-heading font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg"
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
