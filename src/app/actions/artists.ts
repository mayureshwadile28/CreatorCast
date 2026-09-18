"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || dbUser.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
}

export interface CreateArtistInput {
  name: string;
  category: string;
  genre?: string;
  tagline?: string;
  bio: string;
  avatarUrl?: string;
  stats?: { value: string; label: string }[];
}

export async function createArtist(data: CreateArtistInput) {
  await requireAdmin();

  try {
    if (!data.name || !data.name.trim()) {
      return { error: "Creator name is required." };
    }

    // Generate a unique system email for the artist user record
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const email = `${slug || "artist"}_${Date.now()}@creatorcast.internal`;

    const newArtist = await prisma.artist.create({
      data: {
        name: data.name.trim(),
        category: data.category?.trim().toUpperCase() || "CREATOR",
        genre: data.genre?.trim() || "Culture Pioneer",
        tagline: data.tagline?.trim() || null,
        bio: data.bio?.trim() || null,
        avatarUrl: data.avatarUrl?.trim() || null,
        stats: data.stats && data.stats.length > 0 ? (data.stats as any) : undefined,
        user: {
          create: {
            email,
            name: data.name.trim(),
            role: Role.CUSTOMER,
          },
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/artists");
    return { success: true, artist: newArtist };
  } catch (error) {
    console.error("Failed to create artist:", error);
    return { error: "Failed to create creator record in database." };
  }
}

export async function deleteArtist(artistId: string) {
  await requireAdmin();

  try {
    await prisma.artist.delete({
      where: { id: artistId },
    });
    revalidatePath("/admin/artists");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete artist:", error);
    return { error: "Failed to delete artist." };
  }
}
