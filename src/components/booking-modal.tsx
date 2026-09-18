"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Calendar, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";
import { submitBooking } from "@/app/actions/bookings";

interface BookingModalProps {
  artistId: string;
  artistName: string;
  artistCategory?: string | null;
  currentUser?: any;
  initialName?: string;
  initialEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
}

export function BookingModal({
  artistId,
  artistName,
  artistCategory,
  currentUser,
  initialName = "",
  initialEmail = "",
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  hideTrigger = false,
}: BookingModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const defaultName = initialName || currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || "";
  const defaultEmail = initialEmail || currentUser?.email || "";

  const dateInputRef = useRef<HTMLInputElement>(null);

  const isControlled = externalIsOpen !== undefined;
  const activeOpen = isControlled ? externalIsOpen : internalIsOpen;

  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
    company: "",
    eventType: "Brand Campaign",
    budget: "₹3,00,000 - ₹8,00,000",
    date: "",
    notes: "",
  });

  // Sync initial user details when prop becomes available
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || defaultName,
      email: prev.email || defaultEmail,
    }));
  }, [defaultName, defaultEmail]);

  // Ensure portal only mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open to prevent background scrolling & footer overlap
  useEffect(() => {
    if (activeOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [activeOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await submitBooking({
        artistId,
        clientName: formData.name,
        clientEmail: formData.email,
        company: formData.company || undefined,
        eventType: formData.eventType,
        budget: formData.budget,
        eventDate: formData.date || undefined,
        notes: formData.notes || undefined,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        setSubmitted(true);
        setLoading(false);
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setSubmitted(false);
    setErrorMessage(null);
  };

  const triggerCalendar = () => {
    const el = dateInputRef.current;
    if (!el) return;
    if (typeof (el as any).showPicker === "function") {
      try {
        (el as any).showPicker();
      } catch {
        el.focus();
      }
    } else {
      el.focus();
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const modalContent = (
    <AnimatePresence>
      {activeOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Glassmorphic Modal Dialog with rounded-3xl and safe bounds */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0c1018] p-6 sm:p-8 text-white z-10 rounded-3xl border border-white/10 shadow-2xl my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl tracking-tight mb-2 text-white">
                  Inquiry Transmitted
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                  Your booking request for <span className="text-white font-semibold">{artistName}</span> has been saved to our agency desk. Our staff will review and coordinate directly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                  <Link
                    href="/my-bookings"
                    onClick={handleClose}
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors text-center"
                  >
                    View Status in My Bookings &rarr;
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 text-xs font-mono transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-semibold">
                    Direct Talent Inquiry
                  </span>
                  {artistCategory && (
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                      • {artistCategory}
                    </span>
                  )}
                </div>

                <h2 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-1">
                  Book {artistName}
                </h2>
                <p className="text-xs text-zinc-400 mb-6">
                  Provide your project scope or event date. Our management desk will review the brief within 24 hours.
                </p>

                {errorMessage && (
                  <div className="p-3.5 mb-6 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Brand or Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Red Bull India, Spotify"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Target Date
                      </label>
                      <div className="relative">
                        <input
                          ref={dateInputRef}
                          type="date"
                          min={todayStr}
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={triggerCalendar}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Open calendar"
                        >
                          <Calendar className="w-4 h-4 text-indigo-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Event Type & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Engagement Scope
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) =>
                          setFormData({ ...formData, eventType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090c14] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors cursor-pointer"
                      >
                        <option value="Brand Campaign">Brand Campaign</option>
                        <option value="Live Festival Performance">Live Festival Performance</option>
                        <option value="Club / Headline DJ Set">Club / Headline DJ Set</option>
                        <option value="Digital Collaboration / Sponsorship">Digital Collaboration / Sponsorship</option>
                        <option value="Film / Video Commercial Direction">Film / Video Commercial Direction</option>
                        <option value="Esports Tournament Appearance">Esports Tournament Appearance</option>
                        <option value="Private Corporate Event">Private Corporate Event</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                        Budget Range (INR ₹)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#090c14] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors cursor-pointer font-mono"
                      >
                        <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                        <option value="₹3,00,000 - ₹8,00,000">₹3,00,000 - ₹8,00,000</option>
                        <option value="₹8,00,000 - ₹15,00,000">₹8,00,000 - ₹15,00,000</option>
                        <option value="₹15,00,000 - ₹30,00,000">₹15,00,000 - ₹30,00,000</option>
                        <option value="₹30,00,000+ (Custom Scope)">₹30,00,000+ (Custom Scope)</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes / Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                      Campaign Brief / Objectives
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share details on venue, deliverables, expected audience, or campaign requirements..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors resize-none"
                    />
                  </div>

                  {/* Footer & Submit Action */}
                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Encrypted SSL Booking</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-medium rounded-lg disabled:opacity-50 cursor-pointer shrink-0 transition-all shadow-sm"
                    >
                      {loading ? "Transmitting..." : "Submit Inquiry"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {!hideTrigger && !isControlled && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="group relative inline-flex items-center justify-between gap-3 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-200 font-medium text-sm transition-all duration-200 cursor-pointer rounded-lg shadow-sm active:scale-95"
        >
          <span>Request Commercial Booking</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      )}

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
