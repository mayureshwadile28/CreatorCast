import React from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  FadeIn,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  ArtistCardHover,
} from "@/components/motion-client";
import { AnimatedCounter } from "@/components/animated-counter";
import { prisma } from "@/lib/prisma";

// Fallback metadata dictionary for seeded creators
const creatorMetadataMap: Record<
  string,
  { category: string; genre: string; image: string }
> = {
  divyesh: {
    category: "MUSICIAN",
    genre: "Electronic / House",
    image: "/creators/divyesh.jpg",
  },
  mayuresh: {
    category: "PODCASTER",
    genre: "Tech & Society",
    image: "/creators/mayuresh.jpg",
  },
  vedant: {
    category: "FILMMAKER",
    genre: "Cinematic Narrative",
    image: "/creators/vedant.jpg",
  },
  yogesh: {
    category: "GAMING",
    genre: "Digital Culture",
    image: "/creators/yogesh.jpg",
  },
};

const pressOutlets = [
  { name: "Billboard", font: "tracking-wider font-bold" },
  { name: "COSMOPOLITAN", font: "tracking-[0.25em] font-extrabold" },
  { name: "Rolling Stone", font: "font-serif italic font-semibold" },
  { name: "INDIATIMES", font: "tracking-widest font-black" },
  { name: "Forbes", font: "font-serif tracking-normal font-bold" },
  { name: "GRAZIA", font: "tracking-[0.3em] font-light" },
  { name: "GQ", font: "tracking-widest font-black" },
];

export default async function CustomerDirectoryPage() {
  let artists: any[] = [];

  try {
    artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Database query error:", err);
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-28 md:pb-28 border-b border-zinc-900/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
          <FadeIn duration={0.9}>
            <div className="max-w-5xl">
              <h1 className="font-heading font-black text-[2rem] min-[380px]:text-[2.4rem] sm:text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.05] text-white uppercase break-words">
                Building Indian <br />
                <span className="normal-case font-bold">creator culture.</span> <br />
                <span className="normal-case">Exporting it </span>
                <span className="font-editorial normal-case font-normal text-zinc-300">
                  to the world.
                </span>
              </h1>
            </div>
          </FadeIn>

          <FadeIn delay={0.25} duration={0.9}>
            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-zinc-900/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed">
                Musicians, visionaries and digital pioneers defining{" "}
                <span className="font-editorial text-zinc-200">
                  India’s next great cultural era.
                </span>
              </p>
              <div className="flex items-center w-full sm:w-auto">
                <Link
                  href="#roster"
                  className="w-full sm:w-auto text-center justify-center px-7 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-heading font-bold hover:bg-zinc-200 transition-all rounded-full shadow-lg hover:shadow-white/20 inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Roster</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. STATS & IMPACT SECTION (With Scroll-Driven Animated Numbers & Curves) */}
      <section
        id="impact"
        className="py-20 md:py-28 border-b border-zinc-900/80 bg-black/60 backdrop-blur-md relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-xl">
                <div className="mb-2">
                  <AnimatedCounter
                    value={140}
                    suffix="M+"
                    className="font-heading font-black text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <p className="font-editorial text-zinc-400 text-base md:text-lg">
                  combined Spotify monthly listeners & audio reach
                </p>
              </div>

              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-xl">
                <div className="mb-2">
                  <AnimatedCounter
                    value={45}
                    suffix="M+"
                    className="font-heading font-black text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <p className="font-editorial text-zinc-400 text-base md:text-lg">
                  combined active Instagram & social community
                </p>
              </div>

              <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-xl">
                <div className="mb-2">
                  <AnimatedCounter
                    value={12}
                    suffix="B+"
                    className="font-heading font-black text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <p className="font-editorial text-zinc-400 text-base md:text-lg">
                  lifetime impressions and streams across platforms
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. IN THE PRESS */}
      <section
        id="press"
        className="py-16 border-b border-zinc-900/80 bg-[#050505]/70 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-8 font-medium font-mono">
              In The Press
            </div>
            <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12 opacity-60 hover:opacity-95 transition-opacity">
              {pressOutlets.map((outlet, idx) => (
                <div
                  key={idx}
                  className={`text-zinc-400 text-lg md:text-xl uppercase select-none ${outlet.font}`}
                >
                  {outlet.name}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. THE ROSTER SECTION */}
      <section id="roster" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Title with ScrollReveal */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-zinc-900">
              <div>
                <h2 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white">
                  The{" "}
                  <span className="font-editorial font-normal text-zinc-300">
                    roster.
                  </span>
                </h2>
              </div>
              <p className="font-editorial text-zinc-400 text-lg md:text-xl mt-3 md:mt-0">
                musicians, creators, public figures
              </p>
            </div>
          </ScrollReveal>

          {/* Roster Grid */}
          {artists.length === 0 ? (
            <div className="border border-dashed border-zinc-800 p-12 text-center rounded-2xl">
              <h3 className="text-xl font-heading font-bold text-zinc-400 mb-2">
                No creators registered yet
              </h3>
              <p className="text-zinc-600 text-sm">
                Please run the seed script to populate the agency roster.
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Represent "One roof." Accent Card */}
              <StaggerItem className="h-full">
                <div className="h-full min-h-[380px] sm:min-h-[460px] glass-panel rounded-2xl p-8 flex flex-col justify-between group hover:border-white/20 transition-all shadow-xl">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block mb-6 font-mono">
                      Exclusive Agency
                    </span>
                    <h3 className="font-heading font-bold text-4xl md:text-5xl text-white tracking-tight leading-tight">
                      One <br />
                      <span className="font-editorial font-normal text-zinc-400">
                        roof.
                      </span>
                    </h3>
                  </div>

                  <div>
                    <div className="w-8 h-[1px] bg-white/20 mb-4" />
                    <p className="font-editorial text-zinc-300 text-sm">
                      CreatorCast · 2026
                    </p>
                    <p className="text-zinc-500 text-xs mt-2 uppercase tracking-wider font-mono">
                      Selected Roster
                    </p>
                  </div>
                </div>
              </StaggerItem>

              {/* Creator Cards */}
              {artists.map((artist) => {
                const key = artist.name.toLowerCase();
                const meta = creatorMetadataMap[key] || {
                  category: (artist as any).category || "CREATOR",
                  genre: (artist as any).genre || "Culture",
                  image: artist.avatarUrl || "/creators/divyesh.jpg",
                };

                const imageUrl = artist.avatarUrl || meta.image;

                return (
                  <StaggerItem key={artist.id}>
                    <ArtistCardHover className="h-full">
                      <Link
                        href={`/artists/${artist.id}`}
                        className="group relative block h-[420px] sm:h-[460px] overflow-hidden glass-card rounded-2xl shadow-xl"
                      >
                        {/* Portrait Image */}
                        <div className="relative w-full h-full overflow-hidden bg-zinc-950">
                          <Image
                            src={imageUrl}
                            alt={artist.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-top grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Gradient Shadows */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                          {/* Top Tag with curved pill & status */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-300 glass-pill px-3 py-1 rounded-full">
                              {(artist as any).category || meta.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono tracking-wider text-zinc-400 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                                Available
                              </span>
                              <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Bottom Details Overlay */}
                          <div className="absolute bottom-6 left-6 right-6 z-10">
                            <h3 className="font-heading font-black text-2xl tracking-wide uppercase text-white group-hover:text-zinc-200 transition-colors">
                              {artist.name}
                            </h3>
                            <p className="font-editorial text-xs text-zinc-400 mt-1 line-clamp-1">
                              {(artist as any).genre || meta.genre}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </ArtistCardHover>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}
