import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { logout } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  // Check RBAC in Prisma database
  const user = await prisma.user.findUnique({
    where: { email: data.user.email },
  });

  if (!user || user.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }

  // Query pending bookings count for live badge
  let pendingBadge = 0;
  try {
    const res: any[] = await prisma.$queryRawUnsafe(
      `SELECT count(*)::int as count FROM "Booking" WHERE status = 'PENDING'`
    );
    pendingBadge = res?.[0]?.count || 0;
  } catch {
    // fallback 0
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-[#f8fafc] relative selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-side" />

      {/* Staff Luxury Glass Header (Fixed on scroll) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav px-4 sm:px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-6 sm:space-x-8">
          <Link href="/admin" className="flex items-center space-x-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-heading font-black text-white text-base">C</span>
            </span>
            <span className="font-heading font-black text-lg md:text-xl tracking-wider uppercase text-white">
              CreatorCast
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full">
              Staff
            </span>
          </Link>

          <nav className="hidden sm:flex items-center space-x-5 text-xs uppercase tracking-wider font-medium">
            <Link
              href="/admin"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/artists"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Roster
            </Link>
            <Link
              href="/admin/bookings"
              className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>Bookings</span>
              {pendingBadge > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold font-mono flex items-center justify-center">
                  {pendingBadge}
                </span>
              )}
            </Link>
            <Link
              href="/admin/users"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Users
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            href="/"
            className="hidden md:inline-block text-xs uppercase tracking-wider text-zinc-400 hover:text-indigo-300 transition-colors font-mono"
          >
            Public Site &rarr;
          </Link>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-mono text-zinc-400">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-[11px] uppercase tracking-wider font-mono px-3.5 py-1.5 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Container with top padding for fixed header */}
      <main className="flex-1 max-w-7xl w-full mx-auto pt-24 pb-16 relative z-10 px-4 sm:px-6 md:px-12">
        {children}
      </main>
    </div>
  );
}
