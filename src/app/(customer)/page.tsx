import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, TrendingUp, Users, Award, ShieldCheck, Zap } from "lucide-react";
import { FadeIn, ScrollReveal } from "@/components/motion-client";
import { AnimatedCounter } from "@/components/animated-counter";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { RosterShowcase } from "@/components/roster-showcase";

const pressOutlets = [
  { name: "Billboard", font: "tracking-wider font-bold" },
  { name: "Rolling Stone", font: "tracking-wide font-extrabold" },
  { name: "Forbes", font: "tracking-normal font-bold" },
  { name: "GQ India", font: "tracking-widest font-black" },
  { name: "TechCrunch", font: "tracking-tight font-semibold" },
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

  return (
    <div className="bg-[#07080b] text-[#f8fafc] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <FadeIn duration={0.8}>
            {/* Top Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Creator Representation</span>
            </div>

            {/* Main Headline */}
            <div className="max-w-4xl">
              <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] uppercase text-white">
                Discover & Book <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-white bg-clip-text text-transparent">
                  Elite Creators.
                </span>
              </h1>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} duration={0.8}>
            <div className="mt-6 md:mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
                Empowering India's leading musicians, filmmakers, and digital icons. Seamless booking, transparent inquiry workflows, and verified talent.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="#roster"
                  className="w-full sm:w-auto text-center px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs uppercase tracking-wider font-heading font-bold rounded-full shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Explore Roster</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-center px-6 py-3.5 bg-white/[0.05] hover:bg-white/10 text-white text-xs uppercase tracking-wider font-heading font-bold rounded-full border border-white/10 transition-all inline-flex items-center justify-center cursor-pointer"
                >
                  <span>Client Login</span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. STATS & AGENCY IMPACT */}
      <section
        id="impact"
        className="py-16 md:py-24 border-b border-white/10 bg-[#0a0d14]/70 backdrop-blur-md relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="mb-2">
                  <AnimatedCounter
                    value={140}
                    suffix="M+"
                    className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <h4 className="text-sm font-heading font-bold text-zinc-200 uppercase tracking-wider">
                  Audience Reach
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Combined monthly cross-platform impressions and streaming listenership.
                </p>
              </div>

              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                  <Users className="w-5 h-5" />
                </div>
                <div className="mb-2">
                  <AnimatedCounter
                    value={45}
                    suffix="M+"
                    className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <h4 className="text-sm font-heading font-bold text-zinc-200 uppercase tracking-wider">
                  Community Followers
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Engaged fans across Spotify, YouTube, Instagram, and Twitch.
                </p>
              </div>

              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="mb-2">
                  <AnimatedCounter
                    value={99}
                    suffix="%"
                    className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white"
                  />
                </div>
                <h4 className="text-sm font-heading font-bold text-zinc-200 uppercase tracking-wider">
                  Delivery Success
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Completed bookings with brand partners and direct event inquiries.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. PRESS & MEDIA STRIP */}
      <section
        id="press"
        className="py-12 border-b border-white/10 bg-[#07090e]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <ScrollReveal>
            <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-6 font-mono font-medium">
              Featured In Media & Publications
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 opacity-70 hover:opacity-100 transition-opacity">
              {pressOutlets.map((outlet, idx) => (
                <div
                  key={idx}
                  className={`text-zinc-300 text-base sm:text-lg md:text-xl uppercase select-none ${outlet.font}`}
                >
                  {outlet.name}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. THE ROSTER SHOWCASE */}
      <section id="roster" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 block mb-2">
                  Talent Directory
                </span>
                <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase">
                  Featured Creators
                </h2>
              </div>
              <p className="text-zinc-400 text-sm md:text-base mt-2 md:mt-0 font-normal">
                Select a creator to review their portfolio or initiate a direct booking inquiry.
              </p>
            </div>
          </ScrollReveal>

          {/* Client Interactive Filter & Grid */}
          <RosterShowcase artists={artists} currentUser={user} />
        </div>
      </section>
    </div>
  );
}
