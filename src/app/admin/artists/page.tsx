import React from "react";
import { prisma } from "@/lib/prisma";
import { DeleteArtistButton } from "./delete-button";
import { AddArtistModal } from "./add-artist-modal";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminArtistsPage() {
  let artists: any[] = [];
  try {
    artists = await prisma.artist.findMany({
      include: {
        user: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (err) {
    console.error("Error loading artists in admin:", err);
  }

  return (
    <div className="grid flex-1 items-start gap-6 p-2 sm:px-4 md:gap-8 mt-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 block mb-1">
            Talent Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white uppercase">
            Artist Roster Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage represented talent, add new creators, or update showcase details.
          </p>
        </div>

        <div>
          <AddArtistModal />
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="glass-card border border-white/10 overflow-hidden rounded-2xl shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-white">
              Active Creators Roster
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {artists.length} creators in database
          </span>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="border-b border-white/10 bg-[#090c14] text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
              <tr>
                <th className="h-12 px-4 font-medium">Creator</th>
                <th className="h-12 px-4 font-medium">Category / Discipline</th>
                <th className="h-12 px-4 font-medium hidden md:table-cell">Internal Account</th>
                <th className="h-12 px-4 font-medium hidden lg:table-cell">Tagline & Bio</th>
                <th className="h-12 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {artists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No creators found in the roster database. Click "Add New Creator" to add one.
                  </td>
                </tr>
              ) : (
                artists.map((artist) => {
                  const avatar = artist.avatarUrl || "/creators/divyesh.jpg";

                  return (
                    <tr
                      key={artist.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4 font-heading font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                            <Image
                              src={avatar}
                              alt={artist.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-white text-sm">{artist.name}</span>
                              <Link
                                href={`/artists/${artist.id}`}
                                target="_blank"
                                className="text-zinc-500 hover:text-indigo-400 transition-colors"
                                title="View Public Profile"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                            {artist.genre && (
                              <span className="text-[10px] text-zinc-500 font-mono block">
                                {artist.genre}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant="tag" className="bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]">
                          {(artist as any).category || "CREATOR"}
                        </Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell text-zinc-400 font-mono text-[11px]">
                        {artist.user?.email || "Internal System"}
                      </td>
                      <td className="p-4 hidden lg:table-cell text-zinc-400 truncate max-w-[280px]">
                        {artist.tagline ? `${artist.tagline} • ` : ""}
                        {artist.bio || "No bio entered."}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <DeleteArtistButton id={artist.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
