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
  initialName?: string;
  initialEmail?: string;
}

export function BookingModal({
  artistId,
  artistName,
  artistCategory,
  initialName = "",
  initialEmail = "",
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
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
      name: prev.name || initialName,
      email: prev.email || initialEmail,
    }));
  }, [initialName, initialEmail]);

  // Ensure portal only mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open to prevent background scrolling & footer overlap
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await submitBooking({
      artistId,
      clientName: formData.name,
      clientEmail: formData.email,
      company: formData.company,
      eventType: formData.eventType,
      budget: formData.budget,
      eventDate: formData.date,
      notes: formData.notes,
    });

    setLoading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setErrorMessage(null);
    }, 300);
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
      {isOpen && (
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
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-modal p-6 sm:p-8 text-white z-10 rounded-3xl border border-white/10 shadow-2xl my-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer w-8 h-8 rounded-full glass-pill flex items-center justify-center"
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
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-2xl sm:text-3xl tracking-tight mb-2 text-white">
                  Inquiry Transmitted
                </h3>
                <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
                  Your booking request for <span className="text-white font-semibold">{artistName}</span> has been saved to our agency desk. Our talent management staff will review and coordinate directly with the creator.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                  <Link
                    href="/my-bookings"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-black text-xs tracking-widest uppercase font-heading font-bold rounded-xl transition-all shadow hover:bg-zinc-200 text-center cursor-pointer"
                  >
                    Track in My Inquiries &rarr;
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-3 border border-white/20 hover:border-white/50 text-xs tracking-widest uppercase font-heading font-semibold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-1 font-mono">
                    CreatorCast Agency · Talent Inquiry Desk
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
                    Book {artistName}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    {artistCategory || "Creator"} · Direct representation & corporate engagements
                  </p>
                </div>

                {initialEmail && (
                  <div className="mb-4 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between text-xs text-zinc-300 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>
                        Signed in as <strong className="text-white">{initialName || initialEmail}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
                      Verified Profile Linked
                    </span>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-4 p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                        Your Name / Agency *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@agency.in"
                        className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                        Engagement Type
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      >
                        <option value="Brand Campaign">Brand Campaign / Commercial</option>
                        <option value="Live Performance">Live Performance / Music Festival</option>
                        <option value="Keynote Speaking">Keynote / Cultural Summit</option>
                        <option value="Podcast Collaboration">Podcast / Intellectual Dialogue</option>
                        <option value="Esports & Gaming Stream">Esports & Gaming Tournament</option>
                        <option value="Private Event">Private / Corporate Showcase</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                        Target Budget (₹ INR) *
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors"
                      >
                        <option value="Under ₹1,00,000">Under ₹1,00,000 (Under 1 Lakh)</option>
                        <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000 (1L - 3L)</option>
                        <option value="₹3,00,000 - ₹8,00,000">₹3,00,000 - ₹8,00,000 (3L - 8L)</option>
                        <option value="₹8,00,000 - ₹20,00,000">₹8,00,000 - ₹20,00,000 (8L - 20L)</option>
                        <option value="₹20,00,000 - ₹50,00,000">₹20,00,000 - ₹50,00,000 (20L - 50L)</option>
                        <option value="₹50,00,000+">₹50,00,000+ (50 Lakhs+ Elite)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                      Target Date (Click Calendar to Select) *
                    </label>
                    <div className="relative">
                      <input
                        ref={dateInputRef}
                        type="date"
                        min={todayStr}
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        onClick={triggerCalendar}
                        className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={triggerCalendar}
                        className="absolute right-3.5 top-2.5 text-zinc-400 hover:text-white cursor-pointer"
                        aria-label="Open Calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
                      Project Scope & Deliverables
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Describe campaign deliverables, venue/city, date flexibility, and target reach..."
                      className="w-full bg-black/50 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 rounded-xl transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Direct database dispatch</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-white text-black text-xs uppercase tracking-wider font-heading font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-md rounded-xl shrink-0"
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
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center justify-between gap-4 px-8 py-4 bg-white text-black font-heading font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:bg-zinc-200 cursor-pointer shadow-lg hover:shadow-white/20 rounded-full"
      >
        <span>Request Booking</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Render modal directly into document.body to avoid parent stacking context & transform overlap */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
