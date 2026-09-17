import React from "react";
import { PrismaClient } from "@prisma/client";
import { BookingStatusActions } from "./status-actions";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

const prisma = new PrismaClient();

interface BookingRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  accountName: string | null;
  accountEmail: string | null;
  company: string | null;
  eventType: string;
  budget: string;
  eventDate: string | null;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  createdAt: Date;
  artistName: string | null;
}

export default async function AdminBookingsPage() {
  const bookings: BookingRecord[] = await prisma.$queryRawUnsafe(`
    SELECT 
      b.id, b."clientName", b."clientEmail", b."accountName", b."accountEmail", b.company, 
      b."eventType", b.budget, b."eventDate", b.notes, b.status, b."createdAt",
      a.name as "artistName"
    FROM "Booking" b
    LEFT JOIN "Artist" a ON b."artistId" = a.id
    ORDER BY b."createdAt" DESC
  `);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white uppercase">
            Inquiries & Bookings
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            Talent representation requests & commercial engagements
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Total Requests</span>
            <Calendar className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-3xl font-heading font-black text-white">{bookings.length}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Lifetime inquiries logged</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-heading font-black text-amber-400">{pendingCount}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Awaiting agency review</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-mono">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-heading font-black text-emerald-400">{confirmedCount}</div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Approved contracts</p>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="glass-card border border-white/10 overflow-hidden rounded-2xl shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
            Incoming Commercial Inquiries
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Realtime Postgres Feed</span>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="h-12 px-4 font-medium">Artist</th>
                <th className="h-12 px-4 font-medium">Client / Google Auth</th>
                <th className="h-12 px-4 font-medium hidden md:table-cell">Engagement</th>
                <th className="h-12 px-4 font-medium">Budget (₹ INR)</th>
                <th className="h-12 px-4 font-medium hidden sm:table-cell">Target Date</th>
                <th className="h-12 px-4 font-medium">Status</th>
                <th className="h-12 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    No booking inquiries recorded yet. Inquiries submitted through artist profiles will appear here.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-heading font-bold text-white whitespace-nowrap">
                      {booking.artistName || "Unknown Artist"}
                    </td>
                    <td className="p-4">
                      {/* Form Entered Name vs Google / Account Name */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white font-medium">{booking.clientName}</span>
                        {booking.accountName && (
                          <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider text-sky-300 bg-sky-950/80 border border-sky-500/30 rounded-full inline-flex items-center gap-1">
                            <span className="text-sky-400 font-bold">Google:</span> {booking.accountName}
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-400 text-[11px] flex flex-col gap-0.5 mt-1 font-mono">
                        <span>Form: {booking.clientEmail}</span>
                        {booking.accountEmail && booking.accountEmail.toLowerCase() !== booking.clientEmail.toLowerCase() && (
                          <span className="text-sky-400/90 text-[10px]">
                            Auth ID: {booking.accountEmail}
                          </span>
                        )}
                      </div>
                      {booking.company && (
                        <div className="text-zinc-500 text-[10px] uppercase font-mono mt-1">
                          Agency: {booking.company}
                        </div>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell text-zinc-300">
                      <div>{booking.eventType}</div>
                      {booking.notes && (
                        <p className="text-[11px] text-zinc-500 truncate max-w-[220px] mt-0.5">
                          {booking.notes}
                        </p>
                      )}
                    </td>
                    <td className="p-4 font-mono text-zinc-200 whitespace-nowrap">
                      {booking.budget}
                    </td>
                    <td className="p-4 hidden sm:table-cell text-zinc-400 whitespace-nowrap">
                      {booking.eventDate || "TBD"}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {booking.status === "PENDING" && (
                        <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                          Pending
                        </span>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                          Confirmed
                        </span>
                      )}
                      {booking.status === "DECLINED" && (
                        <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <BookingStatusActions
                        bookingId={booking.id}
                        currentStatus={booking.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
