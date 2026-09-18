"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, Sparkles, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Category switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800"
                }`}
              >
                {cat === "ALL" ? "All Disciplines" : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input using Shadcn UI Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            type="text"
            placeholder="Search talent or discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900/80 border-zinc-800 text-xs h-9"
          />
        </div>
      </div>

      {/* Roster Grid */}
      {filteredArtists.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-850 bg-zinc-900/30">
          <p className="text-sm text-zinc-400">No creators found matching your search.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="mt-4 text-xs"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredArtists.map((artist) => {
            const key = artist.name.toLowerCase().split(" ")[0];
            const avatarSrc = artist.avatarUrl || fallbackAvatarMap[key] || "/creators/divyesh.jpg";

            // Parse custom stats if available
            let displayStats: { label: string; value: string }[] = [];
            if (artist.stats) {
              try {
                if (typeof artist.stats === "string") {
                  displayStats = JSON.parse(artist.stats);
                } else if (Array.isArray(artist.stats)) {
                  displayStats = artist.stats;
                }
              } catch {}
            }

            return (
              <Card
                key={artist.id}
                className="group overflow-hidden rounded-xl border-zinc-850 bg-[#111114] hover:border-zinc-700 transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <Link
                  href={`/artists/${artist.id}`}
                  className="relative aspect-[4/5] w-full block overflow-hidden bg-zinc-900"
                >
                  <Image
                    src={avatarSrc}
                    alt={artist.name}
                    fill
                    className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-90" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="tag" className="bg-black/60 backdrop-blur-md border-white/10 text-zinc-300">
                      {artist.category || "Creator"}
                    </Badge>
                  </div>
                </Link>

                {/* Content Section */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <Link
                        href={`/artists/${artist.id}`}
                        className="font-heading font-semibold text-base text-white group-hover:text-zinc-200 transition-colors truncate"
                      >
                        {artist.name}
                      </Link>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                    </div>

                    <p className="text-xs text-zinc-400 font-sans line-clamp-1 mb-3">
                      {artist.genre || artist.tagline || "Contemporary Talent"}
                    </p>

                    {/* Stats pills if configured */}
                    {displayStats.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 py-2 mb-3 border-y border-zinc-850 text-center">
                        {displayStats.slice(0, 2).map((st, i) => (
                          <div key={i} className="px-1">
                            <span className="font-heading font-bold text-xs text-white block">
                              {st.value}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400 block truncate">
                              {st.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full text-xs h-8 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <Link href={`/artists/${artist.id}`}>
                        Portfolio
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveBookingArtist(artist)}
                      className="w-full text-xs h-8 bg-white text-zinc-950 hover:bg-zinc-200 font-medium"
                    >
                      Inquire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {activeBookingArtist && (
        <BookingModal
          artistId={activeBookingArtist.id}
          artistName={activeBookingArtist.name}
          currentUser={currentUser}
          isOpen={!!activeBookingArtist}
          onClose={() => setActiveBookingArtist(null)}
        />
      )}
    </div>
  );
}
