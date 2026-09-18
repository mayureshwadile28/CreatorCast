"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingModal } from "@/components/booking-modal";

interface ArtistItem {
  id: string;
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  category?: string | null;
  genre?: string | null;
  tagline?: string | null;
  stats?: any;
}

const fallbackAvatarMap: Record<string, string> = {
  divyesh: "/creators/divyesh.jpg",
  mayuresh: "/creators/mayuresh.jpg",
  vedant: "/creators/vedant.jpg",
  yogesh: "/creators/yogesh.jpg",
};

interface RosterShowcaseProps {
  artists: ArtistItem[];
  currentUser?: any;
}

export function RosterShowcase({ artists, currentUser }: RosterShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBookingArtist, setActiveBookingArtist] = useState<ArtistItem | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    artists.forEach((a) => {
      const cat = a.category?.trim().toUpperCase();
      if (cat) set.add(cat);
    });
    return ["ALL", ...Array.from(set)];
  }, [artists]);

  // Filtered artists
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        artist.category?.trim().toUpperCase() === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        artist.name.toLowerCase().includes(q) ||
        (artist.genre && artist.genre.toLowerCase().includes(q)) ||
        (artist.category && artist.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [artists, selectedCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* Category Pills & Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        {/* Horizontal scrollable category pills on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-medium tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                    : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {cat === "ALL" ? "All Creators" : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Roster Grid */}
      {filteredArtists.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10">
          <Sparkles className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
          <h3 className="text-base font-heading font-semibold text-zinc-300">
            No creators found
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredArtists.map((artist) => {
              const key = artist.name.toLowerCase();
              const avatar =
                artist.avatarUrl || fallbackAvatarMap[key] || "/creators/divyesh.jpg";
              const category = artist.category || "CREATOR";
              const genre = artist.genre || "Culture Pioneer";

              // Extract first stat if present
              let topStat: string | null = null;
              if (artist.stats) {
                try {
                  const s =
                    typeof artist.stats === "string"
                      ? JSON.parse(artist.stats)
                      : artist.stats;
                  if (Array.isArray(s) && s.length > 0 && s[0]?.value) {
                    topStat = `${s[0].value} ${s[0].label || ""}`;
                  }
                } catch {
                  // ignore
                }
              }

              return (
                <motion.div
                  key={artist.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="group relative flex flex-col justify-between rounded-2xl bg-[#0c1018] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl overflow-hidden"
                >
                  {/* Image Container with link to profile */}
                  <Link
                    href={`/artists/${artist.id}`}
                    className="relative block w-full aspect-[4/5] overflow-hidden bg-[#090c12]"
                  >
                    <Image
                      src={avatar}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1018] via-black/20 to-transparent" />

                    {/* Top Pill Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-white bg-black/60 border border-white/15 px-2.5 py-1 rounded-full backdrop-blur-md">
                        {category}
                      </span>
                      <span className="text-[10px] font-mono tracking-wider text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Available</span>
                      </span>
                    </div>

                    {/* Quick Metric Pill if present */}
                    {topStat && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="text-[10px] font-mono font-medium text-indigo-200 bg-indigo-950/80 border border-indigo-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          ⚡ {topStat}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Card Content & Action Bar */}
                  <div className="p-4 flex flex-col space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/artists/${artist.id}`}
                          className="font-heading font-black text-lg text-white hover:text-indigo-300 transition-colors tracking-tight uppercase"
                        >
                          {artist.name}
                        </Link>
                        <span className="text-xs font-mono text-zinc-400">
                          {genre}
                        </span>
                      </div>
                      {artist.tagline && (
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                          {artist.tagline}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => setActiveBookingArtist(artist)}
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-heading font-semibold tracking-wider uppercase transition-all shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer text-center"
                      >
                        Book Now
                      </button>
                      <Link
                        href={`/artists/${artist.id}`}
                        className="py-2 px-3.5 bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-xl text-xs font-heading font-semibold tracking-wider uppercase transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <span>Profile</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Embedded Booking Modal */}
      {activeBookingArtist && (
        <BookingModal
          artistId={activeBookingArtist.id}
          artistName={activeBookingArtist.name}
          initialName={
            currentUser?.user_metadata?.full_name ||
            currentUser?.user_metadata?.name ||
            currentUser?.user_metadata?.user_name ||
            ""
          }
          initialEmail={currentUser?.email || ""}
          isOpen={true}
          onClose={() => setActiveBookingArtist(null)}
        />
      )}
    </div>
  );
}
