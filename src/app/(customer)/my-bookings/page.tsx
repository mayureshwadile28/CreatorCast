import React from "react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, CheckCircle2, Calendar, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion-client";

const creatorImageMap: Record<string, string> = {
  divyesh: "/creators/divyesh.jpg",
  mayuresh: "/creators/mayuresh.jpg",
  vedant: "/creators/vedant.jpg",
  yogesh: "/creators/yogesh.jpg",
};

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
        <FadeIn className="w-full max-w-md text-center glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-zinc-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mb-2">
            Track Your Inquiries
          </h1>
          <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
            Please sign in to your CreatorCast account to review live updates, staff reviews, and artist coordination statuses for your bookings.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3.5 bg-white text-black font-heading font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-lg"
          >
            Sign In to Account
          </Link>
          <div className="mt-4">
            <Link
              href="/"
              className="text-xs uppercase font-mono tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Fetch all bookings for this user email
  const bookings: any[] = await prisma.$queryRawUnsafe(`
    SELECT 
      b.id, b."clientName", b."clientEmail", b.company, 
      b."eventType", b.budget, b."eventDate", b.notes, b.status, b."createdAt",
      a.id as "artistId", a.name as "artistName", a.category as "artistCategory", a."avatarUrl" as "artistAvatar"
    FROM "Booking" b
    LEFT JOIN "Artist" a ON b."artistId" = a.id
    WHERE LOWER(b."clientEmail") = LOWER($1)
    ORDER BY b."createdAt" DESC
  `, user.email);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-zinc-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="group text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Directory</span>
          </Link>

          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono">
            CLIENT PORTAL // {user.email}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16">
        {/* Header Section */}
        <FadeIn duration={0.7}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-900">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono block mb-2">
                Agency Client Tracking Desk
              </span>
              <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase">
                My <span className="font-editorial font-normal text-zinc-300 normal-case">Inquiries.</span>
              </h1>
            </div>
            <p className="font-editorial text-zinc-400 text-base sm:text-lg max-w-md">
              Live status tracking for talent representations, corporate inquiries, and campaign bookings.
            </p>
          </div>
        </FadeIn>

        {/* Overview KPI Cards */}
        <FadeIn delay={0.15} duration={0.7}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase tracking-wider font-mono">Total Inquiries</span>
                <Calendar className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-3xl font-heading font-black text-white">{bookings.length}</div>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Submitted under your email</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase tracking-wider font-mono">In Staff Review</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-heading font-black text-amber-400">{pendingCount}</div>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Under review by agency staff</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase tracking-wider font-mono">Confirmed & Active</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-heading font-black text-emerald-400">{confirmedCount}</div>
              <p className="text-xs text-zinc-500 mt-1 font-mono">In touch with creator</p>
            </div>
          </div>
        </FadeIn>

        {/* Bookings Feed */}
        <div className="space-y-8 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
              Active Inquiries Log ({bookings.length})
            </h2>
            <Link
              href="/#roster"
              className="text-xs uppercase font-mono tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <FadeIn delay={0.2}>
              <div className="glass-card p-12 sm:p-16 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2 uppercase tracking-wide">
                  No Inquiries Recorded
                </h3>
                <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
                  You have not submitted any talent inquiries yet. Browse our exclusive artist roster and request representation or event bookings.
                </p>
                <Link
                  href="/#roster"
                  className="px-6 py-3 bg-white text-black font-heading font-bold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all shadow-lg"
                >
                  Browse Artists
                </Link>
              </div>
            </FadeIn>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, idx) => {
                const key = (booking.artistName || "").toLowerCase();
                const avatar = booking.artistAvatar || creatorImageMap[key] || "/creators/divyesh.jpg";
                const dateLogged = new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <FadeIn key={booking.id} delay={0.05 * idx} duration={0.6}>
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all shadow-xl space-y-6">
                      {/* Top Artist & Status Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
                            <Image
                              src={avatar}
                              alt={booking.artistName || "Artist"}
                              fill
                              className="object-cover grayscale contrast-125"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 px-2.5 py-0.5 rounded-full glass-pill">
                                {booking.artistCategory || "CREATOR"}
                              </span>
                              <span className="text-[10px] uppercase font-mono text-zinc-500">
                                Logged {dateLogged}
                              </span>
                            </div>
                            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                              {booking.artistName || "Agency Talent"}
                            </h3>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="self-start sm:self-center">
                          {booking.status === "PENDING" && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span>Under Review by Staff</span>
                            </span>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Confirmed · In Contact with Artist</span>
                            </span>
                          )}
                          {booking.status === "DECLINED" && (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-rose-400" />
                              <span>Inquiry Closed</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 3-Step Live Timeline Tracker */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/5">
                        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mb-4">
                          Inquiry Progression Lifecycle
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Step 1 */}
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-bold">
                              ✓
                            </div>
                            <div>
                              <p className="font-heading font-bold text-xs uppercase text-white tracking-wider">
                                1. Inquiry Submitted
                              </p>
                              <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                                Logged to agency database
                              </p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                                : booking.status === "PENDING"
                                ? "bg-amber-500/20 border border-amber-500/50 text-amber-400 animate-pulse"
                                : "bg-zinc-800 border border-zinc-700 text-zinc-500"
                            }`}>
                              {booking.status === "CONFIRMED" ? "✓" : "2"}
                            </div>
                            <div>
                              <p className={`font-heading font-bold text-xs uppercase tracking-wider ${
                                booking.status === "PENDING" ? "text-amber-300" : "text-white"
                              }`}>
                                2. Staff Review
                              </p>
                              <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                                {booking.status === "CONFIRMED"
                                  ? "Staff review completed"
                                  : booking.status === "PENDING"
                                  ? "Staff evaluating terms"
                                  : "Review completed"}
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                                : "bg-zinc-900 border border-white/10 text-zinc-600"
                            }`}>
                              {booking.status === "CONFIRMED" ? "✓" : "3"}
                            </div>
                            <div>
                              <p className={`font-heading font-bold text-xs uppercase tracking-wider ${
                                booking.status === "CONFIRMED" ? "text-emerald-300" : "text-zinc-500"
                              }`}>
                                3. Artist Alignment
                              </p>
                              <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
                                {booking.status === "CONFIRMED"
                                  ? "In active contact with artist"
                                  : "Awaiting staff approval"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Specifications Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                            Engagement Type
                          </span>
                          <span className="text-xs font-semibold text-zinc-200">
                            {booking.eventType}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                            Target Budget (₹ INR)
                          </span>
                          <span className="text-xs font-mono font-bold text-white">
                            {booking.budget}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                            Target Date
                          </span>
                          <span className="text-xs font-mono text-zinc-200">
                            {booking.eventDate || "Flexible / TBD"}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                            Client Reference
                          </span>
                          <span className="text-xs text-zinc-200 truncate block">
                            {booking.clientName} {booking.company ? `(${booking.company})` : ""}
                          </span>
                        </div>
                      </div>

                      {/* Notes / Deliverables if provided */}
                      {booking.notes && (
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
                            Project Scope & Scope Notes
                          </span>
                          <p className="text-xs text-zinc-300 font-light leading-relaxed">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* Bottom Artist Link */}
                      {booking.artistId && (
                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/artists/${booking.artistId}`}
                            className="text-xs uppercase font-mono tracking-wider text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>View {booking.artistName}'s Profile</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
