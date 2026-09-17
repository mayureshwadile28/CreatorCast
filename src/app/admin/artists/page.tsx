import React from "react";
import { PrismaClient } from "@prisma/client";
import { DeleteArtistButton } from "./delete-button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function AdminArtistsPage() {
  const artists = await prisma.artist.findMany({
    include: {
      user: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="grid flex-1 items-start gap-6 p-4 sm:px-6 sm:py-0 md:gap-8 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-white uppercase">
            Artist Roster Management
          </h1>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
            Exclusive represented creators and public talent
          </p>
        </div>
      </div>

      <div className="glass-card border border-white/10 overflow-hidden mt-2 rounded-2xl shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
            Active Creator Directory
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            {artists.length} artists in database
          </span>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="border-b border-white/10 bg-black/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="h-12 px-4 font-medium">Artist Name</th>
                <th className="h-12 px-4 font-medium">Category / Discipline</th>
                <th className="h-12 px-4 font-medium hidden md:table-cell">Account Email</th>
                <th className="h-12 px-4 font-medium hidden lg:table-cell">Bio Preview</th>
                <th className="h-12 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {artists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No creators found in the roster database.
                  </td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <tr
                    key={artist.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-heading font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{artist.name}</span>
                        <Link
                          href={`/artists/${artist.id}`}
                          target="_blank"
                          className="text-zinc-500 hover:text-white transition-colors"
                          title="View Public Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-mono glass-pill text-zinc-300 rounded-full">
                        {(artist as any).category || "CREATOR"}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-zinc-400 font-mono text-[11px]">
                      {artist.user.email}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-zinc-400 truncate max-w-[280px]">
                      {artist.bio || "No bio entered."}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <DeleteArtistButton id={artist.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
