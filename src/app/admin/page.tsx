import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Sparkles, Users, Shield, CalendarCheck, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const artistsCount = await prisma.artist.count();
  
  // Real registered clients (excluding the demo artists)
  const clientsCount = await prisma.user.count({
    where: {
      role: "CUSTOMER",
      artist: null,
    },
  });

  // Staff accounts
  const staffCount = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });

  let bookingsCount = 0;
  let pendingCount = 0;
  try {
    const res: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        count(*)::int as total,
        count(*) FILTER (WHERE status = 'PENDING')::int as pending
      FROM "Booking"
    `);
    bookingsCount = res?.[0]?.total || 0;
    pendingCount = res?.[0]?.pending || 0;
  } catch {
    // fallback
  }

  return (
    <div className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white uppercase">
            Executive Overview
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            CreatorCast Operations Desk · Verified Database Statistics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="px-5 py-2.5 bg-white text-black text-xs uppercase tracking-wider font-heading font-bold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 rounded-xl shadow-lg hover:shadow-white/10"
          >
            <span>View Inquiries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-2">
        {/* Roster Talent */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-mono">Roster Talent</span>
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-4xl font-heading font-black text-white">{artistsCount}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Active creator profiles</p>
        </div>

        {/* Registered Clients */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-mono">Registered Clients</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-4xl font-heading font-black text-white">{clientsCount}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">External client accounts</p>
        </div>

        {/* Staff Admin */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-mono">Staff Administrators</span>
            <Shield className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-4xl font-heading font-black text-white">{staffCount}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Internal staff access</p>
        </div>

        {/* Talent Inquiries */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-mono">Inquiries Logged</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-4xl font-heading font-black text-white">{bookingsCount}</div>
          <p className="text-xs text-amber-400 mt-1 font-mono">
            {pendingCount} pending agency review
          </p>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Link
          href="/admin/bookings"
          className="glass-card p-6 rounded-2xl border border-white/10 group hover:border-white/20 transition-all block shadow-xl"
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono block mb-2">
            Commercial Workflow
          </span>
          <h3 className="font-heading font-bold text-xl text-white group-hover:text-zinc-200 transition-colors flex items-center justify-between">
            <span>Review Booking Inquiries</span>
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Manage incoming commercial requests, verify budgets, and confirm or decline dates directly in Supabase Postgres.
          </p>
        </Link>

        <Link
          href="/admin/artists"
          className="glass-card p-6 rounded-2xl border border-white/10 group hover:border-white/20 transition-all block shadow-xl"
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono block mb-2">
            Talent Management
          </span>
          <h3 className="font-heading font-bold text-xl text-white group-hover:text-zinc-200 transition-colors flex items-center justify-between">
            <span>Manage Talent Roster</span>
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Inspect creator profiles, categories, genres, and remove or update talent records from the agency roster.
          </p>
        </Link>
      </div>
    </div>
  );
}
