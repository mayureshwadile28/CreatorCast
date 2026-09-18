import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { RosterShowcase } from "@/components/roster-showcase";

const fallbackAvatarMap: Record<string, string> = {
  divyesh: "/creators/divyesh.jpg",
  mayuresh: "/creators/mayuresh.jpg",
  vedant: "/creators/vedant.jpg",
  yogesh: "/creators/yogesh.jpg",
};

const pressOutlets = [
  { name: "Billboard", font: "font-serif tracking-wider" },
  { name: "Rolling Stone", font: "font-serif tracking-normal" },
  { name: "Forbes", font: "font-serif tracking-tight" },
  { name: "GQ India", font: "font-sans tracking-widest font-black" },
  { name: "TechCrunch", font: "font-mono tracking-tight font-semibold" },
];

export default async function CustomerDirectoryPage() {
  let artists: any[] = [];
  let user = null;

  try {
    artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
    });

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (err) {
    console.error("Home page data error:", err);
  }

  // Curated preview artists for the hero strip
  const previewArtists = artists.slice(0, 4);

  return (
    <div className="bg-[#09090b] text-[#fafafa] min-h-screen">
      {/* 1. HERO SECTION — AUTHENTIC AGENCY EDITORIAL */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-850 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Agency Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 border border-zinc-800 bg-zinc-900/80 px-3 py-1 rounded-md">
              Contemporary Talent &amp; Cultural Representation
            </span>
          </div>

          {/* Editorial Headline */}
          <div className="max-w-4xl">
            <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white">
              Representing the voices shaping modern culture.
            </h1>
            <p className="mt-6 text-zinc-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
              CreatorCast manages India’s premier digital creators, visionary filmmakers, and cultural leaders — engineering landmark commercial partnerships, brand campaigns, and creative ventures.
            </p>
          </div>

          {/* Action Row with official Shadcn UI Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild className="bg-white text-zinc-950 hover:bg-zinc-200 font-medium px-6 py-2.5 rounded-lg shadow-sm">
              <a href="#roster">
                <span>View Talent Roster</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-medium px-6 py-2.5 rounded-lg">
              <Link href={user ? "/my-bookings" : "/login"}>
                <span>{user ? "Client Inquiries" : "Client Access"}</span>
              </Link>
            </Button>
          </div>

          {/* Hero Visual Roster Preview Strip */}
          {previewArtists.length > 0 && (
            <div className="mt-14 pt-10 border-t border-zinc-850">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-500">
                  Featured Representation
                </span>
                <a
                  href="#roster"
                  className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Explore full roster ({artists.length})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {previewArtists.map((artist) => {
                  const key = artist.name.toLowerCase().split(" ")[0];
                  const avatarSrc = artist.avatarUrl || fallbackAvatarMap[key] || "/creators/divyesh.jpg";

                  return (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.id}`}
                      className="group relative block aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-850 hover:border-zinc-700 transition-all"
                    >
                      <Image
                        src={avatarSrc}
                        alt={artist.name}
                        fill
                        className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-0.5">
                          {artist.category || "Creator"}
                        </span>
                        <h4 className="font-heading font-semibold text-sm sm:text-base text-white truncate">
                          {artist.name}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. STATS & AGENCY PROOF METRICS STRIP */}
      <section
        id="impact"
        className="py-12 md:py-16 border-b border-zinc-850 bg-[#0c0c0e]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-zinc-850">
            <div className="pt-4 lg:pt-0 lg:pl-6 first:pl-0">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                Commercial Volume
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight">
                ₹12.5 Cr+
              </div>
              <p className="text-xs text-zinc-400 mt-1">Brand partnerships transacted</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:pl-6">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                Audience Reach
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight">
                48M+
              </div>
              <p className="text-xs text-zinc-400 mt-1">Cross-platform subscriber network</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:pl-6">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                Contract Security
              </span>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white tracking-tight">
                100%
              </div>
              <p className="text-xs text-zinc-400 mt-1">Vetted agency representation</p>
            </div>

            <div className="pt-4 lg:pt-0 lg:pl-6">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                Operations
              </span>
              <div className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                Mumbai · Bengaluru
              </div>
              <p className="text-xs text-zinc-400 mt-1">New Delhi representation desks</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROSTER SHOWCASE SECTION */}
      <section id="roster" className="py-16 md:py-24 border-b border-zinc-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-1">
                Official Directory
              </span>
              <h2 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight">
                Talent Roster &amp; Representation
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm font-sans">
              Direct booking and brand collaboration inquiries reviewed by our representation team within 24 hours.
            </p>
          </div>

          <RosterShowcase artists={artists} currentUser={user} />
        </div>
      </section>

      {/* 4. PRESS & MEDIA ACCREDITATION */}
      <section id="press" className="py-14 border-b border-zinc-850 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 block mb-6">
            Featured In Leading Publications
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-60">
            {pressOutlets.map((outlet, idx) => (
              <span
                key={idx}
                className={`text-zinc-300 text-lg md:text-xl ${outlet.font} select-none`}
              >
                {outlet.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
