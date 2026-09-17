import React from "react";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
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
      { value: "140M+", label: "Combined Streams" },
      { value: "2.4M", label: "Monthly Spotify Listeners" },
      { value: "60+", label: "Global Tour Stops" },
    ],
    bio: "Divyesh reads dance floors for a living. Operating at the frontier of live electronic performance and melodic groove, the Mumbai-born producer has spent nearly a decade headlining festival stages and curating infectious club atmospheres. With deep roots in progressive and melodic house, his immersive live sets combine analog synthesis with driving percussion, commanding dancefloors from Mumbai to Berlin.",
  },
  mayuresh: {
    category: "PODCASTER & THINKER",
    genre: "Tech & Culture",
    image: "/creators/mayuresh.jpg",
    stats: [
      { value: "320M+", label: "Podcast Video Views" },
      { value: "780K+", label: "YouTube Community" },
      { value: "95K", label: "Newsletter Readers" },
    ],
    bio: "Mayuresh bridges the gap between breakthrough technological disruption and cultural shifts. As the host of Future Cast, he convenes conversations with founders, researchers, and cultural architects, building a community of half a million forward-thinkers. His candid breakdowns and long-form intellectual dialogues have turned him into one of the most trusted voices in modern Indian tech.",
  },
  vedant: {
    category: "FILMMAKER",
    genre: "Cinematic Narrative",
    image: "/creators/vedant.jpg",
    stats: [
      { value: "95M+", label: "Lifetime Film Views" },
      { value: "14", label: "Directing Awards" },
      { value: "420K", label: "Instagram Following" },
    ],
    bio: "Vedant crafts visual symphonies. Known for his atmospheric lighting and poetic documentary storytelling, Vedant has directed viral brand anthems and cinematic travel diaries that have resonated with tens of millions worldwide. His distinct chiaroscuro visual language elevates everyday human resilience into timeless editorial cinema.",
  },
  yogesh: {
    category: "GAMING & ESPORTS",
    genre: "Digital Culture",
    image: "/creators/yogesh.jpg",
    stats: [
      { value: "4,200+", label: "Live Stream Hours" },
      { value: "1.6M+", label: "Subscriber Tribe" },
      { value: "85K", label: "Peak Concurrent Viewers" },
    ],
    bio: "Yogesh is an esports veteran turned digital entertainment icon. Leading high-octane competitive tournaments and interactive live broadcasts, Yogesh commands a passionate community of Gen-Z gamers. His electric charisma, rapid-fire humor, and championship-tier gameplay define the forefront of Indian gaming culture.",
  },
};

function formatClientCount(count: number): string {
  if (!count || count === 0) return "Open for Inquiries";
  if (count === 1) return "1 Client";
  if (count < 1000) return `${count} Clients`;
  const inK = (count / 1000).toFixed(1).replace(/\.0$/, "");
  return `${inK}K Clients`;
}

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const initialName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.user_name ||
    "";
  const initialEmail = user?.email || "";

  let clientCount = 0;
  try {
    const bookingRes: any[] = await prisma.$queryRawUnsafe(
      `SELECT count(*)::int as count FROM "Booking" WHERE "artistId" = $1`,
      artist.id
    );
    clientCount = bookingRes?.[0]?.count || 0;
  } catch (err) {
    console.error("Error fetching artist booking count:", err);
  }

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
  const genre = (artist as any).genre || fallback?.genre || "Electronic";
  const avatarUrl = artist.avatarUrl || fallback?.image || "/creators/divyesh.jpg";

  // Parse stats
  let statsList: { value: string; label: string }[] = fallback?.stats || [
    { value: "100M+", label: "Global Audience Reach" },
    { value: "500K+", label: "Verified Followers" },
    { value: "98%", label: "Campaign Retention" },
  ];

  if ((artist as any).stats) {
    try {
      const parsed = typeof (artist as any).stats === "string" 
        ? JSON.parse((artist as any).stats) 
        : (artist as any).stats;
      if (Array.isArray(parsed) && parsed.length > 0) {
        statsList = parsed;
      }
    } catch {
      // keep fallback
    }
  }

  const bioText = artist.bio || fallback?.bio || "Exclusive CreatorCast Talent.";

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-zinc-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            href="/#roster"
            className="group text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Roster</span>
          </Link>

          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono">
            ROSTER // {rosterNumber}
          </div>
        </div>
      </div>

      {/* Split-Screen Editorial Showcase */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Full-Bleed B&W Dramatic Portrait */}
          <div className="lg:col-span-5 relative">
            <FadeIn duration={0.8}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl rounded-3xl">
                <Image
                  src={avatarUrl}
                  alt={artist.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-top grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Micro agency label */}
                <div className="absolute bottom-6 left-6 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-mono px-3 py-1 rounded-full glass-pill">
                  CreatorCast Talent · {artist.name}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Editorial Typography & Stats */}
          <div className="lg:col-span-7 flex flex-col space-y-10 lg:pl-4">
            {/* Top metadata row */}
            <FadeIn delay={0.1} duration={0.6}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-900">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-zinc-300 font-mono px-3 py-1 rounded-full glass-pill">
                    ROSTER {rosterNumber} · {category}
                  </span>
                  {clientCount > 0 ? (
                    <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full">
                      ● {formatClientCount(clientCount)}
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 bg-black/60 border border-white/10 px-3 py-1 rounded-full">
                      ● Available for Inquiries
                    </span>
                  )}
                </div>
                <span className="font-editorial text-zinc-400 text-base sm:text-lg md:text-xl">
                  {genre}
                </span>
              </div>
            </FadeIn>

            {/* Massive Artist Name */}
            <FadeIn delay={0.2} duration={0.7}>
              <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-none break-words">
                {artist.name}
                <span className="text-zinc-600">.</span>
              </h1>
            </FadeIn>

            {/* 3-Column Stats Bar with Vertical Divider Borders, Glassmorphism, and AnimatedCounter */}
            <FadeIn delay={0.3} duration={0.7}>
              <div className="grid grid-cols-1 sm:grid-cols-3 glass-card p-6 sm:p-8 gap-8 sm:gap-4 border border-white/10 rounded-2xl shadow-xl">
                {statsList.slice(0, 3).map((stat, idx) => {
                  const match = stat.value.match(/^([0-9.]+)(.*)$/);
                  const num = match ? parseFloat(match[1]) : null;
                  const suffix = match ? match[2] : "";
                  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

                  return (
                    <div
                      key={idx}
                      className={`${
                        idx !== 0 ? "sm:border-l sm:border-white/10 sm:pl-6" : ""
                      } ${idx !== statsList.length - 1 ? "sm:pr-4" : ""}`}
                    >
                      <div className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-1">
                        {num !== null ? (
                          <AnimatedCounter value={num} suffix={suffix} decimals={decimals} />
                        ) : (
                          stat.value
                        )}
                      </div>
                      <div className="font-editorial text-zinc-400 text-xs sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>

            {/* Editorial Bio with bold emphasis highlights */}
            <FadeIn delay={0.4} duration={0.7}>
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                  Editorial Biography
                </h3>
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                  {bioText}
                </p>
              </div>
            </FadeIn>

            {/* CTA Booking & Engagement Bar */}
            <FadeIn delay={0.5} duration={0.7}>
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <BookingModal
                  artistId={artist.id}
                  artistName={artist.name}
                  artistCategory={category}
                  initialName={initialName}
                  initialEmail={initialEmail}
                />

                <div className="flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-zinc-500 font-mono">
                  <span>Exclusive Agency Representation</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
