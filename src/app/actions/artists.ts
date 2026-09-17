"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || dbUser.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
}

export async function deleteArtist(artistId: string) {
  await requireAdmin();
  
  try {
    await prisma.artist.delete({
      where: { id: artistId }
    });
    revalidatePath("/admin/artists");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete artist:", error);
    return { error: "Failed to delete artist." };
  }
}
