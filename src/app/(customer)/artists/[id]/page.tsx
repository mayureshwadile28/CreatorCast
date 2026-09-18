import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, CheckCircle2, Shield, Calendar, ArrowUpRight } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { FadeIn } from "@/components/motion-client";
import { AnimatedCounter } from "@/components/animated-counter";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

// Fallback metadata dictionary for seeded creators
const creatorFallbackMap: Record<
  string,
  {
    category: string;
    genre: string;
    image: string;
    stats: { value: string; label: string }[];
    bio: string;
  }
> = {
  divyesh: {
    category: "MUSICIAN",
    genre: "Electronic / House",
    image: "/creators/divyesh.jpg",
    stats: [
      { value: "140M+", label: "Combined Audio Streams" },
      { value: "2.4M", label: "Monthly Listeners" },
      { value: "60+", label: "Global Tour Dates" },
    ],
    bio: "Divyesh operates at the forefront of live electronic music and melodic festival soundscapes. Headlining premier festival stages across India and internationally, Divyesh crafts hypnotic auditory journeys blending driving basslines with soaring synth harmonies.",
  },
  mayuresh: {
    category: "PODCASTER & THINKER",
    genre: "Tech & Society",
    image: "/creators/mayuresh.jpg",
    stats: [
      { value: "320M+", label: "Video Views" },
      { value: "780K+", label: "Subscriber Community" },
      { value: "95K", label: "Newsletter Subscribers" },
    ],
    bio: "Mayuresh is a seminal voice at the intersection of breakthrough technology and modern cultural shifts. Hosting in-depth dialogues with founders, researchers, and cultural architects, Mayuresh commands one of the most engaged intellectual audiences in contemporary digital media.",
  },
  vedant: {
    category: "FILMMAKER",
    genre: "Cinematic Narrative",
    image: "/creators/vedant.jpg",
    stats: [
      { value: "95M+", label: "Film Views" },
      { value: "14", label: "Directing Honors" },
      { value: "420K", label: "Instagram Following" },
    ],
    bio: "Vedant crafts cinematic visual poetry. Renowned for atmospheric chiaroscuro lighting and raw emotional storytelling, Vedant has helmed viral brand anthems and documentary projects that resonate with tens of millions globally.",
  },
  yogesh: {
    category: "GAMING & ESPORTS",
    genre: "Digital Culture",
    image: "/creators/yogesh.jpg",
    stats: [
      { value: "4,200+", label: "Streaming Hours" },
      { value: "1.6M+", label: "Gamer Tribe" },
      { value: "85K", label: "Peak Concurrent Viewers" },
    ],
    bio: "Yogesh is an esports icon and live broadcast powerhouse. Anchoring high-octane competitive tournaments and interactive gaming events, Yogesh commands a passionate community of Gen-Z gamers with unmatched charisma and tournament gameplay.",
  },
};

export default async function ArtistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const artist = await prisma.artist.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!artist) {
    notFound();
  }

  // Check authenticated session to prefill booking modal
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // fallback
  }

  const initialName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    "";
  const initialEmail = user?.email || "";

  // Get index or rank in roster
  const allArtists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    select: { id: true },
  });
  const index = allArtists.findIndex((a) => a.id === artist.id);
  const rosterNumber = String((index >= 0 ? index : 0) + 1).padStart(2, "0");

  const key = artist.name.toLowerCase();
  const fallback = creatorFallbackMap[key];

  const category = (artist as any).category || fallback?.category || "CREATOR";
  const genre = (artist as any).genre || fallback?.genre || "Culture Pioneer";
  const avatarUrl = artist.avatarUrl || fallback?.image || "/creators/divyesh.jpg";

  // Parse stats
  let statsList: { value: string; label: string }[] = fallback?.stats || [
    { value: "100M+", label: "Audience Reach" },
    { value: "500K+", label: "Verified Followers" },
    { value: "98%", label: "Campaign Retention" },
  ];

  if ((artist as any).stats) {
    try {
      const parsed =
        typeof (artist as any).stats === "string"
          ? JSON.parse((artist as any).stats)
          : (artist as any).stats;
      if (Array.isArray(parsed) && parsed.length > 0) {
        statsList = parsed;
      }
    } catch {
      // keep fallback
    }
  }

  const bioText = artist.bio || fallback?.bio || "Represented exclusively by CreatorCast.";

  return (
    <div className="bg-[#07080b] text-[#f8fafc] min-h-screen">
      {/* Top Breadcrumb Header Bar */}
      <div className="border-b border-white/10 bg-[#090c12]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3.5 flex items-center justify-between">
          <Link
            href="/#roster"
            className="group text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-indigo-400" />
            <span>All Creators</span>
          </Link>

          <div className="text-xs uppercase tracking-widest text-indigo-300 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified Talent #{rosterNumber}</span>
          </div>
        </div>
      </div>

      {/* Split-Screen Showcase Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Creator Portrait */}
          <div className="lg:col-span-5 w-full">
            <FadeIn duration={0.7}>
              <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-[#0c1018] border border-white/15 shadow-2xl rounded-3xl group">
                <Image
                  src={avatarUrl}
                  alt={artist.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-85" />

                {/* Bottom Badge Tag inside image */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="text-[11px] uppercase font-mono tracking-wider text-white bg-black/70 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    {category}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Available</span>
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Name, Stats, Bio, Booking Modal */}
          <div className="lg:col-span-7 flex flex-col space-y-8 lg:pl-2">
            {/* Top metadata row */}
            <FadeIn delay={0.1} duration={0.6}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono font-semibold">
                    {genre}
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  ID: {artist.id.slice(0, 8)}
                </span>
              </div>
            </FadeIn>

            {/* Creator Name */}
            <FadeIn delay={0.15} duration={0.7}>
              <div>
                <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase leading-none break-words">
                  {artist.name}
                </h1>
                {artist.tagline && (
                  <p className="text-base sm:text-lg text-indigo-300 mt-2 font-medium">
                    {artist.tagline}
                  </p>
                )}
              </div>
            </FadeIn>

            {/* 3-Column Stats Cards */}
            <FadeIn delay={0.25} duration={0.7}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statsList.slice(0, 3).map((stat, idx) => {
                  const match = stat.value.match(/^([0-9.]+)(.*)$/);
                  const num = match ? parseFloat(match[1]) : null;
                  const suffix = match ? match[2] : "";
                  const decimals =
                    match && match[1].includes(".")
                      ? match[1].split(".")[1].length
                      : 0;

                  return (
                    <div
                      key={idx}
                      className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden"
                    >
                      <div className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-white mb-1">
                        {num !== null ? (
                          <AnimatedCounter
                            value={num}
                            suffix={suffix}
                            decimals={decimals}
                          />
                        ) : (
                          stat.value
                        )}
                      </div>
                      <div className="text-xs font-sans text-zinc-400 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            {/* Biography Section */}
            <FadeIn delay={0.35} duration={0.7}>
              <div className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="text-xs uppercase tracking-wider text-indigo-400 font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creator Background</span>
                </h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {bioText}
                </p>
              </div>
            </FadeIn>

            {/* Booking CTA Bar */}
            <FadeIn delay={0.45} duration={0.7}>
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <BookingModal
                  artistId={artist.id}
                  artistName={artist.name}
                  artistCategory={category}
                  initialName={initialName}
                  initialEmail={initialEmail}
                />
                <span className="text-xs text-zinc-500 font-mono">
                  Guaranteed response within 24 hours
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
