"use client";

import React, { useTransition } from "react";
import { updateBookingStatus, deleteBooking } from "@/app/actions/bookings";
import { Check, X, RotateCcw, Trash2 } from "lucide-react";

interface StatusActionsProps {
  bookingId: string;
  currentStatus: string;
}

export function BookingStatusActions({ bookingId, currentStatus }: StatusActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: "CONFIRMED" | "DECLINED" | "PENDING") => {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently remove this inquiry?")) {
      startTransition(async () => {
        await deleteBooking(bookingId);
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {currentStatus === "PENDING" && (
        <>
          <button
            onClick={() => handleUpdate("CONFIRMED")}
            disabled={isPending}
            title="Approve & Contact Artist"
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all text-[10px] font-mono uppercase tracking-wider disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => handleUpdate("DECLINED")}
            disabled={isPending}
            title="Decline Inquiry"
            className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-all text-[10px] font-mono uppercase tracking-wider disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Decline</span>
          </button>
        </>
      )}

      {currentStatus === "CONFIRMED" && (
        <>
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded-full">
            In Touch
          </span>
          <button
            onClick={() => handleUpdate("PENDING")}
            disabled={isPending}
            title="Re-open Review"
            className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </>
      )}

      {currentStatus === "DECLINED" && (
        <>
          <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 border border-rose-500/20 rounded-full">
            Declined
          </span>
          <button
            onClick={() => handleUpdate("CONFIRMED")}
            disabled={isPending}
            title="Re-approve"
            className="p-1 rounded-full text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
          >
            <Check className="w-3 h-3" />
          </button>
        </>
      )}

      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Delete Record"
        className="p-1.5 rounded-full text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
