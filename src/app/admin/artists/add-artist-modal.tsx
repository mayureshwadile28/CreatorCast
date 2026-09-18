"use client";

import React, { useState, useTransition } from "react";
import { Plus, X, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { createArtist } from "@/app/actions/artists";

const PRESET_AVATARS = [
  { label: "Male Creator 1", url: "/creators/divyesh.jpg" },
  { label: "Male Creator 2", url: "/creators/mayuresh.jpg" },
  { label: "Male Creator 3", url: "/creators/vedant.jpg" },
  { label: "Male Creator 4", url: "/creators/yogesh.jpg" },
];

export function AddArtistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("CREATOR");
  const [genre, setGenre] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/creators/divyesh.jpg");

  // 3 Stats
  const [stat1Val, setStat1Val] = useState("100M+");
  const [stat1Lbl, setStat1Lbl] = useState("Audience Reach");
  const [stat2Val, setStat2Val] = useState("500K+");
  const [stat2Lbl, setStat2Lbl] = useState("Followers");
  const [stat3Val, setStat3Val] = useState("98%");
  const [stat3Lbl, setStat3Lbl] = useState("Retention");

  const resetForm = () => {
    setName("");
    setCategory("CREATOR");
    setGenre("");
    setTagline("");
    setBio("");
    setAvatarUrl("/creators/divyesh.jpg");
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter the creator's full name.");
      return;
    }

    startTransition(async () => {
      const stats = [
        { value: stat1Val.trim() || "100M+", label: stat1Lbl.trim() || "Reach" },
        { value: stat2Val.trim() || "500K+", label: stat2Lbl.trim() || "Followers" },
        { value: stat3Val.trim() || "98%", label: stat3Lbl.trim() || "Engagement" },
      ];

      const res = await createArtist({
        name: name.trim(),
        category,
        genre: genre.trim() || "Culture Pioneer",
        tagline: tagline.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        stats,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 1200);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-heading font-semibold tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Creator</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#0c1018] border border-white/10 p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 block mb-1">
                  Staff Roster Management
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                  Add Creator to Directory
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/[0.04] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 mb-6 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 mb-6 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Creator added successfully! Updating roster directory...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Mehra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Primary Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090c12] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="MUSICIAN">MUSICIAN</option>
                    <option value="PODCASTER">PODCASTER & THINKER</option>
                    <option value="FILMMAKER">FILMMAKER</option>
                    <option value="GAMING">GAMING & ESPORTS</option>
                    <option value="COMEDIAN">COMEDIAN</option>
                    <option value="DIGITAL ARTIST">DIGITAL ARTIST</option>
                    <option value="CREATOR">GENERAL CREATOR</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Genre & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Discipline / Genre
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electronic / Melodic House"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                    Short Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Touring DJ & Festival Headliner"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Photo Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Portrait Photo URL
                </label>
                <input
                  type="text"
                  placeholder="Paste image URL (https://...) or choose a preset below"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-zinc-500">Quick Presets:</span>
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        avatarUrl === preset.url
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                          : "bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Creator Biography
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed background, accomplishments, and career highlights..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Row 5: 3 Custom Showcase Stats */}
              <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-semibold">
                    3 Animated Showcase Metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="e.g. 140M+"
                      value={stat1Val}
                      onChange={(e) => setStat1Val(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Audio Streams"
                      value={stat1Lbl}
                      onChange={(e) => setStat1Lbl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-400 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="e.g. 2.4M"
                      value={stat2Val}
                      onChange={(e) => setStat2Val(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Spotify Listeners"
                      value={stat2Lbl}
                      onChange={(e) => setStat2Lbl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-400 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="e.g. 98%"
                      value={stat3Val}
                      onChange={(e) => setStat3Val(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. Brand Retention"
                      value={stat3Lbl}
                      onChange={(e) => setStat3Lbl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-400 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-heading font-bold tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Publishing Creator..." : "Create & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
