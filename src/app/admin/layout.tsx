import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] relative selection:bg-zinc-100 selection:text-zinc-950">
      {/* Fixed Staff Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between border-b border-zinc-850">
        <div className="flex items-center space-x-6 sm:space-x-8">
          <Link href="/admin" className="flex items-center space-x-2.5 group">
            <span className="font-heading font-bold text-base tracking-[0.2em] uppercase text-white">
              CREATORCAST
            </span>
            <Badge variant="tag" className="bg-zinc-900 border-zinc-700 text-zinc-300">
              Staff Desk
            </Badge>
          </Link>

          <nav className="hidden sm:flex items-center space-x-5 text-xs uppercase tracking-wider font-medium">
            <Link
              href="/admin"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/artists"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Talent Roster
            </Link>
            <Link
              href="/admin/bookings"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Inquiries</span>
              {pendingBadge > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono flex items-center justify-center font-bold">
                  {pendingBadge}
                </span>
              )}
            </Link>
            <Link
              href="/admin/users"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              User Audit
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-xs text-zinc-400 hover:text-white">
            <Link href="/">
              Public Site
            </Link>
          </Button>

          <span className="text-xs font-mono text-zinc-500 hidden md:inline-block">
            {user.email}
          </span>

          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-xs border-zinc-800 text-zinc-300 hover:text-white"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 sm:pt-20 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
        {children}
      </main>
    </div>
  );
}
