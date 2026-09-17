import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { logout } from "@/app/actions/auth";
import { CustomerNav } from "@/components/customer-nav";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;

    if (user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      isAdmin = dbUser?.role === Role.ADMIN;
    }
  } catch (err) {
    console.warn("Layout session resolution skipped:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black relative">
      {/* Ambient background glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-side" />

      {/* Fixed Luxury Floating Glass Header that follows on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full glass-nav">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="group flex items-center space-x-2">
            <span className="font-heading font-black text-xl md:text-2xl tracking-[0.2em] uppercase text-white transition-opacity group-hover:opacity-80">
              CREATORCAST
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white transition-transform group-hover:scale-125" />
          </Link>

          {/* Responsive Desktop and Mobile Navigation */}
          <CustomerNav user={user} isAdmin={isAdmin} logoutAction={logout} />
        </div>
      </header>

      {/* Main Content Area - padded to account for fixed header */}
      <main className="flex-1 pt-20 relative z-10">{children}</main>

      {/* Editorial Minimalist Footer */}
      <footer className="border-t border-zinc-900 bg-[#050505] text-zinc-400 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end pb-12 border-b border-zinc-900">
            <div>
              <span className="font-heading font-black text-2xl tracking-[0.25em] uppercase text-white block mb-4">
                CREATORCAST
              </span>
              <p className="font-editorial text-2xl md:text-3xl text-zinc-300 max-w-md leading-snug">
                Building Indian creator culture. <br className="hidden sm:block" />
                <span className="text-white">Exporting it to the world.</span>
              </p>
            </div>

            <div className="flex flex-col md:items-end justify-between space-y-4 text-xs uppercase tracking-[0.2em]">
              <div className="flex flex-wrap gap-8 text-zinc-400">
                <Link href="/#roster" className="hover:text-white transition-colors">
                  The Roster
                </Link>
                <Link href="/#impact" className="hover:text-white transition-colors">
                  Agency Impact
                </Link>
                {!user && (
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                )}
              </div>
              <p className="text-zinc-600 normal-case tracking-normal text-xs font-mono">
                Private Talent Agency & International Management
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600">
            <p>&copy; {new Date().getFullYear()} CreatorCast Talent Agency. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[11px] text-zinc-600">
              REPRESENT ARCHITECTURE · EDITION 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
