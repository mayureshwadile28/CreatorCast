import React from "react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, Sparkles, ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion-client";

const fallbackAvatarMap: Record<string, string> = {
  divyesh: "/creators/divyesh.jpg",
  mayuresh: "/creators/mayuresh.jpg",
  vedant: "/creators/vedant.jpg",
  yogesh: "/creators/yogesh.jpg",
};

export default async function MyBookingsPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // fallback
  }

  if (!user?.email) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16 bg-[#07080b]">
        <FadeIn className="w-full max-w-md text-center glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5 text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight text-white mb-2">
            Track Inquiries
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in to review live status updates, staff reviews, and booking confirmation for your inquiries.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Sign In to View
          </Link>
          <div className="mt-4">
            <Link
              href="/"
              className="text-xs uppercase font-mono tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Fetch all bookings for this user email
  let bookings: any[] = [];
  try {
    bookings = await prisma.$queryRawUnsafe(`
      SELECT 
        b.id, b."clientName", b."clientEmail", b.company, 
        b."eventType", b.budget, b."eventDate", b.notes, b.status, b."createdAt",
        a.id as "artistId", a.name as "artistName", a.category as "artistCategory", a."avatarUrl" as "artistAvatar"
      FROM "Booking" b
      LEFT JOIN "Artist" a ON b."artistId" = a.id
      WHERE LOWER(b."clientEmail") = LOWER($1)
      ORDER BY b."createdAt" DESC
    `, user.email);
  } catch (err) {
    console.error("Error loading user bookings:", err);
  }

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f8fafc] pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-white/10 bg-[#090c12]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="group text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-indigo-400" />
            <span>Return to Directory</span>
          </Link>

          <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
            Client Portal
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
        {/* Header Title */}
        <FadeIn duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 block mb-1">
                Active Client Status
              </span>
              <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase">
                My Booking Inquiries
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Signed in as: <span className="text-white">{user.email}</span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Total Inquiries
              </span>
              <span className="font-heading font-black text-3xl text-white">
                {bookings.length}
              </span>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02]">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 block mb-1">
                In Review by Staff
              </span>
              <span className="font-heading font-black text-3xl text-amber-400">
                {pendingCount}
              </span>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02]">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 block mb-1">
                Confirmed Bookings
              </span>
              <span className="font-heading font-black text-3xl text-emerald-400">
                {confirmedCount}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <FadeIn delay={0.2} duration={0.6}>
            <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 max-w-xl mx-auto">
              <Calendar className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-base font-heading font-semibold text-white">
                No inquiries submitted yet
              </h3>
              <p className="text-xs text-zinc-400 mt-1 mb-6">
                Browse our roster to find creators and request a date, performance, or brand engagement.
              </p>
              <Link
                href="/#roster"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase font-heading font-bold tracking-wider rounded-full inline-flex items-center gap-2"
              >
                <span>Browse Creators</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const key = booking.artistName?.toLowerCase() || "";
              const avatar =
                booking.artistAvatar || fallbackAvatarMap[key] || "/creators/divyesh.jpg";

              return (
                <FadeIn key={booking.id} duration={0.5}>
                  <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Artist Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                        <Image
                          src={avatar}
                          alt={booking.artistName || "Creator"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                            {booking.artistName || "Exclusive Creator"}
                          </h3>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300">
                            {booking.artistCategory || "CREATOR"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Event: <span className="text-zinc-200">{booking.eventType}</span> • Budget: <span className="text-indigo-300 font-mono">{booking.budget}</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Date & Time Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-zinc-400">
                      {booking.eventDate && (
                        <div className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Event Date: {booking.eventDate}</span>
                        </div>
                      )}
                      <div className="text-zinc-500">
                        Submitted: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Right: Status Pill Badge */}
                    <div className="flex items-center justify-between md:justify-end gap-3">
                      {booking.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm">
                          <Clock className="w-3.5 h-3.5" />
                          <span>In Staff Review</span>
                        </span>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Booking Confirmed</span>
                        </span>
                      )}
                      {booking.status === "DECLINED" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 shadow-sm">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      )}

                      {booking.artistId && (
                        <Link
                          href={`/artists/${booking.artistId}`}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          title="View Artist Profile"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
