import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { logout } from "@/app/actions/auth";
import { CustomerNav } from "@/components/customer-nav";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let isAdmin = false;

  try {
    const cookieStore = await cookies();
    const hasAuth = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));

    if (hasAuth) {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;

      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });
        isAdmin = dbUser?.role === Role.ADMIN;
      }
    }
  } catch (err) {
    console.warn("Layout session resolution skipped:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-[#f8fafc] selection:bg-indigo-500 selection:text-white relative">
      {/* Ambient background glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-side" />
      <div className="ambient-glow-bottom" />

      {/* Fixed Luxury Floating Glass Header that follows on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-heading font-black text-white text-base">C</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-indigo-200 transition-colors">
                CreatorCast
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </Link>

          {/* Responsive Desktop and Mobile Navigation */}
          <CustomerNav user={user} isAdmin={isAdmin} logoutAction={logout} />
        </div>
      </header>

      {/* Main Content Area - padded to account for fixed header */}
      <main className="flex-1 pt-20 relative z-10">{children}</main>

      {/* Modern High-End Platform Footer */}
      <footer className="border-t border-white/10 bg-[#090b10] text-zinc-400 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2.5 mb-3">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                  C
                </span>
                <span className="font-heading font-black text-xl tracking-wider uppercase text-white">
                  CREATORCAST
                </span>
              </div>
              <p className="text-sm text-zinc-400 max-w-md font-sans">
                Next-generation management and booking infrastructure for premier digital creators, artists, and culture pioneers.
              </p>
            </div>

            <div className="flex flex-col md:items-end space-y-3 text-xs uppercase tracking-wider">
              <div className="flex flex-wrap gap-6 text-zinc-300 font-medium">
                <Link href="/#roster" className="hover:text-indigo-400 transition-colors">
                  Creators
                </Link>
                <Link href="/#impact" className="hover:text-indigo-400 transition-colors">
                  Impact
                </Link>
                <Link href="/#press" className="hover:text-indigo-400 transition-colors">
                  Press
                </Link>
                {!user && (
                  <Link href="/login" className="hover:text-indigo-400 transition-colors">
                    Sign In
                  </Link>
                )}
              </div>
              <p className="text-zinc-500 normal-case text-xs font-mono">
                Official Artist & Creator Booking Network
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
            <p>&copy; {new Date().getFullYear()} CreatorCast Inc. All rights reserved.</p>
            <p className="font-mono text-[11px] text-zinc-500">
              SECURE TALENT PLATFORM · EDITION 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
