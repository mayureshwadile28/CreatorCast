"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface BookingSubmissionData {
  artistId: string;
  clientName: string;
  clientEmail: string;
  company?: string;
  eventType: string;
  budget: string;
  eventDate?: string;
  notes?: string;
}

export async function submitBooking(data: BookingSubmissionData) {
  try {
    if (!data.artistId || !data.clientName || !data.clientEmail) {
      return { error: "Missing required booking details (Name, Email, Artist)." };
    }

    // Retrieve authenticated user from session to link Google / auth account details
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId: string | null = user?.id || null;
    const accountEmail: string | null = user?.email || null;
    let accountName: string | null = null;

    if (user) {
      accountName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        (user.email ? user.email.split("@")[0] : null);
    }

    // Insert booking with both user-submitted details and verified Google account metadata
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Booking" (
        "id", "artistId", "userId", "clientName", "clientEmail", "accountName", "accountEmail",
        "company", "eventType", "budget", "eventDate", "notes", "status", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING'::"BookingStatus", now(), now()
      )`,
      data.artistId,
      userId,
      data.clientName,
      data.clientEmail,
      accountName,
      accountEmail,
      data.company || null,
      data.eventType,
      data.budget,
      data.eventDate || null,
      data.notes || null
    );

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    revalidatePath("/my-bookings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return { error: error.message || "Failed to submit booking inquiry." };
  }
}

export async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "DECLINED" | "PENDING") {
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE "Booking" 
       SET "status" = $1::"BookingStatus", "updatedAt" = now()
       WHERE "id" = $2`,
      status,
      bookingId
    );

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/my-bookings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating booking status:", error);
    return { error: error.message || "Failed to update status." };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await prisma.$executeRawUnsafe(
      `DELETE FROM "Booking" WHERE "id" = $1`,
      bookingId
    );

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/my-bookings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    return { error: error.message || "Failed to delete booking." };
  }
}
