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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-zinc-100 selection:text-zinc-950 relative">
      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-agency-grid opacity-60 pointer-events-none z-0" />

      {/* Fixed High-End Minimalist Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center space-x-3">
            <span className="font-heading font-bold text-base sm:text-lg tracking-[0.2em] text-zinc-100 uppercase group-hover:text-white transition-colors">
              CREATORCAST
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-zinc-500 border-l border-zinc-800 pl-3">
              Talent Management
            </span>
          </Link>

          {/* Responsive Desktop and Mobile Navigation */}
          <CustomerNav user={user} isAdmin={isAdmin} logoutAction={logout} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 sm:pt-20 relative z-10">{children}</main>

      {/* High-End Agency Footer */}
      <footer className="border-t border-zinc-850 bg-[#09090b] text-zinc-400 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-zinc-850">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-heading font-bold text-lg tracking-[0.2em] uppercase text-white">
                  CREATORCAST
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                  Global Roster
                </span>
              </div>
              <p className="text-sm text-zinc-400 max-w-md font-sans leading-relaxed">
                Full-service management, brand partnerships, and commercial representation for India's foremost digital creators and cultural leaders.
              </p>
            </div>

            <div className="flex flex-col md:items-end space-y-3 text-xs uppercase tracking-wider">
              <div className="flex flex-wrap gap-6 text-zinc-300 font-medium">
                <Link href="/#roster" className="hover:text-white transition-colors">
                  Talent Roster
                </Link>
                <Link href="/#impact" className="hover:text-white transition-colors">
                  Agency Impact
                </Link>
                <Link href="/#press" className="hover:text-white transition-colors">
                  Press & Media
                </Link>
                {!user && (
                  <Link href="/login" className="hover:text-white transition-colors">
                    Client Access
                  </Link>
                )}
              </div>
              <p className="text-zinc-500 normal-case text-xs font-mono">
                Mumbai · Bengaluru · New Delhi
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2 font-mono">
            <p>&copy; {new Date().getFullYear()} CreatorCast Agency. All rights reserved.</p>
            <p className="text-[11px] text-zinc-500">
              COMMERCIAL TALENT INFRASTRUCTURE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
