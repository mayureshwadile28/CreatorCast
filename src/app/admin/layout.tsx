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
    <div className="min-h-screen flex flex-col bg-black text-white relative selection:bg-white selection:text-black">
      {/* Ambient background glows */}
      <div className="ambient-glow-top" />

      {/* Staff Luxury Glass Header (Fixed on scroll) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin" className="flex items-center space-x-2 group">
            <span className="font-heading font-black text-lg md:text-xl tracking-[0.2em] uppercase text-white">
              CreatorCast
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 glass-pill text-zinc-300 rounded-full">
              Staff
            </span>
          </Link>

          <nav className="hidden sm:flex items-center space-x-6 text-xs uppercase tracking-[0.2em] font-medium">
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
              className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span>Bookings</span>
              {pendingBadge > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold font-mono flex items-center justify-center">
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

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="hidden md:inline-block text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            Live Directory &rarr;
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
